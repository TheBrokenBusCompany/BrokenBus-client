// Get the modal and close modal elements
var modal = document.getElementsByClassName("modal2")[0]; //document.getElementById("emtStopInfo");
var span = document.getElementsByClassName("close")[1];//ARREGLAR, PONER ID
const urlStopsComments = 'http://localhost:5001/api/v1/comments/EMTCode/'

// Opens the modal, trigered when a stop marker is clicked
function showModal2(element) {
    console.log(element); 

    modal.style.display = "block";
    var properties = element.target.feature.properties;
    document.getElementById("modal2Title").innerText = "StopCode " + properties.stopCode;
    document.getElementById("modal2Name").innerText = "StopName " + properties.stopName;
    document.getElementById("form2EmtCode").value = 's' + properties.stopCode;
    
    clearRows2();
    showCommentList2('s' + properties.stopCode);
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
function clearRows2() {
  var table = document.getElementById("commentsTable2");
  for(var i = table.rows.length - 1; i > 0; i--) {
      table.deleteRow(i);
  }
}

// Adds a new data row to the comments table
function addRow2(content) {
  tabBody = document.getElementById("commentsTable2");
  row = document.createElement("tr");
  cell = document.createElement("td");
  cell.appendChild(content);
  row.appendChild(cell);
  tabBody.appendChild(row);
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

      addRow2(div);
    }
}, function(response) {
    console.log('Error on load comments = ' + response);
});
}