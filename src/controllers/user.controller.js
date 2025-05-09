const pool = require('../config/db')
const user = require('../models/user.model')

const getAllUsers = async (req, res) => {
    const result = await user.getAllUsers();
    res.json(result)
};
module.exports = { getAllUsers, }