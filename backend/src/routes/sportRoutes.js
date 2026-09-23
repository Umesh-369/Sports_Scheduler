const express = require('express');
const { body } = require('express-validator');
const sportController = require('../controllers/sportController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');

const router = express.Router();

// GET /api/sports - List all sports
router.get('/', requireAuth, sportController.getAllSports);

// GET /api/sports/:id - Get sport details
router.get('/:id', requireAuth, sportController.getSportById);

// POST /api/sports - Add sport (Admin only)
router.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  [
    body('name').trim().notEmpty().withMessage('Sport name is required'),
    validate
  ],
  sportController.createSport
);

// PUT /api/sports/:id - Edit sport (Admin only)
router.put(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  [
    body('name').optional().trim().notEmpty().withMessage('Sport name cannot be empty'),
    validate
  ],
  sportController.updateSport
);

// DELETE /api/sports/:id - Delete sport (Admin only, checks foreign key)
router.delete(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  sportController.deleteSport
);

module.exports = router;
