const mysql = require("mysql2");

const connection = mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "Danitra1234",
      database: "personnel_db"
    },
    
  );

  module.exports = connection;