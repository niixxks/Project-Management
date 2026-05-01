const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const projectController = require('../controllers/projectController');

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/', projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.post('/:id/members', projectController.addMember);
router.delete('/:id/members', projectController.removeMember);

module.exports = router;
