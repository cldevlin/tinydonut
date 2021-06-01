const express = require("express");
const router = express.Router();
const twilio = require('twilio');
const client = require('twilio')(process.env.ACCOUNTSID ,process.env.AUTHTOKEN);

const sendReply = (reply) => {
  client.messages.create({
    to: '+12899903232',
    from: '+16474931524',
    body: `Your order will be ready in ${reply} minutes!`
  });
};

module.exports = () => {
  let reply;
  router.post('/', twilio.webhook({validate: false}), function(req, res) {
    console.log("IMPORTANT------->>>>>", req.body.Body);
    reply = req.body.Body;
    sendReply(reply);
  });

  router.get("/", (req, res) => {
    res.render('myorder');
  });
  return router;
};
