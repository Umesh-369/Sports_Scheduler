const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

describe('Analytics API Integration Tests', () => {
  let adminAgent;
  let playerAgent;

  beforeAll(async () => {
    await sequelize.authenticate();
    adminAgent = request.agent(app);
    playerAgent = request.agent(app);

    // Sign in Admin
    const adminEmail = (process.env.ADMIN_EMAIL || 's.umeshsaihanumaprasad@gmail.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    await adminAgent
      .post('/api/auth/signin')
      .send({ email: adminEmail, password: adminPassword });

    // Sign in Player
    await playerAgent
      .post('/api/auth/signin')
      .send({ email: 'john@example.com', password: 'Player@123' });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/analytics/player', () => {
    it('should return player-specific session counters', async () => {
      const res = await playerAgent.get('/api/analytics/player');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalSessions');
      expect(res.body.data).toHaveProperty('createdSessions');
      expect(res.body.data).toHaveProperty('joinedSessions');
      expect(res.body.data).toHaveProperty('availableSessions');
    });
  });

  describe('GET /api/analytics/admin', () => {
    it('should allow admin to retrieve community analytics', async () => {
      const res = await adminAgent.get('/api/analytics/admin?days=30');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('summary');
      expect(res.body.data.summary).toHaveProperty('totalUsers');
      expect(res.body.data.summary).toHaveProperty('totalSports');
      expect(res.body.data.summary).toHaveProperty('totalSessions');
      expect(res.body.data.summary).toHaveProperty('activePlayers');
      expect(res.body.data).toHaveProperty('sportPopularity');
      expect(Array.isArray(res.body.data.sportPopularity)).toBe(true);
      expect(res.body.data).toHaveProperty('activityTimeline');
      expect(res.body.data).toHaveProperty('recentSessions');
    });

    it('should block non-admin users from accessing admin analytics', async () => {
      const res = await playerAgent.get('/api/analytics/admin');

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });
});
