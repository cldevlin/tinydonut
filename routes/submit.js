const express = require("express");
const router = express.Router();
const { sendToRestaurant } = require('../send-sms');

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT donuts.name AS donut, users.name AS user, order_items.quantity, orders.order_status, orders.waiting_time FROM donuts JOIN order_items ON donuts.id= order_items.donut_id JOIN orders ON orders.id = order_items.order_id JOIN users ON orders.user_id = users.id WHERE orders.id = 4;`)
      .then(data => {
        let sms = '';
        for (let i of data.rows) {
          sms += (`${i.donut} -> ${i.quantity} \n`);
        }
        sendToRestaurant(2899903232, data.rows[0].user, sms);
        res.redirect("myorder");
      });
  });
  return router;
};
