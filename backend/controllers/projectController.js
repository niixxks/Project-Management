const Project = require('../models/Project');
const Task = require('../models/Task');

// Create project (Admin or Member)
exports.createProject = async (req, res) => {
  try {
    const { name, description, dueDate } = req.body;

    const project = new Project({
      name,
      description,
      owner: req.user.id,
      members: [req.user.id],
      dueDate,
    });

    await project.save();
    await project.populate('owner members');

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all projects for user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    })
      .populate('owner')
      .populate('members');

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner')
      .populate('members');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is member or owner
    const isMember = project.members.some((m) => m._id.toString() === req.user.id);
    if (project.owner._id.toString() !== req.user.id && !isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('owner')
      .populate('members');

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete all tasks in project
    await Task.deleteMany({ project: req.params.id });

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add member to project
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner or admin
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if member already exists
    if (project.members.includes(userId)) {
      return res.status(400).json({ message: 'Member already in project' });
    }

    project.members.push(userId);
    await project.save();

    await project.populate('owner').populate('members');

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove member from project
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner or admin
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    project.members = project.members.filter((m) => m.toString() !== userId);
    await project.save();

    await project.populate('owner').populate('members');

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
