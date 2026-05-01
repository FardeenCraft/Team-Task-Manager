const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const auth = require("../middleware/authMiddleware");

// 🔹 CREATE PROJECT (Admin only)
router.post("/", auth, async (req, res) => {
  try {
    // 🔐 ROLE CHECK
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const { title, description, teamMembers } = req.body;

    // 🛑 VALIDATION
    if (!title) {
      return res.status(400).json({ msg: "Title is required" });
    }

    const project = new Project({
      title,
      description,
      createdBy: req.user.id,
      teamMembers: teamMembers || []
    });

    await project.save();
    res.json(project);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔹 GET PROJECTS (Admin + Member)
router.get("/", auth, async (req, res) => {
  try {
    let projects;

    if (req.user.role === "Admin") {
      // Admin sees projects they created
      projects = await Project.find({
        createdBy: req.user.id
      });
    } else {
      // Member sees only projects where they are team member
      projects = await Project.find({
        teamMembers: req.user.id
      });
    }

    res.json(projects);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 🔹 UPDATE PROJECT (toggle completed)
router.patch("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // 🔐 Only Admin who created project can update
    if (req.user.role !== "Admin" || project.createdBy !== req.user.id) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    // update fields
    project.completed = req.body.completed;

    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 DELETE PROJECT (Admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    // 🔐 Only Admin
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // 🔥 OPTIONAL: delete all tasks of this project
    const Task = require("../models/Task");
    await Task.deleteMany({ projectId: req.params.id });

    await project.deleteOne();

    res.json({ msg: "Project deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;