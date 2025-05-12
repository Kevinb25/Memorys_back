const router = require('express').Router();
const { createNewAlbum, getAlbumById, getAlbumByToken, updateAlbum, searchAlbumByName, deleteAlbum, getAlbumsByUserId } = require('../../controllers/album.controller');



router.post('/', createNewAlbum);
router.get('/viewer/:token', getAlbumByToken);
router.get('/:id', getAlbumById);
router.put('/:id', updateAlbum);
router.get('/search/name', searchAlbumByName);
router.delete('/:id', deleteAlbum);
router.get('/user/:userId', getAlbumsByUserId);
module.exports = router;