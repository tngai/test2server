
var checkQueries = {

	checkPerson: function (full_name) {
		return "SELECT id FROM users WHERE full_name = '" + full_name + "';";
	},

	checkFacebookInfo: function (personTable, user_id, facebook_id, full_name, pic_url, email) {
		return "SELECT EXISTS (" + 
						 "SELECT 1 FROM " + personTable + " " +
						 "WHERE id = " + user_id + " " +
						 "AND full_name = '" + full_name + "' " + 
						 "AND facebook_id = '" + facebook_id + "' " +
						 "AND pic_url = '" + pic_url + "' " +
						 "AND email = '" + email + "'" +
					 ");";
	},

	checkURI: function (uri) {
		return "SELECT EXISTS (" + 
						 "SELECT 1 FROM uri " +
						 "WHERE uri_link = '" + uri + "'" + 
					 ");";
	},

	checkUserFollower: function (user_id, follower_id) {
		return "SELECT EXISTS (" + 
						 "SELECT 1 " + 
						 "FROM users_followers " + 
						 "WHERE user_id = " + user_id + " " +
						 "AND follower_id = " + follower_id +
					 ");";
	},	

	checkURIUser: function (uri_id, user_id) {
		return "SELECT EXISTS (" + 
						 "SELECT 1 " + 
						 "FROM uri_users " +
						 "WHERE uri_id = " + uri_id + " " +
						 "AND user_id = " + user_id + 
					 ");";
	},

	checkURIUserFollower: function (uri, user_id, follower_id) {
		return "SELECT EXISTS (" + 
						 "SELECT 1 " + 
						 "FROM users_followers uf, uri, uri_users_followers uuf " +
						 "WHERE uf.user_id = " + user_id + " " +
						 "AND uf.follower_id = " + follower_id + " " +
						 "AND uf.id = uuf.user_follower_id " +
						 "AND uri.id = uuf.uri_id " +
						 "AND uri.uri_link = '" + uri + "' " +
					 ");";
	},

	checkIfAnyAnnotationsForThisURIUser: function (uri_user_id) {
		return "SELECT EXISTS (" +
							"SELECT 1 FROM annotations " +
							"WHERE uri_user_id = " + uri_user_id + 
					 ");"
	}
	
}

module.exports = checkQueries;