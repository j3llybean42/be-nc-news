const db = require("../db/connection");
const fs = require("fs/promises");

exports.fetchComments = (article_id) => {
  const sqlQuery = `
    SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    `;
  const queryParams = [article_id];
  return db.query(sqlQuery, queryParams).then((result) => result.rows);
};

exports.addCommentById = (article_id, commentToAdd) => {
  const { username, body } = commentToAdd;
  if (!body) {
    return Promise.reject({ status: 400, msg: "Cannot post empty comment" });
  }
  return db
    .query(
      `INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *`,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *`,
      [comment_id]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      } else {
        return result.rows;
      }
    });
};

exports.updateComment = (comment_id, inc_votes) => {
  let queryParams = [comment_id, inc_votes];
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Votes number not given" });
  }
  return db
    .query(
      `UPDATE comments
  SET votes = votes + $2
  WHERE comment_id = $1
  RETURNING *`,
      queryParams
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      } else {
        return result.rows;
      }
    });
};
