const authService = require('../services/authService');

class AuthController {
  async signup(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const user = await authService.signup({ name, email, password });

      // Establish session
      req.session.userId = user.id;

      res.status(201).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  async signin(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await authService.signin({ email, password });

      // Establish session
      req.session.userId = user.id;

      res.status(200).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  async signout(req, res, next) {
    try {
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        res.clearCookie('sports_scheduler_sid');
        res.clearCookie('connect.sid');
        res.status(200).json({
          success: true,
          data: { message: 'Successfully signed out' }
        });
      });
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      // req.user is already populated by requireAuth middleware
      res.status(200).json({
        success: true,
        data: { user: req.user }
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await authService.getAllUsers();
      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
