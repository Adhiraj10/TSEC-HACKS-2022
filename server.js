const connection = require('./connection');
const fs = require('fs')
const axios = require('axios');
const path = require('path');
const { JSDOM } = require('jsdom')
const express = require('express');
const app = express();
const port = 5000;

app.use([express.static(path.join(__dirname, 'static')), express.urlencoded({ extended: false })]);

const emailVerification = async (email) => {
   const key = `7cdf7108d0ea40d9828b8427ecc1942a`
   try {
      let response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${key}&email=${email}`);
      return (response.data.deliverability)
   } catch (error) {
      console.warn(error);
   }
}
app.post('/home', async (req, res) => {
   const { email, password } = req.body;
   let flag = await emailVerification(email);
   if (flag == 'DELIVERABLE') {
      let sql = `INSERT INTO signup values('${email}', '${password}')`;
      connection.query(sql, (err) => {
         if (err) throw err;
         else {
            console.log('Data Inserted Successfully');
            res.sendFile(path.join(__dirname, 'static/home.html'))
         }

      })
   }
   else {
      res.redirect('/signup.html');
   }
})

app.all('*', (req, res) => {
   res.status(404).send('<h1>PAGE NOT FOUND<h1>');
})

app.listen(port, () => {
   console.log(`App running on port ${port}`);
})