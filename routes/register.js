const {addUser} = require('../database');
const express = require('express');
const router = express.Router();

module.exports = () => {
  router.get('/', (req, res) => {
    res.render('register');
  });
  router.post('/', (req, res) => {
    // add cookies here
    const newUser = req.body;
    console.log(req.session);
    addUser(newUser)
      .then((user) => {
        console.log("COOKIE OBJECT ------------>>>", req.session.user_id);
        req.session.user_id = user.id;
      });

    res.redirect('/menu');
  });
  return router;
};
