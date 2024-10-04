const jwt = require('jsonwebtoken');
const User = require('./models/User'); 

/**
 * Middleware to validate user authentication via JWT.
 * Ensures the user is logged in and has a valid token before proceeding.
 *
 * @param {Object} req - Request object from the client.
 * @param {Object} res - Response object to the client.
 * @param {Function} next - Callback to pass control to the next middleware function.
 */
const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    res.status(401).send("Unauthorized");
  }
};

module.exports = requireAuth;
