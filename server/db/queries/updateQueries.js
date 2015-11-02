
var updateQueries = {
	
	updateUsername: function (personTable, oldUsername, newUsername) {
		return "UPDATE " + personTable + " " +
					 "SET username = '" + newUsername + "' " + 
					 "WHERE username = '" + oldUsername + "';";
	},

	updateSharedStatusTo: function (bool, uri, user_id) {
		return "UPDATE uri_users " +
					 "SET is_shared = " + bool + " " +
					 "WHERE uri_id = (SELECT id FROM uri WHERE uri_link = '" + uri + "') " +
					 "AND user_id = " + user_id + ";";
	},

	updateGeneralPost: function (uri, user_id, generalPost) {
		return "UPDATE uri_users " +
					 "SET general_post = '" + generalPost + "' " +
					 "WHERE uri_id = (SELECT id FROM uri WHERE uri_link = '" + uri + "') " +
					 "AND user_id = " + user_id + ";";
	},

	updateAnnotationText: function (annotation_id, text) {
		return "UPDATE annotations " +
					 "SET text = '" + text + "' " +
					 "WHERE id = " + annotation_id + ";";
	}

}

module.exports = updateQueries;