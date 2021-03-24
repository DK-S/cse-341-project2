const db = require('./db');

//Done:add webservice to get list of mediatpes Done:test
  
  //Done:add webservice to get library (with search criteria) TODO:test
  //Done:add webservice to post library and add to the db Done:test
  //Done:add webservice to post library item and update the db Done:test
  //Done:add webservice tp post library item and delete from db Done:test

  
  function getMediaType(req, res){
    var id= req.query.id;
    console.log("getting media type " + id + " from the db");
    if(id){
      getMediaTypeByID(id, (error, result)=>{
        res.json(result[0]);
      });
    }else{
      getAllMediaTypes((error, result) =>{
        console.log(result);
        res.json(result);
      });
    }
  }

  function getMediaTypeByID(id, callback){
    var sql = 'SELECT * FROM mediatypes WHERE id=$1::int';
    var params = [id];
    db.pool.query(sql, params, (err, res)=>{
      if(err){
        console.log("Error in lookup");
        console.log(err);
        callback(err, null);
      }
      if(res.rows){
        callback(null, res.rows);
      }else{
        callback(err, null);
      }
    })
  }

  function getAllMediaTypes(callback){
    var sql = 'SELECT * FROM mediatypes';
    var params = [];
    db.pool.query(sql, params, (err, res)=>{
      if(err){
        console.log(err);
        callback(err, null);
      }
      if(res.rows){
        console.log("Found: " + res.rows);
        callback(null, res.rows);
      } else {
        console.log("Found nothing: " + res.rows);
        callback(err, null);
      }
    });
  }

  function getLibrary(req, res){
    var id = req.query.id;
    var search = req.query.search;
    var checkedout = req.query.checkedout;
    var mediatypeid = req.query.mediatypeid;
    
    console.log("getting library from the db");

    if (id || search || checkedout || mediatypeid) {
      if (search != '' && mediatypeid > 0){
        console.log("Looking for both search and type");
        getFilteredLibrary(search, mediatypeid, (error, result)=>{
          res.json(result);
        });
      }else if (id) {
        console.log("Looking for id");
        getLibraryByID(id, (error, result)=>{
          res.json(result[0]);
        });
      }else if (search && search != ''){
        console.log("Looking for search");
        getFilteredLibrary(search, 0, (error, result)=>{
          res.json(result);
        });
      }else if (checkedout){
        console.log("Looking for checked out");
        getCheckedoutItems((error, result)=>{
          res.json(result);
        });
      }else if (mediatypeid){
        console.log("Looking for type");
        getFilteredLibrary('', mediatypeid, (error, result)=>{
          res.json(result);
        });
      }else {
        console.log("Error: I do not know how we got here!");
      }
      
    }else{
      getAllLibraries((error, result)=>{
        res.json(result);
      })
    }
  }

  function getAllLibraries(callback){
    var sql = getLibrarySQL();
    sql += ' ORDER BY title';
    var params = [];
    queryLibrary(sql, params, (err, res)=>{
      callback(err, res);
    });
  }

  function getLibrarySQL(){
    var sql = 'SELECT library.id as id';
    sql += ', library.upc';
    sql += ', library.title';
    sql += ', library.location';
    sql += ', library.private';
    sql += ', library.mediatypeid';
    sql += ', library.ownerid';
    sql += ', library.borrowerid';
    sql += ', mediatypes.type';
    sql += ', borrower.firstname';
    sql += ', borrower.lastname';
    sql += ' FROM library';
    sql += ' inner join mediatypes on mediatypes.id = library.mediatypeid';
    sql += ' left join users as borrower on borrower.id = library.borrowerid';
    return sql;
  }

  function queryLibrary(sql, params, callback){
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
    });
  }

  function getLibraryByID(id, callback){
    var sql = getLibrarySQL();
    sql += ' WHERE library.id=$1::int';
    sql += ' ORDER BY title';
    var params = [id];
    queryLibrary(sql, params, (err, res)=>{
      callback(err, res);
    });
  }

  function getFilteredLibrary(search='', mediatypeid=0, callback){
    var sql = getLibrarySQL() + ' WHERE ';
    if (search != '' && mediatypeid > 0){
      console.log("Looking for " + search + " and " + mediatypeid);
      sql += "(upc like concat('%',$1::varchar(50),'%') OR title like concat('%',$1::varchar(50),'%') OR location like concat('%',$1::varchar(50),'%') ) ";
      sql += "and (mediatypeid=$2::int)";
      var params = [search, mediatypeid]
    }else if (search != ''){
      console.log("Looking for " + search);
      sql += "(upc like concat('%',$1::varchar(50),'%') OR title like concat('%',$1::varchar(50),'%') OR location like concat('%',$1::varchar(50),'%')) ";
      var params = [search]
    }else{
      console.log("Looking for " + mediatypeid);
      sql += "(mediatypeid=$1::int)";
      var params = [mediatypeid]
    }
    console.log(sql, params);
    //var sql = "SELECT * FROM library inner join mediatypes on mediatypes.id = library.mediatypeid WHERE upc like '%'+$1::varchar(25)+'%' OR title like '%'+$1::varchar(50)+'%' OR location like '%'+$1::varchar(50)+'%' ";
    //var params = [searc];
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
    });
  }

  function getCheckedoutItems(callback){
    var sql = getLibrarySQL();
    sql += ' WHERE borrowerid IS NOT NULL';
    sql += ' ORDER BY title';
    var params = [];
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
    });
  }

  function getLibraryByMedia(mediatypeid, callback){
    var sql = 'SELECT * FROM library inner join mediatypes on mediatypes.id = library.mediatypeid WHERE mediatypeid=$1::int';
    var params = [mediatypeid];
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
    });
  }

  function insertLibraryInDB(upc, title, location, private, typeid, ownerid, borrowerid, callback){
    if(borrowerid>0){
      var sql ="INSERT INTO library (upc, title, location, private, mediatypeid, ownerid, borrowerid) VALUES ";
      sql += "($1::varchar(25), $2::varchar(50), $3::varchar(50), $4::boolean, $5::int, $6::int, $7::int)"
      var params = [upc, title, location, private, typeid, ownerid, borrowerid];
    }else{
      var sql ="INSERT INTO library (upc, title, location, private, mediatypeid, ownerid) VALUES ";
      sql += "($1::varchar(25), $2::varchar(50), $3::varchar(50), $4::boolean, $5::int, $6::int)"
      var params = [upc, title, location, private, typeid, ownerid];
    }
    console.log(sql, params);
    db.pool.query(sql, params, (err, res)=>{
      if(err){
        console.log(err);
      }
    });
  }

  function updateLibraryInDB(id, upc, title, location, private, typeid, ownerid, borrowerid, callback){ 
    var sql = "UPDATE library SET ";
    sql += "upc = $1::varchar(25)";
    sql += ", title=$2::varchar(50)";
    sql += ", location=$3::varchar(50)";
    sql += ", private=$4::boolean";
    sql += ", mediatypeid=$5::int";
    sql += ", ownerid=$6::int";
    console.log(sql, params);
    if(borrowerid>0){
      sql += ", borrowerid=$7::int";
      sql += " WHERE id=$8"
      var params = [upc, title, location, private, typeid, ownerid, borrowerid, id];
    }else{
      sql += ", borrowerid=null";
      sql += " WHERE id=$7"
      var params = [upc, title, location, private, typeid, ownerid, id];
    }
    console.log(sql, params);
    db.pool.query(sql, params, (err, res)=>{
      if(err){
        console.log(err);
      }
    });
  }

  function deleteLibraryInDB(id, callback){
    var sql = "DELETE FROM library WHERE id=$1::int";
    var params = [id];
    db.pool.query(sql,params, (err, res)=>{
      if(err){
        console.log(err);
      }else{
        console.log(sql, params, res);
      }
    });
  }

  function insertLibrary(req, res){
    var id = req.query.id;
    var upc = req.query.upc;
    var title = req.query.title;
    var location = req.query.location;
    var private = req.query.private;
    var typeid = req.query.mediatypeid;
    var ownerid = req.query.ownerid;
    var borrowerid = req.query.borrowerid;
    if(!borrowerid){borrowerid=0;}
    if(!ownerid){ownerid=1;}
    if(upc && title && location && private && typeid){
      console.log("going to save");
      insertLibraryInDB(upc, title, location, private, typeid, ownerid, borrowerid, (error, result)=>{
        console.log(result);
      });
    } else {
      console.log("found blank data cannot save");
    }
    res.end();
    
  }

  function updateLibrary(req, res){
    var id = req.query.id;
    var upc = req.query.upc;
    var title = req.query.title;
    var location = req.query.location;
    var private = req.query.private;
    var typeid = req.query.mediatypeid;
    var ownerid = req.query.ownerid;
    ownerid =1
    var borrowerid = req.query.borrowerid;
    updateLibraryInDB(id, upc, title, location, private, typeid, ownerid, borrowerid, (error, result)=>{
      console.log(result);
    });
    res.end();
  }

  function deleteLibrary(req, res){
    var id = parseInt(req.query.id);
    if(id){
      if(id>0){
        console.log("going to delete "+id);
        deleteLibraryInDB(id, (error, result)=>{
          console.log(result);
        });
      }
    }
    res.end();
  }

  function checkinDB(id){
    var sql = "UPDATE library SET borrowerid = NULL WHERE id=$1::int";
    var params = [id];
    db.pool.query(sql,params, (err, res)=>{
      if(err){
        console.log(err);
      }else{
        console.log(sql, params, res);
      }
    });
  }

  function checkoutDB(id, borrowerid){
    var sql = "UPDATE library SET borrowerid = $1::int WHERE id=$2::int";
    var params = [borrowerid, id];
    db.pool.query(sql,params, (err, res)=>{
      if(err){
        console.log(err);
      }else{
        console.log(sql, params, res);
      }
    });
  }
  
  function checkin(req, res){
    var id = parseInt(req.query.id);
    var borrowerid = parseInt(req.query.borrowerid);
    if (borrowerid){
      checkoutDB(id, borrowerid);
    }else{
      checkinDB(id);
    }
  }

  module.exports = {
    getMediaType: getMediaType,
    getLibrary: getLibrary,
    insertLibrary: insertLibrary,
    updateLibrary: updateLibrary,
    deleteLibrary: deleteLibrary,
    checkin: checkin
  }