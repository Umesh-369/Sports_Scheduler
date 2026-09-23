const { Op } = require('sequelize');
const { Session, Sport, User, SessionParticipant, sequelize } = require('../models');

class AnalyticsService {
  async getAdminAnalytics(days = 30) {
    const totalUsers = await User.count();
    const totalSports = await Sport.count();
    const totalSessions = await Session.count();

    // Active players: distinct users who have participated in at least one session
    const activePlayersCount = await SessionParticipant.count({
      distinct: true,
      col: 'userId'
    });

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Date range filter
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    // Sessions played in date range (past sessions)
    const sessionsPlayedInRange = await Session.count({
      where: {
        date: {
          [Op.between]: [startDateStr, todayStr]
        },
        status: { [Op.ne]: 'CANCELLED' }
      }
    });

    // Sport popularity
    const sports = await Sport.findAll({
      attributes: ['id', 'name', 'icon'],
      include: [
        {
          model: Session,
          as: 'sessions',
          attributes: ['id', 'status', 'date']
        }
      ]
    });

    const totalValidSessions = await Session.count();
    const sportPopularity = sports.map((s) => {
      const count = s.sessions ? s.sessions.length : 0;
      const percentage = totalValidSessions > 0 ? Math.round((count / totalValidSessions) * 100) : 0;
      return {
        id: s.id,
        name: s.name,
        icon: s.icon,
        sessionCount: count,
        percentage
      };
    }).sort((a, b) => b.sessionCount - a.sessionCount);

    // Activity timeline over the last 14-30 days
    const sessions = await Session.findAll({
      where: {
        date: {
          [Op.gte]: startDateStr
        }
      },
      attributes: ['date', 'status'],
      order: [['date', 'ASC']]
    });

    const timelineMap = {};
    sessions.forEach((s) => {
      if (!timelineMap[s.date]) {
        timelineMap[s.date] = { date: s.date, total: 0, open: 0, completed: 0, cancelled: 0 };
      }
      timelineMap[s.date].total += 1;
      if (s.status === 'OPEN') timelineMap[s.date].open += 1;
      else if (s.status === 'FULL') timelineMap[s.date].completed += 1;
      else if (s.status === 'CANCELLED') timelineMap[s.date].cancelled += 1;
    });

    const activityTimeline = Object.values(timelineMap);

    // Recent 5 sessions
    const recentSessions = await Session.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Sport, as: 'sport', attributes: ['id', 'name', 'icon'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });

    return {
      summary: {
        totalUsers,
        totalSports,
        totalSessions,
        activePlayers: activePlayersCount,
        sessionsPlayed: sessionsPlayedInRange
      },
      sportPopularity,
      activityTimeline,
      recentSessions
    };
  }

  async getPlayerStats(userId) {
    const totalSessions = await Session.count({
      where: { status: { [Op.ne]: 'CANCELLED' } }
    });

    const createdSessions = await Session.count({
      where: { creatorId: userId }
    });

    const joinedSessions = await SessionParticipant.count({
      where: { userId }
    });

    // Available sessions: future, OPEN, user not joined
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const joinedSessionIds = (
      await SessionParticipant.findAll({
        where: { userId },
        attributes: ['sessionId']
      })
    ).map((sp) => sp.sessionId);

    const availableSessions = await Session.count({
      where: {
        status: 'OPEN',
        date: { [Op.gte]: todayStr },
        id: { [Op.notIn]: joinedSessionIds.length ? joinedSessionIds : [0] }
      }
    });

    return {
      totalSessions,
      createdSessions,
      joinedSessions,
      availableSessions
    };
  }
}

module.exports = new AnalyticsService();
