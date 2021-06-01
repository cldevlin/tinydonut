const express = require("express");

const router = express.Router();


module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM donuts;`)
      .then((data) => {
        const donuts = data.rows;
        const templateVars = { donuts };
        res.render("menu", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    if (!req.session.cart) {
      req.session.cart = {
        items: {},
        totalQty: 0,
        totalPrice: 0,
      };
    }

    let cart = req.session.cart;
    if (!cart.items[req.body.id]) {
      cart.items[req.body.id] = {
        item: req.body,
        qty: 1,
      };
      cart.totalQty = cart.totalQty + 1;
      cart.totalPrice = cart.totalPrice + req.body.price;
    } else {
      cart.items[req.body.id].qty = cart.items[req.body.id].qty + 1;
      cart.totalQty = cart.totalQty + 1;
      cart.totalPrice = cart.totalPrice + req.body.price;
    }

    res.json({ totalQty: req.session.cart.totalQty });
  });

  return router;
};
