CREATE TABLE users_main (
    UserId INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    UserLogin varchar(25) NOT NULL,
    FirstName varchar(25) DEFAULT '',
    LastName varchar(25) DEFAULT '',
    Email varchar(100) DEFAULT '',
    RoleName varchar(25) DEFAULT '',
    RoleId INT(6) DEFAULT 0,
    EntityId INT(6) DEFAULT 0,
    EntityName VARCHAR(25) DEFAULT '',
    UserPassword varchar(128) DEFAULT ''
)

CREATE TABLE users_roles (
    Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    RoleName varchar(25) UNIQUE NOT NULL,
    Description varchar(100) DEFAULT ''
)