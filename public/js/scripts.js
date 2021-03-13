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
        html += "<button onclick='deleteUser(" + element.id + ");'>Delete</button>";
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
      //const admin = document.getElementById('admin');

      fName.value = obj.firstname;
      lName.value = obj.lastname;
      //admin.value = obj.admin;
    })
    .catch((error) => {
      console.log('error happened: '+error);
    })
    .finally(()=>{

    })
  }
  //buld the form here
  // var html = "<label for='fname'>First Name: <input type='text' name='fname'></label>";
  // html += "<label for='lname'>Last Name: <input type='text' name='lname'></label>";
  
  // mainSection.innerHTML = html;
  // mainSection.classList.remove('loading');
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