const { checkArticleExists, checkUserExists } = require("../app-existence-checks");
const { fetchComments, addCommentById } = require("../models/comments.models");

exports.getCommentsForArticle = (req, res, next) => {
  const article_id = req.params.article_id;
  const fetchCommentsQuery = fetchComments(article_id);
  const articleExistsQuery = checkArticleExists(article_id);

  Promise.all([fetchCommentsQuery, articleExistsQuery])
    .then((results) => {
      const comments = results[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentById = (req, res, next) => {
  const article_id = req.params.article_id;
  const commentToAdd = req.body;
  const username = commentToAdd.username
  const articleExistsQuery = checkArticleExists(article_id);
  const userExistsQuery = checkUserExists(username);
  const addCommentQuery = addCommentById(article_id, commentToAdd);
  Promise.all([addCommentQuery, articleExistsQuery, userExistsQuery])
    .then((results) => {
      const comment = results[0][0];
      res.status(201).send( comment );
    })
    .catch(next);
};
