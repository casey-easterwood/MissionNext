CREATE TABLE Profile_Questions_Groups (
    Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Name varchar(50) NOT NULL
)

CREATE TABLE Profile_Questions (
    Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    GroupId INT(6) NOT NULL,
    Question varchar(100) NOT NULL
)

CREATE TABLE Profile_Questions_Answers (
    Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    QuesitionId INT(6) NOT NULL,
    Answer varchar(100) NOT NULL
)

CREATE TABLE Candidate_Profile_Answers (
  Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  CandidateId INT(6) NOT NULL,
  GroupId INT(6) NOT NULL,
  QuestionId INT(6) NOT NULL,
  AnswerId INT(6) NOT NULL
)