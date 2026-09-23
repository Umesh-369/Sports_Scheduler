'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    const salt = await bcrypt.genSalt(10);
    const playerPassword = await bcrypt.hash('Player@123', salt);

    const now = new Date();

    const users = [
      {
        id: 2,
        name: 'John Doe',
        email: 'john@example.com',
        password: playerPassword,
        role: 'PLAYER',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        name: 'Alice Kumar',
        email: 'alice@example.com',
        password: playerPassword,
        role: 'PLAYER',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 4,
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: playerPassword,
        role: 'PLAYER',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 5,
        name: 'Mike Ross',
        email: 'mike@example.com',
        password: playerPassword,
        role: 'PLAYER',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 6,
        name: 'David Beckham',
        email: 'david@example.com',
        password: playerPassword,
        role: 'PLAYER',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        createdAt: now,
        updatedAt: now
      }
    ];

    await queryInterface.bulkInsert('users', users, {
      updateOnDuplicate: ['name', 'password', 'role', 'avatar', 'updatedAt']
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
