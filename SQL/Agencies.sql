CREATE TABLE Agencies (
    Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Name varchar(25) NOT NULL,
    Address varchar(25) DEFAULT '',
    City varchar(25) DEFAULT '',
    State varchar(25) DEFAULT '',
    PostalCode varchar(25) DEFAULT '',
    Country varchar(25) DEFAULT '',
    ContactName varchar(50) DEFAULT '',
    Phone varchar(25) DEFAULT '',
    Website varchar(25) DEFAULT '',
    Status int(1) NOT NULL DEFAULT 0,
    Created INT(8) NOT NULL
)

