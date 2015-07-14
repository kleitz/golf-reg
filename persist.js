
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var csp = require('js-csp');
var players = require('./models/player-model');

var ObjectId = mongoose.Schema.Types.ObjectId;


module.exports = {
    newPlayer: function (model, input) { // channel gets player structure with data to save
        var ch = csp.chan();
        var myModel = new model(input);
        myModel.save(function (err, docs) {
            if (err)
                csp.putAsync(channel, err);
            else
                csp.putAsync(channel, docs);
        });
        return ch;
    },
    updatePlayer: function (model, input) { // channel gets player structure with _id and any fields to update
        console.log(input);
        console.log("object id is " + input._id);
        var ch = csp.chan();
        model.findById(input._id, function(err, doc) {
            console.log(doc);
            if (err)
                csp.putAsync(err);
            else
                for (var p in input)
                    doc[p] = input[p];
            return doc.save(function (err, val) {
                if (err)
                    csp.putAsync(ch, err);
                else
                    csp.putAsync(ch, val);
            })
        });
        return ch;
    },
    removePlayer: function(model, id) { // channel gets player _id
        var ch = csp.chan();
        model.findByIdAndRemove(id, function (err, docs) {
            if (err) {
                csp.putAsync(ch, err);
            } else {
                csp.putAsync(ch, docs);
            }
        });
        return ch;
    },
    getPlayerById: function(model, id) { // channel gets _id of player
        var ch = csp.chan();
        model.findById(player, function(err,docs) {
            if(err)
                csp.putAsync(channel, err);
            else
                csp.putAsync(channel, docs);
        });
        return ch;
    },
    getPlayerByEmail: function(model, email) { // channel gets email of player
        var ch = csp.chan();
        model.find({email: email}, function(err, docs) {
          if(err)
            csp.putAsync(ch, err);
          else
            csp.putAsync(ch, docs);
        });
        return ch;
    },
    getAllPlayers: function(model) { // get all players
        var ch = csp.chan();
        model.find({}, function(err, docs) {
            if(err)
                csp.putAsync(ch, err);
            else
                csp.putAsync(ch, docs)
        });
        return ch;
    },
    getPlayerByToken: function(model,token) {
        var ch = csp.chan();
        model.find({resetToken: token}, function(err, docs) {
            if(err)
                csp.putAsync(ch, err);
            else
                csp.putAsync(ch, docs)
        });
        return ch;
    },
    savePlayer: function(player) {
        console.log(player);
        var ch = csp.chan();
        player.save(function(err, result) {
            if(err)
                csp.putAsync(ch, err);
            else
                csp.putAsync(ch, result);
        });
        return ch;
    }
};

