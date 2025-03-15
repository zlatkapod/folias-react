const Plant = require('../models/Plant');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all plants
// @route   GET /api/plants
// @access  Public
exports.getPlants = asyncHandler(async (req, res) => {
  const plants = await Plant.find();
  
  res.status(200).json({
    success: true,
    count: plants.length,
    data: plants
  });
});

// @desc    Get single plant
// @route   GET /api/plants/:id
// @access  Public
exports.getPlant = asyncHandler(async (req, res) => {
  const plant = await Plant.findById(req.params.id);
  
  if (!plant) {
    return res.status(404).json({
      success: false,
      message: `Plant with id ${req.params.id} not found`
    });
  }
  
  res.status(200).json({
    success: true,
    data: plant
  });
});

// @desc    Create new plant
// @route   POST /api/plants
// @access  Public
exports.createPlant = asyncHandler(async (req, res) => {
  const plant = await Plant.create(req.body);
  
  res.status(201).json({
    success: true,
    data: plant
  });
});

// @desc    Update plant
// @route   PUT /api/plants/:id
// @access  Public
exports.updatePlant = asyncHandler(async (req, res) => {
  let plant = await Plant.findById(req.params.id);
  
  if (!plant) {
    return res.status(404).json({
      success: false,
      message: `Plant with id ${req.params.id} not found`
    });
  }
  
  plant = await Plant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: plant
  });
});

// @desc    Delete plant
// @route   DELETE /api/plants/:id
// @access  Public
exports.deletePlant = asyncHandler(async (req, res) => {
  const plant = await Plant.findById(req.params.id);
  
  if (!plant) {
    return res.status(404).json({
      success: false,
      message: `Plant with id ${req.params.id} not found`
    });
  }
  
  await plant.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get plants due for watering
// @route   GET /api/plants/to-water
// @access  Public
exports.getPlantsToWater = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const plants = await Plant.find({
    nextWatering: { $lte: today }
  });

  res.status(200).json({
    success: true,
    count: plants.length,
    data: plants
  });
});

// @desc    Get plants by room
// @route   GET /api/plants/by-room/:room
// @access  Public
exports.getPlantsByRoom = asyncHandler(async (req, res) => {
  const plants = await Plant.find({
    room: req.params.room
  });

  res.status(200).json({
    success: true,
    count: plants.length,
    data: plants
  });
});

// @desc    Get plants by health status
// @route   GET /api/plants/by-health/:status
// @access  Public
exports.getPlantsByHealth = asyncHandler(async (req, res) => {
  const plants = await Plant.find({
    health: req.params.status
  });

  res.status(200).json({
    success: true,
    count: plants.length,
    data: plants
  });
});

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