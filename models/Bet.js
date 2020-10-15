const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    index: true
  },
  matchId: {
    type: String,
    required: true,
    index: true
  },
  team: {
    type: String,
    index: true
  },
  odds: {
    type: Number,
    required: true
  }
});

// index for uid/matchId queries
schema.index({
  uid: 1,
  matchId: 1
});

module.exports = mongoose.model('Bet', schema);