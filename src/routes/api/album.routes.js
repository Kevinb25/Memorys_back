const router = require('express').Router();
const { createNewAlbum, getAlbumById, getAlbumByToken, updateAlbum, searchAlbumByName, deleteAlbum, getAlbumsByUserId, generateUploadToken, getAlbumByUploadToken } = require('../../controllers/album.controller');
const verifyToken = require('../../middlewares/verifyToken');

router.post('/', verifyToken, createNewAlbum);
router.get('/viewer/:token', getAlbumByToken);
router.get('/:id', getAlbumById);
router.put('/:id', verifyToken, updateAlbum);
router.get('/search/name', searchAlbumByName);
router.delete('/:id', verifyToken, deleteAlbum);
router.get('/user/:userId', verifyToken, getAlbumsByUserId);
router.get('/upload-token/:albumId', generateUploadToken);
router.get('/upload-access/:token', getAlbumByUploadToken);




module.exports = router;