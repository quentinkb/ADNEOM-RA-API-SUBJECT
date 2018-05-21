CREATE TABLE access (
  id int IDENTITY(1,1) PRIMARY KEY,
  id_user INT NOT NULL,
  last_name varchar(255),
  first_name varchar(255),
  access_time DATE,
  success int,
  code varchar(255),
  message varchar(255)
);
