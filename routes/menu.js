const express = require("express");
const router = express.Router();

// $(document).ready(function() {
//   if ($(".new-tweet").prop("clientHeight") > 0) {
//     $(".new-tweet").slideUp("fast", "linear");
//   } else {
//     $(".new-tweet").slideDown("fast", "linear");
//     $("#tweet-text").focus();
//   }
// }

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM donuts;`)
      .then((data) => {
        const donuts = data.rows;
        // res.json({ donuts });
        const templateVars = { donuts, user: req.session.user_id };  // STRETCH: use jquery to pass user object into templateVars
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
