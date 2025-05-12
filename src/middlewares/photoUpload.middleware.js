const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'memorys/photos',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4'],
        resource_type: 'auto'
    }
});

const upload = multer({ storage });

module.exports = upload;