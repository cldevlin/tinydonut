/* eslint-disable camelcase */
const express = require("express");
const router = express.Router();
const twilio = require('twilio');
const { sendReply, orderReady } = require('../send-sms');


module.exports = (db) => {
  // twilio post request and sms logic
  router.post('/', twilio.webhook({ validate: false }), function (req, res) {
    let reply = req.body.Body;
    const array = reply.split(' ');
    const email = array[0];
    const time = array[1];
    db.query(`UPDATE orders SET waiting_time = $1 FROM users WHERE users.id = orders.user_id and users.email = $2;`, [time, email])
      .then(() => {
        return db.query(`SELECT phone, name FROM users WHERE email=$1;`, [email]);
      })
      .then((data) => {
        return sendReply(data.rows[0].name, time, data.rows[0].phone);
      })
      .then(() => {
        setTimeout(() => {
          return db.query(`UPDATE orders SET order_status = 1 FROM users WHERE users.id = orders.user_id and users.email = $1;`, [email]);
        }, Number(time) * 60000);
      })
      .then(() => {
        return db.query(`SELECT phone, name FROM users WHERE email=$1;`, [email]);
      })
      .then(data => {
        setTimeout(() => {
          orderReady(data.rows[0].phone);
        }, Number(time) * 60000);
      });
  });

  // render myorder page with order infromation and waiting time
  router.get("/", (req, res) => {
    if (!req.session.user) {
      res.redirect("/login");
    }

    db.query(
      `SELECT orders.*, count(order_items.*) AS quantity
    FROM orders
    JOIN order_items ON order_items.order_id = orders.id
    WHERE orders.user_id = $1
    GROUP BY orders.id
    ORDER BY orders.id DESC;`,
      [req.session.user.id]
    ).then((orders) => {
      const templateVars = {
        order_no: orders.rows[0].order_no,
        waiting_time: orders.rows[0].waiting_time,
        status: orders.rows[0].order_status,
        data: orders.rows,
      };
      res.render("myorder", templateVars);
    });
  });
  return router;
};
