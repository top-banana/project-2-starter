const mongoose = require('mongoose');
const User = require('../models/userschema')

const imageSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  username: [{type: String, ref: 'User'}],
  title: {type: String},
  description: {type: String},
  date: {type: Date, default: Date.now},
  imageproperties: { type: String}
})

const image = mongoose.model('Image', imageSchema)
module.exports = image
