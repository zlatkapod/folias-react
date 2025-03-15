const express = require('express');
const careLogController = require('../controllers/careLogController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes - require authentication
router.use(authController.protect);

// Care log routes
router.route('/')
  .post(careLogController.createCareLog);

router.route('/:id')
  .get(careLogController.getCareLog)
  .patch(careLogController.updateCareLog)
  .delete(careLogController.deleteCareLog);

// Special routes
router.get('/plant/:plantId', careLogController.getCareLogsForPlant);
router.get('/type/:type', careLogController.getCareLogsByType);
router.get('/recent', careLogController.getRecentCareLogs);

module.exports = router; 