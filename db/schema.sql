DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;
USE employee_DB;

CREATE TABLE `department` (
  `id` int NOT NULL,
  `name` varchar(30) DEFAULT NULL
);


CREATE TABLE `role` (
  `id` int NOT NULL,
  `title` varchar(30) DEFAULT NULL,
  `salary` decimal(30,0) DEFAULT NULL,
  `department_id` int DEFAULT NULL
);


CREATE TABLE `employee` (
  `id` int NOT NULL,
  `first_name` varchar(30) DEFAULT NULL,
  `last_name` varchar(30) DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  `manager_id` int DEFAULT NULL
);