const { selectTopics, selectEndpoints } = require("./app-models")


exports.getTopics = (req, res) => {
    selectTopics()
    .then((topics) => res.status(200).send({topics}))
}

exports.getEndpoints = (req, res) => {
    selectEndpoints()
    .then((endpoints) => {
        res.status(200).send({endpoints})
    })
}

exports.badPath = (req, res) => {
    res.status(404).send({msg: "endpoint does not exist"})
}