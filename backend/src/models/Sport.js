const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sport = sequelize.define('Sport', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: 'A sport with this name already exists'
      },
      validate: {
        notEmpty: { msg: 'Sport name cannot be empty' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: ''
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'trophy'
    }
  }, {
    tableName: 'sports'
  });

  return Sport;
};
