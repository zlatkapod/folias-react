const express = require('express');
const roomController = require('../controllers/roomController');

const router = express.Router();

// Room routes
router.route('/')
  .get(roomController.getRooms)
  .post(roomController.createRoom);

router.route('/:id')
  .get(roomController.getRoom)
  .put(roomController.updateRoom)
  .delete(roomController.deleteRoom);

module.exports = router; 