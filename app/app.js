const express = require("express");
const { getEndpoints, badPath } = require("./controllers/app.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getArticleById, getArticles, patchArticleId } = require("./controllers/articles.controllers");
const { getCommentsForArticle, postCommentById, deleteCommentById } = require("./controllers/comments.controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsForArticle);

app.post("/api/articles/:article_id/comments", postCommentById);

app.patch("/api/articles/:article_id", patchArticleId)

app.delete("/api/comments/:comment_id", deleteCommentById)

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

//ignore this, it's only here while I'm working in case of mystery errors
// app.use((err, req, res, next) => {
//     if(err){
//         console.log(err)
//     }
// })

app.all("/*", badPath);

module.exports = app;
