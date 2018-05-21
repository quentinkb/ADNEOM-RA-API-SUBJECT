CREATE TABLE access (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  id_user INT NOT NULL,
  last_name varchar(255),
  first_name varchar(255),
  access_time DATE,
  success int,
  code varchar(255),
  message varchar(255)
); 
