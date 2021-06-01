const express = require("express");
const router = express.Router();
const twilio = require('twilio');
const accountSid = 'ACfd94ea29d362f69c15606f58f76b80be';
const authToken = '9aec714628d95462ff774be8f0b12800';
const client = require('twilio')(accountSid, authToken);

const sendReply = (reply) => {
  client.messages.create({
    to: '+12899903232',
    from: '+16474931524',
    body: `This is a ${reply}`
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
    res.send(reply);
  });
  return router;
};
