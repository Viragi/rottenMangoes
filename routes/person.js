const express = require('express');
const router = express.Router();
const db = require('../db');

//insert into table person;
router.post('/', async (req, res, next) => {
  try {
    const result = await db.query(
      'insert into person (name,image) values($1,$2) returning*',
      [req.body.name, req.body.image]
    );
    return res.json(result.rows);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
