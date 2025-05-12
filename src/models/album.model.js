const pool = require("../config/db");
const crypto = require('crypto');


const createNewAlbum = async ({ userId, name, theme, category }) => {
    const publicToken = crypto.randomUUID();

    const [result] = await pool.query(
        `INSERT INTO albums (user_id, name, category, theme, public_token)
     VALUES (?, ?, ?, ?, ?)`,
        [userId, name, category, theme, publicToken]
    );

    return {
        albumId: result.insertId,
        publicToken
    };
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
        'SELECT * FROM albums WHERE user_id = ?',
        [userId]
    );
    return result;
};
module.exports = { createNewAlbum, getAlbumById, getAlbumByToken, updateAlbum, searchAlbumByName, deleteAlbum, getAlbumsByUserId }