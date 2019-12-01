// Get the modal and close modal elements
var modal = document.getElementById("infoEMT");
var span = document.getElementsByClassName("close")[0];
const urlBusComments = 'http://localhost:5001/api/v1/comments/EMTCode/'

// Opens the modal, trigered when a bus marker is clicked
function showModal(element) {
    modal.style.display = "block";
    var properties = element.target.feature.properties;
    document.getElementById("modalTitle").innerText = "Bus " + properties.busCode;
    document.getElementById("modalLineCode").innerText = "Line: " + properties.codLine;
    document.getElementById("modalDirection").innerText = "Direction: " + properties.direction;
    document.getElementById("modalLastUpdate").innerText = "Last update: " + properties.lastUpdate;
    document.getElementById("formEmtCode").value = 'b' + properties.busCode;

    clearRows();
    showCommentList('b' + properties.busCode);
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
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
    console.log('Updating buses position');
    response = JSON.parse(response);
    console.log(response[0])
    for (var i = 0; i<response.length; i++) {
      var author = response[i]['userId']
      var body = response[i]['body']
      var image = response[i]['imageURL']

      var div = document.createElement('div')
      div.innerHTML = author + '</br>' + body + '</br><img src="' + image + '"/>'

      addRow(div)
    }
}, function(response) {
    console.log('Error on load comments = ' + response);
});
}