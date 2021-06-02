const express = require("express");
const sqlFormat = require("pg-format");

const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    if (req.session.user) {
      res.render("cart");
    } else {
      res.redirect("/login");
    }
  });

  const generateRandomString = function (length) {
    let randomString = [];
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < length; i++) {
      randomString.push(
        characters.charAt(Math.floor(Math.random() * characters.length))
      );
    }

    return randomString.join("");
  };

  const insertItemsQueryGenerator = function (orderId, items) {
    let values = [];
    items.forEach((orderItem) => {
      values.push([orderId, orderItem.item.id, orderItem.qty]);
    });

    return sqlFormat(
      "INSERT INTO order_items (order_id, donut_id, quantity) VALUES %L ",
      values
    );
  };

  router.post("/", (req, res) => {
    db.query(
      `INSERT INTO orders(user_id, order_no, sub_total, taxes, total, placed_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *;`,
      [
        req.session.user.id,
        generateRandomString(6),
        req.session.cart.totalPrice,
        req.session.cart.taxes,
        req.session.cart.taxes + req.session.cart.totalPrice,
      ]
    )
      .then((order) => {
        console.log("order inserted");
        const orderId = order.rows[0].id;
        const orderItems = Object.values(req.session.cart.items);
        const query = insertItemsQueryGenerator(orderId, orderItems);

        return db.query(query);
      })
      .then((result) => {
        delete req.session.cart;
        res.redirect("/menu");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
