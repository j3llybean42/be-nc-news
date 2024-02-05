const express = require("express");
const { badPath } = require("./controllers/app.controllers");
const apiRouter = require("./routes/api-router");
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", badPath);

app.use((err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

module.exports = app;
