const router = require('express').Router();
const { addUserToAlbum, acceptInvitation, getUsersByAlbumId, removeUserFromAlbum, updateUserRole, getPendingInvitations, rejectInvitation, } = require('../../controllers/albumUser.controller');
const verifyToken = require('../../middlewares/verifyToken');

router.post('/', verifyToken, addUserToAlbum);
router.delete('/', verifyToken, removeUserFromAlbum);
router.put('/accept', verifyToken, acceptInvitation);
router.get('/album/:albumId', verifyToken, getUsersByAlbumId);
router.put('/role', verifyToken, updateUserRole);
router.get('/user/:userId/pending', verifyToken, getPendingInvitations);
router.post('/reject', verifyToken, rejectInvitation);
router.post('/leave', verifyToken, removeUserFromAlbum);

module.exports = router;