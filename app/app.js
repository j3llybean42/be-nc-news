const express = require("express")
const { getTopics } = require("./app-controllers")

const app = express()

app.get("/api/topics", getTopics)



module.exports = app