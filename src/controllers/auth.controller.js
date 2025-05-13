const authModel = require('../models/auth.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const generateQrBase64 = require('../utils/qrcode');

// Registro
const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const qrToken = crypto.randomUUID();

        const result = await authModel.registerUser({ username, email, passwordHash, qrToken });

        res.status(201).json({
            message: 'Usuario registrado correctamente',
            userId: result.insertId,
            qrToken
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Login clásico
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña requeridos' });
        }

        const user = await authModel.getUserByEmail(email);
        if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatar_url
            }
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Login QR
const loginWithQrToken = async (req, res, next) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await authModel.getUserById(decoded.id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.json({
            message: 'Login con QR exitoso',
            user
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Acceso público a álbum
const getAlbumByToken = async (req, res, next) => {
    try {
        const { token } = req.params;
        const album = await authModel.getAlbumByToken(token);
        if (!album) return res.status(404).json({ error: 'Álbum no encontrado' });

        res.json(album);
    } catch (error) {
        console.error(error);
        next(error);
    }
};
const getQrImageFromToken = async (req, res, next) => {
    const { token } = req.params;

    try {
        const qrUrl = `https://miapp.com/login/qr/${token}`; // cambia a tu dominio real
        const qrImage = await generateQrBase64(qrUrl);

        res.json({ qrImage }); // Imagen base64 lista para un <img src="...">
    } catch (error) {
        next(error);
    }
};

const getQrImageFromAlbumToken = async (req, res, next) => {
    const { token } = req.params;

    try {
        const qrImage = await authModel.getQrImageFromAlbumToken(token);

        res.json({ qrImage }); // Imagen QR base64 lista para frontend
    } catch (error) {
        console.error(error);
        next(error);
    }
};
module.exports = {
    registerUser,
    loginUser,
    loginWithQrToken,
    getAlbumByToken,
    getQrImageFromToken,
    getQrImageFromAlbumToken
};