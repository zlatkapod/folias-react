const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A plant must have a name'],
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    room: {
      type: String,
      required: [true, 'Please specify which room this plant is in'],
      trim: true,
    },
    lightCondition: {
      type: String,
      enum: [
        'Low Light',
        'Medium Light',
        'Bright Light',
        'Direct Sunlight',
        'Indirect Sunlight',
      ],
    },
    wateringFrequency: {
      type: String,
      enum: [
        'Daily',
        'Every 2-3 days',
        'Weekly',
        'Bi-weekly',
        'Monthly',
        'As needed',
      ],
    },
    nextWatering: {
      type: Date,
    },
    lastWatered: {
      type: Date,
    },
    potSize: {
      type: String,
    },
    soilType: {
      type: String,
    },
    health: {
      type: String,
      enum: ['Good', 'Needs Attention'],
      default: 'Good',
    },
    acquiredDate: {
      type: Date,
    },
    imageUrl: {
      type: String,
    },
    notes: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A plant must belong to a user'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for care logs
plantSchema.virtual('careLogs', {
  ref: 'CareLog',
  foreignField: 'plant',
  localField: '_id',
});

// Calculate days until next watering
plantSchema.virtual('daysUntilWatering').get(function () {
  if (!this.nextWatering) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize today's date
  
  const wateringDate = new Date(this.nextWatering);
  const timeDiff = wateringDate - today;
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// Middleware to update nextWatering date when plant is watered
plantSchema.methods.updateNextWatering = function () {
  const now = new Date();
  this.lastWatered = now;
  
  // Set next watering date based on frequency
  switch (this.wateringFrequency) {
    case 'Daily':
      this.nextWatering = new Date(now.setDate(now.getDate() + 1));
      break;
    case 'Every 2-3 days':
      this.nextWatering = new Date(now.setDate(now.getDate() + 3));
      break;
    case 'Weekly':
      this.nextWatering = new Date(now.setDate(now.getDate() + 7));
      break;
    case 'Bi-weekly':
      this.nextWatering = new Date(now.setDate(now.getDate() + 14));
      break;
    case 'Monthly':
      this.nextWatering = new Date(now.setMonth(now.getMonth() + 1));
      break;
    default:
      // If 'As needed' or not specified, don't set next watering
      break;
  }
  
  return this;
};

const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant; 