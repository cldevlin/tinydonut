const express = require("express");
const router = express.Router();
const twilio = require('twilio');
const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
const sendToRestaurant = require('../send-sms');




module.exports = (db) => {

  const sendReply = (reply, number) => {
    client.messages.create({
      to: `+1${number}`,
      from: '+16474931524',
      body: `Your order will be ready in ${reply} minutes!`
    });
  };

  const orderReady = (number) => {
    client.messages.create({
      to: `+1${number}`,
      from: '+16474931524',
      body: `Your order is ready for pickup`
    });
  };
  let reply;
  router.post('/', twilio.webhook({ validate: false }), function (req, res) {
    reply = req.body.Body;
    // if (req.body.Body) {
    //   reply = req.body.Body;
    //   req.session.reply = { reply };
    // }
    db.query(`UPDATE orders SET order_status=1, waiting_time=${reply} WHERE id=4;`);
    db.query(`SELECT phone FROM users WHERE id=16;`)
      .then(data => {
        sendReply(reply, data.rows[0].phone);
        setTimeout(() => {
          orderReady(data.rows[0].phone);
        }, Number(reply) * 60000);
      });
  });

  router.get("/", (req, res) => {
    db.query(`SELECT donuts.name AS donut, users.name AS user, order_items.quantity, orders.order_status, orders.waiting_time FROM donuts JOIN order_items ON donuts.id= order_items.donut_id JOIN orders ON orders.id = order_items.order_id JOIN users ON orders.user_id = users.id WHERE orders.id = 4;`)
      .then(data => {
        console.log(data.rows);
        let sms = '';
        for (let i of data.rows) {
          sms += (`${i.donut} -> ${i.quantity} \n`);
        }
        sendToRestaurant(2899903232, data.rows[0].user, sms)
          .then(message => {
            const templateVars = { message, user: req.session.user_id, waiting_time: data.rows[0].waiting_time, status: data.rows[0].order_status };
            res.render('myorder', templateVars);
          });


      });

  });
  return router;
};
