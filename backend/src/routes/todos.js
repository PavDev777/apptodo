const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM todos');
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { title } = req.body;
  const result = await db.query('INSERT INTO todos(title) VALUES($1) RETURNING *', [title]);
  res.status(201).json(result.rows[0]);
});

module.exports = router;