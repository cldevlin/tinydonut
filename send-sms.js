require('dotenv').config();
const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);

const sendToRestaurant = (number, name, sms) => {
  return client.messages.create({
    to: `+1${number}`,
    from: '+16474931524',
    body: `Order for ${name}: ${sms}`
  });
};
// sendToRestaurant();

module.exports = sendToRestaurant;





