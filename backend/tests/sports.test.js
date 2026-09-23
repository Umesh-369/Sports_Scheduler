const request = require('supertest');
const app = require('../src/app');
const { sequelize, Sport, Session } = require('../src/models');

describe('Sports REST API Integration Tests', () => {
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

  describe('GET /api/sports', () => {
    it('should list all sports with session count', async () => {
      const res = await playerAgent.get('/api/sports');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(6);
      expect(res.body.data[0]).toHaveProperty('sessionCount');
    });
  });

  describe('POST /api/sports (Admin only)', () => {
    it('should allow Admin to create a new sport', async () => {
      const res = await adminAgent
        .post('/api/sports')
        .send({
          name: 'Table Tennis',
          description: 'Fast-paced indoor paddle sport',
          icon: 'table-tennis'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Table Tennis');
    });

    it('should reject non-admin users from creating sports', async () => {
      const res = await playerAgent
        .post('/api/sports')
        .send({
          name: 'Unauthorized Sport',
          description: 'Should fail'
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('ADMIN_REQUIRED');
      expect(res.body.error.message).toBe('Admin access required');
    });
  });

  describe('PUT /api/sports/:id (Admin only)', () => {
    it('should allow Admin to edit sport details', async () => {
      const sport = await Sport.findOne({ where: { name: 'Table Tennis' } });
      const res = await adminAgent
        .put(`/api/sports/${sport.id}`)
        .send({
          name: 'Table Tennis Pro',
          description: 'Updated description for table tennis'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Table Tennis Pro');
    });
  });

  describe('DELETE /api/sports/:id (Deletion Rule)', () => {
    it('should block deletion of a sport referenced by existing sessions', async () => {
      // Sport 1 (Football) has sessions
      const res = await adminAgent.delete('/api/sports/1');
      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('SPORT_REFERENCED_BY_SESSIONS');
    });

    it('should allow deletion of an unreferenced sport', async () => {
      const sport = await Sport.findOne({ where: { name: 'Table Tennis Pro' } });
      const res = await adminAgent.delete(`/api/sports/${sport.id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
