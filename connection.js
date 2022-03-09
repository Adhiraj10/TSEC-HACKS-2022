const mysql = require('mysql');

const connection = mysql.createConnection({
   host: '127.0.0.1',
   user: 'root',
   password: 'jarihda1',
   database: 'devfinder'
});

connection.connect((err) => {
   if (err)
      throw err;
   else
      console.log('Database successfully connected');
})

module.exports = connection;