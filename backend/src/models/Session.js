const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Session = sequelize.define('Session', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sportId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sports',
        key: 'id'
      }
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: { msg: 'Must be a valid date (YYYY-MM-DD)' }
      }
    },
    time: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Time is required' }
      }
    },
    venue: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Venue is required' }
      }
    },
    extraPlayersNeeded: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: { args: [0], msg: 'Extra players needed cannot be negative' }
      }
    },
    status: {
      type: DataTypes.ENUM('OPEN', 'FULL', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'OPEN',
      validate: {
        isIn: {
          args: [['OPEN', 'FULL', 'CANCELLED']],
          msg: 'Status must be OPEN, FULL, or CANCELLED'
        }
      }
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'sessions'
  });

  return Session;
};
