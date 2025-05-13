const router = require('express').Router();
const {
    addReaction,
    getReactionsByPhotoId,
    deleteReaction
} = require('../../controllers/photoReaction.controller');
const verifyToken = require('../../middlewares/verifyToken');

router.post('/', verifyToken, addReaction);
router.get('/photo/:photoId', getReactionsByPhotoId);
router.delete('/', verifyToken, deleteReaction);

module.exports = router;