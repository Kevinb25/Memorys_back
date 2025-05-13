const albumModel = require('../models/album.model');

const createNewAlbum = async (req, res, next) => {
    const { userId, name, theme, category } = req.body;

    if (!userId || !name || !theme) {
        return res.status(400).json({
            error: 'Faltan campos requeridos: userId, name o theme'
        });
    }

    try {
        const result = await albumModel.createNewAlbum({
            userId,
            name,
            theme,
            category
        });

        res.status(201).json({
            message: 'Álbum creado correctamente',
            albumId: result.albumId,
            publicToken: result.publicToken
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
const getAlbumById = async (req, res, next) => {
    try {
        const result = await albumModel.getAlbumById(req.params.id);

        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'Álbum no encontrado' });
        }

        res.json(result);
    } catch (error) {
        console.error(error);
        next(error);
    }
};



const getAlbumByToken = async (req, res, next) => {
    try {
        const token = req.params.token;
        const result = await albumModel.getAlbumByToken(token);

        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'Álbum no encontrado' });
        }

        res.json(result[0]);
    } catch (error) {
        console.error(error);
        next(error);
    }
};
const updateAlbum = async (req, res, next) => {
    const { name, category, theme } = req.body;
    const { id } = req.params;

    if (!name && !category && !theme) {
        return res.status(400).json({ error: 'Debes enviar al menos un campo a actualizar' });
    }

    try {
        await albumModel.updateAlbum(id, { name, category, theme });
        const updatedAlbum = await albumModel.getAlbumById(id);
        res.json({
            message: 'Álbum actualizado correctamente',
            album: updatedAlbum
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const searchAlbumByName = async (req, res, next) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ error: 'Falta el parámetro ?name=' });
    }

    try {
        const result = await albumModel.searchAlbumByName(name);
        res.json(result);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const deleteAlbum = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await albumModel.deleteAlbum(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Álbum no encontrado' });
        }

        res.json({ message: 'Álbum eliminado correctamente' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getAlbumsByUserId = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const result = await albumModel.getAlbumsByUserId(userId);
        res.json(result);
    } catch (error) {
        console.error(error);
        next(error);
    }
};
const generateUploadToken = async (req, res, next) => {
    const { albumId } = req.params;

    try {
        const token = await albumModel.generateUploadToken(albumId);
        res.json({ uploadToken: token });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getAlbumByUploadToken = async (req, res, next) => {
    const { token } = req.params;

    try {
        const album = await albumModel.getAlbumByUploadToken(token);

        if (!album) {
            return res.status(404).json({ error: 'Álbum no encontrado' });
        }

        res.json(album);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports = { createNewAlbum, getAlbumById, getAlbumByToken, updateAlbum, searchAlbumByName, deleteAlbum, getAlbumsByUserId, generateUploadToken, getAlbumByUploadToken };