const Task = require('../models/Task');
const Project = require('../models/Project');

const getDashboard = async (req, res) => {
  try {
    const now = new Date();

    if (req.user.role === 'Admin') {
      const [total, completed, pending, overdue, recent] = await Promise.all([
        Task.countDocuments(),
        Task.countDocuments({ status: 'Completed' }),
        Task.countDocuments({ status: { $in: ['Todo', 'In Progress'] } }),
        Task.countDocuments({ dueDate: { $lt: now }, status: { $ne: 'Completed' } }),
        Task.find().sort('-createdAt').limit(5).populate('assignedTo project', 'name projectName'),
      ]);
      const totalProjects = await Project.countDocuments();
      res.json({ totalTasks: total, completedTasks: completed, pendingTasks: pending, overdueTasks: overdue, recentTasks: recent, totalProjects });
    } else {
      const userId = req.user._id;
      const [assigned, completed, pending, overdue] = await Promise.all([
        Task.countDocuments({ assignedTo: userId }),
        Task.countDocuments({ assignedTo: userId, status: 'Completed' }),
        Task.countDocuments({ assignedTo: userId, status: { $in: ['Todo', 'In Progress'] } }),
        Task.countDocuments({ assignedTo: userId, dueDate: { $lt: now }, status: { $ne: 'Completed' } }),
      ]);
      const recentTasks = await Task.find({ assignedTo: userId }).sort('-createdAt').limit(5).populate('project', 'projectName');
      res.json({ assignedTasks: assigned, completedTasks: completed, pendingTasks: pending, overdueTasks: overdue, recentTasks });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboard };
