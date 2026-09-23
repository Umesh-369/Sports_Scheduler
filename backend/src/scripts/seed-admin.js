'use strict';
require('dotenv').config();
const { sequelize } = require('../config/database');
const seederAdmin = require('../seeders/20250101000000-seed-admin');

async function runAdminSeeder() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    const queryInterface = sequelize.getQueryInterface();
    console.log('Running idempotent admin seeder...');
    await seederAdmin.up(queryInterface);

    const adminEmail = (process.env.ADMIN_EMAIL || 's.umeshsaihanumaprasad@gmail.com').toLowerCase().trim();
    console.log(`Default ADMIN account for '${adminEmail}' has been successfully provisioned.`);

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin account:', error);
    process.exit(1);
  }
}

runAdminSeeder();
