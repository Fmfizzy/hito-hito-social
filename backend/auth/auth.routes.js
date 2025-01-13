const express = require('express');
const { register, login, logout, verifyToken } = require('./auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const recaptchaMiddleware = require('../middleware/recaptcha.middleware');

const router = express.Router();

router.post('/register', recaptchaMiddleware, register);
router.post('/login', recaptchaMiddleware, login);
router.post('/logout', logout);
router.get('/verify', authMiddleware, verifyToken);

module.exports = router;