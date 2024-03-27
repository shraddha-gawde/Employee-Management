const jwt = require('jsonwebtoken');
const { blacklistModel } = require("../models/blacklist.model")
require("dotenv").config()

const authentication = async (req, res, next) => {
    const access_token = req.headers.authorization?.split(" ")[1];

    if (!access_token) {
        return res.status(401).json({ msg: 'No token provided' });
    }

    // Check if token is blacklisted
    const isBlacklisted = await blacklistModel.findOne({ access_token });
    if (isBlacklisted) {
        return res.status(401).json({ msg: 'Token is blacklisted !!! Please login again' });
    }
    try {
        const secret_key = process.env.secretkey
        const decoded = jwt.verify(access_token, secret_key);

        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = {
    authentication
}
