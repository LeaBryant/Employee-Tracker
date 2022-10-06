const connection = require('./connection')

class Data {
    constructor(connection){
        this.connection = connection
    }
    findAllRoles(){
        return this.connection.promise().query(
            `SELECT empRole.id, empRole.title, department.deptname AS department, empRole.salary
            FROM empRole LEFT JOIN department
            ON empRole.department_id = department.id;`
        )
    }
    findAllDepartments(){
        return this.connection.promise().query(
            `SELECT * FROM department;`
        )
    }
    findAllEmployees(){
        return this.connection.promise().query(
            `SELECT employee.id, employee.first_name, employee.last_name, emprole.title, department.deptname, emprole.salary, manager.last_name AS manager FROM employee
            LEFT JOIN emprole 
            ON employee.emprole_id = emprole.id
            LEFT JOIN department
            ON emprole.department_id = department.id
            LEFT JOIN employee AS manager
            ON manager.id = employee.manager_id;`
        )
    }
}

module.exports = new Data(connection)