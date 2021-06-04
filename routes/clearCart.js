const express = require("express");

const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {});

  router.post("/", (req, res) => {
    if (req.session.cart) {
      delete req.session.cart;
    }
    res.json({ empty: true });
  });

  return router;
};
