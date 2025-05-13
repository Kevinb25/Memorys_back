const router = require('express').Router();
const { addUserToAlbum, acceptInvitation, getUsersByAlbumId, removeUserFromAlbum, updateUserRole } = require('../../controllers/albumUser.controller');
const verifyToken = require('../../middlewares/verifyToken');

router.post('/', verifyToken, addUserToAlbum);
router.delete('/', verifyToken, removeUserFromAlbum);
router.put('/accept', verifyToken, acceptInvitation);
router.get('/album/:albumId', verifyToken, getUsersByAlbumId);
router.put('/role', verifyToken, updateUserRole);


module.exports = router;