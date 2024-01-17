const { selectEndpoints } = require("../models/app.models")

exports.getEndpoints = (req, res, next) => {
    selectEndpoints()
    .then((endpoints) => {
        res.status(200).send({endpoints})
    })
}

exports.badPath = (req, res, next) => {
    res.status(404).send({msg: "Endpoint does not exist"})
}

