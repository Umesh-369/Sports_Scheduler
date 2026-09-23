'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sessions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      sportId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sports',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' // Deletion rule: sport cannot be deleted if referenced
      },
      creatorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      time: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      venue: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      extraPlayersNeeded: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      status: {
        type: Sequelize.ENUM('OPEN', 'FULL', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'OPEN'
      },
      cancellationReason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('sessions', ['sportId'], { name: 'sessions_sportId_idx' });
    await queryInterface.addIndex('sessions', ['creatorId'], { name: 'sessions_creatorId_idx' });
    await queryInterface.addIndex('sessions', ['date'], { name: 'sessions_date_idx' });
    await queryInterface.addIndex('sessions', ['status'], { name: 'sessions_status_idx' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('sessions');
  }
};
