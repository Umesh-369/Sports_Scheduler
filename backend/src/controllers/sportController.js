const sportService = require('../services/sportService');

class SportController {
  async getAllSports(req, res, next) {
    try {
      const sports = await sportService.getAllSports();
      res.status(200).json({
        success: true,
        data: sports
      });
    } catch (error) {
      next(error);
    }
  }

  async getSportById(req, res, next) {
    try {
      const sport = await sportService.getSportById(req.params.id);
      res.status(200).json({
        success: true,
        data: sport
      });
    } catch (error) {
      next(error);
    }
  }

  async createSport(req, res, next) {
    try {
      const { name, description, icon } = req.body;
      const sport = await sportService.createSport({ name, description, icon });
      res.status(201).json({
        success: true,
        data: sport
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSport(req, res, next) {
    try {
      const { name, description, icon } = req.body;
      const sport = await sportService.updateSport(req.params.id, { name, description, icon });
      res.status(200).json({
        success: true,
        data: sport
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSport(req, res, next) {
    try {
      const result = await sportService.deleteSport(req.params.id);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SportController();
