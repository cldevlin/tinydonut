const express = require('express');
const router = express.Router();

module.exports = () => {
  router.get('/', (req, res) => {
    // add if statement (if user_id cookie is present)
    res.render('register');
  });
  return router;
};
