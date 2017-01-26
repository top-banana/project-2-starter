const User = require('../models/userschema');
const image = require('../models/imageschema');
const event = require('../models/eventschema');
const passport = require('../config/ppConfig');
const express = require('express');
const router = express.Router({mergeParams: true});
const multer = require('multer');
const cloudinary = require('cloudinary');
const upload = multer({dest: './uploads/'})

router.get('/signup', function (req, res) {
  res.render('signupform')
})

router.get('/login', function (req, res) {
  res.render('loginform')
})

router.get('/profile', function (req, res) {
  image.find({user: req.user.id})
  .exec(function (err, image) {
    if (err) {
      console.log(err);
      return
    }
    res.render('dummy', {image: image})
  })
})

router.get('/profile/img/:id', function (req, res) {
  image.findById(req.params.id, function (err, image) {
    if (err) {
      console.log(err);
      return
    }
    res.render('imagepage', {image:image})
  })
})

router.get('/profile/img/:id/edit', function (req, res) {
  image.findById(req.params.id, function (err, image) {
    if (err) {
      console.log(err);
      return
    }
    res.render('editimage', {image:image})
  })
})

// router.get('/profile/events', function (req, res) {
//   event.find({user: req.user.id})
//   .exec(function (err, event) {
//     if (err) {
//       console.log(err);
//       return
//     }
//     res.render('usereventsdashboard', {event: event})
//   })
// })

router.get('/profile/events', function (req, res) {
  User.findById(req.user.id)
  .populate('eventsorganized')
  .populate('eventsattending')
  .exec(function (err, user) {
    res.render('usereventsdashboard', {user: user})
  })
})

router.get('/profile/events/create-event', function (req, res) {
  res.render('createnewevent')
})

router.get('/profile/events/:id', function (req, res) {
  event.findById(req.params.id, function (err, event) {
    res.render("userindividualeventpage", {event: event})
  })
})

router.get('/profile/events/:id/edit', function (req, res) {
  event.findById(req.params.id, function (err, event) {
    res.render("editeventform", {event: event})
  })
})

router.get('/logout', function(req, res) {
  req.logout()
  console.log('logged out')
  res.redirect('/')
})

router.post('/signup', function (req, res) {
  User.create(req.body, function (err, createduser) {
    if (err) {
      console.log(err);
      res.redirect('/auth/signup')
      return
    } else{
        res.redirect('/auth/login')
    }
  })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/auth/profile/',
  failureRedirect: '/auth/login'
}));


router.post('/profile', upload.single('myFile'), (req, res) => {
  cloudinary.uploader.upload(req.file.path, function (result) {
    User.findById(req.user.id, (err, user) => {
      image.create({
        user: req.user.id,
        username: req.user.name,
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        imageproperties: result.url
      }, (err, image) => {
        user.images.push(image._id)
        user.save(function (err) {
          if (err) {
            console.log(err);
            return
          }
          else {
            res.redirect('/auth/profile')
          }
        })
      })
    })
  })
})

router.put('/profile/img/:id/edit', function (req, res) {
  console.log(image);
  image.findOneAndUpdate({_id: req.params.id}, req.body, function (err, image) {
    console.log(image);
    if (err) {
      console.log(err);
      return
    }
    res.redirect("/auth/profile/img/"+req.params.id)
  })
})

router.delete('/profile/img/:id', function (req, res) {
  image.findOneAndRemove({_id: req.params.id}, function (err, image) {
    if (err) {
      console.log('ERROR IMAGE REMOVE');
      console.log(err);
      return
    } else {
      console.log('IMAGE REMOVE NOT ERRONEOUS.');
      console.log('the image is', image);
      User.findById(req.user.id, function (err, user) {
        if (err) return res.json(err)
        for (var i = 0; i < user.images.length; i++) {
          if (user.images[i].equals(req.params.id)) {
            user.images.splice(i, 1)
          }
        }
        user.save()
        res.redirect('/auth/profile')
      })
      // User.findByIdAndUpdate(
      //   {_id: req.user._id},
      //   // {'$pull': {'images': req.params.id}},
      //   {'$pull': {User.images: req.params.id}},
      //   {'new': true },
      //   function (err, imgData) {
      //     if (err) return res.json(err)
      //     res.redirect('/auth/profile')
      //   })
      }
    })
  })

// if error, return error,
// if succcessful, create a new event and update the user's db

router.post('/profile/events', function (req, res) {
  event.create({
    user: req.user.id,
    name: req.body.name,
    date: req.body.date,
    location: req.body.location,
    groupsize: req.body.groupsize,
    type: req.body.type,
    description: req.body.description,
    status: req.body.status
  }, function (err, event) {
    if (err) {
      console.log(err);
      return
    }
    console.log("user update");
    User.findById(req.user.id, function (err, user) {
      user.eventsorganized.push(event._id)
      user.save(function (err, result) {
        if (err) {
          console.log(err);
          return
        }
        res.redirect('/auth/profile/events')
      })
    })
  })
})


router.put('/profile/events/:id/edit', function (req, res) {
  event.findOneAndUpdate({_id: req.params.id}, req.body, function (err, event) {
    if (err) {
      console.log(err);
      return
    } else {
      res.redirect('/auth/profile/events/'+req.params.id)
    }
  })
})


router.delete('/profile/events/:id', function (req, res) {
  event.findOneAndRemove({_id: req.params.id}, function (err, event) {
    console.log("delete");
    if (err) {
      console.log(err);
      returns
    } else {
      User.findByIdAndUpdate(
        req.user.id,
        {'$pull': { posts: post._id }},
        function (err, event2) {
          // (err) ? req.flashreq.flash('error', 'Delete unsuccesful') : req.flash('success', 'Post deleted')
          if (err) {
            console.log(err);
            return
          }
          res.redirect('/auth/profile/events')
        })
      }
    })
  })

module.exports = router
