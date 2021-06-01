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

    addUser(newUser)
      .then((user) => {
        req.session.user_id = user.id;
        res.redirect('/menu');
      })
      .catch((e) => res.send(e));
    //console.log('THIS IS USER!!!!', newUser);
    // res.redirect('/menu');
  });
  return router;
};
