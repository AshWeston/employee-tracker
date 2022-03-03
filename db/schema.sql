DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;
USE employee_DB;

CREATE TABLE department (
  id INT NOT NULL,
  dept VARCHAR(45) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL,
  title VARCHAR(45) NULL,
  salary DECIMAL NOT NULL,
  dept_id INT REFERENCES department.id,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL,
  first_name VARCHAR(45) NULL,
  last_name VARCHAR(45) NULL,
  role_id INT REFERENCES role.id,
  manager_name VARCHAR(45) NULL,
  PRIMARY KEY (id)
);