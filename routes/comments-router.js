const { deleteCommentById, patchComment } = require("../controllers/comments.controllers");

const commentRouter = require("express").Router();

commentRouter.route("/:comment_id").delete(deleteCommentById).patch(patchComment)

module.exports = commentRouter