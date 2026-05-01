const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const { title, description, teamMembers } = req.body;

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


router.get("/", auth, async (req, res) => {
  try {
    let projects;

    if (req.user.role === "Admin") {
      projects = await Project.find({
        createdBy: req.user.id
      });
    } else {
      projects = await Project.find({
        teamMembers: req.user.id
      });
    }

    res.json(projects);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.patch("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    if (req.user.role !== "Admin" || project.createdBy !== req.user.id) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    project.completed = req.body.completed;

    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

    const Task = require("../models/Task");
    await Task.deleteMany({ projectId: req.params.id });

    await project.deleteOne();

    res.json({ msg: "Project deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;