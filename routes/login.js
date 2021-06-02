const { getUserWithEmail } = require("../database");
const express = require("express");
const router = express.Router();

const login = function (email, password) {
  return getUserWithEmail(email).then((user) => {
    if (!user || password !== user.password) {
      return null;
    } else {
      return user;
    }
  });
};

module.exports = () => {
  router.get("/", (req, res) => {
    if (req.session.user_id) {
      return res.redirect("/menu");
    }
    res.render("login");
  });

  router.post("/", (req, res) => {
    const { email, password } = req.body;
    login(email, password)
      .then((user) => {
        console.log("LINE 25 -------->", user);
        if (!user) {
          res.statusCode = 403;
          return res.send("<html><h1>Error: Wrong password</h1></html>");
        }
        req.session.user = {
          id: user.id,
          name: user.name,
        };
        res.redirect("/menu");
      })
      .catch((e) => res.send(e));
  });
  return router;
};
