CREATE TABLE Jobs (
    Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    AgencyId int(6) NOT NULL DEFAULT 0,
    Title varchar(50) DEFAULT '',
    Location varchar(25) DEFAULT '',
    Status int(1) NOT NULL DEFAULT 0,
    Created INT(8) NOT NULL
)

alter table Jobs add CategoryId int(6) NOT NULL DEFAULT 0

ALTER TABLE Jobs
    DROP Category;

SELECT
Jobs.Id As Id,
Jobs.AgencyId As AgencyId,
Jobs.Title As Title,
Jobs.CategoryId As CategoryId,
Jobs.Location As Location,
Jobs.Status As Status,
Jobs.Created As Created,
JobCategories.Name as Category
FROM Jobs left join JobCategories
on (Jobs.CategoryId = JobCategories.Id)
ORDER BY Title

CREATE TABLE Job_Description (
      Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      JobId int(6) NOT NULL UNIQUE ,
      Description varchar(1000) DEFAULT ''
)

CREATE TABLE Job_Preferred_Experience (
     Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
     JobId int(6) NOT NULL UNIQUE ,
     Description varchar(1000) DEFAULT ''
)