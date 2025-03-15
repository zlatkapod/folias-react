const Room = require('../models/roomModel');
const Plant = require('../models/plantModel');

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

// Get room by ID
exports.getRoom = async (req, res, next) => {
  try {
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

    // Count plants in this room
    const plantCount = await Plant.countDocuments({
      owner: req.user.id,
      room: room.name,
    });

    // Get plants in this room
    const plants = await Plant.find({
      owner: req.user.id,
      room: room.name,
    });

    res.status(200).json({
      status: 'success',
      data: {
        room: {
          ...room.toObject(),
          plantCount,
          plants,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// Create a new room
exports.createRoom = async (req, res, next) => {
  try {
    // Add user to request body
    req.body.owner = req.user.id;

    // Check if room with same name already exists for this user
    const existingRoom = await Room.findOne({
      owner: req.user.id,
      name: req.body.name,
    });

    if (existingRoom) {
      return res.status(400).json({
        status: 'fail',
        message: 'A room with this name already exists',
      });
    }

    const newRoom = await Room.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        room: newRoom,
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