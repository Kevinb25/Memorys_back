const albumUserModel = require('../models/albumUser.model');

const addUserToAlbum = async (req, res, next) => {
    const { albumId, userId, role } = req.body;

    if (!albumId || !userId || !role) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
        await albumUserModel.addUserToAlbum(albumId, userId, role);
        res.status(201).json({ message: 'Usuario invitado al álbum con estado pending' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};


const acceptInvitation = async (req, res, next) => {
    const { albumId, userId } = req.body;

    if (!albumId || !userId) {
        return res.status(400).json({ error: 'Faltan albumId o userId en el body' });
    }

    try {
        const result = await albumUserModel.acceptInvitation(albumId, userId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Invitación no encontrada' });
        }

        res.json({ message: 'Invitación aceptada correctamente' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getUsersByAlbumId = async (req, res, next) => {
    const { albumId } = req.params;

    try {
        const users = await albumUserModel.getUsersByAlbumId(albumId);
        res.json(users);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const updateUserRole = async (req, res, next) => {
    const { albumId, userId, role } = req.body;

    if (!albumId || !userId || !role) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
        const result = await albumUserModel.updateUserRole(albumId, userId, role);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado en ese álbum' });
        }

        res.json({ message: 'Rol actualizado correctamente' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const removeUserFromAlbum = async (req, res, next) => {
    const { albumId, userId } = req.body;

    if (!albumId || !userId) {
        return res.status(400).json({ error: 'Faltan albumId o userId en el body' });
    }

    try {
        const result = await albumUserModel.removeUserFromAlbum(albumId, userId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Relación no encontrada' });
        }

        res.json({ message: 'Usuario eliminado del álbum' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports = { addUserToAlbum, acceptInvitation, getUsersByAlbumId, updateUserRole, removeUserFromAlbum }