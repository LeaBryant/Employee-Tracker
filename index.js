const { employeeQuestions, managerQuestion, engineerQuestion, internQuestion, menuQuestion } = require('./src/questions');
const inquirer = require("inquirer");
const Manager = require('./lib/Manager');
const Employee = require('./lib/Employee');
const Intern = require('./lib/Intern');
const Engineer = require('./lib/Engineer');
const fs = require('fs');
const generateHTML = require('./src/generateHTML');

let team = [];

const menu = () => {
    inquirer.prompt(menuQuestion)
    .then(data => {
        if(data.nextStep ==='Enter an engineer.') {
            engineer();
        }
        else if (data.nextStep ==='Enter an intern.') {
                intern();
            }
        else {
            writeToFile(team);
        }
    });
}

const writeToFile = (data)=> {
    return new Promise((resolve, reject) => {
        fs.writeFile('./dist/index.html', generateHTML(data), err => {
          if (err) {
            reject(err);
            return;
          }
          resolve({
            ok: true,
            message: 'File created!'
          });
        });
      });
    };

const init = () => {
    const managerArray = managerQuestion.concat(employeeQuestions); 
    inquirer.prompt(managerArray)
    .then(data => {
        const manager = new Manager (data.name, data.employeeID, data.email, data.officeNumber);
        team.push(manager);
        menu();
    }) 
}

const intern = () => {
    const internArray = internQuestion.concat(employeeQuestions); 
    inquirer.prompt(internArray)
    .then(data => {
        const intern = new Intern (data.name, data.employeeID, data.email, data.school);
        team.push(intern);
        menu();
    })
}

const engineer = () => {
    const engineerArray = engineerQuestion.concat(employeeQuestions); 
    inquirer.prompt(engineerArray)
    .then(data => {
        const engineer = new Engineer (data.name, data.employeeID, data.email, data.gitHubUsername);
        team.push(engineer);
        menu();
    })
}

let manager = init();