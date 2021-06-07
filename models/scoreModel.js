const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'The username must be provided!']
  },
  scores: [{
    type: Number
  }, ]
});

const Score = mongoose.model('scores', scoreSchema);

module.exports = Score;
