const express = require('express');
const router = express.Router();
const db = require('../db');

//insert into table movie_person;
router.post('/', async (req, res, next) => {
  try {
    const result = await db.query(
      'insert into movie_person (movie_id,person_id,role) values($1,$2,$3) returning*',
      [req.body.movie_id, req.body.person_id, req.body.role]
    );
    return res.json(result.rows);
  } catch (e) {
    console.log(e);
    return next(e);
  }
});

module.exports = router;
