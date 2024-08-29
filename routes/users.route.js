const express = require("express");
const route = express.Router();
const fs = require("node:fs");

const users = JSON.parse(fs.readFileSync("./data/users.json"));

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
    fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));
    res.send("User created successfully.");
  });

route
  .get("/:id", (req, res) => {
    const { id } = req.params;
    const user = users.filter((user) => user.id === +id)[0];
    if (!user) {
      return res.send("User not found.");
    }
    res.send(user);
  })

  .patch("/:id", (req, res) => {
    const { id } = req.params;
    const userToUpdateIndex = users.findIndex((user) => user.id === +id);
    let userToUpdate = users[userToUpdateIndex];

    if (!userToUpdate) {
      return res.send("User not found.");
    }

    userToUpdate = {
      ...userToUpdate,
      ...req.body,
    };

    users.splice(userToUpdateIndex, 1, userToUpdate);
    fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));
    res.send("User updated successfully.");
  })

  .delete("/:id", (req, res) => {
    const { id } = req.params;
    const userToDeleteIndex = users.findIndex((user) => user.id === +id);

    if (!users[userToDeleteIndex]) {
      return res.send("User not found.");
    }

    users.splice(userToDeleteIndex, 1);
    fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));
    res.send("User deleted successfully.");
  });

module.exports = route;
