const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: String,
  role: String,
  duration: String,
  description: String,
  order: { type: Number, default: 0 }
});

const educationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  year: String,
  order: { type: Number, default: 0 }
});

const skillSchema = new mongoose.Schema({
  category: String,
  skills: [String],
  order: { type: Number, default: 0 }
});

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  technologies: [String],
  order: { type: Number, default: 0 }
});

const resumeSchema = new mongoose.Schema({
  personalInfo: {
    name: String,
    email: String,
    phone: String,
    location: String,
    linkedIn: String,
    github: String,
    website: String,
    summary: String
  },
  experience: [experienceSchema],
  education: [educationSchema],
  skills: [skillSchema],
  projects: [projectSchema],
  certifications: [{
    name: String,
    issuer: String,
    year: String,
    order: { type: Number, default: 0 }
  }],
  achievements: [{
    description: String,
    order: { type: Number, default: 0 }
  }],
  templateId: {
    type: String,
    default: 'modern'
  },
  layout: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  transcriptions: [{
    text: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
resumeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);

