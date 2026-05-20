const Project = require('../models/Project');
const User = require('../models/User');

const createProject = async (req, res) => {
  const { projectName, description, teamMembers } = req.body;
  try {
    const project = await Project.create({
      projectName,
      description,
      createdBy: req.user._id,
      teamMembers: teamMembers || [],
    });
    res.status(201).json(await project.populate('createdBy teamMembers', 'name email'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const query = req.user.role === 'Admin' ? {} : { teamMembers: req.user._id };
    const projects = await Project.find(query).populate('createdBy teamMembers', 'name email').sort('-createdAt');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('createdBy teamMembers', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    if (req.user.role !== 'Admin' && !project.teamMembers.some(m => m._id.equals(req.user._id))) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProject = async (req, res) => {
  const { projectName, description, teamMembers } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.projectName = projectName || project.projectName;
    project.description = description || project.description;
    if (teamMembers) project.teamMembers = teamMembers;

    await project.save();
    res.json(await project.populate('createdBy teamMembers', 'name email'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTeamMembers = async (req, res) => {
  try {
    const members = await User.find({ role: 'Member' }).select('name email');
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createProject, getAllProjects, getProjectById, updateProject, deleteProject, getTeamMembers };
