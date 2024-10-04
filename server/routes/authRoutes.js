require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

/**
 * Function to normalize usernames by trimming whitespace and converting to lowercase.
 * @param {string} username - The username to normalize.
 * @returns {string} The normalized username.
 */
const normalizeUsername = username => username.trim().toLowerCase();

// Endpoint to register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const normalizedUsername = normalizeUsername(username);

    // Check if the username already exists
    const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser) {
      return res.status(409).json({message : "Username already in use"});
    }

    // Create a new user instance with normalized username and provided password
    const user = new User({ username: normalizedUsername, password });
    await user.save();

    console.log("Original password:" , password);
    console.log("Hashed password:" , user.password);

    res.status(201).json({ message: "User registered successfully"});
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({message : "Failed to register user"});
  }
});

// Endpoint for user login
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const normalizedUsername = normalizeUsername(username);
      const user = await User.findOne({ username: normalizedUsername });

      // If user does not exist, return error message
      if (!user) {
        console.log("User not found in database:", normalizedUsername);  // Log if user is not found
        return res.status(401).json({ message: "User not found" });
      }
      
      // Compare the provided password with the stored hashed password
      const isMatch = await user.comparePassword(password);
      console.log("Stored hash passowrd:", user.password);
      console.log("Password for comparison:" , password);

      // If passwords do not match, return error message
      if (!isMatch) {
        console.log("Password does not match for user:", normalizedUsername);  // Log when passwords do not match
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // If login successful, generate a JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ token, username: user.username });  // Send username and token to the client
    } catch (error) {
      console.error("Login error for user:", normalizedUsername, error);
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
