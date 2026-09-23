const { Sport, Session, Sequelize } = require('../models');

class SportService {
  async getAllSports() {
    const sports = await Sport.findAll({
      attributes: {
        include: [
          [
            Sequelize.fn('COUNT', Sequelize.col('sessions.id')),
            'sessionCount'
          ]
        ]
      },
      include: [
        {
          model: Session,
          as: 'sessions',
          attributes: []
        }
      ],
      group: ['Sport.id'],
      order: [['name', 'ASC']]
    });

    return sports.map((s) => {
      const data = s.toJSON();
      data.sessionCount = parseInt(data.sessionCount || '0', 10);
      return data;
    });
  }

  async getSportById(id) {
    const sport = await Sport.findByPk(id, {
      include: [{ model: Session, as: 'sessions' }]
    });

    if (!sport) {
      const error = new Error('Sport not found');
      error.statusCode = 404;
      error.code = 'SPORT_NOT_FOUND';
      throw error;
    }

    return sport;
  }

  async createSport({ name, description = '', icon = 'trophy' }) {
    const existing = await Sport.findOne({ where: { name: name.trim() } });
    if (existing) {
      const error = new Error('A sport with this name already exists');
      error.statusCode = 409;
      error.code = 'SPORT_ALREADY_EXISTS';
      throw error;
    }

    const sport = await Sport.create({
      name: name.trim(),
      description: description.trim(),
      icon: icon.trim()
    });

    return sport;
  }

  async updateSport(id, { name, description, icon }) {
    const sport = await Sport.findByPk(id);
    if (!sport) {
      const error = new Error('Sport not found');
      error.statusCode = 404;
      error.code = 'SPORT_NOT_FOUND';
      throw error;
    }

    if (name && name.trim() !== sport.name) {
      const existing = await Sport.findOne({ where: { name: name.trim() } });
      if (existing) {
        const error = new Error('A sport with this name already exists');
        error.statusCode = 409;
        error.code = 'SPORT_ALREADY_EXISTS';
        throw error;
      }
      sport.name = name.trim();
    }

    if (description !== undefined) sport.description = description.trim();
    if (icon !== undefined) sport.icon = icon.trim();

    await sport.save();
    return sport;
  }

  async deleteSport(id) {
    const sport = await Sport.findByPk(id);
    if (!sport) {
      const error = new Error('Sport not found');
      error.statusCode = 404;
      error.code = 'SPORT_NOT_FOUND';
      throw error;
    }

    // Business rule: Deletion rule - a sport cannot be deleted if any session references it
    const sessionCount = await Session.count({ where: { sportId: id } });
    if (sessionCount > 0) {
      const error = new Error(`Cannot delete sport "${sport.name}" because ${sessionCount} session(s) reference it. Please remove or reassign those sessions first.`);
      error.statusCode = 409;
      error.code = 'SPORT_REFERENCED_BY_SESSIONS';
      throw error;
    }

    await sport.destroy();
    return { message: `Sport "${sport.name}" successfully deleted.` };
  }
}

module.exports = new SportService();
