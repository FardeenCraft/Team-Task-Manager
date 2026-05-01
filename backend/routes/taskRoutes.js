const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");
const Project = require("../models/Project");
const User = require("../models/User");

// CREATE TASK
router.post("/", auth, async (req, res) => {
  try {
    // 🔐 ROLE CHECK (ADD THIS)
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const { title, description, assignedTo, projectId, dueDate } = req.body;

    // 🛑 BASIC VALIDATION (IMPORTANT)
    if (!title || !assignedTo) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      projectId,
      dueDate,
      createdBy: req.user.id
    });

    await task.save();
    res.json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET TASKS (for logged-in user)
router.get("/", auth, async (req, res) => {
  try {
    let tasks;

    // 🔐 ROLE-BASED FILTER
    if (req.user.role === "Admin") {
      tasks = await Task.find();
    } else {
      // Member → only their tasks
      tasks = await Task.find({
        assignedTo: req.user.id
      });
    }

    const users = await User.find();
    const projects = await Project.find();

    const enrichedTasks = tasks.map(task => {
      const user = users.find(
        u => u._id.toString() === task.assignedTo
      );

      const project = projects.find(
        p => p._id.toString() === task.projectId
      );

      return {
        ...task._doc,
        assignedUserName: user ? user.name : "Unknown",
        projectName: project ? project.title : "No Project"
      };
    });

    res.json(enrichedTasks);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// UPDATE TASK STATUS
router.patch("/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 DELETE TASK
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // 🔐 Only Admin can delete
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Not allowed" });
    }

    await task.deleteOne();

    res.json({ msg: "Task deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;