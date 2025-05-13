const router = require('express').Router();
const { getAllUsers, getUserById, getUserByName, updateAvatar, updateUsername } = require('../../controllers/user.controller');
const verifyToken = require('../../middlewares/verifyToken');




router.put('/:id/avatar', verifyToken, updateAvatar)
router.get('/', getAllUsers)
router.get('/username/:username', getUserByName);
router.get('/:id', getUserById)
router.put('/:id/username', verifyToken, updateUsername)

module.exports = router;