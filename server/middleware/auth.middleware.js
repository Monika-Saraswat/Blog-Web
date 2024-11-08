const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/jwt.utils');

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        console.log('Token not found');
        return res.status(403).json({ message: "Unauthorized access. Please log in." }); // Respond with message
    }

    try {
        const user = verifyToken(token); // Verify the token
        req.user = user; // Attach user data to request
        next();
    } catch (error) {
        console.log(error)
        return res.status(403); // Forbidden if token verification fails
    }
};

module.exports = { authenticateJWT };
