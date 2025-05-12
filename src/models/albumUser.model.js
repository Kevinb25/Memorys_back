const pool = require("../config/db");

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

module.exports = { addUserToAlbum, acceptInvitation, getUsersByAlbumId, updateUserRole, removeUserFromAlbum }