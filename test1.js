require("dotenv").config();

const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");

app.use(express.json());

const posts = [
  {
    username: "BK",
    title: "post 01",
  },
  {
    username: "PIKACHU",
    title: "post 02",
  },
];
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.user));
});

app.post("/login", (req, res) => {
  const username = req.body.username;

  const user = { user: username };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);
  res.json({ accessToken: accessToken });
});

app.listen(3000, () => {
  console.log("Port Run on 3000");
});
