CREATE TABLE users (
	id INT(11) NOT NULL AUTO_INCREMENT,
	username VARCHAR(128) NOT NULL,
	password VARCHAR(128) NOT NULL,
	image varchar(128) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE posts (
	id INT(11) NOT NULL AUTO_INCREMENT,
	text VARCHAR(128) NOT NULL,
	created_at DATETIME NOT NULL,
	userid INT(11) NOT NULL,
	postid INT(11),
	PRIMARY KEY (id),
    FOREIGN KEY (userid) REFERENCES users(id),
    FOREIGN KEY (postid) REFERENCES posts(id)
);

CREATE TRIGGER tg_posts_insert
BEFORE INSERT ON posts
FOR EACH ROW
	SET NEW.created_at = NOW();

CREATE TRIGGER tg_posts_update
BEFORE UPDATE ON posts
FOR EACH ROW
	SET NEW.created_at = NOW();

/*CREATE TABLE comments (
	id INT(11) NOT NULL AUTO_INCREMENT,
	text VARCHAR(128) NOT NULL,
	created_at DATETIME NOT NULL,
	userid INT(11) NOT NULL,
	postid INT(11) NOT NULL,
	PRIMARY KEY (id),
    FOREIGN KEY (userid) REFERENCES users(id),
    FOREIGN KEY (postid) REFERENCES posts(id)
);

CREATE TRIGGER tg_comments_insert
BEFORE INSERT ON comments
FOR EACH ROW
	SET NEW.created_at = NOW();

CREATE TRIGGER tg_comments_update
BEFORE UPDATE ON comments
FOR EACH ROW
	SET NEW.created_at = NOW();*/

CREATE TABLE news (
	id int(11) NOT NULL AUTO_INCREMENT,
	title varchar(128) NOT NULL,
	slug varchar(128) NOT NULL,
	text text NOT NULL,
	PRIMARY KEY (id),
	KEY slug (slug)
);