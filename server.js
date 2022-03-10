const connection = require('./connection');
const ejs = require('ejs')
const axios = require('axios');
const path = require('path');
const express = require('express');
const app = express();
const port = 5000;

app.set('view engine', 'ejs');
app.use([express.static(path.join(__dirname, 'static')), express.urlencoded({ extended: false })]);

const emailVerification = async (email) => {
   const key = `7cdf7108d0ea40d9828b8427ecc1942a`
   try {
      let response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${key}&email=${email}`);
      return (response.data.deliverability);
   } catch (error) {
      console.warn(error);
   }
}

const fetchProjects = async () => {
   try {
      let projects = await axios.get(`https://raw.githubusercontent.com/deepsourcelabs/good-first-issue/master/data/generated.sample.json`);
      return projects;
   } catch (error) {
      throw error;
   }
}

app.post('/main.html', async (req, res) => {
   const { email, password } = req.body;
   let flag = await emailVerification(email);
   if (flag == 'DELIVERABLE') {
      let sql = `INSERT INTO signup values('${email}', '${password}')`;
      connection.query(sql, (err) => {
         if (err) throw err;
         else {
            console.log('Data Inserted Successfully');
            res.sendFile(path.join(__dirname, 'static/main.html'))
         }

      })
   }
   else {
      res.redirect('/signup.html');
   }
})

app.get('/findev.ejs', async (req, res) => {
   let result = await fetchProjects();
   res.render('findev', { data: result.data })
})

app.get('/prof.html', (req, res) => {
   res.status(200).sendFile(path.join(__dirname, 'static/prof.html'))
})

app.all('*', (req, res) => {
   res.status(404).send('<h1>PAGE NOT FOUND<h1>');
})

app.listen(port, () => {
   console.log(`App running on port ${port}`);
})

