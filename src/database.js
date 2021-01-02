const mysql = require('mysql');
const { promisify } = require('util');
const { release } = require('os');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'news_portal'
});

pool.getConnection(function(err) {
    if (err) { 
        console.log("err news_portal:", err);
        return;    
    } else {
        release();
        console.log('DB news_portal is connected');
        return;
    }
});


const poolusr = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'userdb'
});

poolusr.getConnection(function(err) {
    if (err) { 
        console.log("err userdb:", err);
        return;    
    } else {
        release();
        console.log('DB userdb is connected');
        return;
    }
});

pool.query = promisify(pool.query);
poolusr.query = promisify(poolusr.query);
module.exports = { pool, poolusr };