const express = require('express');
const { body } = require('express-validator');
const sessionController = require('../controllers/sessionController');
const { requireAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');

const router = express.Router();

// GET /api/sessions - List sessions with filters (view, sportId, date, status)
router.get('/', requireAuth, sessionController.getAllSessions);

// GET /api/sessions/:id - Get session details
router.get('/:id', requireAuth, sessionController.getSessionById);

// POST /api/sessions - Create new session
router.post(
  '/',
  requireAuth,
  [
    body('sportId').isInt({ min: 1 }).withMessage('Valid sport is required'),
    body('date').isDate().withMessage('Valid date is required (YYYY-MM-DD)'),
    body('time').trim().notEmpty().withMessage('Time is required'),
    body('venue').trim().notEmpty().withMessage('Venue is required'),
    body('extraPlayersNeeded')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Extra players needed must be 0 or greater'),
    validate
  ],
  sessionController.createSession
);

// POST /api/sessions/:id/join - Join session
router.post('/:id/join', requireAuth, sessionController.joinSession);

// POST /api/sessions/:id/cancel - Cancel session
router.post(
  '/:id/cancel',
  requireAuth,
  [
    body('cancellationReason')
      .trim()
      .notEmpty()
      .withMessage('Cancellation reason is required'),
    validate
  ],
  sessionController.cancelSession
);

module.exports = router;
