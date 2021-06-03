require('dotenv').config();
const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);

const sendToRestaurant = (number, name, sms) => {
  return client.messages.create({
    to: `+1${number}`,
    from: '+16474931524',
    body: `Order for ${name}: ${sms}`,
  });
};
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
module.exports = { sendToRestaurant, sendReply, orderReady };





