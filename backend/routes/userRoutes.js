const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', authorize('admin'), userController.deleteUser);
router.post('/:id/make-admin', authorize('admin'), userController.makeAdmin);

module.exports = router;
