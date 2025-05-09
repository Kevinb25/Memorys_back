const pool = require('../config/db')
const user = require('../models/user.model')

const getAllUsers = async (req, res) => {
    const result = await user.getAllUsers();
    res.json(result);
};

const getUserById = async (req, res) => {
    const result = await user.getUserById(req.params.id);
    res.json(result);
};

const getUserByName = async (req, res) => {
    const result = await user.getUserByName(req.params.username);
    res.json(result);
}

const updateAvatar = async (req, res, next) => {
    const { id } = req.params;
    const { avatarUrl } = req.body;
    if (!avatarUrl) {
        return res.status(400).json({ error: 'No tiene avatar el body' });
    }

    try {
        await user.updateAvatar(id, avatarUrl);
        const updatedAvatar = await user.getUserById(id);
        res.json({ message: "Avatar Actualizado", updatedAvatar })
    } catch (error) {
        next(error);
    }

}
const updateUsername = async (req, res, next) => {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Falta username en el body' });
    }

    try {
        await user.updateUsername(id, username);
        const updated = await user.getUserById(id);
        res.json({ message: 'Nombre de usuario actualizado', updated });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllUsers, getUserById, getUserByName, updateAvatar, updateUsername };