const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');

const router = express.Router();

// POST /api/auth/signup
router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Full name is required'),
    body('email').trim().isEmail().normalizeEmail({ gmail_remove_dots: false }).withMessage('Please provide a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate
  ],
  authController.signup
);

// POST /api/auth/signin
router.post(
  '/signin',
  [
    body('email').trim().isEmail().normalizeEmail({ gmail_remove_dots: false }).withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  authController.signin
);

// POST /api/auth/signout
router.post('/signout', authController.signout);

// GET /api/auth/me
router.get('/me', requireAuth, authController.getCurrentUser);

// PUT /api/auth/change-password
router.put(
  '/change-password',
  requireAuth,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    validate
  ],
  authController.changePassword
);

module.exports = router;
