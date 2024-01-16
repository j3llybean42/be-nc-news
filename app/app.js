const express = require("express")
const { getTopics, getEndpoints, badPath, getArticleById, getArticles } = require("./app-controllers")

const app = express()

app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.use((err, req, res, next) => {    
    if(err.code){
        res.status(400).send({msg: "Bad request"})
    } else next(err)
})

app.use((err, req, res, next) => {
    if(err.msg && err.status){
        res.status(err.status).send({msg: err.msg})
    }else next(err)
})

app.all("/*", badPath)

module.exports = app