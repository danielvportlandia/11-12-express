'use strict';

import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  bicepsRPM: {
    type: Number,
  },
  tricepsRPM: {
    type: Number,
  },
});

// Vinicio Mongoose wants to create a model out of a Schema
export default mongoose.model('user', userSchema);
