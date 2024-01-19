const {
  getArticles,
  getArticleById,
  patchArticleId,
  postArticle,
} = require("../controllers/articles.controllers");
const {
  getCommentsForArticle,
  postCommentById,
} = require("../controllers/comments.controllers");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles).post(postArticle);
articleRouter.route("/:article_id").get(getArticleById).patch(patchArticleId);
articleRouter
  .route("/:article_id/comments")
  .get(getCommentsForArticle)
  .post(postCommentById);

  module.exports = articleRouter