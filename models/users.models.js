const db = require("../db/connection");
const fs = require("fs/promises");

exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users;`).then((result) => result.rows)
}
exports.fetchUsername = (username) => {
    return db.query(`SELECT * FROM users
    WHERE username = $1`, [username])
    .then((result) => {
        const user = result.rows[0]
        if(!user){
            return Promise.reject({status: 404, msg: "User not found"})
        }
        return user
    })
}