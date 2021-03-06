// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const cookieSession = require("cookie-session");
const http = require("http");
const app = express();
const morgan = require("morgan");

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use(express.static("public"));

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded",
  })
);
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));
// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const menuRoutes = require("./routes/menu");
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");
const logoutRoute = require("./routes/logout");
const clearCartRoute = require("./routes/clearCart");
const cartRoute = require("./routes/cart");
const smsRoute = require("./routes/myorder");
// const submitRoute = require("./routes/submit");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own

app.use("/api/users", usersRoutes(db));
app.use("/api/menu", menuRoutes(db));
app.use("/menu", menuRoutes(db));
app.use("/login", loginRoute(db));
app.use("/register", registerRoute(db));
app.use("/logout", logoutRoute(db));
app.use("/api/widgets", widgetsRoutes(db));
app.use("/cart", cartRoute(db));
app.use("/menu", menuRoutes(db));
app.use("/myorder", smsRoute(db));
app.use("/clearCart", clearCartRoute(db));

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  res.redirect("/login");
});

http
  .createServer(app)
  .listen(PORT, () => console.log(`Example app listening on port ${PORT}`));
