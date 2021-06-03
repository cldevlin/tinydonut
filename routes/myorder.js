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
    db.query(`SELECT donuts.name AS donut, users.name AS user, order_items.quantity, orders.order_status, orders.waiting_time FROM donuts JOIN order_items ON donuts.id= order_items.donut_id JOIN orders ON orders.id = order_items.order_id JOIN users ON orders.user_id = users.id WHERE users.id = ${req.session.user.id};`)
      .then(data => {
        console.log(data.rows[0].waiting_time, data.rows[0].order_status);
        const templateVars = {user: req.session.user.id, waiting_time: data.rows[0].waiting_time, status: data.rows[0].order_status };
        res.render('myorder', templateVars);
      });
  });
  return router;
};


