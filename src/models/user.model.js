const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  method: {
    type: String,
    enum: ['local', 'github'],
    required: true,
  },
  githubId: {
    type: String,
    unique: function() {
      return this.method === 'github';
    },
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: function() {
      return this.method === 'local' || this.method === 'github';
    },
    unique: function() {
      return this.method === 'local';
    },
  },
  lastname: {
    type: String,
  },
  password: {
    type: String,
    required: function() {
      return this.method === 'local';
    },
  },
  phone: {
    type: String,
  },
  displayName: {
    type: String,
  },
  profileUrl: {
    type: String,
  },
  avatarUrl: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
