const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "Djy66978@1997",
    host: "localhost",
    port: "5432",
    database: "todolist"
});

module.exports = pool;