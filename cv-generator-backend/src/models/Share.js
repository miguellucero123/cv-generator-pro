const mongoose = require('mongoose');

const ShareSchema = new mongoose.Schema({
  cv: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CV',
    required: true,
  },
  token: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    default: null,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Share', ShareSchema);
