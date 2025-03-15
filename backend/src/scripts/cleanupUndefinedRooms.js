/**
 * Script to clean up plants with "undefined" rooms
 * 
 * This script:
 * 1. Connects to the database
 * 2. Finds all plants with room set to "undefined"
 * 3. Updates them to either have a default room or removes them
 */

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Plant = require('../models/plantModel');
const Room = require('../models/roomModel');
const User = require('../models/userModel');
const connectDB = require('../utils/db');

// Load environment variables
dotenv.config();

// Main cleanup function
const cleanupUndefinedRooms = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Find all plants with undefined rooms
    const undefinedPlants = await Plant.find({ room: 'undefined' });
    
    if (undefinedPlants.length === 0) {
      console.log('No plants with undefined rooms found.');
      process.exit(0);
    }
    
    console.log(`Found ${undefinedPlants.length} plants with undefined rooms.`);
    
    // Create a default room if it doesn't exist
    let defaultRoom = await Room.findOne({ name: 'Default Room' });
    
    if (!defaultRoom) {
      // Find a user to associate with the default room
      const anyUser = await User.findOne();
      
      if (!anyUser) {
        console.error('No users found in the database. Cannot create default room.');
        process.exit(1);
      }
      
      defaultRoom = await Room.create({
        name: 'Default Room',
        lightCondition: 'Medium light',
        description: 'Default room created by system cleanup script',
        owner: anyUser._id
      });
      
      console.log('Created a new default room:', defaultRoom.name);
    }
    
    // Update all plants with undefined rooms to use the default room
    const updateResult = await Plant.updateMany(
      { room: 'undefined' },
      { $set: { room: 'Default Room' } }
    );
    
    console.log(`Updated ${updateResult.modifiedCount} plants to use the default room.`);
    
    // Verify the update
    const remainingUndefined = await Plant.countDocuments({ room: 'undefined' });
    console.log(`Remaining plants with undefined rooms: ${remainingUndefined}`);
    
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Database connection closed.');
    
    process.exit(0);
  } catch (error) {
    console.error(`Error cleaning up undefined rooms: ${error.message}`);
    process.exit(1);
  }
};

// Execute the cleanup
cleanupUndefinedRooms(); 