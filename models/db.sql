CREATE TABLE users(id serial PRIMARY KEY, username text UNIQUE NOT NULL, full_name text, profile_picture text, oauth_token text, insta_id int);
CREATE TABLE hashtags (id serial PRIMARY KEY, tag text UNIQUE NOT NULL);
CREATE TABLE user_hashtags (id serial PRIMARY KEY, user_id int, hashtag_id int, last_liked int DEFAULT 0, like_amount int DEFAULT 0);
ALTER TABLE user_hashtags ADD CONSTRAINT foreign_user FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE user_hashtags ADD CONSTRAINT foreign_hashtag FOREIGN KEY (hashtag_id) REFERENCES hashtags (id);
