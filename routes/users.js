const express = require("express");
const route = express.Router();
const fs = require("node:fs");

const users = JSON.parse(fs.readFileSync("./users.json"));

route
  .get("/", (req, res) => {
    res.send(users);
  })

  .post("/", (req, res) => {
    const newUser = {
      id: Date.now(),
      email: req.body.email,
      password: req.body.password,
    };
    users.push(newUser);
    fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));
    res.send("User created successfully.");
  });

route
  .get("/:id", (req, res) => {
    const user = users.filter((user) => user.id === +req.params.id)[0];
    if (!user) {
      return res.send("User not found.");
    }
    res.send(user);
  })

  .patch("/:id", (req, res) => {
    const userIndex = users.findIndex((user) => user.id === +req.params.id);
    const user = users[userIndex];

    if (!users[userIndex]) {
      return res.send("User not found.");
    }
    const { email, password } = req.body;
    user.email = email || user.email;
    user.password = password || user.password;

    users.splice(userIndex, 1, user);
    fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));
    res.send("User updated successfully.");
  })

  .delete("/:id", (req, res) => {
    const userIndex = users.findIndex((user) => user.id === +req.params.id);

    if (!users[userIndex]) {
      return res.send("User not found.");
    }

    users.splice(userIndex, 1);
    fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));
    res.send("User deleted successfully.");
  });

module.exports = route;
