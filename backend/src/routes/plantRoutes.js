const express = require('express');
const plantController = require('../controllers/plantController');

const router = express.Router();

// Plant routes
router.route('/')
  .get(plantController.getPlants)
  .post(plantController.createPlant);

router.route('/:id')
  .get(plantController.getPlant)
  .put(plantController.updatePlant)
  .delete(plantController.deletePlant);

// Special routes
router.get('/to-water', plantController.getPlantsToWater);
router.get('/by-room/:room', plantController.getPlantsByRoom);
router.get('/by-health/:status', plantController.getPlantsByHealth);

module.exports = router; 