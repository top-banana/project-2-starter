// const User = require('../models/userschema');
// const comments = require('../models/commentsschema');
const event = require('../models/eventschema');
const passport = require('../config/ppConfig');
const express = require('express');
const router = express.Router({mergeParams: true});
// public profile page

// router.get('/', function (req, res) {
//   image.find({}, function (err, image) {
//     if (err) {
//       console.log(err);
//       return
//     }
//     res.render("home", {image:image})
//   })
// })



router.get('/events', function (req, res) {
  console.log(event);
  event.find({}, function (err, event) {
    if (err) {
      console.log(err);
      return
    }
    res.render('publiceventslisting', {event: event})
  })
})

router.get('/events/event/:id', function (req,res) {
  event.findById(req.params.id, function (err, event) {
    if (err) {
      console.log(err);
      return
    }
    res.render('publiceventlisting', {event: event})
  })
})

// if interested in event - check if user is signed in. if signed in, allow to join, else tell them to sign up first before joining the event
// once individual, his name will be listed on the page as one of the attendees.. once max group number has been reached, status of the group changes to confirmed and button is disabled

router.get('/events/event/:id/interestedinevent', function (req, res) {
  event.findById(req.params.id, function (err, event) {
    res.render("publiceventlisting", {event: event})
  })
})

router.get('/events/event/:id/yourevent', function (req, res) {
  console.log("individual event page");
  event.find({user: req.user.id})
  .exec(function (err, user) {
    res.redirect('/auth/profile/events')
  })
})


// when user signs up for event, update the eventsattending array, flag him as attending the event,
// update the user as going for an event,
router.put('/events/event/:id/interestedinevent', function (req, res) {
  event.findOne({_id: req.params.id}, function (err, event) {
    if (err) {
      console.log(err);
      return
    } else {
      event.usersattending.push(req.user._id)
      req.user.eventsattending.push(req.params.id)
      console.log("inside function");
      event.save()
      req.user.save()
      res.redirect('/public/events/event/'+req.params.id)
    }
  })
})

module.exports = router
