$(document).ready(getLibraryView);

function selectTab(number){
  const tab = [document.querySelector(".tabs ul li:nth-child(1) button"),
  document.querySelector(".tabs ul li:nth-child(2) button"),
  document.querySelector(".tabs ul li:nth-child(3) button")]
  tab.forEach(btn => {
    btn.classList.remove('selected');
  })
  tab[number].classList.add('selected');
}


function getUsers(){
  const mainSection = document.getElementById('main');
  selectTab(2);
              


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
  var html = "<div class='form'><label for='fname'>First Name: <input id='fname' type='text' name='fname'></label>";
  html += "<label for='lname'>Last Name: <input id='lname' type='text' name='lname'></label>";
  html += "<button onclick='saveUser(" + id + ");'>Save</button>";
  html += "</div>";
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

function populateMediaTypeSelect(id=0, search=true){
  const searchType = document.getElementById("searchType");
  const mediatype = document.getElementById("mediatype");
  var dd = searchType;
  if (searchType){dd = searchType;}
  if (mediatype){dd = mediatype;}
  
  var html = "";
  fetch('getmediatypes', {method:'GET'})
  .then(res=>res.text())
  .then((result) =>{
    try{
      var obj = JSON.parse(result);
    } catch(e){
      throw new Error(result);
    }
    if (search){
      html += "<option value='0'";
      if (id == 0){html += " selected ";}
      html += ">All</option>";
    }
    
    obj.forEach(element =>{
      html += "<option value='" + element.id + "'";
      if (element.id == id){html += " selected ";}
      html += ">" + element.type + "</option>";
    });
    
  })
  .catch((error) => {
    alert('catch '+error);
  })
  .finally(()=>{
    dd.innerHTML = html;
  })
}

function getLibrary(search='', mediatypeid=0){
  const libraryTable = document.getElementById('libraryTable');
  var html = "";  
  var url = 'getlibrary';
  if (search != '' || mediatypeid > 0){
    if (search != '' && mediatypeid > 0){
      url += '?search=' + search;
      url += '&mediatypeid='+mediatypeid;
    }else if (search != ''){
      url += '?search=' + search;
    }else{
      url += '?mediatypeid='+mediatypeid;
    }
  }
  fetch(url, {method:'GET'})
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
      html += "<div>";
      html += "<button onclick='getAddLibraryForm(" + element.id + ");'>Edit</button>";
      html += "<button onclick='deleteLibrary(" + element.id + ");'>Delete</button>";  
      html += "</div>";
    });

  })
  .catch((error) => {
    alert(error);
  })
  .finally(()=>{
    libraryTable.innerHTML = html;
    document.getElementById('main').classList.remove('loading');
  })
}

function searchLibrary(){
  const searchString = document.getElementById('searchString');
  const searchType = document.getElementById('searchType');
  getLibrary(searchString.value, searchType.value);
}

function getLibraryView(){
  //Done: setup the base layer then call the sub layers
  //getSearchArea
  //getLibrary

  const mainSection = document.getElementById('main');
  mainSection.classList.add('loading');
  selectTab(0);
  //search section
  var html = "<div class='search'>";
  html += "<label for='searchString'>Search: <input id='searchString' type='text' name='searchString'></label>";
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
  html += "<button onclick='getAddLibraryForm(0);'>Add to Library</button>";
  html += "</div>";
  mainSection.innerHTML = html;
  //mainSection.classList.remove('loading');
  
  populateMediaTypeSelect();
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

function populateLibraryForm(id, callback){
  const title = document.getElementById("title");
  const location = document.getElementById("location");
  const upc = document.getElementById("upc");
  const private = document.getElementById("private");
  const mediatype = document.getElementById("mediatype");
  const borrowerid = document.getElementById("borrowerid");
  const savebtn = document.getElementById("savebtn");
  
  var url = 'getlibrary?id=' + id;
    fetch(url, {method:'GET'})
    .then(res=>res.text())
    .then((result) =>{
      try{
        var obj = JSON.parse(result);
      } catch(e){
        throw new Error(result);
      }
      title.value = obj.title;
      location.value = obj.location;
      upc.value = obj.upc;
      private.checked = obj.checked;
      savebtn.onclick = function (){saveLibrary(obj.id);}
      populateMediaTypeSelect(obj.mediatypeid);
      if(obj.borrowerid){
        populateBorrowerSelect(obj.borrowerid);
      }else{
        populateBorrowerSelect(0);
      }

    })
    .catch((error) => {
      console.log('error happened: '+error);
    })
    .finally(()=>{

    })

}

function populateBorrowerSelect(id=0){
  const borrowerid = document.getElementById("borrowerid");
  var dd = borrowerid;
  if (borrowerid){dd = borrowerid;}
  
  var html = "";
  fetch('getborrowers', {method:'GET'})
  .then(res=>res.text())
  .then((result) =>{
    try{
      var obj = JSON.parse(result);
    } catch(e){
      throw new Error(result);
    }
    html += "<option value='0'";
    if (id == 0){html += " selected ";}
    html += ">Select</option>";
    obj.forEach(element =>{
      html += "<option value='" + element.id + "'";
      if (element.id == id){html += " selected ";}
      html += ">" + element.firstname + " " + element.lastname + "</option>";
    });
    
  })
  .catch((error) => {
    alert('catch '+error);
  })
  .finally(()=>{
    dd.innerHTML = html;
  })
}

function getAddLibraryForm(id=0){
  const mainSection = document.getElementById('main');
  mainSection.classList.add('loading');

  var html = "<div class='form'><label for='title'>Title: <input id='title' type='text' name='title'></label>";
  html += "<label for='location'>Location: <input id='location' type='text' name='location'></label>";
  html += "<label for='upc'>UPC: <input id='upc' type='text' name='upc'></label>";
  html += "<label for='private'>Private: <input id='private' type='checkbox' name='private'></label>";
  html += "<label for='mediatype'>Media Type: <select id='mediatype' name='mediatype'>"; 
  html += "<option value='0'>Loading ...</option>";
  html += "</select></label>";
  html += "<label for='borrowerid'>Borrowed By: <select id='borrowerid' name='borrowerid'>";
  html += "<option value='0'>Loading ...</option>";
  html += "</select></label>";
  
  html += "<button id='savebtn' onclick='saveLibrary(0);'>Save</button>";

  html += "</div>";
  mainSection.innerHTML = html;
  mainSection.classList.remove('loading');

  
  if (id==0){
    //keep blank values
    populateMediaTypeSelect(0, false);
    populateBorrowerSelect(0);
  } else {
    populateLibraryForm(id);
  }
}

function saveLibrary(id=0){
  const title = document.getElementById("title");
  const location = document.getElementById("location");
  const upc = document.getElementById("upc");
  const private = document.getElementById("private");
  const mediatype = document.getElementById("mediatype");
  const borrowerid = document.getElementById("borrowerid");
  if(id ==0){
    var url = 'insertlibrary?title=' + title.value;
    url += '&location=' + location.value;
    url += '&upc=' + upc.value;
    url += '&private=' + private.checked;
    url += '&mediatypeid=' + mediatype.value;
    url += '&borrowerid=' + borrowerid.value;
  }else{
    var url ='updatelibrary?id='+id;
    url += '&title=' + title.value;
    url += '&location=' + location.value;
    url += '&upc=' + upc.value;
    url += '&private=' + private.checked;
    url += '&mediatypeid=' + mediatype.value;
    url += '&borrowerid=' + borrowerid.value;
  }

  fetch(url, {method:'POST'})
  
  getLibraryView();
}

function getCheckedOutView(){
  const mainSection = document.getElementById('main');
  selectTab(1);
  mainSection.classList.add('loading');
  
  var html = '';
  //table section
  html += "<div id='libraryTable' class='table library borrower'>";
  html += "Loading...";
  html += "</div>";
  
  mainSection.innerHTML = html;
  //mainSection.classList.remove('loading');

  getCheckedoutLibrary();
}

function getCheckedoutLibrary(){
  var url='getlibrary?checkedout=true';
  var html = '';
  fetch(url, {method:'GET'})
  .then(res=>res.text())
  .then((result) =>{
    try{
      var obj = JSON.parse(result);
    } catch(e){
      throw new Error(result);
    }

    //setup header row
    html += "<div>Title</div>";
    html += "<div>Borrower</div>";
    html += "<div>UPC</div>";
    html += "<div>Media Type</div>";
    html += "<div></div>";

    //populate the table
    obj.forEach(element => {
      html += "<div>" + element.title + "</div>";
      html += "<div>" + element.firstname + " " + element.lastname + "</div>";
      html += "<div>" + element.upc + "</div>";
      html += "<div>" + element.type + "</div>";
      html += "<div>";
      html += "<button onclick='checkin(" + element.id + ");'>Checkin</button>";
      html += "</div>";
    });

  })
  .catch((error) => {
    alert(error);
  })
  .finally(()=>{
    libraryTable.innerHTML = html;
    document.getElementById('main').classList.remove('loading');
  })

}

function checkin(id){
  if (id==0){
    console.log('cannot update: ', id);
  } else {
    var url = 'checkin?id=' + id;
    fetch(url, {method:'POST'})
  }
  getCheckedoutLibrary();
}


