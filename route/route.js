const express = require("express");
const Users = require("../model/model");
const route = express.oute();

route.get("/", async (req, res) => {
  try {
    const user = await Users.find();
    res.send();
  } catch (e) {
    console.log(e.message);
  }
});
