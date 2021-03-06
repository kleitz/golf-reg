var AppDispatcher = require('../dispatchers/AppDispatcher');
var appConstants = require('../constants/appConstants');

var playerActions = {
    updateCurrentPlayer: function (player) {
        AppDispatcher.handleAction({
            actionType: appConstants.UPDATE_CURRENT_PLAYER,
            data: player
        });
    },
    newPlayer: function(name) {
        AppDispatcher.handleAction({
            actionType: appConstants.NEW_PLAYER,
            data: name
        })
    }
};

module.exports = playerActions;