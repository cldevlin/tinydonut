const accountSid = 'ACfd94ea29d362f69c15606f58f76b80be';
const authToken = '9aec714628d95462ff774be8f0b12800';

const client = require('twilio')(accountSid, authToken);

client.messages.create({
  to: '+12899903232',
  from: '+16474931524',
  body: 'This is a TEST'
});
// .then((message) => console.log(message.sid));





