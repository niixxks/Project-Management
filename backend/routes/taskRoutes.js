const express = require('express');
const { protect } = require('../middleware/auth');
const taskController = require('../controllers/taskController');

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/', taskController.createTask);
router.get('/project/:projectId', taskController.getProjectTasks);
router.get('/my/tasks', taskController.getMyTasks);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.get('/dashboard/stats', taskController.getDashboardStats);

module.exports = router;
