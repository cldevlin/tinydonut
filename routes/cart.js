const express = require("express");
const sqlFormat = require("pg-format");
const { sendToRestaurant } = require('../send-sms');
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
      "INSERT INTO order_items (order_id, donut_id, quantity) VALUES %L RETURNING *;",
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
        db.query(`SELECT donuts.name AS donut, users.name AS user, order_items.quantity, orders.order_status, orders.waiting_time, users.email AS email FROM donuts JOIN order_items ON donuts.id= order_items.donut_id JOIN orders ON orders.id = order_items.order_id JOIN users ON orders.user_id = users.id WHERE orders.id = $1 AND order_status = 0;`, [result.rows[0].order_id])
          .then(data => {
            let sms = '';
            for (let i of data.rows) {
              sms += (`${i.donut} -> ${i.quantity} \n`);
            }
            return sendToRestaurant(2899903232, data.rows[0].user, data.rows[0].email, sms);
          });


        res.redirect("myorder");
        // res.redirect("/submit");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
