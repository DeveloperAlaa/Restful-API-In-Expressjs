const express = require("express");

const route = express.Router();

const fs = require("node:fs");
const path = require("node:path");

const usersFilePath = path.join(__dirname, "../data/users.json");

route.use("/:id", (req, res, next) => {
  fs.readFile(usersFilePath, (err, data) => {
    if (err) {
      const err = new Error("File not found");
      err.statusCode = 404;
      return next(err);
    }
    const users = JSON.parse(data);
    const { id } = req.params;
    const userIndex = users.findIndex((user) => user.id === +id);
    let user = users[userIndex];
    if (!user) {
      return res.send("User not found ya bro.");
    }

    const userData = {
      index: userIndex,
      body: { ...user },
    };

    req.userData = userData;

    next();
  });
});

route
  .get("/", (req, res, next) => {
    fs.readFile(usersFilePath, (err, data) => {
      if (err) {
        const err = new Error("File not found");
        err.statusCode = 404;
        console.log(err);
        return next(err);
      }
      const users = JSON.parse(data);
      res.send(users);
    });
  })

  .post("/", (req, res, next) => {
    fs.readFile(usersFilePath, (err, data) => {
      if (err) {
        const err = new Error("File not found");
        err.statusCode = 404;
        return next(err);
      }
      const users = JSON.parse(data);

      const newUser = {
        id: Date.now(),
        ...req.body,
      };

      users.push(newUser);
      const usersString = JSON.stringify(users, null, 2);
      fs.writeFile(usersFilePath, usersString, (err) => {
        if (err) {
          next(err);
          return;
        }
      });
      res.send("User created successfully.");
    });
  });

route
  .get("/:id", (req, res, next) => {
    fs.readFile(usersFilePath, (err, data) => {
      if (err) {
        const err = new Error("File not found");
        err.statusCode = 404;
        return next(err);
      }

      const user = req.userData.body;
      res.send(user);
    });
  })

  .patch("/:id", (req, res) => {
    fs.readFile(usersFilePath, (err, data) => {
      if (err) {
        const err = new Error("File not found");
        err.statusCode = 404;
        return next(err);
      }
      const users = JSON.parse(data);

      const userToUpdateIndex = req.userData.index;
      let userToUpdate = req.userData.body;

      userToUpdate = {
        ...userToUpdate,
        ...req.body,
      };

      users.splice(userToUpdateIndex, 1, userToUpdate);
      const usersString = JSON.stringify(users, null, 2);

      fs.writeFile(usersFilePath, usersString, (err) => {
        if (err) {
          next(err);
          return;
        }
      });
      res.send("User updated successfully.");
    });
  })

  .delete("/:id", (req, res) => {
    fs.readFile(usersFilePath, (err, data) => {
      if (err) {
        const err = new Error("File not found");
        err.statusCode = 404;
        return next(err);
      }
      const users = JSON.parse(data);

      const userToDeleteIndex = req.userData.index;

      users.splice(userToDeleteIndex, 1);
      const usersString = JSON.stringify(users, null, 2);

      fs.writeFile(usersFilePath, usersString, (err) => {
        if (err) {
          next(err);
          return;
        }
      });

      res.send("User deleted successfully.");
    });
  });

module.exports = route;
