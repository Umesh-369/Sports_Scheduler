const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/analytics/admin - Admin community analytics (Admin only)
router.get('/admin', requireAuth, requireRole('ADMIN'), analyticsController.getAdminAnalytics);

// GET /api/analytics/player - Player dashboard stats (Any authenticated user)
router.get('/player', requireAuth, analyticsController.getPlayerStats);

module.exports = router;
