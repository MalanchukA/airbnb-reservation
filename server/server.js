const express = require('express');

const app = express();
const port = 3002;
const bodyParser = require('body-parser');
const path = require('path');

const request = require('supertest');

const cors = require('cors');
var compression = require('compression')
const controllers = require('./controllers.js');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }
  // fallback to standard filter function
  return compression.filter(req, res);
}

app.use(compression({ filter: shouldCompress }));

app.use('/', express.static(path.join(__dirname, '../dist')));
app.use('/:id', express.static(path.join(__dirname, '../dist')));

app.get('/houses/:id', (req, res) => {
  controllers.getHouse(req, res);
});

app.get('/dates/:id', (req, res) => {
  controllers.getDates(req, res);
});

// Test to check server responses using request supertest
request(app)
  .get('/houses/1')
  .expect('Content-Type', /json/)
  .expect(200)
  .end((err) => {
    if (err) {
      throw err;
    }
  });
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
