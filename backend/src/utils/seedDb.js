const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Plant = require('../models/Plant');
const Room = require('../models/Room');
const { PlantType, SoilType, PotSize, LightCondition } = require('../models/Configuration');

// Load environment variables
dotenv.config();

// Initial plant types
const plantTypes = [
  { id: 'succulent', label: 'Succulent' },
  { id: 'cactus', label: 'Cactus' },
  { id: 'tropical', label: 'Tropical' },
  { id: 'herb', label: 'Herb' },
  { id: 'fern', label: 'Fern' },
  { id: 'palm', label: 'Palm' },
  { id: 'orchid', label: 'Orchid' },
  { id: 'bonsai', label: 'Bonsai' },
  { id: 'flower', label: 'Flowering Plant' }
];

// Initial soil types
const soilTypes = [
  { id: 'all-purpose', label: 'All-purpose Potting Mix' },
  { id: 'succulent', label: 'Succulent/Cactus Mix' },
  { id: 'orchid', label: 'Orchid Mix' },
  { id: 'african-violet', label: 'African Violet Mix' },
  { id: 'peat-moss', label: 'Peat Moss' },
  { id: 'perlite', label: 'Perlite' }
];

// Initial pot sizes
const potSizes = [
  { id: 'xs', label: 'Extra Small (2-3")' },
  { id: 'sm', label: 'Small (4-5")' },
  { id: 'md', label: 'Medium (6-8")' },
  { id: 'lg', label: 'Large (10-12")' },
  { id: 'xl', label: 'Extra Large (14"+)' }
];

// Initial light conditions
const lightConditions = [
  { id: 'direct', label: 'Direct Sunlight' },
  { id: 'indirect', label: 'Indirect Sunlight' },
  { id: 'low', label: 'Low Light' },
  { id: 'medium', label: 'Medium Light' }
];

// Initial rooms
const rooms = [
  { name: 'Living Room', lightLevel: 'Medium', description: 'Main living area with east-facing windows' },
  { name: 'Kitchen', lightLevel: 'High', description: 'Kitchen with south-facing windows' },
  { name: 'Bedroom', lightLevel: 'Low', description: 'Bedroom with north-facing windows' },
  { name: 'Bathroom', lightLevel: 'Low', description: 'Bathroom with small window' },
  { name: 'Office', lightLevel: 'Medium', description: 'Home office with west-facing windows' }
];

// Sample plants
const plants = [
  {
    name: 'Snake Plant',
    type: 'succulent',
    room: 'Living Room',
    nextWatering: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    lastWatered: new Date(),
    health: 'Good',
    lightCondition: 'Low Light',
    potSize: 'md',
    soilType: 'all-purpose',
    wateringFrequency: 'Bi-weekly',
    acquiredDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    notes: 'Very hardy plant, doesn\'t need much attention'
  },
  {
    name: 'Monstera',
    type: 'tropical',
    room: 'Living Room',
    nextWatering: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    lastWatered: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    health: 'Good',
    lightCondition: 'Medium Light',
    potSize: 'lg',
    soilType: 'all-purpose',
    wateringFrequency: 'Weekly',
    acquiredDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    notes: 'Growing new leaf, make sure to mist regularly'
  },
  {
    name: 'Peace Lily',
    type: 'flower',
    room: 'Bedroom',
    nextWatering: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    lastWatered: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    health: 'Needs attention',
    lightCondition: 'Low Light',
    potSize: 'md',
    soilType: 'all-purpose',
    wateringFrequency: 'Weekly',
    acquiredDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    notes: 'Leaves starting to droop, might need more water'
  }
];

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Clear existing data
      await Plant.deleteMany();
      await Room.deleteMany();
      await PlantType.deleteMany();
      await SoilType.deleteMany();
      await PotSize.deleteMany();
      await LightCondition.deleteMany();
      
      console.log('Previous data cleaned');
      
      // Insert new data
      await PlantType.insertMany(plantTypes);
      await SoilType.insertMany(soilTypes);
      await PotSize.insertMany(potSizes);
      await LightCondition.insertMany(lightConditions);
      await Room.insertMany(rooms);
      await Plant.insertMany(plants);
      
      console.log('Database seeded successfully!');
      process.exit(0);
    } catch (error) {
      console.error('Error seeding database:', error);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 