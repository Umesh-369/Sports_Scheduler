const request = require('supertest');
const app = require('../src/app');
const { sequelize, Session, SessionParticipant, Sport, User } = require('../src/models');

describe('Sessions REST API Integration Tests', () => {
  let johnAgent;
  let aliceAgent;
  let sarahAgent;
  let testSessionId;

  const formatDate = (date) => date.toISOString().split('T')[0];
  const relDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return formatDate(d);
  };

  beforeAll(async () => {
    await sequelize.authenticate();
    johnAgent = request.agent(app);
    aliceAgent = request.agent(app);
    sarahAgent = request.agent(app);

    // Sign in John (user 2)
    await johnAgent
      .post('/api/auth/signin')
      .send({ email: 'john@example.com', password: 'Player@123' });

    // Sign in Alice (user 3)
    await aliceAgent
      .post('/api/auth/signin')
      .send({ email: 'alice@example.com', password: 'Player@123' });

    // Sign in Sarah (user 4)
    await sarahAgent
      .post('/api/auth/signin')
      .send({ email: 'sarah@example.com', password: 'Player@123' });
  });

  afterAll(async () => {
    // Clean up created test sessions if any
    if (testSessionId) {
      await SessionParticipant.destroy({ where: { sessionId: testSessionId } });
      await Session.destroy({ where: { id: testSessionId } });
    }
    await sequelize.close();
  });

  describe('POST /api/sessions (Create Session & Capacity Rule)', () => {
    it('should create a session with creator auto-joined and calculate capacity properly', async () => {
      const res = await johnAgent
        .post('/api/sessions')
        .send({
          sportId: 1, // Football
          date: relDate(10),
          time: '18:00',
          venue: 'Test Arena Park',
          extraPlayersNeeded: 1, // 1 creator + 1 extra = 2 slots total
          teamMemberIds: [],
          description: 'A test session'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      const session = res.body.data;
      testSessionId = session.id;

      expect(session.isCreator).toBe(true);
      expect(session.status).toBe('OPEN');
      expect(session.totalSlots).toBe(2);
      expect(session.currentParticipantsCount).toBe(1);
      expect(session.slotsRemaining).toBe(1);
    });

    it('should reject creating a session with date in the past', async () => {
      const res = await johnAgent
        .post('/api/sessions')
        .send({
          sportId: 1,
          date: '2020-01-01',
          time: '10:00',
          venue: 'Past Ground',
          extraPlayersNeeded: 5
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('PAST_SESSION_DATE');
    });
  });

  describe('POST /api/sessions/:id/join (Join Session & Validations)', () => {
    it('should allow a player (Alice) to join the open session and update capacity', async () => {
      const res = await aliceAgent.post(`/api/sessions/${testSessionId}/join`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const session = res.body.data;

      expect(session.currentParticipantsCount).toBe(2);
      expect(session.slotsRemaining).toBe(0);
      expect(session.status).toBe('FULL');
    });

    it('should prevent joining a session that is already FULL', async () => {
      // Sarah attempts to join when slotsRemaining is 0
      const res = await sarahAgent.post(`/api/sessions/${testSessionId}/join`);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('SESSION_FULL');
    });

    it('should prevent duplicate join by the same player', async () => {
      // Alice attempts to join again
      const res = await aliceAgent.post(`/api/sessions/${testSessionId}/join`);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('ALREADY_JOINED');
    });

    it('should prevent joining a session that has already passed', async () => {
      // Session 7 is a seeded past session (relDate -5)
      const res = await johnAgent.post('/api/sessions/7/join');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('SESSION_IN_PAST');
    });
  });

  describe('Session Time Conflict Detection', () => {
    let conflictSessionId;

    afterAll(async () => {
      if (conflictSessionId) {
        await SessionParticipant.destroy({ where: { sessionId: conflictSessionId } });
        await Session.destroy({ where: { id: conflictSessionId } });
      }
    });

    it('should block joining overlapping sessions on the same date and time', async () => {
      // Create a second session at the exact same date and time (relDate(10), 18:00)
      const createRes = await sarahAgent
        .post('/api/sessions')
        .send({
          sportId: 2, // Basketball
          date: relDate(10),
          time: '18:00',
          venue: 'Nearby Basketball Court',
          extraPlayersNeeded: 4
        });

      conflictSessionId = createRes.body.data.id;

      // Alice is already in testSessionId at relDate(10), 18:00
      // Alice tries to join Sarah's overlapping session
      const joinRes = await aliceAgent.post(`/api/sessions/${conflictSessionId}/join`);

      expect(joinRes.status).toBe(409);
      expect(joinRes.body.success).toBe(false);
      expect(joinRes.body.error.code).toBe('TIME_CONFLICT');
    });
  });

  describe('POST /api/sessions/:id/cancel (Cancellation Flow)', () => {
    it('should require a cancellation reason', async () => {
      const res = await johnAgent
        .post(`/api/sessions/${testSessionId}/cancel`)
        .send({ cancellationReason: '' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should prevent non-creator from cancelling session', async () => {
      const res = await aliceAgent
        .post(`/api/sessions/${testSessionId}/cancel`)
        .send({ cancellationReason: 'I want to cancel this' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should allow the creator to cancel with a reason', async () => {
      const res = await johnAgent
        .post(`/api/sessions/${testSessionId}/cancel`)
        .send({ cancellationReason: 'Venue lights broken down' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('CANCELLED');
      expect(res.body.data.cancellationReason).toBe('Venue lights broken down');
    });

    it('should prevent joining a cancelled session', async () => {
      const res = await sarahAgent.post(`/api/sessions/${testSessionId}/join`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('CANNOT_JOIN_CANCELLED');
    });
  });

  describe('GET /api/sessions (Filters & Views)', () => {
    it('should filter sessions by view=created', async () => {
      const res = await johnAgent.get('/api/sessions?view=created');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.every((s) => s.isCreator)).toBe(true);
    });

    it('should filter sessions by view=available', async () => {
      const res = await sarahAgent.get('/api/sessions?view=available');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      // Available must be open, future, not joined
      expect(res.body.data.every((s) => s.status === 'OPEN' && !s.hasJoined && !s.isPast)).toBe(true);
    });
  });
});
