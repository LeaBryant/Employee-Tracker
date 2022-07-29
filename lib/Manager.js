const Employee = require('./Employee');

class Manager extends Employee {
    //run employee
    constructor (name, employeeID, email, officeNumber) {
    //run manager 
    super(name, employeeID, email);
       this.officeNumber = officeNumber;
    }
    //add get officeNumber method
    getOfficeNumber() {
        return this.officeNumber;
    }
    getRole() {
        return 'Manager';
    }
}

module.exports = Manager;