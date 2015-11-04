
var selectQueries = {

	selectPerson: function (personTable, full_name) {
		return "SELECT id FROM " + personTable + " " +
					 "WHERE full_name = '" + full_name + "';";
	},

	selectIsSharedProperty: function (uri, user_id) {
		return "SELECT uu.is_shared FROM uri, uri_users uu " +
					 "WHERE uri.id = uu.uri_id AND uri.uri_link = '" + uri + "' " +
					 "AND uu.user_id = " + user_id + ";";
	},

	selectFullNameAndPicURLBasedOnID: function (user_id) {
		return "SELECT id, full_name, pic_url FROM users " +
						"WHERE id = " + user_id + ";";
	},

	selectFullNamePicURLAndID: function(full_name) {
		return "SELECT id, full_name, pic_url FROM users " +
						"WHERE full_name = '" + full_name + "';";
	},

	selectGeneralPost: function (uri, user_id) {
		return "SELECT uu.general_post FROM uri, uri_users uu " +
					 "WHERE uri.id = uu.uri_id AND uri.uri_link = '" + uri + "' " +
					 "AND uu.user_id = " + user_id + ";";
	},

	selectURIID: function (uri) {
		return "SELECT id FROM uri " +
					 "WHERE uri_link = '" + uri + "';";
	},

	selectURIUserID: function (uri_id, user_id) {
		return "SELECT id FROM uri_users " +
					 "WHERE uri_id = " + uri_id + " AND user_id = " + user_id + ";";
	},

	selectAnnotationID: function (uri, user_id, text, quote) {
		return "SELECT a.id " +
					 "FROM uri, uri_users uu, annotations a " +
					 "WHERE uu.user_id = " + user_id + " " +
					 "AND uri.id = uu.uri_id " +
					 "AND uu.id = a.uri_user_id " +
					 "AND uri.uri_link = '" + uri + "' " +
					 "AND a.text = '" + text + "' " +
					 "AND a.quote = '" + quote + "';";
	},

	selectURIs: function (user_id) {
		return "SELECT * " +
					 "FROM uri, uri_users uu " +
					 "WHERE uu.user_id = " + user_id + " " +
					 "AND uri.id = uu.uri_id ORDER BY uu.updated_at DESC;";
	},

	whoLikedThisPost: function (uri, user_id) {
		return "SELECT uf.follower_id " +
					 "FROM uri, users_followers uf, uri_users_followers uuf " +
					 "WHERE uf.user_id = " + user_id + " " +
					 "AND uf.id = uuf.user_follower_id " +
					 "AND uri.id = uuf.uri_id " +
					 "AND uri.uri_link = '" + uri + "' " +
					 "AND uuf.is_liked = true;";
	},

	selectAnnotations: function (uri, user_id) {
		return "SELECT a.id, a.text, a.quote, a.start1, a.end1, a.startoffset, a.endoffset " +
					 "FROM uri, uri_users uu, annotations a " +
					 "WHERE uu.user_id = " + user_id + " " +
					 "AND uri.id = uu.uri_id " +
					 "AND uu.id = a.uri_user_id " +
					 "AND uri.uri_link = '" + uri + "';";
	},

	selectCommentsOnGeneralPost: function (uri, user_id) {
		return "SELECT c.message, uf.follower_id " +
					 "FROM users_followers uf, uri, uri_users_followers uuf, comments c " +
					 "WHERE uf.user_id = " + user_id + " " +
					 "AND uf.id = uuf.user_follower_id " +
					 "AND uri.id = uuf.uri_id " +
					 "AND uuf.id = c.uri_user_follower_id " +
					 "AND uri.uri_link = '" + uri + "' " +
					 "AND c.annotation_id IS NULL;";
	},

	selectCommentsOnAnnotation: function (uri, user_id, annotation_id) {
		return "SELECT c.message, uf.follower_id " +
					 "FROM users_followers uf, uri, uri_users_followers uuf, comments c " +
					 "WHERE uf.user_id = " + user_id + " " +
					 "AND uf.id = uuf.user_follower_id " +
					 "AND uri.id = uuf.uri_id " +
					 "AND uuf.id = c.uri_user_follower_id " +
					 "AND uri.uri_link = '" + uri + "' " +
					 "AND c.annotation_id = " + annotation_id + ";";
	},

	selectPeopleYouFollow: function (follower_id) {
		return "SELECT user_id " +
					 "FROM users_followers " +
					 "WHERE follower_id = " + follower_id + ";";
	},

	selectPeopleFollowingYou: function (user_id) {
		return "SELECT follower_id " +
					 "FROM users_followers " +
					 "WHERE user_id = " + user_id + ";";
	},

	selectArchivedURIs: function (user_id) {
		return "SELECT uri.uri_link, uri.title " +
					 "FROM uri, uri_users uu " +
					 "WHERE uu.user_id = " + user_id + " " +
					 "AND uri.id = uu.uri_id " +
					 "AND uu.is_archived = true;";

		// I assume also that this also will be based on time you saved
	},

	selectPersonIfPersonAnnotatedThisPage: function (uri, user_id) {
		return "SELECT uu.user_id " +
					 "FROM uri, uri_users uu " +
					 "WHERE uu.user_id = " + user_id + " " +
 					 "AND uri.id = uu.uri_id " +
					 "AND uri.uri_link = '" + uri + "';";
	}


// And after I check for sure that this works, I'm going to create all the insert functions
}

module.exports = selectQueries; 