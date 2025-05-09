const router = require('express').Router();
const { getAllUsers, getUserById, getUserByName, updateAvatar, updateUsername } = require('../../controllers/user.controller');




router.put('/:id/avatar', updateAvatar)
router.get('/', getAllUsers)
router.get('/username/:username', getUserByName);
router.get('/:id', getUserById)
router.put('/:id/username', updateUsername)

module.exports = router;