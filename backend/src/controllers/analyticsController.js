const analyticsService = require('../services/analyticsService');

class AnalyticsController {
  async getAdminAnalytics(req, res, next) {
    try {
      const days = req.query.days ? parseInt(req.query.days, 10) : 30;
      const analytics = await analyticsService.getAdminAnalytics(days);
      res.status(200).json({
        success: true,
        data: analytics
      });
    } catch (error) {
      next(error);
    }
  }

  async getPlayerStats(req, res, next) {
    try {
      const stats = await analyticsService.getPlayerStats(req.user.id);
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalyticsController();
