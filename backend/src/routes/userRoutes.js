const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Dev token route - only for development environment
if (process.env.NODE_ENV === 'development') {
  router.post('/dev-token', authController.getDevToken);
}

// Protected routes
router.use(authController.protect);
router.get('/me', userController.getMe);
router.patch('/update-me', userController.updateMe);

module.exports = router; 