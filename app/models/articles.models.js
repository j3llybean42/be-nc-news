const db = require("../../db/connection");
const fs = require("fs/promises");

exports.findArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      const article = result.rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return article;
    });
};

exports.selectArticles = () => {
  return db
    .query(
      `
      SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url,
      COUNT(comment_id)::INT AS comment_count
      FROM articles
      JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY created_at DESC
      `
    )
    .then((result) => result.rows);
};

exports.updateArticle = (article_id, inc_votes) => {
  let queryParams = [article_id, inc_votes]
  if(typeof inc_votes !== "number"){
    return Promise.reject({status: 400, msg: "Votes number not given"})
  }
  return db.query(`UPDATE articles
  SET votes = votes + $2
  WHERE article_id = $1
  RETURNING *`, queryParams)
  .then((result) => result.rows[0])
}