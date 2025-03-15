/**
 * Script to clean up plants with invalid room values
 * 
 * This script handles:
 * - undefined rooms
 * - null rooms
 * - empty string rooms
 * - plants with room references that don't exist
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
const cleanupInvalidRooms = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Find all plants with problematic room values
    const invalidRoomPlants = await Plant.find({
      $or: [
        { room: 'undefined' },
        { room: null },
        { room: '' }
      ]
    });
    
    if (invalidRoomPlants.length === 0) {
      console.log('No plants with invalid rooms found.');
    } else {
      console.log(`Found ${invalidRoomPlants.length} plants with invalid rooms.`);
      
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
      
      // Update all plants with invalid rooms
      const updateResult = await Plant.updateMany(
        {
          $or: [
            { room: 'undefined' },
            { room: null },
            { room: '' }
          ]
        },
        { $set: { room: 'Default Room' } }
      );
      
      console.log(`Updated ${updateResult.modifiedCount} plants to use the default room.`);
    }
    
    // Now check if there are any plants with room names that don't exist in the rooms collection
    const allRooms = await Room.find({}, { name: 1 });
    const roomNames = allRooms.map(room => room.name);
    
    const orphanedPlants = await Plant.find({ 
      room: { $nin: roomNames },
      // Make sure we don't include the ones we just fixed
      room: { $ne: 'Default Room' }
    });
    
    if (orphanedPlants.length > 0) {
      console.log(`Found ${orphanedPlants.length} plants with rooms that don't exist in the room collection.`);
      
      // Log the orphaned plants for reference
      orphanedPlants.forEach(plant => {
        console.log(`Plant ID: ${plant._id}, Name: ${plant.name}, Invalid Room: ${plant.room}`);
      });
      
      // Update these plants to use the default room as well
      const orphanUpdateResult = await Plant.updateMany(
        { _id: { $in: orphanedPlants.map(p => p._id) } },
        { $set: { room: 'Default Room' } }
      );
      
      console.log(`Updated ${orphanUpdateResult.modifiedCount} orphaned plants to use the default room.`);
    } else {
      console.log('No plants with non-existent room references found.');
    }
    
    // Verify no invalid plants remain
    const remainingInvalid = await Plant.countDocuments({
      $or: [
        { room: 'undefined' },
        { room: null },
        { room: '' }
      ]
    });
    
    console.log(`Remaining plants with invalid rooms: ${remainingInvalid}`);
    
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Database connection closed.');
    
    process.exit(0);
  } catch (error) {
    console.error(`Error cleaning up invalid rooms: ${error.message}`);
    process.exit(1);
  }
};

// Execute the cleanup
cleanupInvalidRooms(); 