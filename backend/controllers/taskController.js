const Task = require('../models/Task');
const Project = require('../models/Project');

// Create task
exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is member of project
    const isMember = project.members.some((m) => m.toString() === req.user.id);
    if (project.owner.toString() !== req.user.id && !isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const task = new Task({
      title,
      description,
      project: projectId,
      assignedTo,
      priority,
      dueDate,
      createdBy: req.user.id,
    });

    await task.save();
    await task.populate('assignedTo createdBy');

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tasks for a project
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.some((m) => m.toString() === req.user.id);
    if (project.owner.toString() !== req.user.id && !isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo')
      .populate('createdBy')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my tasks
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ assignedTo: req.user.id }, { createdBy: req.user.id }],
    })
      .populate('project')
      .populate('assignedTo')
      .populate('createdBy')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization
    const project = await Project.findById(task.project);
    const isMember = project.members.some((m) => m.toString() === req.user.id);

    if (
      project.owner.toString() !== req.user.id &&
      task.createdBy.toString() !== req.user.id &&
      !isMember &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('assignedTo')
      .populate('createdBy');

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization
    const project = await Project.findById(task.project);
    const isMember = project.members.some((m) => m.toString() === req.user.id);

    if (
      project.owner.toString() !== req.user.id &&
      task.createdBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Get user's projects
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    });

    const projectIds = projects.map((p) => p._id);

    // Get task stats
    const tasks = await Task.find({ project: { $in: projectIds } });

    const completed = tasks.filter((t) => t.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const todo = tasks.filter((t) => t.status === 'todo').length;

    // Get overdue tasks
    const now = new Date();
    const overdue = tasks.filter(
      (t) => t.dueDate && t.dueDate < now && t.status !== 'completed'
    );

    // Get assigned to me
    const myTasks = tasks.filter((t) => t.assignedTo?.toString() === req.user.id);

    res.json({
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completed,
      inProgress,
      todo,
      overdue: overdue.length,
      assignedToMe: myTasks.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
