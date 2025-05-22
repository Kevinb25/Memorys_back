const albumModel = require('../models/album.model');
const albumUserModel = require('../models/albumUser.model');
const photoModel = require('../models/photo.model');

// Crear un nuevo álbum
const createNewAlbum = async (req, res, next) => {
    const { userId, name, category, theme } = req.body;

    if (!userId || !name) {
        return res.status(400).json({
            error: 'Faltan campos requeridos: userId o name'
        });
    }

    try {
        const result = await albumModel.createNewAlbum({
            userId,
            name,
            category: category || '',
            theme: theme || ''
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

// Obtener un álbum por su ID
const getAlbumById = async (req, res, next) => {
    try {
        const albumId = req.params.id;
        const result = await albumModel.getAlbumById(albumId);

        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'Álbum no encontrado' });
        }

        const album = result[0];
        const participants = await albumUserModel.getUsersByAlbumId(album.id);

        res.json({ album, users: participants });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Obtener álbum por token público (modo viewer)
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

// Obtener álbum por token de subida (modo uploader)
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

// Actualizar un álbum
const updateAlbum = async (req, res, next) => {
    const { name, category, theme } = req.body;
    const { id } = req.params;

    if (!name && !category && !theme) {
        return res.status(400).json({ error: 'Debes enviar al menos un campo a actualizar' });
    }

    try {
        await albumModel.updateAlbum(id, { name, category, theme });
        const updatedAlbum = await albumModel.getAlbumById(id);
        res.json({ message: 'Álbum actualizado correctamente', album: updatedAlbum });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Buscar álbum por nombre
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

// Eliminar un álbum y sus fotos
const deleteAlbum = async (req, res, next) => {
    const { id } = req.params;
    try {
        const photos = await photoModel.getPhotosByAlbumId(id);
        for (const photo of photos) {
            await photoModel.deletePhoto(photo.id);
        }

        await albumModel.deleteAlbum(id);
        res.json({ message: 'Álbum eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar álbum y fotos:', error);
        next(error);
    }
};

// Obtener todos los álbumes de un usuario
const getAlbumsByUserId = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const albums = await albumModel.getAlbumsByUserId(userId);
        res.json(albums);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Generar token de subida
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

module.exports = {
    createNewAlbum,
    getAlbumById,
    getAlbumByToken,
    getAlbumByUploadToken,
    updateAlbum,
    searchAlbumByName,
    deleteAlbum,
    getAlbumsByUserId,
    generateUploadToken
};