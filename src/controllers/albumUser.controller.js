const albumUserModel = require('../models/albumUser.model');
const userModel = require('../models/user.model');
const albumModel = require('../models/album.model')

const addUserToAlbum = async (req, res, next) => {
    const { albumId, emailOrUsername, role } = req.body;
    const inviterId = req.user.id;

    if (!albumId || !emailOrUsername || !role) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
        // Verificar que el usuario autenticado es el creador del álbum
        const [album] = await albumModel.getAlbumById(albumId);
        if (!album || album.user_id !== inviterId) {
            return res.status(403).json({ error: 'No tienes permisos para invitar' });
        }

        // Buscar usuario destino por email o username
        const user = await userModel.getByEmailOrUsername(emailOrUsername);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (user.id === inviterId) {
            return res.status(400).json({ error: 'No puedes invitarte a ti mismo' });
        }

        // Verificar si ya está invitado
        const existing = await albumUserModel.findRelation(albumId, user.id);
        if (existing) {
            return res.status(409).json({ error: 'Ya has invitado a este usuario' });
        }

        // Guardar la invitación
        await albumUserModel.addUserToAlbum(albumId, user.id, role);

        res.status(201).json({ message: 'Usuario invitado correctamente' });

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

const getPendingInvitations = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const invites = await albumUserModel.getPendingInvitations(userId);

        res.json(invites); // ya vienen con albumId, albumName, inviterUsername, role
    } catch (err) {
        console.error(err);
        next(err);
    }
};
const rejectInvitation = async (req, res, next) => {
    const { albumId, userId } = req.body;

    if (!albumId || !userId) {
        return res.status(400).json({ error: 'Faltan albumId o userId en el body' });
    }

    try {
        const result = await albumUserModel.removeUserFromAlbum(albumId, userId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Invitación no encontrada' });
        }

        res.json({ message: 'Invitación rechazada correctamente' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
module.exports = { addUserToAlbum, acceptInvitation, getUsersByAlbumId, updateUserRole, removeUserFromAlbum, getPendingInvitations, rejectInvitation }