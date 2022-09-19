const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
  },

  password: {
    type: String,
    required: [true, 'Username must have a password'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
