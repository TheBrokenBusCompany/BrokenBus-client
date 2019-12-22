// Get the modal and close modal elements
var modal = document.getElementById('emtBusInfo');
var infoBuses = document.getElementById('busInfo');
var title = document.getElementById("modalTitle");
var name = document.getElementById("modalLineCode");
var direction = document.getElementById("modalDirection");
var lastUpdate = document.getElementById("modalLastUpdate");
var emtCode =  document.getElementById("formEmtCode")
var span = document.getElementsByClassName("close")[0];
const urlBusComments = 'http://localhost:5001/api/v1/comments/EMTCode/'

// Opens the modal, trigered when a bus marker is clicked
function showBus(element) {

    modal.style.display = "block";
    infoBuses.style.display = "block";

    var properties = element.target.feature.properties;
    
    title.innerText = "Bus " + properties.busCode;
    document.getElementById("modalLineCode").innerText = "Line: " + properties.codLine;
    direction.style.display = "block"
    direction.innerText = "Direction: " + properties.direction;
    lastUpdate.style.display = "block"
    lastUpdate.innerText = "Last update: " + properties.lastUpdate;
    
    emtCode.value = 'b' + properties.busCode;

    clearComments();
    showCommentList('b' + properties.busCode);
}

function showStop(element) {

  modal.style.display = "block";
  infoBuses.style.display = "block";

  var properties = element.target.feature.properties;

  title.innerText = "Stop " + properties.stopCode;
  document.getElementById("modalLineCode").innerText = "Name: " + properties.stopName;
  direction.style.display = "none"
  lastUpdate.style.display = "none"
  
  emtCode.value = 's' + properties.stopCode;

  clearComments();
  showCommentList('s' + properties.stopCode);
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  infoBuses.style.display = "none";
}

// Comments

// Clears the comments list

function clearComments() {

  var lis = document.querySelectorAll('#listComments li');
  for(var i=0; li=lis[i]; i++) {
    console.log("e");
    li.parentNode.removeChild(li);
  }
  
}

// Add all comments for a bus to the comments table
function showCommentList(busCode) {
  httpGetAsync(urlBusComments + busCode, function(response) {   
    response = JSON.parse(response);
    for (var i = 0; i<response.length; i++) {
      var author = response[i]['userId'];
      var body = response[i]['body'];
      var image = response[i]['imageURL'];

      if (image == null || image == 'null') {
        createComment(author, body);
      } else {
        createComment(author, body, image);
      }

      
    }
  }, function(response) {
      console.log('Error on load comments = ' + response);
  });
}

function createComment(userID, body, image = null) {
  var ul = document.getElementById("listComments");
  var li = document.createElement("li");
  li.setAttribute("class", "user-comment");

  userInfo = document.createElement("div");
  userInfo.className = "userInfo";

  imagen = document.createElement("img");
  imagen.className = "avatar";
  imagen.src = user.getImageUrl();

  username = document.createElement("p");
  username.className = "username";
  username.innerHTML = userID;

  userInfo.appendChild(imagen);
  userInfo.appendChild(username);

  text = document.createElement("div");
  text.className = "text";
  text.innerText = body;

  li.appendChild(userInfo);
  li.appendChild(text);

  console.log(image);
  if (!(image == null || image == 'null')) {
    commentImage = document.createElement("img");
    commentImage.className = "commentImage";
    commentImage.src = image;

    li.append(commentImage);
  } 

  ul.appendChild(li);
}
/*
EJEMPLO DE UN COMENTARIO
  <li class="user-comment">
      <div class="userInfo">
          <img class="avatar" src=""/>
          <div class="username">Javi</div>
      </div>
      
      <div class="text">Suspendisse gravida sem?</div>
      <img class="commentImage" />
  </li>
*/