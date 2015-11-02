var AppDispatcher = require('../dispatchers/app-dispatchers');

var AppActions = {
  exampleAction: function(info) {
    AppDispatcher.handleViewAction({
      actionType: 'thing to do',
      info: info
    }) 
  }
}

module.exports = AppActions;