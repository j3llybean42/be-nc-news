const db = require("../../db/connection");
const fs = require("fs/promises");


exports.fetchComments = (article_id) => {
  const sqlQuery = `
    SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at
    `;
  const queryParams = [article_id];
  return db.query(sqlQuery, queryParams).then((result) => result.rows);
};

exports.addCommentById = (article_id, commentToAdd) => {
  const { username, body } = commentToAdd;
  if (!body) {
    return Promise.reject({ status: 400, msg: "Cannot post empty comment" });
  } 
  return db.query(
    `INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *`,
    [article_id, username, body]
  ).then(({rows}) => {
    return rows
  })

};
