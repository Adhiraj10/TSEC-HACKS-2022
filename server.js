const connection = require('./connection');
const path = require('path')
const express = require('express');
const app = express();
const port = 5000;

app.use([express.static(path.join(__dirname, 'static')), express.urlencoded({ extended: false })]);

app.get('*', (req, res) => {
   res.status(404).send('<h1>PAGE NOT FOUND<h1>');
})

app.listen(port, () => {
   console.log(`App running on port ${port}`);
})