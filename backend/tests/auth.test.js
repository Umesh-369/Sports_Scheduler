const request = require('supertest');
const app = require('../src/app');
const { sequelize, User } = require('../src/models');
const adminSeeder = require('../src/seeders/20250101000000-seed-admin');

describe('Authentication & Role Authorization Integration Tests', () => {
  let adminAgent;
  let playerAgent;

  const adminEmail = (process.env.ADMIN_EMAIL || 's.umeshsaihanumaprasad@gmail.com').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

  beforeAll(async () => {
    await sequelize.authenticate();
    // Run admin seeder to ensure test database has the admin account
    await adminSeeder.up(sequelize.getQueryInterface());
    adminAgent = request.agent(app);
    playerAgent = request.agent(app);
  });

  afterAll(async () => {
    // Clean up test users created
    await User.destroy({
      where: {
        email: ['testplayer@example.com', 'escalate@example.com']
      }
    });
    await sequelize.close();
  });

  describe('Sequelize Admin Seeder Idempotency', () => {
    it('should create the admin account when it runs', async () => {
      const admin = await User.findOne({ where: { email: adminEmail } });
      expect(admin).not.toBeNull();
      expect(admin.role).toBe('ADMIN');
      expect(admin.name).toBe('Umesh Sai Hanuma Prasad');
    });

    it('should execute idempotently without duplicating when run a second time', async () => {
      // Run seeder second time
      await adminSeeder.up(sequelize.getQueryInterface());
      const adminCount = await User.count({ where: { email: adminEmail } });
      expect(adminCount).toBe(1);
    });
  });

  describe('POST /api/auth/signup', () => {
    it('should register a new player with role PLAYER', async () => {
      const res = await playerAgent
        .post('/api/auth/signup')
        .send({
          name: 'Test Player',
          email: 'testplayer@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.name).toBe('Test Player');
      expect(res.body.data.user.role).toBe('PLAYER');
      expect(res.body.data.user.password).toBeUndefined();

      // Verify session was established
      const meRes = await playerAgent.get('/api/auth/me');
      expect(meRes.status).toBe(200);
      expect(meRes.body.data.user.email).toBe('testplayer@example.com');
    });

    it('should completely ignore client-provided role="ADMIN" and create PLAYER', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Privilege Escalation Attempt',
          email: 'escalate@example.com',
          password: 'Password123!',
          role: 'ADMIN' // Malicious attempt to self-assign ADMIN
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('PLAYER');

      // Verify in DB directly
      const createdUser = await User.findOne({ where: { email: 'escalate@example.com' } });
      expect(createdUser.role).toBe('PLAYER');
    });

    it('should prevent registration with duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Duplicate Player',
          email: 'testplayer@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
    });

    it('should validate password length', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Short Pass',
          email: 'shortpass@example.com',
          password: '123'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/signin', () => {
    it('should authenticate seeded admin using ADMIN_EMAIL and ADMIN_PASSWORD', async () => {
      const res = await adminAgent
        .post('/api/auth/signin')
        .send({
          email: adminEmail,
          password: adminPassword
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(adminEmail);
      expect(res.body.data.user.role).toBe('ADMIN');
      expect(res.body.data.user.name).toBe('Umesh Sai Hanuma Prasad');
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('should reject invalid password for user', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: adminEmail,
          password: 'WrongPassword!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should reject nonexistent email', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'unknown_user_404@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('Role-based Route Authorization & 403 ADMIN_REQUIRED', () => {
    it('should return 403 Forbidden with code ADMIN_REQUIRED when player calls POST /api/sports', async () => {
      const res = await playerAgent
        .post('/api/sports')
        .send({
          name: 'Disallowed Sport'
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toEqual({
        message: 'Admin access required',
        code: 'ADMIN_REQUIRED'
      });
    });

    it('should return 403 Forbidden with code ADMIN_REQUIRED when player calls GET /api/analytics/admin', async () => {
      const res = await playerAgent.get('/api/analytics/admin');

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toEqual({
        message: 'Admin access required',
        code: 'ADMIN_REQUIRED'
      });
    });

    it('should allow admin to access GET /api/analytics/admin successfully', async () => {
      const res = await adminAgent.get('/api/analytics/admin');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('summary');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 when unauthenticated', async () => {
      const unauth = request(app);
      const res = await unauth.get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return user info when authenticated via session cookie', async () => {
      const res = await adminAgent.get('/api/auth/me');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(adminEmail);
      expect(res.body.data.user.role).toBe('ADMIN');
    });
  });

  describe('POST /api/auth/signout', () => {
    it('should destroy session and clear session cookie', async () => {
      const res = await playerAgent.post('/api/auth/signout');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify session is now invalidated
      const meRes = await playerAgent.get('/api/auth/me');
      expect(meRes.status).toBe(401);
    });
  });
});
