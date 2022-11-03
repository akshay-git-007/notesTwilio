const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const twilio = require("twilio");

dotenv.config();

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;

const client = new twilio(accountSid, authToken);

mongoose.connect(process.env.LINK, {
  useNewUrlParser: true
});

const querySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});



const Message = mongoose.model("Message", querySchema);


app.get("/", function(req, res) {
  res.render("index");
})

app.get("/query", function(req, res) {
  res.render("query");
})

app.post("/query", function(req, res) {
  const query1 = new Message({
    email: req.body.email,
    message: req.body.name
  });
  query1.save();
  client.messages
  .create({
    body: `Email: ${req.body.email} Message: ${req.body.name}`,
    to: process.env.ADMINNUMBER, // Text this number
    from: process.env.FROMNUMBER, // From a valid Twilio number
  });
  res.redirect("/");
});

app.get("/error", function(req, res) {
  res.render("error");
})
app.post("/error", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || "3000", function() {
  console.log("server is running on port 3000");
});