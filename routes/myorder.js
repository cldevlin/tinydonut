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
  let reply;
  router.post('/', twilio.webhook({ validate: false }), function (req, res) {
    reply = req.body.Body;
    console.log(reply);
    db.query(`SELECT phone FROM users WHERE id=18;`)
      .then(data => {
        sendReply(reply, data.rows[0].phone);
      });
  });

  router.get("/", (req, res) => {
    db.query(`SELECT donuts.name AS donut, users.name AS user, order_items.quantity FROM donuts JOIN order_items ON donuts.id= order_items.donut_id JOIN orders ON orders.id = order_items.order_id JOIN users ON orders.user_id = users.id WHERE orders.id = 5;`)
      .then(data => {
        console.log(data.rows);
        let sms = '';
        for (let i of data.rows) {
          sms += (`${i.donut} -> ${i.quantity} \n`);
        }
        sendToRestaurant(2899903232, data.rows[0].user, sms)
          .then(message => {
            const templateVars = { message, user: req.session.user_id };
            res.render('myorder', templateVars);
          });


      });

  });
  return router;
};
