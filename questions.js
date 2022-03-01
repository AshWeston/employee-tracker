const questions = [
  {
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View All Departments/Roles or Employees", //will give option to view all departments, all roles or all employees
      "Edit Department", //will give option to add or remove department
      "Edit Role", //will give option to add or update Role
      "Edit Employee", //will give option to add or remove Employee
      "Exit",
    ],
  },
];

module.exports = questions;

// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
