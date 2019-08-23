const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const movieRoute = require('./routes/movies.js');
const personRoute = require('./routes/person.js');
const moviePersonRoute = require('./routes/moviePerson.js');

app.set('view engine', 'pug');

app.use(cors());
app.use(express.static('public'));
app.use(morgan('tiny'));
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use('/movies', movieRoute);
app.use('/person', personRoute);
app.use('/movie/person', moviePersonRoute);

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    err
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`application is running on port ${PORT}`);
});
