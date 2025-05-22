const pool = require("../config/db");
const db = require('../config/db');

const addUserToAlbum = async (albumId, userId, role) => {
    const [result] = await pool.query(
        `INSERT INTO albums_users (album_id, user_id, role, status)
     VALUES (?, ?, ?, 'pending')`,
        [albumId, userId, role]
    );
    return result;
};

const acceptInvitation = async (albumId, userId) => {
    const [result] = await pool.query(
        `UPDATE albums_users
     SET status = 'accepted'
     WHERE album_id = ? AND user_id = ?`,
        [albumId, userId]
    );
    return result;
};

const getUsersByAlbumId = async (albumId) => {
    const [result] = await pool.query(
        `SELECT u.id, u.username, u.avatar_url, au.role, au.status
     FROM albums_users au
     JOIN users u ON au.user_id = u.id
     WHERE au.album_id = ?`,
        [albumId]
    );
    return result;
};

const updateUserRole = async (albumId, userId, role) => {
    const [result] = await pool.query(
        `UPDATE albums_users SET role = ? WHERE album_id = ? AND user_id = ?`,
        [role, albumId, userId]
    );
    return result;
};

const removeUserFromAlbum = async (albumId, userId) => {
    const [result] = await pool.query(
        `DELETE FROM albums_users WHERE album_id = ? AND user_id = ?`,
        [albumId, userId]
    );
    return result;
};
const getPendingInvitations = async (userId) => {
    const [rows] = await db.query(
        `SELECT 
  au.album_id AS albumId,
  au.role,
  a.name AS albumName,
  u.username AS inviterUsername
FROM albums_users au
JOIN albums a ON au.album_id = a.id
JOIN users u ON a.user_id = u.id
WHERE au.user_id = ? AND au.status = 'pending';`,
        [userId]
    );
    return rows;
};
const getUserAlbumRelation = async (albumId, userId) => {
    const [rows] = await db.query(
        'SELECT * FROM albums_users WHERE album_id = ? AND user_id = ?',
        [albumId, userId]
    );
    return rows[0]; // null si no existe
};

async function getByEmailOrUsername(value) {
    const [rows] = await db.query(
        `SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1`,
        [value, value]
    );
    return rows[0];
}
async function findRelation(albumId, userId) {
    const [rows] = await db.query(
        'SELECT * FROM albums_users WHERE album_id = ? AND user_id = ? LIMIT 1',
        [albumId, userId]
    );
    return rows.length > 0 ? rows[0] : null;
}

module.exports = { addUserToAlbum, acceptInvitation, getUsersByAlbumId, updateUserRole, removeUserFromAlbum, getPendingInvitations, getUserAlbumRelation, getByEmailOrUsername, findRelation }