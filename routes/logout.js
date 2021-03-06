const express = require("express");
const router = express.Router();

module.exports = () => {
  router.post("/", (req, res) => {
    delete req.session.user;
    res.redirect("/login");
  });
  return router;
};
