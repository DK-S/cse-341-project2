const db = require('./db');

function getUsers(req, res){
  var id = req.query.id;
  console.log("getting user " + id + " from the db");
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
  db.pool.query(sql, params, (err, res)=>{
    if(err){
      console.log("Error in look up");
      console.log(err);
      callback(err, null);
    } 
    if(res.rows){
      callback(null, res.rows);
    }else{
      callback(err, null);
    }
    //console.log(res.rows);
    //callback(null, res.rows);
  });
}

function getUsersfromDB(callback){
  var sql = 'SELECT * FROM users';
  var params = [];
  db.pool.query(sql, params, (err, res)=>{
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
  db.pool.query(sql, params, (err, res)=>{
    if(err){
      console.log(err);
      //callback(err, null);
    }
    //callback(null, 1);
  });
}

function deleteUser(req, res){
  var id= parseInt(req.query.id);
  if (id){
    if(id > 1){
      var sql = "DELETE FROM users WHERE id=$1::int";
      var params = [id];
      db.pool.query(sql,params, (err, res)=>{
        if(err){
          //callback(err, null)
        }
        //callback(null, res.rows);
      });
    }
  }
}

module.exports = {
  getUsers: getUsers,
  putUser: putUser,
  deleteUser: deleteUser
}