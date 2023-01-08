const { Schema, model } = require('mongoose');

// Key model
const KeySchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = model('Key', KeySchema);