const express = require("express");
const app = express();
const users = require("./routes/user.js");
const post = require("./routes/post.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
app.use(cookieParser());

// app.use("/users", users);
// app.use("/", post);

// app.get("/getcookies", (req, res) => {
//   res.cookie("Greet", "Hello");
//   res.send("Sent you cookies");
// });

// app.get("/", (req, res) => {
//   console.dir(req.cookies);
//   res.send("Hi Root here");
// });

const sessionOption ={
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOption));

app.get("/register", (req, res) => {
  let { name } = req.query;
  res.send(name);
});

// app.get("/test", (req, res) => {
//   res.send("test successful");
// });

// app.get("/reqcount", (req, res) => {
//   if(req.session.count){
//     req.session.count++;
//   }else{
//     req.session.count=1;
//   }
//   res.send(`You send a request ${req.session.count}`);
// });

app.listen(3000, () => {
  console.log("Listening");
});
