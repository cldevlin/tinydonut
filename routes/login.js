const { getUserWithEmail } = require("../database");
const express = require("express");
const router = express.Router();

const login = function (email, password) {
  return getUserWithEmail(email).then((user) => {
    if (password === user.password) {
      return user;
    }
    return null;
  });
};

module.exports = () => {
  router.get("/", (req, res) => {
    // add if statement (if user_id cookie is present) ---> redirect to /menu
    res.render("login");
  });

  router.post("/", (req, res) => {
    // add cookies here
    const { email, password } = req.body;
    login(email, password)
      .then((user) => {
        console.log("LINE 25 -------->", user);
        if (!user) {
          console.log("Line 25: ",user);
          res.send({ error: "error" });
          return;
        }
        req.session.userId = user.id;
        res.redirect("/menu");
        // res.send({user: {name: user.name, email: user.email, id: user.id}});
      })
      .catch((e) => res.send(e));
  });
  return router;
};
