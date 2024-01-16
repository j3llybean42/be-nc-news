const { checkArticleExists } = require("./app-existence-checks")
const { selectTopics, selectEndpoints, findArticleById, selectArticles, fetchComments } = require("./app-models")


exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => res.status(200).send({topics}))
}

exports.getEndpoints = (req, res, next) => {
    selectEndpoints()
    .then((endpoints) => {
        res.status(200).send({endpoints})
    })
}

exports.badPath = (req, res, next) => {
    res.status(404).send({msg: "Endpoint does not exist"})
}

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

exports.getCommentsForArticle = (req, res, next) => {
    const article_id = req.params.article_id
    const fetchCommentsQuery = fetchComments(article_id)
    const articleExistsQuery = checkArticleExists(article_id)

    Promise.all([fetchCommentsQuery, articleExistsQuery])
    .then((results) => {
        const comments = results[0]
        res.status(200).send({comments})
    })
    .catch(next)
}