const mysql = require("mysql2");
const util = require("util");
const inquirer = require("inquirer");
const cTable = require("console.table");
const questions = require("./questions");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "testuser",
  password: "pa$$word123",
  database: "employee_DB",
});

//to use async/await
connection.query = util.promisify(connection.query);

//connect to the database
connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected");
});

//begin application
startPrompts();

async function startPrompts() {
  const { action } = await inquirer.prompt(questions);
  switch (action) {
    case "View All Departments, Roles or Employees": //view all
      viewAll();
      break;
    case "Edit Department": //add or remove department
      editDepartments();
      break;
    case "Edit Employee Role": //add or remove role
      editRole();
      break;
    case "Edit Employee": //add or remove employee
      editEmployee();
      break;
    case "Exit":
      process.exit(0);
      break;
    default:
      break;
  }
}
/////////////////////////////////////////////////////////////////////////////////////

// View All Departments, Roles or Employees
async function viewAll() {
  const { viewChoice } = await inquirer.prompt({
    name: "viewChoice",
    type: "list",
    message: "Select an category to view from the following options:",
    choices: ["Employees", "Departments", "Roles"],
  });
  let query;
  if (viewChoice === "Employees") {
    query = `SELECT  employee.id, employee.first_name, employee.last_name,
      role.title, role.salary, employee.manager_id, department.dept AS department
      FROM ((employee
      INNER JOIN role ON employee.role_id = role.id)
      INNER JOIN department ON role.dept_id = department.id)
      ORDER BY id`;
  } else if (viewChoice === "Departments") {
    query = `SELECT id, dept FROM department`;
  } else if (viewChoice === "Roles") {
    query = `SELECT role.title, role.id AS id, role.salary, department.dept AS department FROM role 
    INNER JOIN department ON role.dept_id = department.id ORDER BY id
     ASC`;
  }
  const data = await connection.query(query);
  console.table(data);
  startPrompts();
}

// Add/Remove Department
async function editDepartments() {
  const { department } = await inquirer.prompt({
    name: "department",
    type: "list",
    message: "Choose one of the following:",
    choices: ["Add Department", "Remove Department", "Exit"],
  });
  if (department === "Add Department") {
    addDepartment();
  }
  if (department === "Remove Department") {
    removeDepartment();
  }
  if (department === "Exit") {
    startPrompts();
  }
}
///////////////////////////////////////////////
////add department function
async function addDepartment() {
  const departmentName = await inquirer.prompt({
    name: "department",
    type: "input",
    message: "What department would you like to add?",
  });

  const data = departmentName.department;

  const query = await connection.query(
    "INSERT INTO department SET ?",
    {
      dept: data,
    },

    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " Department Added\n");
      startPrompts();
    }
  );
}
//////////////////////////////////////////////////
////remove department function
async function removeDepartment() {
  connection.query(
    "SELECT dept AS departments FROM department",
    async function (err, departments) {
      const data = await inquirer.prompt([
        {
          name: "departments",
          message: "What department would you like to remove?",
          type: "list",
          choices: departments.map((department) => ({
            name: department.departments,
          })),
        },
      ]);
      connection.query("DELETE FROM department WHERE ?", {
        dept: data.departments,
      }),
        startPrompts();
    }
  );
}
/////////////////////////////////////////////////////////////////////////////////////
//Edit Employee (Add or Remove)
async function editEmployee() {
  const { employee } = await inquirer.prompt({
    name: "employee",
    type: "list",
    message: "What would you like to do?",
    choices: ["Add Employee", "Remove Employee", "Exit"],
  });
  if (employee === "Add Employee") {
    addEmployee();
  } else if (employee === "Remove Employee") {
    removeEmployee();
  } else {
    startPrompts();
  }
}

///////////////////////////////////////////////////////////////////
//// Add employee function
async function addEmployee() {
  connection.query(`SELECT id, title FROM role;`, function (err, res) {
    const role = res.map(({ id, title }) => ({
      name: title,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?",
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the employee's last name?",
        },
        {
          type: "list",
          name: "role",
          message: "What is the employee's role?",
          choices: role,
        },
      ])
      .then((data) => {
        const param = [data.first_name, data.last_name, data.role];
        connection.query(
          `SELECT id, concat(first_name, " ", last_name) AS name FROM employee;`,
          function (err, res) {
            if (err) throw err;
            const manager = res.map(({ id, name }) => ({
              name: name,
              value: id,
            }));

            inquirer
              .prompt([
                {
                  type: "list",
                  name: "manager",
                  message: "Does this person have a manager?",
                  choices: ["Yes", "No"],
                },
                {
                  type: "list",
                  name: "empManager",
                  message: "Who is the employee's manager?",
                  choices: manager,
                  when(answers) {
                    return answers.manager === "Yes";
                  },
                },
              ])
              .then((managerChoice) => {
                param.push(managerChoice.empManager);

                const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                connection.query(sql, param, (err, results) => {
                  if (err) throw err;

                  console.log(
                    `${data.first_name} ${data.last_name} has been added to the database`
                  );

                  startPrompts();
                });
              });
          }
        );
      });
  });
}

///////////////////remove employee///

async function removeEmployee() {
  const employees = await connection.query(
    "SELECT id, first_name, last_name FROM employee"
  );
  let employeeArray = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "Select any employee to remove",
        choices: employeeArray,
      },
    ])
    .then((employee) => {
      connection.query(`DELETE FROM employee WHERE id = ${employee.employee}`);
      console.log("Employee Removed!");
      startPrompts();
    });
}

//////////////////////////////////////////////////////////////////////////////////////////////
//Edit role

async function editRole() {
  const { role } = await inquirer.prompt({
    name: "role",
    type: "list",
    message: "What would you like to do?",
    choices: ["Add Role", "Update Role", "Remove Role", "Exit"],
  });
  if (role === "Add Role") {
    addRole();
  }
  if (role === "Update Role") {
    updateRole();
  }
  if (role === "Remove Role") {
    removeRole();
  }
  if (role === "Exit") {
    startPrompts();
  }
}
//////////////////////////////////////////////
////add role function
async function addRole() {
  const departments = await connection.query("SELECT dept, id FROM department");
  const { dept, title, salary } = await inquirer.prompt([
    {
      name: "dept",
      type: "list",
      message: "Which department will this role be associated with?",
      choices: departments.map((row) => ({ name: row.dept, value: row.id })),
    },
    {
      name: "title",
      type: "input",
      message: "What role are you creating?",
    },
    {
      name: "salary",
      type: "number",
      message: "What is the salary for this role?",
    },
  ]);
  connection.query(
    `INSERT INTO role (title, salary, dept_id) VALUES ('${title}', ${salary}, ${dept})`,

    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " Role Added\n");
      startPrompts();
    }
  );
}

///////////////////////////////////////////////////////////////////////////////////////////
//Edit role

async function updateRole() {
  const employees = await connection.query(
    "SELECT first_name AS firstName, last_name AS lastName, id FROM employee"
  );
  const roles = await connection.query("SELECT id, title, salary FROM role");
  const { employee, role } = await inquirer.prompt([
    {
      name: "employee",
      type: "list",
      message: "Select an employee to update:",
      choices: employees.map((employee) => ({
        name: employee.firstName + " " + employee.lastName,
        value: employee.id,
      })),
    },
    {
      name: "role",
      type: "list",
      message: "Select the new role:",
      choices: roles.map((row) => ({ name: row.title, value: row.id })),
    },
  ]);
  connection.query(
    `UPDATE employee SET role_id = ${role} WHERE  id = ${employee}`,

    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " Role Updated\n");
      startPrompts();
    }
  );
}

///Remove Role///

async function removeRole() {
  connection.query("SELECT id, title FROM role", async function (err, title) {
    const rolesArray = await inquirer.prompt([
      {
        type: "list",
        name: "title",
        message: "Select any role to remove",
        choices: title.map((title) => ({
          name: title.title,
        })),
      },
    ]); //up to  here is working
    connection.query("DELETE FROM roles WHERE ?", {
      role: rolesArray.role,
    }),
      startPrompts();
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// NOTES:

// Functions:

// View All Employees – need to fix so that you can see manager name, rather than ID
//Add Employee - not working. Need to fix role_id
//change choices for role iD to get from table rather than string.
//need to fix remove employee
// Edit Department functions working

// Edit Employee Role – working

// Edit Employee – need to check remove Employee. Will do once Add employee working

// Can be done later:

// Remove Role

// Swap around salary and department on view all roles
