const express = require('express');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/users - List users (for team member selection, etc.)
router.get('/', requireAuth, authController.getAllUsers);

module.exports = router;
