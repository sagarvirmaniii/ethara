const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
  createProject, getAllProjects, getProjectById,
  updateProject, deleteProject, getTeamMembers,
} = require('../controllers/projectController');

const router = express.Router();

router.use(protect);

router.get('/members', adminOnly, getTeamMembers);
router.route('/').get(getAllProjects).post(adminOnly, createProject);
router.route('/:id').get(getProjectById).put(adminOnly, updateProject).delete(adminOnly, deleteProject);

module.exports = router;
