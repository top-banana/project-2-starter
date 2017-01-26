// dependencies
require('dotenv').config({ silent: true });
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer')
const upload = multer({dest: './uploads/'})
const cloudinary = require('cloudinary');
const fs = require('fs');
const flash = require('connect-flash');
const ejsLayouts = require("express-ejs-layouts");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const express = require('express');
const app = express();
const path = require('path');
const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn');
// controllers
const usercontroller = require('./controllers/usercontroller');
const publiccontroller = require('./controllers/publiccontroller');
const image = require('./models/imageschema');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/eh');
mongoose.Promise = global.Promise

app.set('view engine', 'ejs');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(ejsLayouts);
app.use(require('morgan')('dev'));
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', function (req, res) {
  image.find({}, function (err, image) {
    if (err) {
      console.log(err);
      return
    }
    console.log(image);
    res.render("home", {image:image})
  })
})

app.use(function(req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.use('/public', publiccontroller)
app.use('/auth', usercontroller)
app.use(isLoggedIn)

// app.post('/',upload.single('myFile'), (req, res) => {
//   cloudinary.uploader.upload(req.file.path, function (result){
//     console.log(result.url);
//     res.render('dummy2', {result: result})
//   })
// })


app.listen(process.env.PORT || 3000)
console.log("earth without art is just eh");

module.exports = app;
