const router = require('express').Router();
const {
    addReaction,
    getReactionsByPhotoId,
    deleteReaction
} = require('../../controllers/photoReaction.controller');

router.post('/', addReaction);
router.get('/photo/:photoId', getReactionsByPhotoId);
router.delete('/', deleteReaction);

module.exports = router;