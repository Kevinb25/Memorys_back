const QRCode = require('qrcode');

const generateQrBase64 = async (url) => {
    try {
        const qrImage = await QRCode.toDataURL(url);
        return qrImage;
    } catch (error) {
        console.error('Error generando QR:', error);
        throw error;
    }
};

module.exports = generateQrBase64;