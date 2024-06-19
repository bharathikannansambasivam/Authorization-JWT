const express = require("express");
const mongoose = require("mongoose");
const { MONGO_URL, PORT } = require("./config");
const userModel = require("./model/model");
const bcrypt = require("bcrypt");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());

app.post("/register", async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = {
      username: req.body.username,
      password: hashPassword,
    };

    const createUser = await userModel.create(newUser);
    return res.send(createUser);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userModel.findOne({ username });

    if (!user) {
      console.log("User not found");
      return res.status(401).send("Incorrect Username or Password");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Password does not match");
      return res.status(401).send("Incorrect Username or Password");
    }

    const token = jwt.sign({ user }, "Secretkey@123", {
      expiresIn: "1h",
    });

    res.send(`User logged in successfully and the Token is ${token}`);
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  }
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("DB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.log(e.message);
  });
