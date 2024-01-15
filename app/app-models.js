const db = require("../db/connection")
const fs = require("fs/promises")

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`).then((result) => result.rows)
}

exports.selectEndpoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8").then((fileContents) => {
        const endpoints = JSON.parse(fileContents)
        return endpoints
    })
}

exports.findArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = ${article_id}`).then((result) => {
        const article = result.rows[0]
        if(!article){
            return Promise.reject({
                status: 404,
                msg: "Article not found"
            })
        }
        return article
    })
}

