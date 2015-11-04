
var deleteQueries = {

	deletePerson: function (personTable, user_id) {
		return "DELETE FROM " + personTable + " " +
					 "WHERE id = " + user_id + ";";
	},

	deleteUserFollowerRelationship: function (user_id, follower_id) {
		return "DELETE FROM users_followers " +
					 "WHERE user_id = " + user_id + " " +
					 "AND follower_id = " + follower_id + " RETURNING id;";
	},

	deleteURIUser: function (uri_user_id) {
		return "DELETE FROM uri_users WHERE id = " + uri_user_id + " RETURNING id;";
	},

	deleteAnnotation: function (annotation_id) {
		return "DELETE FROM annotations " +
					 "WHERE id = " + annotation_id + "RETURNING uri_user_id;"; 
	},

	deleteComment: function (commentID) {
		return "DELETE FROM comments " + 
					 "WHERE id = " + commentID + ";";
	},

	deleteLike: function (uri, user_id, follower_id) {
		var rString;
		rString = "DELETE FROM uri_users_followers uuf " +
			   "USING uri, users_followers uu " +
			   "WHERE uu.id = uuf.user_follower_id " +
			   "AND uri.id = uuf.uri_id " +
			   "AND uri.uri_link = '" + uri + "' " +
			   "AND uu.user_id = " + user_id + " " +
			   "AND uu.follower_id =" + follower_id + " RETURNING *;";
		return rString;

	}

}

module.exports = deleteQueries;