const Room = require('../models/Room');
const Plant = require('../models/Plant');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
exports.getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find();
  
  res.status(200).json({
    success: true,
    count: rooms.length,
    data: rooms
  });
});

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  
  if (!room) {
    return res.status(404).json({
      success: false,
      message: `Room with id ${req.params.id} not found`
    });
  }
  
  res.status(200).json({
    success: true,
    data: room
  });
});

// @desc    Create new room
// @route   POST /api/rooms
// @access  Public
exports.createRoom = asyncHandler(async (req, res) => {
  const room = await Room.create(req.body);
  
  res.status(201).json({
    success: true,
    data: room
  });
});

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Public
exports.updateRoom = asyncHandler(async (req, res) => {
  let room = await Room.findById(req.params.id);
  
  if (!room) {
    return res.status(404).json({
      success: false,
      message: `Room with id ${req.params.id} not found`
    });
  }
  
  room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: room
  });
});

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Public
exports.deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  
  if (!room) {
    return res.status(404).json({
      success: false,
      message: `Room with id ${req.params.id} not found`
    });
  }
  
  await room.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// Get all rooms for current user
exports.getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ owner: req.user.id });

    // For each room, count the number of plants
    const roomsWithPlantCount = await Promise.all(
      rooms.map(async (room) => {
        const plantCount = await Plant.countDocuments({
          owner: req.user.id,
          room: room.name,
        });
        
        return {
          ...room.toObject(),
          plantCount,
        };
      })
    );

    res.status(200).json({
      status: 'success',
      results: rooms.length,
      data: {
        rooms: roomsWithPlantCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Update room
exports.updateRoom = async (req, res, next) => {
  try {
    // If name is being updated, check if a room with the new name already exists
    if (req.body.name) {
      const existingRoom = await Room.findOne({
        owner: req.user.id,
        name: req.body.name,
        _id: { $ne: req.params.id }, // Exclude current room
      });

      if (existingRoom) {
        return res.status(400).json({
          status: 'fail',
          message: 'A room with this name already exists',
        });
      }
    }

    const updatedRoom = await Room.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRoom) {
      return res.status(404).json({
        status: 'fail',
        message: 'Room not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        room: updatedRoom,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Delete room
exports.deleteRoom = async (req, res, next) => {
  try {
    // Get the room to check its name
    const room = await Room.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!room) {
      return res.status(404).json({
        status: 'fail',
        message: 'Room not found',
      });
    }

    // Check if there are plants in this room
    const plantCount = await Plant.countDocuments({
      owner: req.user.id,
      room: room.name,
    });

    if (plantCount > 0) {
      return res.status(400).json({
        status: 'fail',
        message: `Cannot delete room with plants. There are ${plantCount} plants in this room.`,
      });
    }

    // Delete the room
    await Room.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
}; 