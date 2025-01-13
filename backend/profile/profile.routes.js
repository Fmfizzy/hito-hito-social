const express = require('express');
const router = express.Router();
const profileController = require('./profile.controller');

// Route to update user profile
router.patch('/:userId', profileController.updateProfile);

module.exports = router;
