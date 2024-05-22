const mongoose = require('mongoose')

const questSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rewards: {
    type: Array,
    required: true
  }
})

module.exports = mongoose.model('Quest', questSchema)
