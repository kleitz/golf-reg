
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var events = require('../models/event-model');
var persist = require('../persist');
var csp = require('js-csp');

var ObjectId = mongoose.Schema.Types.ObjectId;

var validateEvent = function(req) {
    console.log(req.body);
    req.sanitize('name').trim();
    req.sanitize('location').trim();
    req.check('name', 'A name between 5 and 100 characters must be supplied').notEmpty().isLength(5, 100);
    req.check('location', 'A location between 5 and 100 characters must be supplied').notEmpty().isLength(5,100);
    req.body.flights.forEach(function(el, index) {
        req.check(['flights', index, 'maxPlayers'], "Incorrect value for Maximum Players").notEmpty().isNumeric();
        req.check(['flights', index, 'time'], "Must supply a valid time").notEmpty().isTime();
    });
    req.check('date', "A date later than today must be supplied").notEmpty().isFutureDate();
    return req.validationErrors(true);
};







var indexAction = function(req, res, next) {
    csp.go(function* () {
        var allEvents = yield csp.take(persist.getAll(events.Event));
        if(allEvents instanceof Error)
            next(allEvents);
        else
            res.render('events/index.jade', {events: allEvents, errors: {}});
    })
};

var newAction = function(req, res) {
    res.render('events/new.jade', {event: {name: '',
                                    location: '',
                                    date: '',
                                    flights: [
                                        {time: '',
                                        maxPlayers: ''}
                                    ]},
                                    errors: {},
                                    referrer: req.get('Referrer')})
};

var createAction = function(req, res, next) {
    console.log('entering create action');
    var mappedErrors = validateEvent(req);
    if(mappedErrors) {
        console.log('validation errors');
        console.log(mappedErrors);
        res.render('events/new.jade', {event: req.body, errors: mappedErrors});
    } else {
        var event = new events.Event(req.body);
        console.log('about to save');
        console.log(event);
        csp.go(function*() {
            var result = yield csp.take(persist.saveModel(event));
            if (result instanceof Error)
                next(500, result);
            else
                res.redirect('/events');
        })
    }
};

var showAction = function(req, res, next) {
    csp.go(function*() {
        var myEvent = yield csp.take(persist.getModelById(events.Event, req.params._id));
        if(result instanceof Error)
            next(404, myEvent);
        else
            res.render('events/show.jade', {event: myEvent, errors: {}});
    })
};

// index
router.get('/', indexAction);
// create
router.post('/', createAction);
// new
router.get('/new', newAction);
// show
router.get('/:id', showAction);
// edit
router.get('/:id/edit', function() {});
// update
router.post('/:id', function() {});
// delete
router.post(':/id/delete', function() {});

module.exports = router;


