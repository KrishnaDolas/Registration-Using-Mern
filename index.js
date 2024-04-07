const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");

// https://www.youtube.com/watch?v=XOgwuTEWPWM

const app = express();
dotenv.config({path:'.env'});

const port = process.env.PORT || 3000;

let mongoURL = process.env.mongoURL

// const password = process.env.password;

mongoose.connect(mongoURL,
  {
    useNewUrlParser: true
  }
);

const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await Registration.findOne({ email: email });

    if (!existingUser) {
      const registrationData = new Registration({
        name,
        email,
        password,
      });
      await registrationData.save();
      res.redirect("/success");
    } else {
      console.log("User already exists");
      res.redirect("/error");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
});

app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "success.html"));
});

app.get("/error", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "error.html"));
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
