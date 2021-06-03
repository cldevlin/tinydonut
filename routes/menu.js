const express = require("express");

const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    if (!req.session.user) {
      res.redirect("/login");
    }

    db.query(`SELECT * FROM donuts;`)
      .then((data) => {
        const donuts = data.rows;
        const templateVars = { donuts }; // STRETCH: use jquery to pass user object into templateVars
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
        taxes: 0,
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
      cart.taxes = Math.round(cart.totalPrice * 0.13);
    } else {
      cart.items[req.body.id].qty = cart.items[req.body.id].qty + 1;
      cart.totalQty = cart.totalQty + 1;
      cart.totalPrice = cart.totalPrice + req.body.price;
      cart.taxes = Math.round(cart.totalPrice * 0.13);
    }

    res.json({ totalQty: req.session.cart.totalQty });
  });

  return router;
};
