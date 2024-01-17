const db = require("../../db/connection");
const fs = require("fs/promises");

exports.selectEndpoints = () => {
  return fs
    .readFile(`${__dirname}/../../endpoints.json`, "utf-8")
    .then((fileContents) => {
      const endpoints = JSON.parse(fileContents);
      return endpoints;
    });
};


