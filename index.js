const express = require("express");
const helmet = require("helmet");
const knex = require("knex");
const knexConfig = require("./knexfile");

// init server
const server = express();

// init knex dev db connection with sqlite3
const db = knex(knexConfig.development);

// middleware inits
server.use(express.json());
server.use(helmet());

server.post("/api/cohorts", (req, res) => {
  const { name } = req.body;
  const cohort = { name };
  db.insert(cohort)
    .into("cohorts")
    .then(postedCohort => res.status(201).json(postedCohort))
    .catch(err => res.status(500).json(err));
});

server.get("/api/cohorts", (req, res) => {
  db("cohorts")
    .then(cohorts => res.status(200).json(cohorts))
    .catch(err => res.status(500).json(err));
});

server.get("/api/cohorts/:id", (req, res) => {
  const { id } = req.params;
  db("cohorts")
    .where({ id })
    .first()
    .then(cohort => res.status(200).json(cohort))
    .catch(err => res.status(500).json(err));
});

server.get("/api/cohorts/:id/students", async (req, res) => {
  const { id } = req.params;
  const students = await db("students").where({ cohort_id: id });
  res.status(200).json(students);
});

server.put("/api/cohorts/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const cohort = { name };
  db("cohorts")
    .where({ id })
    .update(cohort)
    .then(bool => res.status(200).json(bool))
    .catch(err => res.status(500).json(err));
});

server.delete("/api/cohorts/:id", (req, res) => {
  const { id } = req.params;
  db("cohorts")
    .where({ id })
    .del()
    .then(bool => res.status(200).json(bool))
    .catch(err => res.status(200).json(err));
});

server.get("/api/students", (req, res) => {
  db("students")
    .then(students => res.status(200).json(students))
    .catch(err => res.status(500).json(err));
});

server.get("/api/students/:id", (req, res) => {
  const { id } = req.params;
  db("students")
    .where({ id })
    .first()
    .then(student => res.status(200).json(student))
    .catch(err => res.status(500).json(err));
});

server.post('/api/students/', (req, res) => {
  const {name, cohort_id} = req.body;
  const student = {name, cohort_id};
  db.insert(student)
    .into('students')
    .then(newStudent => res.status(201).json(newStudent))
    .catch(err => res.status(500).json(err));
});

// init server listener
server.listen(9000, () => console.log(`API running on port 9000`));
