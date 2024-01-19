const db = require("../db/connection");
const fs = require("fs/promises");

exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users;`).then((result) => result.rows)
}