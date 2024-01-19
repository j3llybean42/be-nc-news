const express = require("express");
const { getEndpoints, badPath } = require("./controllers/app.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getArticleById, getArticles, patchArticleId } = require("./controllers/articles.controllers");
const { getCommentsForArticle, postCommentById, deleteCommentById } = require("./controllers/comments.controllers");
const { getUsers } = require("./controllers/users.controllers");
const apiRouter = require("./routes/api-router")

const app = express();

app.use(express.json());

app.use("/api", apiRouter)

app.all("/*", badPath);

app.use((err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

module.exports = app;