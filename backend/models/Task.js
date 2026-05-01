const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,

  status: {
    type: String,
    enum: ["Todo", "In Progress", "Done"],
    default: "Todo"
  },

  assignedTo: String,
  projectId: String,
  dueDate: Date,

  
  createdBy: String
});

module.exports = mongoose.model("Task", taskSchema);