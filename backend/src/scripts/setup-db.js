require('dotenv').config();
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

// Import migrations
const migrationUsers = require('../migrations/20250101000001-create-users');
const migrationSports = require('../migrations/20250101000002-create-sports');
const migrationSessions = require('../migrations/20250101000003-create-sessions');
const migrationParticipants = require('../migrations/20250101000004-create-session-participants');

// Import seeders
const seederAdmin = require('../seeders/20250101000000-seed-admin');
const seederUsers = require('../seeders/20250101000001-seed-users');
const seederSports = require('../seeders/20250101000002-seed-sports');
const seederSessions = require('../seeders/20250101000003-seed-sessions');

async function createDatabases() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  const devDb = process.env.DB_NAME || 'sports_scheduler_db';
  const testDb = process.env.DB_TEST_NAME || 'sports_scheduler_test_db';

  console.log(`Ensuring database '${devDb}' exists...`);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${devDb}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);

  console.log(`Ensuring test database '${testDb}' exists...`);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${testDb}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);

  await connection.end();
}

async function migrateAndSeedDb(dbName) {
  console.log(`\n--- Migrating and seeding '${dbName}' ---`);
  const seq = new Sequelize(
    dbName,
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      dialect: 'mysql',
      logging: false,
      timezone: '+00:00'
    }
  );

  await seq.authenticate();
  const queryInterface = seq.getQueryInterface();

  console.log(`Running migrations on ${dbName}...`);
  try {
    await migrationUsers.up(queryInterface, seq.Sequelize);
  } catch (err) {
    if (!err.message.includes('already exists')) console.log('Users:', err.message);
  }

  try {
    await migrationSports.up(queryInterface, seq.Sequelize);
  } catch (err) {
    if (!err.message.includes('already exists')) console.log('Sports:', err.message);
  }

  try {
    await migrationSessions.up(queryInterface, seq.Sequelize);
  } catch (err) {
    if (!err.message.includes('already exists')) console.log('Sessions:', err.message);
  }

  try {
    await migrationParticipants.up(queryInterface, seq.Sequelize);
  } catch (err) {
    if (!err.message.includes('already exists')) console.log('SessionParticipants:', err.message);
  }

  console.log(`Running seeders on ${dbName}...`);
  await seederAdmin.up(queryInterface);
  await seederUsers.up(queryInterface);
  await seederSports.up(queryInterface);
  await seederSessions.up(queryInterface);

  console.log(`Completed for ${dbName}.`);
  await seq.close();
}

async function runMigrationsAndSeeds() {
  await createDatabases();

  const devDb = process.env.DB_NAME || 'sports_scheduler_db';
  const testDb = process.env.DB_TEST_NAME || 'sports_scheduler_test_db';

  await migrateAndSeedDb(devDb);
  await migrateAndSeedDb(testDb);

  console.log('\nAll databases setup and seeded successfully!');
}

if (require.main === module) {
  runMigrationsAndSeeds()
    .then(() => {
      console.log('Setup finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Database setup failed:', err);
      process.exit(1);
    });
}

module.exports = {
  createDatabases,
  migrateAndSeedDb,
  runMigrationsAndSeeds
};
