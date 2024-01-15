const express = require("express")
const { getTopics, getEndpoints, badPath } = require("./app-controllers")

const app = express()

app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.all("/*", badPath)

module.exports = app