const Plant = require('../models/plantModel');

// Get all plants for current user
exports.getAllPlants = async (req, res, next) => {
  try {
    const plants = await Plant.find({ owner: req.user.id });

    res.status(200).json({
      status: 'success',
      results: plants.length,
      data: {
        plants,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get plant by ID
exports.getPlant = async (req, res, next) => {
  try {
    const plant = await Plant.findOne({
      _id: req.params.id,
      owner: req.user.id,
    }).populate('careLogs');

    if (!plant) {
      return res.status(404).json({
        status: 'fail',
        message: 'Plant not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        plant,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Create a new plant
exports.createPlant = async (req, res, next) => {
  try {
    // Add user to request body
    req.body.owner = req.user.id;

    // Format dates if provided
    if (req.body.nextWatering) {
      req.body.nextWatering = new Date(req.body.nextWatering);
    }
    if (req.body.acquiredDate) {
      req.body.acquiredDate = new Date(req.body.acquiredDate);
    }

    const newPlant = await Plant.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        plant: newPlant,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Update plant
exports.updatePlant = async (req, res, next) => {
  try {
    // Format dates if provided
    if (req.body.nextWatering) {
      req.body.nextWatering = new Date(req.body.nextWatering);
    }
    if (req.body.acquiredDate) {
      req.body.acquiredDate = new Date(req.body.acquiredDate);
    }

    const updatedPlant = await Plant.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPlant) {
      return res.status(404).json({
        status: 'fail',
        message: 'Plant not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        plant: updatedPlant,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Delete plant
exports.deletePlant = async (req, res, next) => {
  try {
    const plant = await Plant.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!plant) {
      return res.status(404).json({
        status: 'fail',
        message: 'Plant not found',
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

// Get plants due for watering
exports.getPlantsToWater = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const plants = await Plant.find({
      owner: req.user.id,
      nextWatering: { $lte: today },
    });

    res.status(200).json({
      status: 'success',
      results: plants.length,
      data: {
        plants,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get plants by room
exports.getPlantsByRoom = async (req, res, next) => {
  try {
    const plants = await Plant.find({
      owner: req.user.id,
      room: req.params.room,
    });

    res.status(200).json({
      status: 'success',
      results: plants.length,
      data: {
        plants,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get plants by health status
exports.getPlantsByHealth = async (req, res, next) => {
  try {
    const plants = await Plant.find({
      owner: req.user.id,
      health: req.params.status,
    });

    res.status(200).json({
      status: 'success',
      results: plants.length,
      data: {
        plants,
      },
    });
  } catch (err) {
    next(err);
  }
}; 