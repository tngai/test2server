
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
					 "AND user_id = " + user_id + " RETURNING id;";
	},

	updateTimestampOnURIUser: function (uri_user_id) {
		return "UPDATE uri_users " +
					 "SET updated_at = NOW() " +
					 "WHERE id = " + uri_user_id + " RETURNING id;";
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
	},

	updateUserRow: function(table,newInfo){
		var info = [];
		var rString;
		if(newInfo.picUrl) {
			info.push(" pic_url='"+newInfo.picUrl+"'");
		}
		if(newInfo.description) {
			info.push(" description='"+newInfo.description+"'");
		}
		info = info.join(',');

		rString = "UPDATE "+table+" SET "+info+ " WHERE id= '"+newInfo.user_id+"';"
		return rString;		
	}
}

module.exports = updateQueries;