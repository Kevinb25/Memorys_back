const router = require('express').Router();
const { addPhoto, getPhotosByAlbumId, getPhotoById, updatePhoto, deletePhoto, getPhotosByCategory, searchPhotosByTitle } = require('../../controllers/photo.controller');
const upload = require('../../middlewares/photoUpload.middleware');


router.post('/', upload.single('file'), addPhoto);
router.get('/album/:albumId', getPhotosByAlbumId);
router.get('/:id', getPhotoById);
router.put('/:id', updatePhoto);
router.delete('/:id', deletePhoto);
router.get('/album/:albumId/category/:category', getPhotosByCategory);
router.get('/album/:albumId/search', searchPhotosByTitle);

module.exports = router;