// const accountSid = 'ACfd94ea29d362f69c15606f58f76b80be';
// const authToken = '9aec714628d95462ff774be8f0b12800';
// require('dotenv').config();
// const client = require('twilio')(accountSid, authToken);
require('dotenv').config();
const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);

const sendToRestaurant = () => {
  client.messages.create({
    to: '+12899903232',
    from: '+16474931524',
    body: `This is a TEST`
  });
};

sendToRestaurant();





