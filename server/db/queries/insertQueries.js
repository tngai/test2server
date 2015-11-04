
var insertQueries = {

	insertPerson: function (personTable, full_name, username, pic_url, uploaded_pic, facebook_id, email, description) {
		return "INSERT INTO " + personTable + " (full_name, username, pic_url, uploaded_pic, facebook_id, email, description) " +
					 "VALUES ('" + full_name + "', '" + username + "', '" + pic_url + "', '" + uploaded_pic + "', " +
					 				 "'" + facebook_id + "', '" + email + "', '" + description + "') " + 
					 "RETURNING id;";
	},

	insertUserFollowerRelationship: function (user_id, follower_id) {
		return "INSERT INTO users_followers (user_id, follower_id) " +
					 "VALUES (" + user_id + ", " + follower_id + ");";
	},

	insertURI: function (uri, title) {
		return "INSERT INTO uri (uri_link, title) " +
					 "VALUES ('" + uri + "', '" + title + "') " +
					 "RETURNING id;";
	},

	insertURIUser: function (uri_id, user_id) {
		return "INSERT INTO uri_users (uri_id, user_id) " +
					 "VALUES (" + uri_id + ", " + user_id + ") RETURNING id";
	},

	insertURIUserFollower: function (uri, user_id, follower_id) {
		return "INSERT INTO uri_users_followers (uri_id, user_follower_id) " +
					 "VALUES (" +
					 		"(SELECT id FROM uri WHERE uri_link = '" + uri + "')," +
							"(SELECT id FROM users_followers " +
							  "WHERE user_id = " + user_id + " AND uf.follower_id = " + follower_id + ")" +
					 ");";
	},

	insertAnnotation: function (uri_user_id, text, quote, start, end, startOffset, endOffset) {
		return "INSERT INTO annotations (uri_user_id, text, quote, start1, end1, startoffset, endoffset) " +
					 "VALUES (" + uri_user_id + ", '" + text + "', '" + quote + "', '" + start + "', " +
							"'" + end + "', '" + startOffset + "', '" + endOffset + "'" +
					 ") RETURNING id";
	},

	insertGeneralPostComment: function (uri, user_id, follower_id, message) {
		return "INSERT INTO comments (uri_user_follower_id, message) " +
					 "VALUES (" +
					 		"(SELECT uuf.id FROM users_followers uf, uri, uri_users_followers uuf " +
					 			"WHERE uf.user_id = " + user_id + " AND uf.follower_id = " + follower_id + " " +
					 			"AND uf.id = uuf.user_follower_id AND uri.id = uuf.uri_id AND uri.uri_link = '" + uri + "'), " +
							"'" + message + "'" +
					 ");";
	},

	insertAnnotationComment: function (uri, user_id, follower_id, message, annotation_id) {
		return "INSERT INTO comments (uri_user_follower_id, message, annotation_id) " +
					 "VALUES (" +
					 		"(SELECT uuf.id FROM users_followers uf, uri, uri_users_followers uuf " +
					 			"WHERE uf.user_id = " + user_id + " AND uf.follower_id = " + follower_id + " " +
					 			"AND uf.id = uuf.user_follower_id AND uri.id = uuf.uri_id AND uri.uri_link = '" + uri + "'), " +
							"'" + message + "', " + annotation_id +
					 ");";
	},

	insertLikes: function(uri, user_id, follower_id) {
		var rString;
		rString = "INSERT INTO uri_users_followers (uri_id, user_follower_id, is_liked) " +
				"VALUES ("+
					"(SELECT id FROM uri WHERE uri_link = '" + uri + "'), " +
					"(SELECT id FROM users_followers WHERE user_id = " + user_id + " AND follower_id = " + follower_id + "), true" +
				") RETURNING *;"
		return rString;
	}

}

module.exports = insertQueries;