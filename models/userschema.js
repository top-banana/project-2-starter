const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, 'name must be between 3 and 50 characters'],
    maxlength: [50, 'name must be between 3 and 50 characters']
  },

  email: {
    type: String,
    required: true,
    unique: true,
    match: emailRegex
  },

  password: {
    type: String,
    required: true,
    minlength: [8, 'name must be between 8 and 40 characters']
  },

  images: [{type: mongoose.Schema.Types.ObjectId, ref: 'Image'}],

  eventsorganized: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
  
  eventsattending: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}]
})


// hooks
userSchema.pre('save', function (next) {
  // binding user to the current user
  var user = this
  user.name = user.name.toLowerCase()
  next()
})

// using bcrypt to hash the pw
userSchema.pre('save', function (next) {
  const user = this
  if (!user.isModified('password')) return next()
  const hash = bcrypt.hashSync(user.password, 10)
  user.password = hash;
  next()
})

userSchema.methods.validPassword = function(password) {
  // Compare is a bcrypt method that will return a boolean,
  return bcrypt.compareSync(password, this.password);
};

userSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        // delete the password from the JSON data, and return
        delete ret.password;
        return ret;
    }
}


const user = mongoose.model('User', userSchema);
module.exports = user
