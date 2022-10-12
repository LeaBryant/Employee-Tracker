const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

// Connect to database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "employees_db",
    password: "Danitra1234",
    port: "/tmp/mysql.sock",
});

var departmentsArray = [];
var deptIdsArray = [];
var rolesArray = [];
var rolesIdsArray = [];
var employeesArray = [];
var employeeIdsArray = [];

const startList = () => {
    getDepartments();
    getRoles();
    getEmployees();
    inquirer
        .prompt([
            {
                type: "list",
                name: "initial_selection",
                message: "Choose from the following options:",
                choices: [
                    "List all Departments",
                    "List all Roles",
                    "List all Employees",
                    "Add a Department",
                    "Add a Role",
                    "Add an Employee",
                    "Update a Employee",
                    "Exit",
                ],
            },
        ])
        .then((answers) => {
            if (answers.initial_selection == "View all departments") {
                viewDepts();
            }
            if (answers.initial_selection == "View all roles") {
                viewRoles();
            }
            if (answers.initial_selection == "View all employees") {
                viewEmployees();
            }
            if (answers.initial_selection == "Add a department") {
                promptDName();
            }
            if (answers.initial_selection == "Add a role") {
                promptRName();
            }
            if (answers.initial_selection == "Add an employee") {
                promptEName();
            }
            if (answers.initial_selection == "Update an employee role") {
                promptNewERole();
            }
            if (answers.initial_selection == "Quit") {
                console.log("Thank you for using this application.");
            }
        });
};

const getDepartments = () => {
    db.query("SELECT id, department_name FROM departments", function (err,res) {
        res.forEach((item) => {
            departmentsArray.push(item.department_name);
        });
        res.forEach((item) => {
            var obj = {
                id: item.id,
                departmentName: item.department_name,
            };
            deptIdsArray.push(obj);
        });
    });
}

const getRoles = () => {
    db.query("SELECT id, title FROM roles", function (err, res) {
        res.forEach((item) => {
            if (rolesArray.indexOf(item.title) === -1) {
                rolesArray.push(item.title);
            }
        });
        res.forEach((item) => {
            var obj = {
                id: item.id,
                role: item.title,
            };
            rolesIdsArray.push(obj);
        });
    });
}

const getEmployees = () => {
    db.query(
        "SELECT id, first_name, last_name FROM employees",
        function (err, res) {
            res.forEach((item) => {
                var fullName = `${item.first_name} ${item.last_name}`;
                employeesArray.push(fullName);
            });
            res.forEach((item) => {
                var fullName = `${item.first_name} ${item.last_name}`
                var obj = {
                    id: item.id,
                    totalName: fullName

                    //firstName: item.first_name,
                    //lastName: item.last_name,
                };
                employeeIdsArray.push(obj);
            });
        }
    );
}

const viewDepts = () => {
    db.query(
        `SELECT departments.id, departments.department_name AS department
        FROM departments
        ORDER BY departments.id;
        `,
        function (err, results) {
            console.table(results);
            startList();
        }
    );
};

const viewRoles = () => {
    db.query(
        `SELECT roles.id, roles.title AS job_title, departments.department_name AS department, roles.salary
    FROM roles
    LEFT JOIN departments
    ON departments.id = roles.department_id
    ORDER BY roles.id;
    `,
        function (err, results) {
            console.table(results);
            startList();
        }
    );
};

const viewEmployees = () => {
    db.query(
        `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name AS department, roles.salary, CONCAT(managers.first_name, ' ',managers.last_name) AS manager
    FROM departments
    LEFT JOIN roles
    ON departments.id = roles.department_id
    LEFT JOIN employees
    ON roles.id = employees.role_id
    LEFT JOIN employees AS managers
    ON managers.id = employees.manager_id 
    ORDER BY employees.id;
    `,
        function (err, results) {
            console.table(results);
            startList();
        }
    );
};

const promptDName = () => {
    inquirer
        .prompt([
            {
                type: "input",
                name: "deptName",
                message: "Enter the department's name?",
            },
        ])
        .then((answers) => {
            addDepartment(answers.deptName);

            console.log("Department name added " + answers.deptName + ".");
        });
};

const addDepartment = (deptName) => {
    db.query(
        `INSERT INTO departments (department_name)
    VALUES ("${deptName}");
    `,
        function (err, results) { }
    );

    db.query(
        `SELECT departments.id, departments.department_name AS department
    FROM departments
    ORDER BY departments.id;
    `,
        function (err, results) {
            console.table(results);
            startList();
        }
    );
};

//To add a role, functions promptRoleName and addRole to ask input questions and write to table
const promptRName = () => {
    inquirer
        .prompt([
            {
                type: "input",
                name: "roleTitle",
                message: "Enter the role's title?",
            },
            {
                type: "input",
                name: "roleSalary",
                message: "Enter role's salary?",
            },
            {
                type: "list",
                name: "roleDepartment",
                message: "Enter role's department?",
                choices: departmentsArray
            },
        ])
        .then((answers) => {
            var deptNum;
            deptIdsArray.forEach((item) => {
                if (answers.roleDepartment === item.departmentName) {
                    deptNum = item.id;
                }
            });

            addRole(answers.roleTitle, answers.roleSalary, deptNum);

            console.log(
                "You've added an employee role titled " +
                answers.roleTitle +
                " whose salary is " +
                answers.roleSalary +
                " and department is " +
                answers.roleDepartment +
                "."
            );
        });
};

const addRole = (roleTitle, roleSalary, roleDepartment) => {
    db.query(
        `INSERT INTO roles (title, salary, department_id)
    VALUES ("${roleTitle}", ${roleSalary}, ${roleDepartment});
    `,
        function (err, results) { }
    );

    db.query(
        `SELECT roles.id, roles.title AS job_title, departments.department_name AS department, roles.salary
    FROM roles
    LEFT JOIN departments
    ON departments.id = roles.department_id
    ORDER BY roles.id;
    `,
        function (err, results) {
            console.table(results);
            startList();
        }
    );
};

const promptEName = () => {
    inquirer
        .prompt([
            {
                type: "input",
                name: "employeeFirstName",
                message: "Enter employee's first name?",
            },
            {
                type: "input",
                name: "employeeLastName",
                message: "Enter employee's last name?",
            },
            {
                type: "list",
                name: "employeeRole",
                message: "Enter employee's job role?",
                choices: rolesArray
            },
            {
                type: "list",
                name: "employeeManager",
                message: "Enter employee's manager?",
                choices: employeesArray
            },
        ])
        .then((answers) => {
            // Employee role options converted to integer
            var roleNum;
            rolesIdsArray.forEach((item) => {
                if (answers.employeeRole === item.role) {
                    roleNum = item.id;
                }
            });

            var managerNum;
            employeeIdsArray.forEach((item) => {
                if (answers.employeeManager === item.totalName) {
                    managerNum = item.id;
                }
            });

            addEmployee(
                answers.employeeFirstName,
                answers.employeeLastName,
                roleNum,
                managerNum
            );

            console.log(
                "You've added an employee named " +
                answers.employeeFirstName +
                " " +
                answers.employeeLastName +
                " whose job is " +
                answers.employeeRole +
                " and manager is " +
                answers.employeeManager +
                "."
            );
        });
};

const addEmployee = (
    employeeFirstName,
    employeeLastName,
    employeeRole,
    employeeManager
) => {
    db.query(
        `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
    VALUES ("${employeeFirstName}", "${employeeLastName}", ${employeeRole}, ${employeeManager});
    `,
        function (err, results) { }
    );

    db.query(
        `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name AS department, roles.salary, CONCAT(managers.first_name, ' ',managers.last_name) AS manager
    FROM departments
    LEFT JOIN roles
    ON departments.id = roles.department_id
    LEFT JOIN employees
    ON roles.id = employees.role_id
    LEFT JOIN employees AS managers
    ON managers.id = employees.manager_id 
    ORDER BY employees.id;
    `,
        function (err, results) {
            console.table(results);
            startList();
        }
    );
};

const promptNewERole = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "employeeName",
                message: "Who is the employee?",
                choices: employeesArray
            },
            {
                type: "list",
                name: "employeeRole",
                message: "What is the employee's new job role?",
                choices: rolesArray
            }
        ])
        .then((answers) => {
            var employeeId;
            employeeIdsArray.forEach((item) => {
            if (answers.employeeName === item.totalName) {
                employeeId = item.id;
            }
            });

            var roleNum;
            rolesIdsArray.forEach((item) => {
            if (answers.employeeRole === item.role) {
                roleNum = item.id;
            }
            });


            updateEmployeeRole(
                employeeId,
                roleNum
            );

            console.log(
                "You've updated the job role of " +
                answers.employeeName +
                " to " +
                answers.employeeRole +
                "."
            );

        })
}

const updateEmployeeRole = (employeeId, roleNum) => {
    db.query(
        `UPDATE employees
        SET role_id = ${roleNum}
        WHERE id = "${employeeId}";
    `,
        function (err, results) { }
    );

    db.query(
        `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name AS department, roles.salary, CONCAT(managers.first_name, ' ',managers.last_name) AS manager
    FROM departments
    LEFT JOIN roles
    ON departments.id = roles.department_id
    LEFT JOIN employees
    ON roles.id = employees.role_id
    LEFT JOIN employees AS managers
    ON managers.id = employees.manager_id 
    ORDER BY employees.id;
    `,
        function (err, results) {
            console.table(results);
            startList();
        }
    );
}

startList();