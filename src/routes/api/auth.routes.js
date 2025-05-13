const router = require('express').Router();
const {
    registerUser,
    loginUser,
    loginWithQrToken,
    getAlbumByToken,
    getQrImageFromToken,
    getQrImageFromAlbumToken
} = require('../../controllers/auth.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/login/qr/:token', loginWithQrToken);
router.get('/album/:token', getAlbumByToken);
router.get('/qr-image/:token', getQrImageFromToken);
router.get('/album/qr/:token', getQrImageFromAlbumToken);
module.exports = router;