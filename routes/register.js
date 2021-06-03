const { addUser } = require("../database");
const express = require("express");
const router = express.Router();

module.exports = () => {
  router.get("/", (req, res) => {
    res.render("register");
  });
  router.post("/", (req, res) => {
    // add cookies here
    const newUser = req.body;
    console.log("req.body-------- ", req.body);

    if (
      !newUser.name ||
      !newUser.email ||
      !newUser.phone ||
      !newUser.password
    ) {
      res.statusCode = 403;
      return res.send(
        "<html><h1>Error: Please fill out all fields</h1></html>"
      );
    }

    addUser(newUser)
      .then((user) => {
        // eslint-disable-next-line camelcase
        req.session.user = {
          id: user.id,
          name: user.name,
          photo_url: user.photo_url,
        };
        res.redirect("/menu");
      })
      .catch((e) => res.send(e));
    //console.log('THIS IS USER!!!!', newUser);
    // res.redirect('/menu');
  });
  return router;
};
