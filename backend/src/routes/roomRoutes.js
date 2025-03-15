const express = require('express');
const roomController = require('../controllers/roomController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes - require authentication
router.use(authController.protect);

// Room routes
router.route('/')
  .get(roomController.getAllRooms)
  .post(roomController.createRoom);

router.route('/:id')
  .get(roomController.getRoom)
  .patch(roomController.updateRoom)
  .delete(roomController.deleteRoom);

module.exports = router; 