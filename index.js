const express = require('express');
const cors = require('cors');
const items = require('./app/items');
const categories = require('./app/categories');
const locations = require('./app/locations');
const fileDb = require('./fileDb');

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.use('/items', items);
app.use('/categories', categories);
app.use('/locations', locations);

const run = async () => {
  await fileDb.init();

  app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
  });
};

run().catch(e => {
  console.error(e);
});