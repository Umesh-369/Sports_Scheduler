const { Op } = require('sequelize');
const { Session, Sport, User, SessionParticipant } = require('../models');

class SessionService {
  /**
   * Helper to parse date and time string into a Date object
   */
  getSessionDateTime(dateStr, timeStr) {
    // Normalizes time like '17:00' or '5:00 PM' into 24h ISO
    let hours = 0;
    let minutes = 0;

    if (timeStr.includes(':')) {
      const isPM = /pm/i.test(timeStr);
      const isAM = /am/i.test(timeStr);
      const cleanTime = timeStr.replace(/[^\d:]/g, '');
      const parts = cleanTime.split(':');
      hours = parseInt(parts[0], 10);
      minutes = parseInt(parts[1] || '0', 10);

      if (isPM && hours < 12) hours += 12;
      if (isAM && hours === 12) hours = 0;
    }

    const pad = (n) => String(n).padStart(2, '0');
    return new Date(`${dateStr}T${pad(hours)}:${pad(minutes)}:00Z`);
  }

  isPastSession(dateStr, timeStr) {
    const sessionDate = this.getSessionDateTime(dateStr, timeStr);
    return sessionDate < new Date();
  }

  /**
   * Calculate session capacity metrics
   */
  computeCapacity(session) {
    const participantsCount = session.participants ? session.participants.length : (session.sessionParticipants ? session.sessionParticipants.length : 0);
    // Initial slots were creator (1) + team members at creation + extraPlayersNeeded.
    // However, as players join, participants count increases and slotsRemaining decreases.
    // If extraPlayersNeeded was recorded at creation, totalSlots is participants at creation + extraPlayersNeeded.
    // To ensure exact capacity consistency:
    // If session is OPEN, totalSlots = participantsCount + remainingNeeded.
    // We can derive totalSlots as: (initial creators + team members) + extraPlayersNeeded.
    // When session is created: totalSlots = (1 + initialTeamMemberCount) + extraPlayersNeeded.
    // But since extraPlayersNeeded in DB is fixed at creation time, totalSlots = initialTeamCount + extraPlayersNeeded.
    // Let's store total capacity or calculate accurately:
    // Any extra players needed was the slots available beyond the initial roster.
    return {
      participantsCount,
      extraPlayersNeeded: session.extraPlayersNeeded
    };
  }

  async getAllSessions({ sportId, date, status, view, currentUserId }) {
    const where = {};

    if (sportId) where.sportId = sportId;
    if (date) where.date = date;
    if (status) where.status = status;

    const include = [
      {
        model: Sport,
        as: 'sport',
        attributes: ['id', 'name', 'icon', 'description']
      },
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email', 'avatar', 'role']
      },
      {
        model: User,
        as: 'participants',
        attributes: ['id', 'name', 'email', 'avatar', 'role'],
        through: { attributes: ['role', 'createdAt'] }
      }
    ];

    const sessions = await Session.findAll({
      where,
      include,
      order: [['date', 'ASC'], ['time', 'ASC']]
    });

    const now = new Date();

    // Map and filter based on view
    const enriched = sessions.map((sess) => {
      const s = sess.toJSON();
      const isPast = this.isPastSession(s.date, s.time);
      const isCreator = currentUserId ? s.creatorId === currentUserId : false;
      const hasJoined = currentUserId
        ? (s.participants || []).some((p) => p.id === currentUserId)
        : false;

      // Count initial participants (creator + members at creation) vs total
      // We know extraPlayersNeeded is how many additional players can join beyond initial roster.
      // Total Capacity = initial participants + extraPlayersNeeded
      // Let's identify initial participants by CREATOR role or creation timestamp, or compute:
      // Slots remaining = max(0, totalSlots - currentParticipants)
      // When created, participantsCount was 1 + teamMembersCount.
      // Total capacity = initialParticipantsCount + extraPlayersNeeded.
      // Count initial participants (creator + team members added at creation)
      const initialRosterCount = (s.participants || []).filter(p => {
        const role = p.SessionParticipant ? p.SessionParticipant.role : (p.role || '');
        return role === 'CREATOR' || role === 'TEAM_MEMBER';
      }).length || 1;

      const totalSlots = initialRosterCount + s.extraPlayersNeeded;
      const currentParticipantsCount = (s.participants || []).length;
      const slotsRemaining = Math.max(0, totalSlots - currentParticipantsCount);

      return {
        ...s,
        isPast,
        isCreator,
        hasJoined,
        totalSlots,
        currentParticipantsCount,
        slotsRemaining
      };
    });

    // Apply view filters
    if (view === 'created' && currentUserId) {
      return enriched.filter((s) => s.isCreator);
    }

    if (view === 'joined' && currentUserId) {
      return enriched.filter((s) => s.hasJoined);
    }

    if (view === 'available' && currentUserId) {
      return enriched.filter((s) => !s.isPast && s.status === 'OPEN' && !s.hasJoined && s.slotsRemaining > 0);
    }

    if (view === 'upcoming') {
      return enriched.filter((s) => !s.isPast && s.status !== 'CANCELLED');
    }

    return enriched;
  }

  async getSessionById(id, currentUserId) {
    const session = await Session.findByPk(id, {
      include: [
        {
          model: Sport,
          as: 'sport',
          attributes: ['id', 'name', 'icon', 'description']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email', 'avatar', 'role']
        },
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'name', 'email', 'avatar', 'role'],
          through: { attributes: ['role', 'createdAt'] }
        }
      ]
    });

    if (!session) {
      const error = new Error('Session not found');
      error.statusCode = 404;
      error.code = 'SESSION_NOT_FOUND';
      throw error;
    }

    const s = session.toJSON();
    const isPast = this.isPastSession(s.date, s.time);
    const isCreator = currentUserId ? s.creatorId === currentUserId : false;
    const hasJoined = currentUserId
      ? (s.participants || []).some((p) => p.id === currentUserId)
      : false;

    const initialRosterCount = (s.participants || []).filter(p => {
      const role = p.SessionParticipant ? p.SessionParticipant.role : (p.role || '');
      return role === 'CREATOR' || role === 'TEAM_MEMBER';
    }).length || 1;

    const totalSlots = initialRosterCount + s.extraPlayersNeeded;
    const currentParticipantsCount = (s.participants || []).length;
    const slotsRemaining = Math.max(0, totalSlots - currentParticipantsCount);

    return {
      ...s,
      isPast,
      isCreator,
      hasJoined,
      totalSlots,
      currentParticipantsCount,
      slotsRemaining
    };
  }

  async createSession({
    sportId,
    creatorId,
    date,
    time,
    venue,
    extraPlayersNeeded = 1,
    teamMemberIds = [],
    description = ''
  }) {
    // 1. Verify sport exists
    const sport = await Sport.findByPk(sportId);
    if (!sport) {
      const error = new Error('Selected sport does not exist');
      error.statusCode = 404;
      error.code = 'SPORT_NOT_FOUND';
      throw error;
    }

    // 2. Validate date and time are not in past
    if (this.isPastSession(date, time)) {
      const error = new Error('Cannot schedule a session in the past');
      error.statusCode = 400;
      error.code = 'PAST_SESSION_DATE';
      throw error;
    }

    // Filter out creatorId if present in teamMemberIds and remove duplicates
    const uniqueMembers = [...new Set(teamMemberIds.filter((id) => id !== creatorId))];

    // Capacity rule: Total slots = (creator + team members) + extraPlayersNeeded
    // If extraPlayersNeeded is 0, session is already full
    const status = extraPlayersNeeded === 0 ? 'FULL' : 'OPEN';

    // Create session record
    const session = await Session.create({
      sportId,
      creatorId,
      date,
      time,
      venue: venue.trim(),
      extraPlayersNeeded: Math.max(0, parseInt(extraPlayersNeeded, 10)),
      status,
      description: description ? description.trim() : null
    });

    const now = new Date();
    // Auto-join creator as participant
    const participantsToCreate = [
      {
        sessionId: session.id,
        userId: creatorId,
        role: 'CREATOR',
        createdAt: now,
        updatedAt: now
      }
    ];

    // Auto-join selected team members
    for (const memberId of uniqueMembers) {
      const userExists = await User.findByPk(memberId);
      if (userExists) {
        participantsToCreate.push({
          sessionId: session.id,
          userId: memberId,
          role: 'TEAM_MEMBER',
          createdAt: now,
          updatedAt: now
        });
      }
    }

    await SessionParticipant.bulkCreate(participantsToCreate);

    return this.getSessionById(session.id, creatorId);
  }

  async joinSession(sessionId, userId) {
    const session = await Session.findByPk(sessionId, {
      include: [
        { model: Sport, as: 'sport' },
        { model: SessionParticipant, as: 'sessionParticipants' }
      ]
    });

    if (!session) {
      const error = new Error('Session not found');
      error.statusCode = 404;
      error.code = 'SESSION_NOT_FOUND';
      throw error;
    }

    // Rule: Cannot join cancelled session
    if (session.status === 'CANCELLED') {
      const error = new Error('Cannot join a cancelled session');
      error.statusCode = 400;
      error.code = 'CANNOT_JOIN_CANCELLED';
      throw error;
    }

    // Rule: Cannot join past session
    if (this.isPastSession(session.date, session.time)) {
      const error = new Error('Cannot join a session that has already passed');
      error.statusCode = 400;
      error.code = 'SESSION_IN_PAST';
      throw error;
    }

    // Rule: Cannot join twice
    const existing = await SessionParticipant.findOne({
      where: { sessionId, userId }
    });
    if (existing) {
      const error = new Error('You have already joined this session');
      error.statusCode = 409;
      error.code = 'ALREADY_JOINED';
      throw error;
    }

    // Compute total capacity
    const details = await this.getSessionById(sessionId, userId);
    if (details.slotsRemaining <= 0 || session.status === 'FULL') {
      const error = new Error('This session is already full');
      error.statusCode = 409;
      error.code = 'SESSION_FULL';
      throw error;
    }

    // Rule: Time conflict detection
    // User cannot join if already participating in another active session on the same date with conflicting time
    const userOtherSessions = await Session.findAll({
      where: {
        id: { [Op.ne]: sessionId },
        date: session.date,
        status: { [Op.ne]: 'CANCELLED' }
      },
      include: [
        {
          model: SessionParticipant,
          as: 'sessionParticipants',
          where: { userId }
        },
        {
          model: Sport,
          as: 'sport',
          attributes: ['name']
        }
      ]
    });

    // Check for conflicting session (within 90 min window or same hour)
    const targetTime = this.getSessionDateTime(session.date, session.time).getTime();
    for (const other of userOtherSessions) {
      const otherTime = this.getSessionDateTime(other.date, other.time).getTime();
      const diffMinutes = Math.abs(targetTime - otherTime) / (1000 * 60);

      if (diffMinutes < 90) {
        const error = new Error(`Time conflict: You are already registered for a ${other.sport ? other.sport.name : ''} session on ${other.date} at ${other.time}.`);
        error.statusCode = 409;
        error.code = 'TIME_CONFLICT';
        throw error;
      }
    }

    // Add user as participant
    await SessionParticipant.create({
      sessionId,
      userId,
      role: 'MEMBER'
    });

    // Check if session is now full
    const newCount = details.currentParticipantsCount + 1;
    if (newCount >= details.totalSlots) {
      session.status = 'FULL';
      await session.save();
    }

    return this.getSessionById(sessionId, userId);
  }

  async cancelSession(sessionId, userId, cancellationReason, userRole) {
    const session = await Session.findByPk(sessionId, {
      include: [{ model: Sport, as: 'sport' }]
    });

    if (!session) {
      const error = new Error('Session not found');
      error.statusCode = 404;
      error.code = 'SESSION_NOT_FOUND';
      throw error;
    }

    // Rule: Only creator or Admin can cancel
    if (session.creatorId !== userId && userRole !== 'ADMIN') {
      const error = new Error('Only the session creator or an administrator can cancel this session');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    // Rule: Reason required
    if (!cancellationReason || !cancellationReason.trim()) {
      const error = new Error('A cancellation reason is required');
      error.statusCode = 400;
      error.code = 'CANCELLATION_REASON_REQUIRED';
      throw error;
    }

    session.status = 'CANCELLED';
    session.cancellationReason = cancellationReason.trim();
    await session.save();

    return this.getSessionById(sessionId, userId);
  }
}

module.exports = new SessionService();
