
var deleteQueries = {

	deletePerson: function (personTable, user_id) {
		return "DELETE FROM " + personTable + " " +
					 "WHERE id = " + user_id + ";";
	},

	deleteUserFollowerRelationship: function (user_id, follower_id) {
		return "DELETE FROM users_followers " +
					 "WHERE user_id = " + user_id + " " +
					 "AND follower_id = " + follower_id + ";";
	},

	deleteAnnotation: function (annotation_id) {
		return "DELETE FROM annotations " +
					 "WHERE id = " + annotation_id + ";"; 
	},

	deleteComment: function (commentID) {
		return "DELETE FROM comments " + 
					 "WHERE id = " + commentID + ";";
	}

}

module.exports = deleteQueries;