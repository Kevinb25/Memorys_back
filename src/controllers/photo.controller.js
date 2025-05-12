const photoModel = require('../models/photo.model');

const addPhoto = async (req, res, next) => {
    try {
        const {
            albumId,
            title,
            note,
            category,
            takenDate,
            location
        } = req.body;

        if (!req.file || !req.file.path) {
            return res.status(400).json({ error: 'No se ha subido ninguna imagen o video' });
        }

        const photoUrl = req.file.path;
        const publicId = req.file.filename;

        const result = await photoModel.addPhoto({
            albumId: Number(albumId),
            title,
            note,
            category,
            photoUrl,
            takenDate,
            location,
            publicId
        });

        res.status(201).json({
            message: 'Foto agregada correctamente',
            photoId: result.insertId,
            photoUrl
        });
    } catch (error) {
        console.error("Error al insertar en la base de datos:", error);
        next(error);
    }
};

const getPhotosByAlbumId = async (req, res, next) => {
    const { albumId } = req.params;
    try {
        const photos = await photoModel.getPhotosByAlbumId(albumId);
        res.json(photos);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getPhotoById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const photo = await photoModel.getPhotoById(id);
        if (!photo) {
            return res.status(404).json({ error: 'Foto no encontrada' });
        }

        res.json(photo);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const updatePhoto = async (req, res, next) => {
    const { id } = req.params;
    const { title, note, category, takenDate, location } = req.body;

    try {
        await photoModel.updatePhoto(id, { title, note, category, takenDate, location });
        const updated = await photoModel.getPhotoById(id);
        res.json({
            message: 'Foto actualizada correctamente',
            photo: updated
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const deletePhoto = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await photoModel.deletePhoto(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Foto no encontrada o ya eliminada' });
        }
        res.json({ message: 'Foto eliminada correctamente' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
const getPhotosByCategory = async (req, res, next) => {
    const { albumId, category } = req.params;
    try {
        const result = await photoModel.getPhotosByCategory(albumId, category);
        res.json(result);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const searchPhotosByTitle = async (req, res, next) => {
    const { albumId } = req.params;
    const { title } = req.query;
    try {
        const result = await photoModel.searchPhotosByTitle(albumId, title);
        res.json(result);
    } catch (error) {
        console.error(error);
        next(error);
    }
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