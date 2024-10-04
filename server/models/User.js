const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Defines the schema for the User model with Mongoose.
 * Includes pre-save middleware for password hashing and a method for password comparison.
 */
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}); 

/**
 * Pre-save middleware for the User schema.
 * Automatically hashes the password before saving it to the database if it has been modified.
 * @param {Function} next - Callback to continue to the next middleware or save operation.
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // If the password hasn't been modified, skip hashing
  }
  console.log("Hashing password...");
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * Method to compare a user's password with the user's stored password.
 * @param {string} candidatePassword - The password to test against the stored hash.
 * @returns {Promise<boolean>} A promise that resolves with whether the passwords match.
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
