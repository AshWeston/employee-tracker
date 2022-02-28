const mysql = require("mysql2");
const util = require("util");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "XX", //need to work out how to update password before including.
  //   database: "employee_DB", - need to create database.
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected");
  init();
});

function init() {
  console.log("initialised");
} //create first function
