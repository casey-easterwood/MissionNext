CREATE TABLE Candidates (
    Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    UserId int(6) NOT NULL DEFAULT 0,
    Name varchar(50) NOT NULL,
    Address varchar(25) DEFAULT '',
    City varchar(25) DEFAULT '',
    State varchar(25) DEFAULT '',
    PostalCode varchar(25) DEFAULT '',
    Country varchar(25) DEFAULT '',
    Phone varchar(25) DEFAULT '',
    Email varchar(100) DEFAULT '',
    Status int(1) NOT NULL DEFAULT 0,
    DateOfBirth INT(8) NOT NULL,
    Created INT(8) NOT NULL
)

