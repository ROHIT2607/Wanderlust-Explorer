if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// Requiring Packages
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const dbUrl = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
}

// Creating mongoose connection
main()
  .then((res) => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error", err);
});

// Creating Sessions and Cookie
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// Root Directory
// app.get("/", (req, res) => {
//   console.log("Hi, I'm Root");
//   res.send(`Hello I m Root`);
// });

// Using Session and flash
app.use(session(sessionOptions));
app.use(flash());

// Using passport for saving password
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Getting flash message
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Get the all routes of listings and reviews
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// If Page not Found
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});

// Listening on Port
app.listen(8080, () => {
  console.log("Server is Listening to port 8080");
});
