const router = require('express').Router();
const { addUserToAlbum, acceptInvitation, getUsersByAlbumId, removeUserFromAlbum, updateUserRole } = require('../../controllers/albumUser.controller');


router.post('/', addUserToAlbum);
router.delete('/', removeUserFromAlbum);
router.put('/accept', acceptInvitation);
router.get('/album/:albumId', getUsersByAlbumId);
router.put('/role', updateUserRole);


module.exports = router;