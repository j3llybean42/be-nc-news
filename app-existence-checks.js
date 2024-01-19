const db = require("./db/connection")

exports.checkArticleExists = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Article not found"})
        }
    })
}

exports.checkUserExists = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "User not found"})
        } 
    })
}

exports.checkCommentExists = (comment_id) => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Comment not found"})
        }
    })
}

exports.checkTopicExists = (topicQuery) => {
    return db.query(`SELECT * FROM topics WHERE slug = $1`, [topicQuery])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Topic not found"})
        }
    })
}