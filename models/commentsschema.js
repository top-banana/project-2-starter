const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/userschema')
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


const commentsSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: {type: String},
  email: {
    type: String,
    required: true,
    match: emailRegex
  },
  comments: {type: String},
  date: {type: Date, default: Date.now}
})

const comments = mongoose.model('Comments', commentsSchema)
module.exports = comments
