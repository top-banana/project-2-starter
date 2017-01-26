const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: {type: String, required: true},
  date: {type: Date, default: Date.now},
  location: {type: String},
  numberofspots: {type: Number},
  type: {type: String, required: true},
  description: {type: String},
  status: {type: String, default: 'Proposed'},
  usersattending: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
})

const event = mongoose.model("Event", eventSchema)
module.exports = event
