const mysql = require('mysql2');
const util = require('util');
require('dotenv').config('./../.env')

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

pool.query = util.promisify(pool.query);



module.exports = pool;
