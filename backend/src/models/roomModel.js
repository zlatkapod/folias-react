const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A room must have a name'],
      trim: true,
    },
    lightCondition: {
      type: String,
      enum: [
        'Low light',
        'Medium light',
        'Bright indirect',
        'Direct sunlight',
      ],
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A room must belong to a user'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for plants in this room
roomSchema.virtual('plants', {
  ref: 'Plant',
  foreignField: 'room',
  localField: 'name',
});

// Create an index on the room name (for faster lookups by plants)
roomSchema.index({ name: 1, owner: 1 }, { unique: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room; 