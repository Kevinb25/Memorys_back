const pool = require('../config/db');
const cloudinary = require('../utils/cloudinary');

const addPhoto = async ({ albumId, title, note, category, photoUrl, takenDate, location, publicId }) => {
    const [result] = await pool.query(
        `INSERT INTO photos (album_id, title, note, category, photo_url, taken_date, location, public_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [albumId, title, note, category, photoUrl, takenDate, location, publicId]
    );
    return result;
};

const getPhotosByAlbumId = async (albumId) => {
    const [result] = await pool.query(
        `SELECT id, title, note, category, photo_url, taken_date, location, created_at
     FROM photos
     WHERE album_id = ?
     ORDER BY created_at DESC`,
        [albumId]
    );
    return result;
};

const getPhotoById = async (id) => {
    const [result] = await pool.query(
        `SELECT id, album_id, title, note, category, photo_url, taken_date, location, created_at
     FROM photos
     WHERE id = ?`,
        [id]
    );
    return result[0] || null;
};

const updatePhoto = async (id, { title, note, category, takenDate, location }) => {
    const [result] = await pool.query(
        `UPDATE photos
     SET title = ?, note = ?, category = ?, taken_date = ?, location = ?
     WHERE id = ?`,
        [title, note, category, takenDate, location, id]
    );
    return result;
};
const deletePhoto = async (id) => {
    try {
        const [[photo]] = await pool.query(`SELECT public_id, photo_url FROM photos WHERE id = ?`, [id]);

        if (!photo || !photo.public_id) {
            return { affectedRows: 0 };
        }

        // Detectar tipo de recurso por extensión
        const isVideo = photo.photo_url.endsWith('.mp4');
        const resourceType = isVideo ? 'video' : 'image';

        // Eliminar de Cloudinary
        await cloudinary.uploader.destroy(photo.public_id, { resource_type: resourceType });

        // Eliminar de la base de datos
        const [result] = await pool.query(`DELETE FROM photos WHERE id = ?`, [id]);
        return result;

    } catch (error) {
        console.error('Error al eliminar la foto:', error);
        throw new Error('Error al eliminar la foto');
    }
};

const getPhotosByCategory = async (albumId, category) => {
    const [result] = await pool.query(
        `SELECT id, title, note, category, photo_url, taken_date, location, created_at
     FROM photos
     WHERE album_id = ? AND category = ?
     ORDER BY taken_date ASC`,
        [albumId, category]
    );
    return result;
};

const searchPhotosByTitle = async (albumId, title) => {
    const [result] = await pool.query(
        `SELECT id, title, note, category, photo_url, taken_date, location, created_at
     FROM photos
     WHERE album_id = ? AND title LIKE ?
     ORDER BY taken_date ASC`,
        [albumId, `%${title}%`]
    );
    return result;
};

module.exports = {
    addPhoto,
    getPhotosByAlbumId,
    getPhotoById,
    updatePhoto,
    deletePhoto,
    getPhotosByCategory,
    searchPhotosByTitle
};