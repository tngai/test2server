var AppDispatcher = require('../dispatchers/app-dispatchers');
var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var AppStore = assign(EventEmitter.prototype, {
  emitChange: function() {
    this.emit('change')
  },
  addChangeListener: function(callback) {
    this.on('change', callback)
  },
  removeChangeListener: function(callback) {
    this.removeListener('change', callback)
  },


  getUserInfo: function() {
    console.log('get user info from here!');
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.actionType){
      case 'thing to do':
        console.log('do something');
        break;
      case 'thing 2':
        console.log('do something diff');
        break;
    }
    AppStore.emitChange();

    return true;
  })
})

module.exports = AppStore;
