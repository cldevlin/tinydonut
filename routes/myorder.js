/* eslint-disable camelcase */
const express = require("express");
const router = express.Router();
const twilio = require('twilio');
const { sendReply, orderReady } = require('../send-sms');




module.exports = (db) => {
  router.post('/', twilio.webhook({ validate: false }), function (req, res) {
    let reply = req.body.Body;
    db.query(`UPDATE orders SET order_status=1, waiting_time=${reply} WHERE user_id = $1;`, [16]);
    db.query(`SELECT phone FROM users WHERE id=$1;`, [16])
      .then(data => {
        sendReply(reply, data.rows[0].phone);
        setTimeout(() => {
          orderReady(data.rows[0].phone);
        }, Number(reply) * 60000);
      });
  });

  router.get("/", (req, res) => {
    db.query(`SELECT donuts.name AS donut, users.name AS user, order_items.quantity, orders.order_status, orders.waiting_time FROM donuts JOIN order_items ON donuts.id= order_items.donut_id JOIN orders ON orders.id = order_items.order_id JOIN users ON orders.user_id = users.id WHERE users.id = 16;`)
      .then(data => {
        console.log(data.rows[0].waiting_time, data.rows[0].order_status);
        const templateVars = {user: req.session.user.id, waiting_time: data.rows[0].waiting_time, status: data.rows[0].order_status };
        res.render('myorder', templateVars);
      });
  });
  return router;
};


