const express = require('express');
const path = require('path');
const pg = require('pg');

const { Pool } = require('pg');
//const connectionString = process.env.DATABASE_URL || "postgres://papai:Vitoria@localhost:5433/papai";
const connectionString = process.env.DATABASE_URL || "postgres://gbczdsokypniwz:092a1d25740fe968bc63b4315873510dd21cc0ad4dac65615596489aeca3abc9@ec2-54-89-49-242.compute-1.amazonaws.com:5432/d6btksl1k7f1ht";
const pool = new Pool({connectionString: connectionString, ssl: { rejectUnauthorized: false }});

const ejs = require('ejs');
const { parse } = require('querystring');
const url = require('url');

const PORT = process.env.PORT || 5000;

const app=express();

  app.set("port", PORT);
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.get('/', (req, res)=> res.render('pages/index'));
  app.get('/getusers', getUsers);
  app.post('/putuser', putUser);
  app.post('/deleteuser', deleteUser);

  app.listen(PORT, () =>{console.log("Now listening on port: ", PORT);});
  


  //----------Functions--------------

  function getUsers(req, res){
    var id = req.query.id;
    console.log(id);
    if (id){
      getUserfromDB(id, (error, result)=>{
        res.json(result[0]);
      });
    } else {
      getUsersfromDB((error, result)=>{
        res.json(result);
      });
    }
  } 

  function getUserfromDB(id, callback){
    var sql = 'SELECT * FROM users WHERE id=$1::int';
    var params = [id];
    pool.query(sql, params, (err, res)=>{
      if(err){
        console.log("Error in look up");
        console.log(err);
        callback(err, null);
      } 
      //console.log(res.rows);
      callback(null, res.rows);
    });
  }

  function getUsersfromDB(callback){
    var sql = 'SELECT * FROM users';
    var params = [];
    pool.query(sql, params, (err, res)=>{
      if(err){
        console.log("Error in look up");
        console.log(err);
        callback(err, null);
      } 
      //console.log(res.rows);
      callback(null, res.rows);
    });
  } 
 
  function putUser(req, res){
    console.log(req.query);
    var id = req.query.id;
    var fName = req.query.fname;
    var lName = req.query.lname;
    var uName = req.query.username;
    var pass = req.query.password;
    var admin = req.query.admin;
    
    if (id){
      var sql = "UPDATE users SET firstname=$1::varchar(25), lastname=$2::varchar(25) WHERE id=$3::int";
      var params = [fName, lName, id];
    }else{
      var sql = 'INSERT INTO users (firstname, lastname) VALUES ($1::varchar(25), $2::varchar(25));';  
      var params = [fName, lName];
    }
    console.log(sql, params)
    pool.query(sql, params, (err, res)=>{
      if(err){
        console.log(err);
        //callback(err, null);
      }
      //callback(null, 1);
    });
  }

  function deleteUser(req, res){
    var id= req.query.id;
    if (id){
      var sql = "DELETE FROM users WHERE id=$1::int";
      var params = [id];
      pool.query(sql,params, (err, res)=>{
        if(err){
          //callback(err, null)
        }
        //callback(null, res.rows);
      });
    }
  }



  //Done:Create the header in head.ejs Done:test
  //Done:finish the index.ejs with blank section Loading.... Done:test
  //Done:Add javascript AJAX to populate users list Done:test
  //Done:add javascript AJAX to open a new user form Done:test
  //Done:add javascript AJAX to send the new user to the server Done:test

  //Done:add webservice to pose new user and add to db Done:test
  //Done:add webservice to get user list DONE:test
  //Done:add webservice to post user and update the db Done:test
  //Done:add webservice to post user and delete from db Done:test
  
  //TODO:add webservice to get list of mediatpes TODO:test
  
  //TODO:add webservice to get library (with search criteria) TODO:test
  //TODO:add webservice to post library and add to the db TODO:test
  //TODO:add webservice to post library item and update the db TODO:test
  //TODO:add webservice tp post library item and delete from db TODO:test

  //TODO:add AJAX to open the library list TODO:test
  //TODO:add AJAX to open the new video form TODO:test
  //TODO:add AJAX to open the library for checkedout items TODO:test
  //



