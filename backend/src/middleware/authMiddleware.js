const { User } = require('../models');

const requireAuth = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required. Please sign in.',
          code: 'UNAUTHORIZED'
        }
      });
    }

    const user = await User.findByPk(req.session.userId);
    if (!user) {
      req.session.destroy();
      return res.status(401).json({
        success: false,
        error: {
          message: 'User session invalid or user no longer exists.',
          code: 'UNAUTHORIZED'
        }
      });
    }

    req.user = user.toSafeJSON();
    req.userInstance = user; // keep raw instance if needed
    next();
  } catch (error) {
    next(error);
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required. Please sign in.',
          code: 'UNAUTHORIZED'
        }
      });
    }

    // ADMIN inherits PLAYER role privileges
    const userRole = req.user.role;
    const hasRole = roles.includes(userRole) || (userRole === 'ADMIN' && roles.includes('PLAYER'));

    if (!hasRole) {
      if (roles.length === 1 && roles[0] === 'ADMIN') {
        return res.status(403).json({
          success: false,
          error: {
            message: 'Admin access required',
            code: 'ADMIN_REQUIRED'
          }
        });
      }

      return res.status(403).json({
        success: false,
        error: {
          message: `Access denied. Requires one of: [${roles.join(', ')}].`,
          code: 'FORBIDDEN'
        }
      });
    }

    next();
  };
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Authentication required. Please sign in.',
        code: 'UNAUTHORIZED'
      }
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Admin access required',
        code: 'ADMIN_REQUIRED'
      }
    });
  }

  next();
};

module.exports = {
  requireAuth,
  requireRole,
  requireAdmin
};

