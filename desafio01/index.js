const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

let count = 0;

function countRequests(req, res, next) {
  count++;
  console.log(`Total de Requisições: ${count}`);
  return next();
}

function checkIdProject(req, res, next) {
  const id = req.params.id;

  projeto = projects.find((proj, index) => {
    if (proj.id === id) {
      req.index = index;
      req.projeto = proj;
      return true;
    } else {
      return false;
    }
  });

  if (!projeto) {
    return res.status(400).json({ error: "Este projeto não existe" });
  }

  return next();
}

server.get("/projects", countRequests, (req, res) => {
  return projects.length > 0
    ? res.json(projects)
    : res.json({ message: "Nenhum projeto encontrado." });
});

server.post("/projects", countRequests, (req, res) => {
  const { id, title, tasks } = req.body;
  projeto = {
    id,
    title,
    tasks
  };
  projects.push(projeto);

  return res.json(projects);
});

server.post(
  "/projects/:id/tasks",
  countRequests,
  checkIdProject,
  (req, res) => {
    const { title } = req.body;
    tasks = req.projeto.tasks;

    tasks.push(title);

    projects[req.index].tasks = tasks;

    return res.json(projects);
  }
);

server.put("/projects/:id", countRequests, checkIdProject, (req, res) => {
  const { title } = req.body;

  index = req.index;
  projeto = req.projeto;

  if (projeto) {
    projects[index].title = title;
  }

  return res.json(projects);
});

server.delete("/projects/:id", countRequests, checkIdProject, (req, res) => {
  projects.splice(req.index, 1);
  return res.json({ message: "Projeto excluído com sucesso." });
});

server.listen(3000);
