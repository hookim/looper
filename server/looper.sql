-- CREATE DATABASE looperProject;
-- CREATE USER looper_admin@localhost IDENTIFIED BY '';
-- ALTER USER looper_admin@localhost IDENTIFIED BY '';

-- GRANT SELECT,INSERT,UPDATE,DELETE ON looperProject.* TO looper_admin@localhost; 

USE looperProject;

CREATE TABLE Users(
	user_id VARCHAR(20) PRIMARY KEY,
    user_nickname VARCHAR(20) NOT NULL,
    register_date DATETIME NOT NULL,
    password VARCHAR(20) NOT NULL
);

CREATE TABLE Loopers(
	looper_id VARCHAR(20),
    user_id VARCHAR(20),
    url VARCHAR(100),
    created_time DATETIME NOT NULL,
    PRIMARY KEY (looper_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Memos(
	id VARCHAR(20),
	timestamp INT, 
	looper_id VARCHAR(20),
    memo VARCHAR(200),
    PRIMARY KEY (id),
    FOREIGN KEY (looper_id) REFERENCES Loopers(looper_id)
);

-- TEST CODE
INSERT INTO Users (user_id, register_date, user_nickname, password)
VALUES ('abc123', '2023-05-17 11:12:00', 'nick', '1234');

INSERT INTO Loopers (looper_id, user_id, created_time, url)
VALUES ('loopertest123', 'abc123', '2023-05-17 12:17:00', 'https://www.youtube.com/watch?v=fbPmLhM9EZQ');

INSERT INTO Memos (id, timestamp, looper_id, memo)
VALUES ('timestamp123', '3000', 'loopertest123', 'This is my test memo for the looper');



