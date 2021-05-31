const express = require('express');
const router = express.Router();

module.exports = () => {
  router.get('/', (req, res) => {
    // add if statement (if user_id cookie is present) ---> redirect to /menu
    res.render('login');
  });
  router.post('/', (req, res) => {
    // add cookies here
    res.redirect('/menu');
  });
  return router;
};
