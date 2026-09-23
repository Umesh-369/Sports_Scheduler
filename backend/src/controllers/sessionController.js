const sessionService = require('../services/sessionService');

class SessionController {
  async getAllSessions(req, res, next) {
    try {
      const { sportId, date, status, view } = req.query;
      const currentUserId = req.user ? req.user.id : null;

      const sessions = await sessionService.getAllSessions({
        sportId: sportId ? parseInt(sportId, 10) : undefined,
        date,
        status,
        view,
        currentUserId
      });

      res.status(200).json({
        success: true,
        data: sessions
      });
    } catch (error) {
      next(error);
    }
  }

  async getSessionById(req, res, next) {
    try {
      const currentUserId = req.user ? req.user.id : null;
      const session = await sessionService.getSessionById(req.params.id, currentUserId);

      res.status(200).json({
        success: true,
        data: session
      });
    } catch (error) {
      next(error);
    }
  }

  async createSession(req, res, next) {
    try {
      const {
        sportId,
        date,
        time,
        venue,
        extraPlayersNeeded,
        teamMemberIds,
        description
      } = req.body;

      const session = await sessionService.createSession({
        sportId: parseInt(sportId, 10),
        creatorId: req.user.id,
        date,
        time,
        venue,
        extraPlayersNeeded: extraPlayersNeeded !== undefined ? parseInt(extraPlayersNeeded, 10) : 1,
        teamMemberIds: Array.isArray(teamMemberIds) ? teamMemberIds.map(Number) : [],
        description
      });

      res.status(201).json({
        success: true,
        data: session
      });
    } catch (error) {
      next(error);
    }
  }

  async joinSession(req, res, next) {
    try {
      const session = await sessionService.joinSession(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        data: session
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelSession(req, res, next) {
    try {
      const { cancellationReason } = req.body;
      const session = await sessionService.cancelSession(
        req.params.id,
        req.user.id,
        cancellationReason,
        req.user.role
      );

      res.status(200).json({
        success: true,
        data: session
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SessionController();
