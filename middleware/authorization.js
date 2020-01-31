const jwt = require('jsonwebtoken');
const {
    JWT_SECRET
} = require('../config/secrets')

const auth = async function (req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        return res.redirect('/signin');
    }
    if (token) {
        const decoded = await jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        await next();
    } else {
        res.status(400).send("Invalid token");
    }
}
module.exports = auth;