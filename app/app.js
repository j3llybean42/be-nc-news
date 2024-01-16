const express = require("express")
const { getTopics, getEndpoints, badPath, getArticleById } = require("./app-controllers")

const app = express()

app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.get("/api/articles/:article_id", getArticleById)

app.use((err, req, res, next) => {    
    if(err.code === "42703"){
        res.status(400).send({msg: "Bad request"})
    } else next(err)
})

app.use((err, req, res, next) => {
    if(err.msg === "Article not found"){
        res.status(404).send({msg: "Article not found"})
    }
})

app.all("/*", badPath)

module.exports = app