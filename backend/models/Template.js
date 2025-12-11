const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  thumbnail: String,
  category: {
    type: String,
    enum: ['modern', 'classic', 'creative', 'minimal', 'professional'],
    default: 'modern'
  },
  layout: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  styles: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Template', templateSchema);

