const router = require('express').Router();

router.use('/albums', require('./api/album.routes'))
router.use('/album_users', require('./api/albumUser.routes'))
router.use('/auth', require('./api/auth.routes'))
router.use('/messages', require('./api/message.routes'))
router.use('/photos', require('./api/photo.routes'))
router.use('/users', require('./api/user.routes'))

module.exports = router;