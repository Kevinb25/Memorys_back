const pool = require('../config/db');

const addReaction = async ({ photoId, userId, emoji, comment }) => {
    const [result] = await pool.query(
        `INSERT INTO photo_reactions (photo_id, user_id, emoji, comment)
         VALUES (?, ?, ?, ?)`,
        [photoId, userId, emoji, comment]
    );
    return result;
};

const getReactionsByPhotoId = async (photoId) => {
    const [result] = await pool.query(
        `SELECT 
       pr.id,
       pr.photo_id,
       pr.user_id,
       pr.emoji,
       pr.comment,
       pr.created_at,
       u.username,
       u.avatar_url
     FROM photo_reactions pr
     JOIN users u ON pr.user_id = u.id
     WHERE pr.photo_id = ?
     ORDER BY pr.created_at DESC`,
        [photoId]
    );
    return result;
};

const deleteReaction = async ({ photoId, userId }) => {
    const [result] = await pool.query(
        `DELETE FROM photo_reactions
         WHERE photo_id = ? AND user_id = ?`,
        [photoId, userId]
    );
    return result;
};


module.exports = {
    addReaction,
    getReactionsByPhotoId,
    deleteReaction
};