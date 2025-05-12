const photoReactionModel = require('../models/photoReaction.model');

const addReaction = async (req, res, next) => {
    const { photoId, userId, emoji, comment } = req.body;

    if (!photoId || !userId || !emoji) {
        return res.status(400).json({ error: 'photoId, userId y emoji son requeridos' });
    }

    try {
        await photoReactionModel.addReaction({ photoId, userId, emoji, comment });
        res.status(201).json({ message: 'Reacción registrada correctamente' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getReactionsByPhotoId = async (req, res, next) => {
    try {
        const { photoId } = req.params;
        const reactions = await photoReactionModel.getReactionsByPhotoId(photoId);
        res.json(reactions);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const deleteReaction = async (req, res, next) => {
    const { photoId, userId } = req.body;

    if (!photoId || !userId) {
        return res.status(400).json({ error: 'photoId y userId son requeridos' });
    }

    try {
        await photoReactionModel.deleteReaction({ photoId, userId });
        res.json({ message: 'Reacción eliminada' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports = {
    addReaction,
    getReactionsByPhotoId,
    deleteReaction
};