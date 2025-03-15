const mongoose = require('mongoose');

const careLogSchema = new mongoose.Schema(
  {
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant',
      required: [true, 'Care log must be associated with a plant'],
    },
    type: {
      type: String,
      required: [true, 'Log type is required'],
      enum: ['watering', 'fertilizing', 'repotting', 'health'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    quantity: {
      type: Number, // For watering and fertilizing
    },
    fertilizerName: {
      type: String, // For fertilizing
    },
    potSize: {
      type: String, // For repotting
    },
    soilType: {
      type: String, // For repotting
    },
    issue: {
      type: String, // For health issues
    },
    description: {
      type: String, // For health issues
    },
    treatment: {
      type: String, // For health issues
    },
    photoUrl: {
      type: String, // For health issues
    },
    notes: {
      type: String, // For all log types
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Care log must have a user who created it'],
    },
  },
  {
    timestamps: true,
  }
);

// Middleware: After saving a watering log, update the plant's next watering date
careLogSchema.post('save', async function() {
  if (this.type === 'watering') {
    try {
      // Get the Plant model
      const Plant = mongoose.model('Plant');
      
      // Find the plant and update watering info
      const plant = await Plant.findById(this.plant);
      
      if (plant) {
        plant.lastWatered = this.date;
        
        // Calculate and set next watering date based on frequency
        if (plant.wateringFrequency) {
          plant.updateNextWatering();
          await plant.save();
        }
      }
    } catch (error) {
      console.error('Error updating plant watering info:', error);
    }
  }
  
  // If this is a repotting log, update the plant's pot size and soil type
  if (this.type === 'repotting') {
    try {
      const Plant = mongoose.model('Plant');
      const plant = await Plant.findById(this.plant);
      
      if (plant) {
        if (this.potSize) plant.potSize = this.potSize;
        if (this.soilType) plant.soilType = this.soilType;
        await plant.save();
      }
    } catch (error) {
      console.error('Error updating plant repotting info:', error);
    }
  }
});

const CareLog = mongoose.model('CareLog', careLogSchema);

module.exports = CareLog; 