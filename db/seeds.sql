use employee_DB;

-- departments
INSERT INTO `department` (`id`, `name`) VALUES
(1, 'Finance'),
(2, 'HR'),
(3, 'Sales'),
(4, 'IT'),

-- roles
INSERT INTO `role` (`id`, `title`, `salary`, `dept_id`) VALUES
(1, 'Salesperson', '70000', 1),
(2, 'Accountant', '80000', 2),
(3, 'IT', '90000', 3),
(4, 'Operations Manager', '150000', 4);

-- employees
INSERT INTO `employee` (`id`, `first_name`, `last_name`, `role_id`, `manager_id`) VALUES
(1, 'Danni ', 'Henson', 2, 1),
(2, 'Jordan', ' Esparza', 1, 1),
(3, 'Brandon', 'Strickland', 4, 2),
(4, 'Phoebe', 'Holding', 3, 2),
(5, 'Ezra', 'Chavez', 2, 1);
(6, 'Sami', 'Andrews', 1, 2);




