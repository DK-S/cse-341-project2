const express = require('express');
const path = require('path');
const pg = require('pg');

const ejs = require('ejs');
const { parse } = require('querystring');
const url = require('url');

const user = require('./modules/user');
const library = require('./modules/library');

const PORT = process.env.PORT || 5000;

const app=express();

  app.set("port", PORT);
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.get('/', (req, res)=> res.render('pages/index'));
  app.get('/getusers', user.getUsers);
  app.post('/putuser', user.putUser);
  app.post('/deleteuser', user.deleteUser);
  app.get('/getlibrary', library.getLibrary);
  app.get('/getmediatypes', library.getMediaType);
  app.post('/insertlibrary', library.insertLibrary);
  app.post('/updatelibrary', library.updateLibrary);
  app.post('/deletelibrary', library.deleteLibrary);


  app.listen(PORT, () =>{console.log("Now listening on port: ", PORT);});
  


  //----------Functions--------------

  //Done:Create the header in head.ejs Done:test
  //Done:finish the index.ejs with blank section Loading.... Done:test
  //Done:Add javascript AJAX to populate users list Done:test
  //Done:add javascript AJAX to open a new user form Done:test
  //Done:add javascript AJAX to send the new user to the server Done:test

  //Done:add webservice to pose new user and add to db Done:test
  //Done:add webservice to get user list DONE:test
  //Done:add webservice to post user and update the db Done:test
  //Done:add webservice to post user and delete from db Done:test
  
  //Done:add webservice to get list of mediatpes Done:test
  
  //Done:add webservice to get library (with search criteria) TODO:test
  //Done:add webservice to post library and add to the db Done:test
  //Done:add webservice to post library item and update the db Done:test
  //Done:add webservice tp post library item and delete from db Done:test

  //Done:add AJAX to open the library list Done:test
  //TODO:add AJAX to open the new video form TODO:test
  //TODO:add AJAX to open the library for checkedout items TODO:test
  //



