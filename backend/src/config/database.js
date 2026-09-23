require('dotenv').config();
const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const dbName = env === 'test' 
  ? (process.env.DB_TEST_NAME || 'sports_scheduler_test_db')
  : (process.env.DB_NAME || 'sports_scheduler_db');

const sequelize = new Sequelize(
  dbName,
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    logging: env === 'development' ? false : false, // clean output, can toggle to console.log if debugging
    timezone: '+00:00', // UTC storage
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: false
    }
  }
);

module.exports = {
  sequelize,
  Sequelize
};
