'use strict';

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    
    // Helper to calculate relative date YYYY-MM-DD
    const relDate = (offsetDays) => {
      const d = new Date();
      d.setDate(d.getDate() + offsetDays);
      return formatDate(d);
    };

    const sessions = [
      {
        id: 1,
        sportId: 1, // Football
        creatorId: 2, // John Doe
        date: relDate(2),
        time: '17:00',
        venue: 'City Sports Ground',
        extraPlayersNeeded: 8,
        status: 'OPEN',
        cancellationReason: null,
        description: 'Friendly 11-a-side match! All skill levels welcome. Bring studs or turf shoes.',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        sportId: 2, // Basketball
        creatorId: 3, // Alice Kumar
        date: relDate(3),
        time: '18:00',
        venue: 'Indoor Court Arena',
        extraPlayersNeeded: 5,
        status: 'OPEN',
        cancellationReason: null,
        description: '5v5 pickup basketball game. Looking for energetic players!',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        sportId: 3, // Tennis
        creatorId: 4, // Sarah Wilson
        date: relDate(4),
        time: '19:00',
        venue: 'Tennis Club Center',
        extraPlayersNeeded: 0,
        status: 'FULL',
        cancellationReason: null,
        description: 'Doubles casual tennis match. Hard court surface.',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 4,
        sportId: 4, // Cricket
        creatorId: 6, // David Beckham
        date: relDate(5),
        time: '16:00',
        venue: 'National Stadium Complex',
        extraPlayersNeeded: 7,
        status: 'OPEN',
        cancellationReason: null,
        description: 'T20 practice match under floodlights. Protective gear provided.',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 5,
        sportId: 5, // Volleyball
        creatorId: 2, // John Doe
        date: relDate(3),
        time: '17:30',
        venue: 'Sports Complex Court B',
        extraPlayersNeeded: 3,
        status: 'CANCELLED',
        cancellationReason: 'Heavy rain forecasted, outdoor court maintenance required.',
        description: 'Casual volleyball game.',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 6,
        sportId: 6, // Badminton
        creatorId: 5, // Mike Ross
        date: relDate(6),
        time: '19:00',
        venue: 'Indoor Wooden Court',
        extraPlayersNeeded: 3,
        status: 'OPEN',
        cancellationReason: null,
        description: 'Badminton doubles rally and casual tournament games.',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 7,
        sportId: 1, // Football
        creatorId: 3, // Alice Kumar
        date: relDate(-5),
        time: '17:00',
        venue: 'City Sports Ground',
        extraPlayersNeeded: 0,
        status: 'FULL',
        cancellationReason: null,
        description: 'Weekend football championship warm-up.',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 8,
        sportId: 2, // Basketball
        creatorId: 2, // John Doe
        date: relDate(-10),
        time: '18:00',
        venue: 'Downtown YMCA Court',
        extraPlayersNeeded: 0,
        status: 'FULL',
        cancellationReason: null,
        description: 'Fast break training and scrimmage.',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 9,
        sportId: 3, // Tennis
        creatorId: 6, // David Beckham
        date: relDate(-14),
        time: '08:00',
        venue: 'Sunrise Tennis Club',
        extraPlayersNeeded: 0,
        status: 'FULL',
        cancellationReason: null,
        description: 'Early morning singles rally.',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 10,
        sportId: 5, // Volleyball
        creatorId: 4, // Sarah Wilson
        date: relDate(7),
        time: '18:30',
        venue: 'Beach Volleyball Arena',
        extraPlayersNeeded: 4,
        status: 'OPEN',
        cancellationReason: null,
        description: 'Sunset sand volleyball meetup. Great music and vibes.',
        createdAt: now,
        updatedAt: now
      }
    ];

    await queryInterface.bulkInsert('sessions', sessions, {
      updateOnDuplicate: ['date', 'time', 'venue', 'extraPlayersNeeded', 'status', 'cancellationReason', 'description', 'updatedAt']
    });

    // Populate session_participants
    const participants = [
      // Session 1 (Football, Open, creator: 2, extraNeeded: 8, total: 10)
      { sessionId: 1, userId: 2, role: 'CREATOR', createdAt: now, updatedAt: now },
      { sessionId: 1, userId: 3, role: 'TEAM_MEMBER', createdAt: now, updatedAt: now },

      // Session 2 (Basketball, Open, creator: 3, extraNeeded: 5, total: 8)
      { sessionId: 2, userId: 3, role: 'CREATOR', createdAt: now, updatedAt: now },
      { sessionId: 2, userId: 4, role: 'TEAM_MEMBER', createdAt: now, updatedAt: now },
      { sessionId: 2, userId: 5, role: 'TEAM_MEMBER', createdAt: now, updatedAt: now },

      // Session 3 (Tennis, Full, creator: 4, extraNeeded: 0, total: 2)
      { sessionId: 3, userId: 4, role: 'CREATOR', createdAt: now, updatedAt: now },
      { sessionId: 3, userId: 2, role: 'TEAM_MEMBER', createdAt: now, updatedAt: now },

      // Session 4 (Cricket, Open, creator: 6, extraNeeded: 7, total: 11)
      { sessionId: 4, userId: 6, role: 'CREATOR', createdAt: now, updatedAt: now },
      { sessionId: 4, userId: 2, role: 'TEAM_MEMBER', createdAt: now, updatedAt: now },
      { sessionId: 4, userId: 3, role: 'TEAM_MEMBER', createdAt: now, updatedAt: now },
      { sessionId: 4, userId: 5, role: 'TEAM_MEMBER', createdAt: now, updatedAt: now },

      // Session 5 (Volleyball, Cancelled, creator: 2)
      { sessionId: 5, userId: 2, role: 'CREATOR', createdAt: now, updatedAt: now },
      { sessionId: 5, userId: 4, role: 'TEAM_MEMBER', createdAt: now, updatedAt: now },

      // Session 6 (Badminton, Open, creator: 5, extraNeeded: 3, total: 4)
      { sessionId: 6, userId: 5, role: 'CREATOR', createdAt: now, updatedAt: now },

      // Session 7 (Past Full, creator: 3)
      { sessionId: 7, userId: 3, role: 'CREATOR', createdAt: now, updatedAt: now },
      { sessionId: 7, userId: 2, role: 'MEMBER', createdAt: now, updatedAt: now },
      { sessionId: 7, userId: 4, role: 'MEMBER', createdAt: now, updatedAt: now },
      { sessionId: 7, userId: 5, role: 'MEMBER', createdAt: now, updatedAt: now },
      { sessionId: 7, userId: 6, role: 'MEMBER', createdAt: now, updatedAt: now },

      // Session 8 (Past Full, creator: 2)
      { sessionId: 8, userId: 2, role: 'CREATOR', createdAt: now, updatedAt: now },
      { sessionId: 8, userId: 3, role: 'MEMBER', createdAt: now, updatedAt: now },

      // Session 9 (Past Full, creator: 6)
      { sessionId: 9, userId: 6, role: 'CREATOR', createdAt: now, updatedAt: now },
      { sessionId: 9, userId: 4, role: 'MEMBER', createdAt: now, updatedAt: now },

      // Session 10 (Future Open, creator: 4)
      { sessionId: 10, userId: 4, role: 'CREATOR', createdAt: now, updatedAt: now },
      { sessionId: 10, userId: 5, role: 'MEMBER', createdAt: now, updatedAt: now }
    ];

    await queryInterface.bulkInsert('session_participants', participants, {
      updateOnDuplicate: ['role', 'updatedAt']
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('session_participants', null, {});
    await queryInterface.bulkDelete('sessions', null, {});
  }
};
