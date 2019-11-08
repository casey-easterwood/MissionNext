CREATE TABLE Schools (
    Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Name varchar(100) NOT NULL,
    Address varchar(200) DEFAULT '',
    City varchar(50) DEFAULT '',
    State varchar(25) DEFAULT '',
    PostalCode varchar(25) DEFAULT '',
    Country varchar(25) DEFAULT '',
    ContactName varchar(100) DEFAULT '',
    Phone varchar(25) DEFAULT '',
    Website varchar(100) DEFAULT '',
    Status int(1) NOT NULL DEFAULT 0,
    Created INT(8) NOT NULL,
    ImportId INT(8) NOT NULL,
    OwnerUserId INT(8) NOT NULL
)

CREATE Table p_bin
(
    id   int(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data bit(8)
)

CREATE Table p_binary
(
    id   int(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data binary(2)
)