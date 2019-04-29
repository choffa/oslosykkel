const express = require('express');
const serveStatic = require('serve-static');
const util = require('./server/util')

const app = express();

app.use(serveStatic(__dirname + "/dist"));

app.get('/api/stations/:city', (req, res) => {
  util.getStations(req.params.city)
    .then(data => res.json(data))
    .catch((err) => {
      console.error(err);
      res.status(502).send('Could not get data from API');
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);

console.log('server started ' + PORT);