const jwt = require("jsonwebtoken");
const User = require("../Model/User");
require("dotenv").config();

const JWT_KEY = process.env.JWT_SECRET;

/**
 * Verifies user authentication from request and returns the user object
 * @param {Object} req - Express request object
 * @param {Object} options - Optional query options
 * @param {string} options.select - Fields to select (e.g., '-password')
 * @param {string|Array} options.populate - Fields to populate (e.g., 'events')
 * @returns {Promise<Object>} User document or null
 * @throws {Error} If token is missing or invalid
 */
async function verifyUserAuth(req, options = {}) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized, No token provided');
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_KEY);

    const conditions = [];

    if (decoded.userEmail) conditions.push({ userEmail: decoded.userEmail });
    if (decoded.userName) conditions.push({ userName: decoded.userName });
    if (decoded.walletAddress) conditions.push({ walletAddress: decoded.walletAddress });


    if (conditions.length === 0) {
        throw new Error('Invalid token payload: no user identification found');
    }
    
    let query = User.findOne({ $or: conditions });
    
    if (options.select) {
        query = query.select(options.select);
    }
    
    if (options.populate) {
        query = query.populate(options.populate);
    }
    
    const user = await query;
    return user;
}

module.exports = { verifyUserAuth };