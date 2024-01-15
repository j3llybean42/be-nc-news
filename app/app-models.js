const db = require("../db/connection")
const fs = require("fs/promises")

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`).then((result) => result.rows)
}

exports.selectEndpoints = () => {
    console.log(__dirname)
    return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8").then((fileContents) => {
        const endpoints = JSON.parse(fileContents)
        return endpoints
    })
}

