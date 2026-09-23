const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SessionParticipant = sequelize.define('SessionParticipant', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sessions',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    role: {
      type: DataTypes.ENUM('CREATOR', 'TEAM_MEMBER', 'MEMBER'),
      allowNull: false,
      defaultValue: 'MEMBER'
    }
  }, {
    tableName: 'session_participants',
    indexes: [
      {
        unique: true,
        fields: ['sessionId', 'userId'],
        name: 'unique_session_participant'
      }
    ]
  });

  return SessionParticipant;
};
