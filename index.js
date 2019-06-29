const express = require("express");

const server = express();

server.use(express.json());

const users = ["Vitor", "Paulo", "João"];

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd("Request");
});

function checkUsersExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next();
}

function checkUsersInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }

  req.user = user;

  return next();
}

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUsersInArray, (req, res) => {
  const { index } = req.params;

  return res.json(req.user);
});

server.post("/users", checkUsersExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put("/users/:index", checkUsersInArray, checkUsersExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;
});

server.delete("/users/:index", checkUsersInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
});

server.listen(3000);
