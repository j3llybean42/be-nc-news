const { checkArticleExists } = require("../app-existence-checks")
const { findArticleById, selectArticles, updateArticle } = require("../models/articles.models")

exports.getArticleById = (req, res, next) => {
    const article_id = req.params.article_id
    findArticleById(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => res.status(200).send({articles}))
    .catch(next)
}

exports.patchArticleId = (req, res, next) => {
    const article_id = req.params.article_id
    const {inc_votes} = req.body
    const articleExistsQuery = checkArticleExists(article_id)
    const patchArticleQuery = updateArticle(article_id, inc_votes)

    Promise.all([patchArticleQuery, articleExistsQuery])
    .then((results) => {
        const article = results[0]
        res.status(200).send({article})
    })
    .catch(next)
}