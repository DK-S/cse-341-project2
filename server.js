const express = require('express');
const path = require('path');
const pg = require('pg');
const ejs = require('ejs');
const { parse } = require('querystring');
const url = require('url');

const PORT = process.env.PORT || 5000;

express()
  .set("port", PORT)
  .use(express.urlencoded())
  .use(express.json())
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

  .get('/', (req, res)=> res.render('pages/index'))


  .listen(PORT, () =>{console.log("Now listening on port: ", PORT);})

