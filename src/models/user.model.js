const pool = require("../config/db");

const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    return result[0];
};

const getUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (result.length === 0) return null;
    return result[0];
}

const getUserByName = async (username) => {
    const result = await pool.query('SELECT *from users WHERE username = ?', [username]);
    if (result.length === 0) return null;
    return result[0];
}

const updateAvatar = async (id, avatarUrl) => {
    const [result] = await pool.query(
        'UPDATE users SET avatar_url = ? WHERE id = ?',
        [avatarUrl, id]
    );
    return result;
};

const updateUsername = async (id, username) => {
    const [result] = await pool.query(
        'UPDATE users SET username = ? WHERE id = ?',
        [username, id]
    );
    return result;
};

module.exports = { getAllUsers, getUserById, getUserByName, updateAvatar, updateUsername }