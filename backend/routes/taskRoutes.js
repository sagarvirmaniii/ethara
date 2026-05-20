const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const { createTask, getTasksByProject, updateTask, deleteTask } = require('../controllers/taskController');

const router = express.Router();

router.use(protect);

router.get('/project/:projectId', getTasksByProject);
router.post('/', adminOnly, createTask);
router.route('/:id').put(updateTask).delete(adminOnly, deleteTask);

module.exports = router;
