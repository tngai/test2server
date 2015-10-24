var db = require('../config');

require('./users');
require('./users_followers');

var Annotation = db.Model.extend({
  // Trip properties
  tableName: 'annotations',
  
  user: function() {
    return this.belongsTo('User');
  }
}, {
  // Trip methods:
  fetchById: function(id) {
    return new this({
      id: id
    }).fetch()
  },
  // newTrip
  newAnnotation: function(options) {
    return new this(options);
  },
  fetchByUri: function(uri) {
    return new this({
      uri:uri
    }).fetchAll()
  },
  destroyById: function(id) {
    return new this({id:id}).destroy()
  },
  updateById: function(options) {
    return new this(options).save();
  }
});

module.exports = db.model('Annotation', Annotation);