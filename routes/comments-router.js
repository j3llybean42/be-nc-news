const { deleteCommentById } = require("../controllers/comments.controllers");

const commentRouter = require("express").Router();

commentRouter.route("/:comment_id").delete(deleteCommentById);

module.exports = commentRouter