const pool = require("../config/db");
const crypto = require('crypto');


const createNewAlbum = async ({ userId, name, theme, category }) => {
    const publicToken = crypto.randomUUID();
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        // Crear álbum
        const [albumResult] = await conn.query(
            `INSERT INTO albums (user_id, name, category, theme, public_token)
       VALUES (?, ?, ?, ?, ?)`,
            [userId, name, category, theme, publicToken]
        );

        const albumId = albumResult.insertId;

        // Relacionarlo con el usuario como owner
        await conn.query(
            `INSERT INTO albums_users (album_id, user_id, role, status)
       VALUES (?, ?, 'owner', 'accepted')`,
            [albumId, userId]
        );

        await conn.commit();

        return {
            albumId,
            publicToken
        };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

const getAlbumById = async (id) => {
    const result = await pool.query('SELECT * FROM albums WHERE id = ?', [id]);
    if (result.length === 0) return null;
    return result[0];
}

const getAlbumByToken = async (token) => {
    const [result] = await pool.query(
        'SELECT * FROM albums WHERE public_token = ?',
        [token]
    );
    return result;
};

const updateAlbum = async (id, { name, category, theme }) => {
    const [result] = await pool.query(
        `UPDATE albums
     SET name = ?, category = ?, theme = ?
     WHERE id = ?`,
        [name, category, theme, id]
    );
    return result;
};

const searchAlbumByName = async (name) => {
    const [result] = await pool.query(
        'SELECT * FROM albums WHERE name LIKE ?',
        [`%${name}%`]
    );
    return result;
};

const deleteAlbum = async (id) => {
    const [result] = await pool.query(
        'DELETE FROM albums WHERE id = ?',
        [id]
    );
    return result;
};

const getAlbumsByUserId = async (userId) => {
    const [result] = await pool.query(
        `SELECT 
       a.*, 
       au.album_id AS albumId,
       au.role, 
       au.status
     FROM albums a
     JOIN albums_users au ON a.id = au.album_id
     WHERE au.user_id = ? AND au.status = 'accepted'`,
        [userId]
    );
    return result;
};
const generateUploadToken = async (albumId) => {
    const uploadToken = crypto.randomUUID();

    await pool.query(
        'UPDATE albums SET upload_token = ? WHERE id = ?',
        [uploadToken, albumId]
    );

    return uploadToken;
};

const getAlbumByUploadToken = async (uploadToken) => {
    const [result] = await pool.query(
        'SELECT * FROM albums WHERE upload_token = ?',
        [uploadToken]
    );

    if (result.length === 0) return null;
    return result[0];
};
module.exports = { createNewAlbum, getAlbumById, getAlbumByToken, updateAlbum, searchAlbumByName, deleteAlbum, getAlbumsByUserId, generateUploadToken, getAlbumByUploadToken }