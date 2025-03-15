const CareLog = require('../models/careLogModel');
const Plant = require('../models/plantModel');

// Get all care logs for a plant
exports.getCareLogsForPlant = async (req, res, next) => {
  try {
    // First check if the plant exists and belongs to the user
    const plant = await Plant.findOne({
      _id: req.params.plantId,
      owner: req.user.id,
    });

    if (!plant) {
      return res.status(404).json({
        status: 'fail',
        message: 'Plant not found',
      });
    }

    // Get all care logs for the plant
    const careLogs = await CareLog.find({
      plant: req.params.plantId,
      createdBy: req.user.id,
    }).sort({ date: -1 }); // Sort by date descending (newest first)

    res.status(200).json({
      status: 'success',
      results: careLogs.length,
      data: {
        careLogs,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get care log by ID
exports.getCareLog = async (req, res, next) => {
  try {
    const careLog = await CareLog.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    }).populate('plant');

    if (!careLog) {
      return res.status(404).json({
        status: 'fail',
        message: 'Care log not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        careLog,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Create a new care log
exports.createCareLog = async (req, res, next) => {
  try {
    // First check if the plant exists and belongs to the user
    const plant = await Plant.findOne({
      _id: req.body.plant,
      owner: req.user.id,
    });

    if (!plant) {
      return res.status(404).json({
        status: 'fail',
        message: 'Plant not found',
      });
    }

    // Add user to request body
    req.body.createdBy = req.user.id;

    // Format date if provided
    if (req.body.date) {
      req.body.date = new Date(req.body.date);
    }

    const newCareLog = await CareLog.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        careLog: newCareLog,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Update care log
exports.updateCareLog = async (req, res, next) => {
  try {
    // Format date if provided
    if (req.body.date) {
      req.body.date = new Date(req.body.date);
    }

    const updatedCareLog = await CareLog.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCareLog) {
      return res.status(404).json({
        status: 'fail',
        message: 'Care log not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        careLog: updatedCareLog,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Delete care log
exports.deleteCareLog = async (req, res, next) => {
  try {
    const careLog = await CareLog.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!careLog) {
      return res.status(404).json({
        status: 'fail',
        message: 'Care log not found',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

// Get all care logs by type
exports.getCareLogsByType = async (req, res, next) => {
  try {
    const careLogs = await CareLog.find({
      createdBy: req.user.id,
      type: req.params.type,
    })
      .populate('plant', 'name')
      .sort({ date: -1 });

    res.status(200).json({
      status: 'success',
      results: careLogs.length,
      data: {
        careLogs,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get recent care logs
exports.getRecentCareLogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const careLogs = await CareLog.find({
      createdBy: req.user.id,
    })
      .populate('plant', 'name')
      .sort({ date: -1 })
      .limit(limit);

    res.status(200).json({
      status: 'success',
      results: careLogs.length,
      data: {
        careLogs,
      },
    });
  } catch (err) {
    next(err);
  }
}; 