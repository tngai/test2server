
var users = "CREATE TABLE IF NOT EXISTS users ( " +
							"id BIGSERIAL PRIMARY KEY, " +
							"facebook_id TEXT, " +
							"full_name TEXT, " +
							"username TEXT, " +
							"pic_url TEXT, " +
							"uploaded_pic TEXT, " +
							"email TEXT, " +
						 	"description TEXT " +
						");";

var followers = "CREATE TABLE IF NOT EXISTS followers ( " +
									"id BIGSERIAL PRIMARY KEY, " +
									"facebook_id TEXT, " +
									"full_name TEXT, " +
									"username TEXT, " +
									"pic_url TEXT, " +
									"uploaded_pic TEXT, " +
									"email TEXT, " +
									"description TEXT " +
								");";

var users_followers = "CREATE TABLE IF NOT EXISTS users_followers ( " +
												"id BIGSERIAL PRIMARY KEY, " +
												"user_id BIGINT REFERENCES users(id) ON DELETE CASCADE, " +
												"follower_id BIGINT REFERENCES users(id) ON DELETE CASCADE " +
											");";

var uri = "CREATE TABLE IF NOT EXISTS uri ( " +
						"id BIGSERIAL PRIMARY KEY, " +
						"uri_link TEXT, " +
						"title TEXT " +
					");";

var uri_users = "CREATE TABLE IF NOT EXISTS uri_users ( " +
									"id BIGSERIAL PRIMARY KEY, " +
									"uri_id BIGINT REFERENCES uri(id) ON DELETE CASCADE, " +
									"user_id BIGINT REFERENCES users(id) ON DELETE CASCADE, " +
									"is_shared BOOL DEFAULT false, " +
									"updated_at TIMESTAMPTZ DEFAULT NOW(), " +
									"general_post TEXT, " +
									"is_archived BOOL DEFAULT false, " +
									"archived_at TIMESTAMPTZ " +
								");";

var uri_users_followers = "CREATE TABLE IF NOT EXISTS uri_users_followers ( " +
														"id BIGSERIAL PRIMARY KEY, " +
														"uri_id BIGINT REFERENCES uri(id) ON DELETE CASCADE, " +
														"user_follower_id BIGINT REFERENCES users_followers(id) ON DELETE CASCADE, " +
														"is_liked BOOL DEFAULT false " +
													");";

var annotations = "CREATE TABLE IF NOT EXISTS annotations ( " +
										"id BIGSERIAL PRIMARY KEY, " +
										"uri_user_id BIGINT REFERENCES uri_users(id) ON DELETE CASCADE, " +
										"text TEXT, " +
										"quote TEXT, " +
										"start1 TEXT, " +
										"end1 TEXT, " +
										"startoffset TEXT,  " +
										"endoffset TEXT, " +
										"created_at TIMESTAMPTZ DEFAULT NOW(), " +
										"updated_at TIMESTAMPTZ DEFAULT NOW() " +
									");";

var comments = "CREATE TABLE IF NOT EXISTS comments ( " +
								"id BIGSERIAL PRIMARY KEY, " +
								"uri_user_follower_id BIGINT REFERENCES uri_users_followers(id) ON DELETE CASCADE, " +
								"annotation_id BIGINT REFERENCES annotations(id) ON DELETE CASCADE, " +
								"message TEXT, " +
								"created_at TIMESTAMPTZ DEFAULT NOW() " +
			 				");"; 

var tables = [users, followers, users_followers, uri, uri_users, uri_users_followers, annotations, comments];
module.exports = tables;
