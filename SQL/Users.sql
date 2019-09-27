CREATE TABLE users_main (
    UserId INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    UserLogin varchar(25) NOT NULL,
    FirstName varchar(25) DEFAULT '',
    LastName varchar(25) DEFAULT '',
    Email varchar(100) DEFAULT '',
    Role varchar(25) DEFAULT '',
    UserPassword varchar(128) DEFAULT ''
)
