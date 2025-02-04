const mongoose = require('mongoose');

// Create Project Schema
const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model('Project', ProjectSchema);
