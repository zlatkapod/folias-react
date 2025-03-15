const User = require('../models/userModel');

// Get current user profile
exports.getMe = async (req, res, next) => {
  try {
    // User is already available in req.user due to protect middleware
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Update user profile
exports.updateMe = async (req, res, next) => {
  try {
    // 1. Check if password update is attempted
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: 'fail',
        message: 'This route is not for password updates. Use /updatePassword.',
      });
    }

    // 2. Filter out unwanted fields
    const filteredBody = {};
    const allowedFields = ['name', 'email', 'avatar'];
    Object.keys(req.body).forEach((field) => {
      if (allowedFields.includes(field)) {
        filteredBody[field] = req.body[field];
      }
    });

    // 3. Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get user by ID (admin only)
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Update user (admin only)
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
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