const express = require('express');
const db = require('../db/index.js');
const router = express.Router();

//get 10 most popular movie/ get movie for the searched term.
router.get('/', async (req, res, next) => {
  try {
    const queryVal = req.query.type;
    if (queryVal == 'search') {
      const searchTerm = req.query.term;
      const result = await db.query(
        'select id, title,rating, release_year, description from movies where title ilike $1',
        [`%${searchTerm}%`]
      );
        if(req.accepts('text/html')){
            res.render('searchMovies', {
            brandname: 'Rotten Mangoes',
            name: searchTerm,
            list: result.rows
          });
        }else{
          res.json(result.rows);
        }
      
    } else {
      const result = await db.query(
        'select id, title,rating, release_year, description from movies order by rating desc limit  10 '
      );

      const resultGener = await db.query('select id,type from gener');

      const movieYear = await db.query(
        'select m.id, m.title, m.rating, m.release_year from movies m inner join (select release_year, max(rating) as maxrating from movies group by release_year) a on  a.release_year= m.release_year and a.maxrating=m.rating where m.release_year > $1 order by release_year desc ',
        [2002]
      );

      const movieYearResult = movieYear.rows.reduce((obj, item) => {
        obj[item.release_year] = item;
        return obj;
      }, {});
      var yearList = movieYear.rows.reduce((arr, item) => {
        arr.push(item.release_year);
        return arr;
      }, []);

      if(req.accepts('text/html')){
          res.render('popularMovies', {
          brandname: 'Rotten Mangoes',
          name: 'POPULAR MOVIES OF ALL TIME',
          list: result.rows,
          nameGener: 'TOP HUNDERED MOVIES BY GENRE',
          listGener: resultGener.rows,
          nameYear: 'BEST MOVIE BY YEAR',
          listYear: movieYearResult,
          yearList: yearList
        });
      } else{
        return res.json({
          popularMovies: result.rows,
          generMovies: resultGener.rows,
          yearBaseMovies:movieYearResult,
          listOfYears:yearList
        });
      }
    }
  } catch (e) {
    console.log(e);
    return next(e);
  }
});

//get details of the selected movie
router.get('/:id', async (req, res, next) => {
  try {
    console.log("I am here");
    const moviedetails = await db.query(
      `select id, title, rating,release_year, description from movies where id= ${
        req.params.id
      }`
    );

    const personDetails = await db.query(
      `select p.name, p.image  from  person p left join  movie_person mp on p.id = mp.person_id where mp.movie_id=${
        req.params.id
      }`
    );

    var result = {
      moviedetails: moviedetails.rows[0],
      personDetails: personDetails.rows
    };

    var director = personDetails.rows.filter(item => {
      return item.role == 'director';
    });
    // var actors = personDetails.rows.filter(item => {
    //   return item.role == null;
    // });
    // console.log(result);

    if(req.accepts('text/html')){
      return res.render('singleMovie', {
        brandname: 'Rotten Mangoes',
        name: 'Movie Details',
        title: result.moviedetails.title,
        rating: result.moviedetails.rating,
        release_year: result.moviedetails.release_year,
        director: director,
        list: result.personDetails,
        description: result.moviedetails.description
      });

    }else{
      return res.json(result.rows);

    }
    
  } catch (err) {
    // console.log(err);
    return next(err);
  }
});

//get movies by genre

router.get('/genre/:id', async (req, res, next) => {
  try {
    var generId = req.params.id;
    var generName = await db.query('select type from gener where id=$1', [
      req.params.id
    ]);
    var result = await db.query(
      'select m.id, m.title,m.rating,m.release_year,m.description from movies m join movie_genre mg on mg.movie_id = m.id where mg.genre_id = $1',
      [generId]
    );
    // console.log('GENRE RESULT', result.rows);
    if(req.accepts('text/html')){
      return res.render('generMovieList', {
        brandname: 'Rotten Mangoes',
        name: `TOP 100 ${generName.rows[0].type} MOVIES`,
        list: result.rows
      });
    }else{
      return res.json(result.rows);

    }
    
  } catch (e) {
    console.log(e);
    return next(e);
  }
});

//insert into movies table;

router.post('/', async (req, res, next) => {
  console.log(req.body.title);
  var result = await db.query(
    'insert into movies (title,rating,release_year) values($1,$2,$3) returning *',
    [req.body.title, req.body.rating, req.body.release_year]
  );
  return res.json(result.rows);
});

module.exports = router;

// {"title":"AAP",
// "rating":5,
// "release_year":"2008"}
