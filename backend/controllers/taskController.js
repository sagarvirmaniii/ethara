const Task = require('../models/Task');
const Project = require('../models/Project');

const createTask = async (req, res) => {
  const { title, description, assignedTo, project, status, priority, dueDate } = req.body;
  try {
    const proj = await Project.findById(project);
    if (!proj) return res.status(404).json({ message: 'Project not found' });

    const task = await Task.create({
      title, description, assignedTo, project, status, priority, dueDate,
      createdBy: req.user._id,
    });
    res.status(201).json(await task.populate('assignedTo createdBy', 'name email'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTasksByProject = async (req, res) => {
  try {
    const query = { project: req.params.projectId };
    if (req.user.role === 'Member') query.assignedTo = req.user._id;

    const tasks = await Task.find(query)
      .populate('assignedTo createdBy', 'name email')
      .sort('-createdAt');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role === 'Member') {
      if (!task.assignedTo?.equals(req.user._id)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      task.status = req.body.status || task.status;
    } else {
      const { title, description, assignedTo, status, priority, dueDate } = req.body;
      if (title) task.title = title;
      if (description) task.description = description;
      if (assignedTo) task.assignedTo = assignedTo;
      if (status) task.status = status;
      if (priority) task.priority = priority;
      if (dueDate) task.dueDate = dueDate;
    }

    await task.save();
    res.json(await task.populate('assignedTo createdBy', 'name email'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createTask, getTasksByProject, updateTask, deleteTask };
