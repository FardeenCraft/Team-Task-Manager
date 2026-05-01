const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdBy: String,
  teamMembers: [String],

  
  completed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Project", projectSchema);