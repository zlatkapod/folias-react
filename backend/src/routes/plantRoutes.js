const express = require('express');
const plantController = require('../controllers/plantController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes - require authentication
router.use(authController.protect);

// Plant routes
router.route('/')
  .get(plantController.getAllPlants)
  .post(plantController.createPlant);

router.route('/:id')
  .get(plantController.getPlant)
  .patch(plantController.updatePlant)
  .delete(plantController.deletePlant);

// Special routes
router.get('/to-water', plantController.getPlantsToWater);
router.get('/by-room/:room', plantController.getPlantsByRoom);
router.get('/by-health/:status', plantController.getPlantsByHealth);

module.exports = router; 