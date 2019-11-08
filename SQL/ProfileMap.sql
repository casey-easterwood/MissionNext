CREATE TABLE ProfileMap (
     Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
     CandidateFieldId INT(8) NOT NULL,
     CandidateFieldName varchar(50) NOT NULL DEFAULT '',
     CandidateAnswerId INT(8) NOT NULL,
     CandidateFieldAnswer varchar(50) NOT NULL DEFAULT '',
     OrganizationFieldId INT(8) NOT NULL,
     OrganizationFieldName varchar(50) NOT NULL DEFAULT '',
     OrganizationAnswerId INT(8) NOT NULL,
     OrganizationFieldAnswer varchar(50) NOT NULL DEFAULT ''
)
