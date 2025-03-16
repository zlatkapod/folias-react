const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plant name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Plant type is required'],
    trim: true
  },
  room: {
    type: String,
    trim: true
  },
  nextWatering: {
    type: Date
  },
  lastWatered: {
    type: Date
  },
  health: {
    type: String,
    enum: ['Good', 'Needs attention', 'Critical'],
    default: 'Good'
  },
  lightCondition: {
    type: String,
    enum: ['Direct Sunlight', 'Indirect Sunlight', 'Low Light', 'Medium Light'],
    default: 'Medium Light'
  },
  potSize: {
    type: String
  },
  soilType: {
    type: String
  },
  wateringFrequency: {
    type: String,
    enum: ['Daily', 'Every 2-3 days', 'Weekly', 'Bi-weekly', 'Monthly'],
    default: 'Weekly'
  },
  acquiredDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field on save
PlantSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Plant', PlantSchema); 