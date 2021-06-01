const express = require("express");
const router = express.Router();


module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM donuts;`)
      .then((data) => {
        const donuts = data.rows;
        // res.json({ donuts });
        const templateVars = { donuts };
        res.render("menu", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
    // req.session['cakedonut'] = 'test';
    // console.log(req.session);
  });

  // router.post("/", (req, res) => {
  //   res.status(200);
  // });

  return router;
};
