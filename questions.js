const questions = [
  {
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View All Departments, Roles or Employees", //view all
      "Edit Department", //add or remove department
      "Edit Employee Role", //add or remove role
      "Edit Employee", //add or remove employee
      "Exit",
    ],
  },
];

module.exports = questions;
