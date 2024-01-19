const db = require("../db/connection");
const fs = require("fs/promises");
const { checkTopicExists } = require("../controllers/app-existence-checks");

exports.findArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, 
    COUNT(comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`,
      [article_id]
    )
    .then((result) => {
      const article = result.rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "Article not found"
        });
      }
      return article;
    });
};

exports.selectArticles = (topic, sort_by = "created_at", order = "DESC") => {
  const validSortQueries = ["created_at", "comment_count", "votes"]
  if(!validSortQueries.includes(sort_by)){
    return Promise.reject({status: 400, msg: "Invalid sort_by query"})
  }
  const validOrderQueries = ["ASC", "DESC"]
  if(!validOrderQueries.includes(order.toUpperCase())){
    return Promise.reject({status: 400, msg: "Invalid order query"})
  }
  let sqlQuery = `
  SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url,
  COUNT(comment_id)::INT AS comment_count
  FROM articles
  JOIN comments ON articles.article_id = comments.article_id`;
  const queryParams = [];

  if (topic) {
    sqlQuery += ` WHERE topic = $1`;
    queryParams.push(topic);
  }

  sqlQuery += ` GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order}
  `;
  return db.query(sqlQuery, queryParams).then((result) => result.rows);
};

exports.updateArticle = (article_id, inc_votes) => {
  let queryParams = [article_id, inc_votes];
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Votes number not given" });
  }
  return db
    .query(
      `UPDATE articles
  SET votes = votes + $2
  WHERE article_id = $1
  RETURNING *`,
      queryParams
    )
    .then((result) => result.rows[0]);
};
