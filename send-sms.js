require('dotenv').config();
const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);

const sendToRestaurant = (number, name, email, sms) => {
  return client.messages.create({
    to: `+1${number}`,
    from: '+16474931524',
    body: `Order for ${name} (${email}): ${sms}`,
  });
};
const sendReply = (name,time, number) => {
  client.messages.create({
    to: `+1${number}`,
    from: '+16474931524',
    body: `${name}! Your order will be ready in ${time} minutes! Hurry!`
  });
};

const orderReady = (number) => {
  client.messages.create({
    to: `+1${number}`,
    from: '+16474931524',
    body: `Your order is ready for pickup`
  });
};
module.exports = { sendToRestaurant, sendReply, orderReady };





