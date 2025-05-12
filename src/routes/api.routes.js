const router = require('express').Router();

router.use('/album', require('./api/album.routes'))
router.use('/albums_users', require('./api/albumUser.routes'))
router.use('/auth', require('./api/auth.routes'))
router.use('/messages', require('./api/message.routes'))
router.use('/photos', require('./api/photo.routes'))
router.use('/users', require('./api/user.routes'))
router.use('/photo_reactions', require('./api/photoReaction.routes'))


module.exports = router;