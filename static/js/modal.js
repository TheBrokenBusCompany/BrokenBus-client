// Get the modal and close modal elements
var modal = document.getElementById('emtBusInfo');
var infoBuses = document.getElementById('busInfo');
var infoStops = document.getElementById('infoStop');
var span = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close")[1];
const urlBusComments = 'http://localhost:5001/api/v1/comments/EMTCode/'
const urlStopsComments = 'http://localhost:5001/api/v1/comments/EMTCode/'

// Opens the modal, trigered when a bus marker is clicked
function showModal(element) {
  /*
    console.log(modal == modal2); 
    console.log(modal);
    console.log(modal2);
    modal2.style.display = "none";
  */
    modal.style.display = "block";
    infoBuses.style.display = "block";
    infoStops.style.display = "none";
    var properties = element.target.feature.properties;
    document.getElementById("modalTitle").innerText = "Bus " + properties.busCode;
    document.getElementById("modalLineCode").innerText = "Line: " + properties.codLine;
    document.getElementById("modalDirection").innerText = "Direction: " + properties.direction;
    document.getElementById("modalLastUpdate").innerText = "Last update: " + properties.lastUpdate;
    document.getElementById("formEmtCode").value = 'b' + properties.busCode;

    clearRows();
    showCommentList('b' + properties.busCode);
}

function openModal2(element) {
  console.log(element); 

  modal.style.display = "block";
  infoStops.style.display = "block";
  infoBuses.style.display = "none";

  var properties = element.target.feature.properties;
  document.getElementById("modal2Title").innerText = "StopCode " + properties.stopCode;
  document.getElementById("modal2Name").innerText = "StopName " + properties.stopName;
  document.getElementById("formEmtCode").value = 's' + properties.stopCode;
  
  clearRows();
  showCommentList2('s' + properties.stopCode);
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  infoBuses.style.display = "none";
}

span2.onclick = function() {
  modal.style.display = "none"; 
  infoStops.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    infoBuses.style.display = "none";
    infoStops.style.display = "none";
  }
}

// Comments

// Clears the comments table
function clearRows() {
  var table = document.getElementById("commentsTable");
  for(var i = table.rows.length - 1; i > 0; i--) {
      table.deleteRow(i);
  }
}

// Adds a new data row to the comments table
function addRow(content) {
  tabBody = document.getElementById("commentsTable");
  row = document.createElement("tr");
  cell = document.createElement("td");
  cell.appendChild(content);
  row.appendChild(cell);
  tabBody.appendChild(row);
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
        image = '';
      } else {
        image = '<img class="commentImage" src="' + image + '"/>'
      }

      var div = document.createElement('div');
      div.innerHTML = author + '</br>' + body + '</br>' + image;

      addRow(div);
    }
}, function(response) {
    console.log('Error on load comments = ' + response);
});
}

// Add all comments for a stop to the comments table
function showCommentList2(stopCode) {
  httpGetAsync(urlStopsComments + stopCode, function(response) {   
    response = JSON.parse(response);
    for (var i = 0; i<response.length; i++) {
      var author = response[i]['userId'];
      var body = response[i]['body'];
      var image = response[i]['imageURL'];

      if (image == null || image == 'null') {
        image = '';
      } else {
        image = '<img class="commentImage" src="' + image + '"/>'
      }

      var div = document.createElement('div');
      div.innerHTML = author + '</br>' + body + '</br>' + image;

      addRow(div);
    }
}, function(response) {
    console.log('Error on load comments = ' + response);
});
}