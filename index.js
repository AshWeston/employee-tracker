const mysql = require("mysql2");
const util = require("util");
const inquirer = require("inquirer");
const questions = require("questions.js");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "testuser",
  password: "pa$$word123",
  //   database: "employee_DB", - need to create database.
});

// promise wrapper to enable async await with MYSQL
connection.query = util.promisify(connection.query).bind(connection);

//connect to the database
connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected");
  init();
});

//begin application
async function init() {
  const { action } = await inquirer.prompt(questions);
  switch (action) {
    case "View All Departments/Roles or Employees":
      viewInfo();
      break;
    case "Edit Department":
      editDepartments();
      break;
    case "Edit Role":
      editRole();
      break;
    case "Edit Employee":
      editEmployee();
      break;
    case "Exit":
      process.exit(0);
      break;
    default:
      break;
  }
}
