const express = require('express');
const router = express.Router();

module.exports = () => {
  router.get('/', (req, res) => {
    res.render('register');
  });
  router.post('/', (req, res) => {
    // add cookies here
    const user = req.body;
    console.log('THIS IS USER!!!!', user);
    res.redirect('/menu');
  });
  return router;
};
