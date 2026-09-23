const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(400).json({
      success: false,
      error: {
        message: firstError.msg,
        field: firstError.path || firstError.param,
        code: 'VALIDATION_ERROR'
      }
    });
  }
  next();
};

module.exports = validate;
