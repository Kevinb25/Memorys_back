const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const generateQrBase64 = require('../utils/qrcode');

// Crear usuario
const registerUser = async ({ username, email, passwordHash, qrToken }) => {
    const [result] = await pool.query(
        `INSERT INTO users (username, email, password, qr_token)
     VALUES (?, ?, ?, ?)`,
        [username, email, passwordHash, qrToken]
    );

    return result.insertId; // <--- Solo el ID como número
};

// Buscar usuario por email
const getUserByEmail = async (email) => {
    const [result] = await pool.query(
        `SELECT id, username, email, password, avatar_url FROM users WHERE email = ?`,
        [email]
    );
    if (result.length === 0) return null;
    return result[0];
};

// Buscar usuario por ID
const getUserById = async (id) => {
    const [result] = await pool.query(
        `SELECT id, username, email, avatar_url FROM users WHERE id = ?`,
        [id]
    );
    if (result.length === 0) return null;
    return result[0];
};

// Buscar usuario por QR token
const getUserByQrToken = async (qrToken) => {
    const [result] = await pool.query(
        `SELECT id, username, email, avatar_url FROM users WHERE qr_token = ?`,
        [qrToken]
    );
    if (result.length === 0) return null;
    return result[0];
};

// Obtener álbum público por token (modo solo lectura)
const getAlbumByToken = async (token) => {
    const [result] = await pool.query(
        `SELECT id, name, theme, category, user_id, created_at FROM albums WHERE public_token = ?`,
        [token]
    );
    if (result.length === 0) return null;
    return result[0];
};

// Generar imagen base64 para QR de álbum público
const getQrImageFromAlbumToken = async (albumToken) => {
    const qrUrl = `https://miapp.com/viewer/${albumToken}`;
    const qrImage = await generateQrBase64(qrUrl);
    return qrImage;
};

module.exports = {
    registerUser,
    getUserByEmail,
    getUserById,
    getUserByQrToken,
    getAlbumByToken,
    getQrImageFromAlbumToken
};
