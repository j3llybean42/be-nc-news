const { selectTopics } = require("./app-models")


exports.getTopics = (req, res) => {
    selectTopics()
    .then((topics) => res.status(200).send({topics}))
}