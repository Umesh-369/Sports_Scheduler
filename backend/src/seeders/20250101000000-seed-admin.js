'use strict';
require('dotenv').config();
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    const adminEmail = (process.env.ADMIN_EMAIL || 's.umeshsaihanumaprasad@gmail.com').toLowerCase().trim();
    const adminPasswordPlain = process.env.ADMIN_PASSWORD || 'Admin@123456';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPasswordPlain, salt);
    const now = new Date();

    // Clean up legacy admin account if present so exactly one admin exists
    try {
      await queryInterface.sequelize.query(
        'DELETE FROM users WHERE email = "admin@sportsscheduler.com"'
      );
    } catch (_) {}

    // Query to check if the admin account already exists
    const [existingUsers] = await queryInterface.sequelize.query(
      'SELECT id, email, role FROM users WHERE email = ? LIMIT 1',
      { replacements: [adminEmail] }
    );

    if (existingUsers && existingUsers.length > 0) {
      // Idempotent update: ensure role is ADMIN, name is correct, and password updated
      await queryInterface.sequelize.query(
        'UPDATE users SET name = ?, role = "ADMIN", password = ?, avatar = NULL, updatedAt = ? WHERE email = ?',
        {
          replacements: [
            'Umesh Sai Hanuma Prasad',
            hashedPassword,
            now,
            adminEmail
          ]
        }
      );
    } else {
      // Create new ADMIN account safely
      const [id1User] = await queryInterface.sequelize.query(
        'SELECT id FROM users WHERE id = 1 LIMIT 1'
      );

      const adminData = {
        name: 'Umesh Sai Hanuma Prasad',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        avatar: null,
        createdAt: now,
        updatedAt: now
      };

      if (!id1User || id1User.length === 0) {
        adminData.id = 1;
      }

      await queryInterface.bulkInsert('users', [adminData]);
    }
  },

  down: async (queryInterface) => {
    const adminEmail = (process.env.ADMIN_EMAIL || 's.umeshsaihanumaprasad@gmail.com').toLowerCase().trim();
    await queryInterface.bulkDelete('users', { email: adminEmail }, {});
  }
};
