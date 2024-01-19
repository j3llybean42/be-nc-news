const { fetchUsers, fetchUsername } = require("../models/users.models")

exports.getUsers = (req, res, next) => {
    fetchUsers()
    .then((users) => res.status(200).send({users}))
    .catch(next)
}

exports.getUsername = (req, res, next) => {
    const username = req.params.username
    fetchUsername(username)
    .then((user) => {
        res.status(200).send({user})
    })
    .catch(next)
}