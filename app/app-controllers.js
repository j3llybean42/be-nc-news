const { selectTopics, selectEndpoints } = require("./app-models")


exports.getTopics = (req, res) => {
    selectTopics()
    .then((topics) => res.status(200).send({topics}))
}

exports.getEndpoints = (req, res) => {
    selectEndpoints()
    .then((endpoints) => {
        console.log(endpoints, "<-- controller endpoints")
        res.status(200).send({endpoints})
    })
}