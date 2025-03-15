const express = require('express');
const {
  plantType,
  soilType,
  potSize,
  lightCondition
} = require('../controllers/configController');

const router = express.Router();

// Plant Types routes
router
  .route('/plant-types')
  .get(plantType.getAll)
  .post(plantType.create);

router
  .route('/plant-types/:id')
  .get(plantType.getOne)
  .put(plantType.update)
  .delete(plantType.delete);

// Soil Types routes
router
  .route('/soil-types')
  .get(soilType.getAll)
  .post(soilType.create);

router
  .route('/soil-types/:id')
  .get(soilType.getOne)
  .put(soilType.update)
  .delete(soilType.delete);

// Pot Sizes routes
router
  .route('/pot-sizes')
  .get(potSize.getAll)
  .post(potSize.create);

router
  .route('/pot-sizes/:id')
  .get(potSize.getOne)
  .put(potSize.update)
  .delete(potSize.delete);

// Light Conditions routes
router
  .route('/light-conditions')
  .get(lightCondition.getAll)
  .post(lightCondition.create);

router
  .route('/light-conditions/:id')
  .get(lightCondition.getOne)
  .put(lightCondition.update)
  .delete(lightCondition.delete);

module.exports = router; 