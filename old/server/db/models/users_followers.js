var db = require('../config');

require('./users.js');
require('./annotations.js');

var User_followers = db.Model.extend({

	tableName: users_followers, 	
	annotations: function(){
		return this.hasMany('annotations');
	}

},{
	//model methods
	fetchById: function(options) {
    	return new this(options).fetch( {withRelated:['annotations']} );
  	},
  	newUserFollower: function(options) {
    return new this(options);
  }	

});