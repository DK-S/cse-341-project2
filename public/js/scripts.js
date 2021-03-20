function getUsers(){
  const mainSection = document.getElementById('main');
  mainSection.classList.add('loading');
  
  fetch('getusers', {method:'GET'})
    .then(res=>res.text())
    .then((result) =>{
      try{
        var obj = JSON.parse(result);
      } catch(e){
        throw new Error(result);
      }

      var html = "<div class='table user'>";
      html += "<div>First Name</div>";
      html += "<div>Last Name</div>";
      html += "<div></div>";
      obj.forEach(element => {
        html += "<div>" + element.firstname + "</div>";
        html += "<div>" + element.lastname + "</div>";
        html += "<div>";
        html += "<button onclick='addUser(" + element.id + ");'>Edit</button>";
        if (parseInt(element.id)>1){
          html += "<button onclick='deleteUser(" + element.id + ");'>Delete</button>";  
        }
        html += "</div>";
      });
      html += "</div>";
      html += "<div>";
      html += "<button onclick='addUser();'>Add User</button>"
      html += "</div>";
      
      mainSection.innerHTML = html;
      mainSection.classList.remove('loading');
    })
    .catch((error) => {

    })
    .finally(()=>{

    })
}

function addUser(id=0){
  const mainSection = document.getElementById('main');
  mainSection.classList.add('loading');
  //buld the form here
  var html = "<label for='fname'>First Name: <input id='fname' type='text' name='fname'></label>";
  html += "<label for='lname'>Last Name: <input id='lname' type='text' name='lname'></label>";
  html += "<button onclick='saveUser(" + id + ");'>Save</button>";
  
  mainSection.innerHTML = html;
  mainSection.classList.remove('loading');

  if (id==0){
    //keep blank values
  } else {
    //get the values from the server
    var url = 'getusers?id=' + id;
    fetch(url, {method:'GET'})
    .then(res=>res.text())
    .then((result) =>{
      try{
        var obj = JSON.parse(result);
      } catch(e){
        throw new Error(result);
      }
      const fName = document.getElementById('fname');
      const lName = document.getElementById('lname');

      fName.value = obj.firstname;
      lName.value = obj.lastname;
    })
    .catch((error) => {
      console.log('error happened: '+error);
    })
    .finally(()=>{

    })
  }
}

function saveUser(id=0){
  const fName = document.getElementById('fname');
  const lName = document.getElementById('lname');
  if (id==0){
    var url = 'putuser?fname=' + fname.value + '&lname=' + lName.value;
  }else{
    var url = 'putuser?id=' + id + '&fname=' + fname.value + '&lname=' + lName.value;
  }
  
  fetch(url, {method:'POST'})
  
  getUsers();
}

function deleteUser(id=0){
  if (id==0){
    console.log('cannot delete: ', id);
  } else {
    var url = 'deleteuser?id=' + id;
    fetch(url, {method:'POST'})
  }
  getUsers();
}

function getSearchArea(){
  const searchType = document.getElementById("searchType");
  var html = "";
  fetch('getmediatypes', {method:'GET'})
  .then(res=>res.text())
  .then((result) =>{
    try{
      var obj = JSON.parse(result);
    } catch(e){
      throw new Error(result);
    }
    html += "<option value='0'>All</option>"
    obj.forEach(element =>{
      html += "<option value='" + element.id + "'>" + element.type + "</option>";
    });
    
  })
  .catch((error) => {
    alert('catch '+error);
  })
  .finally(()=>{
    searchType.innerHTML = html;
  })
}

function getLibrary(){
  const libraryTable = document.getElementById('libraryTable');
  var html = "";  
  fetch('getlibrary', {method:'GET'})
  .then(res=>res.text())
  .then((result) =>{
    try{
      var obj = JSON.parse(result);
    } catch(e){
      throw new Error(result);
    }

    //setup header row
    html += "<div>Title</div>";
    html += "<div>Location</div>";
    html += "<div>UPC</div>";
    html += "<div>Media Type</div>";
    html += "<div></div>";

    //populate the table
    obj.forEach(element => {
      html += "<div>" + element.title + "</div>";
      html += "<div>" + element.location + "</div>";
      html += "<div>" + element.upc + "</div>";
      html += "<div>" + element.type + "</div>";
      html += "<div>"+element.id;
      html += "<button onclick='editLibrary(" + element.id + ");'>Edit</button>";
      html += "<button onclick='deleteLibrary(" + element.id + ");'>Delete</button>";  
      html += "</div>";
    });

  })
  .catch((error) => {
    alert(error);
  })
  .finally(()=>{
    libraryTable.innerHTML = html;
  })
}

function getLibraryView(){
  //Done: setup the base layer then call the sub layers
  //getSearchArea
  //getLibrary

  const mainSection = document.getElementById('main');
  mainSection.classList.add('loading');
  
  //search section
  var html = "<div class='search'>";
  html += "<label for='searchString'>Search: <input type='text' name='searchString'></label>";
  html += "<label for='searchType'>Search: ";
  html += "<select id='searchType' name='searchType'>";
  html += "<option value='0'>Loading ...</option>";
  html += "</select>";
  html += "</label>";
  html += "<button onclick='searchLibrary();'>Search</button>";
  html += "</div>";

  //table section
  html += "<div id='libraryTable' class='table library'>";
  html += "Loading...";
  html += "</div>";

  //add a button for adding to the library
  html += "<div>";
  html += "<button onclick='addLibrary();'>Add to Library</button>";
  html += "</div>";
  mainSection.innerHTML = html;
  mainSection.classList.remove('loading');
  
  getSearchArea();
  getLibrary();
}

function deleteLibrary(id=0){
  if (id==0){
    console.log('cannot delete: ', id);
  } else {
    var url = 'deletelibrary?id=' + id;
    fetch(url, {method:'POST'})
  }
  getLibrary();
}

//TODO: create these functions

//searchLibrary();
//addLibrary();
//editLibrary(id)
//getLibraryForm()
//populateForm(id)
//saveLibrary(id=0)
//getCheckedOutView();