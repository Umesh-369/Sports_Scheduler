const { sequelize, Sequelize } = require('../config/database');

const UserModel = require('./User');
const SportModel = require('./Sport');
const SessionModel = require('./Session');
const SessionParticipantModel = require('./SessionParticipant');

// Initialize models
const User = UserModel(sequelize);
const Sport = SportModel(sequelize);
const Session = SessionModel(sequelize);
const SessionParticipant = SessionParticipantModel(sequelize);

// User <-> Session (as Creator)
User.hasMany(Session, { foreignKey: 'creatorId', as: 'createdSessions' });
Session.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

// Sport <-> Session
Sport.hasMany(Session, { foreignKey: 'sportId', as: 'sessions' });
Session.belongsTo(Sport, { foreignKey: 'sportId', as: 'sport' });

// Session <-> User (through SessionParticipant)
Session.belongsToMany(User, {
  through: SessionParticipant,
  foreignKey: 'sessionId',
  otherKey: 'userId',
  as: 'participants'
});
User.belongsToMany(Session, {
  through: SessionParticipant,
  foreignKey: 'userId',
  otherKey: 'sessionId',
  as: 'joinedSessions'
});

// Explicit associations for SessionParticipant
Session.hasMany(SessionParticipant, { foreignKey: 'sessionId', as: 'sessionParticipants' });
SessionParticipant.belongsTo(Session, { foreignKey: 'sessionId', as: 'session' });

User.hasMany(SessionParticipant, { foreignKey: 'userId', as: 'participations' });
SessionParticipant.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Sport,
  Session,
  SessionParticipant
};
