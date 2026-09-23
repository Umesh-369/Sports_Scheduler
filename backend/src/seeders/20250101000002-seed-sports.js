'use strict';

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    const sports = [
      {
        id: 1,
        name: 'Football',
        description: 'Team sport, 11 players',
        icon: 'football',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        name: 'Basketball',
        description: 'Indoor/Outdoor, 5v5',
        icon: 'basketball',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        name: 'Tennis',
        description: 'Individual/Doubles',
        icon: 'tennis',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 4,
        name: 'Cricket',
        description: 'Team sport, 11 players',
        icon: 'cricket',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 5,
        name: 'Volleyball',
        description: 'Team sport, 6 players',
        icon: 'volleyball',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 6,
        name: 'Badminton',
        description: 'Individual/Doubles',
        icon: 'badminton',
        createdAt: now,
        updatedAt: now
      }
    ];

    await queryInterface.bulkInsert('sports', sports, {
      updateOnDuplicate: ['name', 'description', 'icon', 'updatedAt']
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('sports', null, {});
  }
};
