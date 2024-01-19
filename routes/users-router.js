const { getUsers, getUsername } = require("../controllers/users.controllers")

const userRouter = require("express").Router()

userRouter.route("/").get(getUsers)
userRouter.route("/:username").get(getUsername)

module.exports = userRouter