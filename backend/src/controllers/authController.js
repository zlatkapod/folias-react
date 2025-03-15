const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');

// Create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Development token for testing - only available in development environment
exports.getDevToken = async (req, res, next) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({
      status: 'fail',
      message: 'Endpoint not found'
    });
  }
  
  try {
    // Look for a development user or create one if it doesn't exist
    let devUser = await User.findOne({ email: 'dev@example.com' });
    
    if (!devUser) {
      try {
        devUser = await User.create({
          name: 'Development User',
          email: 'dev@example.com',
          password: 'password123',
          passwordConfirm: 'password123',
          role: 'admin' // Give admin role for testing all features
        });
        console.log('Created development user for testing');
      } catch (createErr) {
        console.error('Error creating dev user:', createErr);
        // If we can't create, try to find again - might be a validation error
        devUser = await User.findOne({ email: 'dev@example.com' });
        if (!devUser) {
          throw new Error('Could not create or find development user');
        }
      }
    }
    
    // Generate JWT
    const token = createToken(devUser._id);
    
    // Set token in cookie for better security (optional)
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    
    res.status(200).json({
      status: 'success',
      token,
      message: 'Development token generated',
      user: {
        id: devUser._id,
        name: devUser.name,
        email: devUser.email,
        role: devUser.role
      }
    });
  } catch (err) {
    console.error('Error generating dev token:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Error generating development token',
      error: err.message
    });
  }
};

// Register user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already in use',
      });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    // Generate JWT
    const token = createToken(newUser._id);

    // Remove password from output
    newUser.password = undefined;

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password',
      });
    }

    // Check if user exists & password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }

    // Generate JWT
    const token = createToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get current user profile
// exports.getMe = async (req, res, next) => {
//   try {
//     // User is already available in req.user due to protect middleware
//     res.status(200).json({
//       status: 'success',
//       data: {
//         user: req.user,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// Update user profile
// exports.updateMe = async (req, res, next) => {
//   try {
//     // 1. Check if password update is attempted
//     if (req.body.password || req.body.passwordConfirm) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'This route is not for password updates. Use /updatePassword.',
//       });
//     }

//     // 2. Filter out unwanted fields
//     const filteredBody = {};
//     const allowedFields = ['name', 'email', 'avatar'];
//     Object.keys(req.body).forEach((field) => {
//       if (allowedFields.includes(field)) {
//         filteredBody[field] = req.body[field];
//       }
//     });

//     // 3. Update user document
//     const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json({
//       status: 'success',
//       data: {
//         user: updatedUser,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// Update password
exports.updatePassword = async (req, res, next) => {
  try {
    // 1. Get user from database
    const user = await User.findById(req.user.id).select('+password');

    // 2. Check if current password is correct
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your current password is incorrect',
      });
    }

    // 3. Update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4. Generate JWT and login
    const token = createToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Protect middleware - checks if user is authenticated
exports.protect = async (req, res, next) => {
  try {
    // 1. Check if token exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.',
      });
    }

    // 2. Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // 4. Set user in request
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token. Please log in again.',
      });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Your token has expired. Please log in again.',
      });
    }
    next(err);
  }
};

// Restrict to certain roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
}; 