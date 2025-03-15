const mongoose = require('mongoose');

// Generic configuration schema that can be used for different types of configurations
const ConfigSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Configuration ID is required'],
    trim: true
  },
  label: {
    type: String,
    required: [true, 'Configuration label is required'],
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
ConfigSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create models for different configuration types
const PlantType = mongoose.model('PlantType', ConfigSchema);
const SoilType = mongoose.model('SoilType', ConfigSchema);
const PotSize = mongoose.model('PotSize', ConfigSchema);
const LightCondition = mongoose.model('LightCondition', ConfigSchema);

module.exports = {
  PlantType,
  SoilType,
  PotSize,
  LightCondition
}; 