var geoJSONLayer = null;
var user = null;
const busesEndpoint = 'https://brokenbus-server.herokuapp.com/api/v1/buses/geojson';
const stopsEndpoint = 'https://brokenbus-server.herokuapp.com/api/v1/stops/geojson';
const urlUser = 'https://brokenbus-server.herokuapp.com/api/v1/users';
const urlComment = 'https://brokenbus-server.herokuapp.com/api/v1/comments';

const busIcon = new L.icon({ 
    iconUrl: '/static/icon/icon_bus.png',
    iconSize: [27, 27],
    iconAnchor: [13, 27]
});

const stopIcon = new L.icon({ 
    iconUrl: '/static/icon/icon_stop_white.png',
    iconSize: [15, 15],
    iconAnchor: [8, 8]
}); 

function onSignIn(googleUser) {
    /*
     * Called only by the google sign in button
     * Logs the user in and hides itself while showing the user
     */
    user = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;

    var xmlHttp = new XMLHttpRequest(); 
    xmlHttp.open("POST", urlUser);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.send('idtoken=' + id_token);

    document.getElementById("userName").innerText = user.getName();
    document.getElementById("profilePicture").src = user.getImageUrl();
    document.getElementById('formUserToken').value = id_token;

    document.getElementById('googleSignIn').style.display = 'none';
    document.getElementById('googleUser').style.display = 'flex';
    document.getElementById('divCommentForm').style.display = 'block';
}


function onError(response) {
    /*
     * Called only by the google sign in button
     * in case of error.
     */
    console.log('Error on OAuth:' + response);
}

function signOut() {
    /*
     * Logs out the user, hides itself and shows
     * the google sign in button again.
     */
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });

    document.getElementById("userName").innerText = '';
    document.getElementById("profilePicture").src = '';
    document.getElementById('formUserToken').value = '';

    document.getElementById('googleSignIn').style.display = 'block';
    document.getElementById('googleUser').style.display = 'none';
    document.getElementById('divCommentForm').style.display = 'none';
}

function sleep(ms) {
    /*
     * Async sleep function
     */
    return new Promise(resolve => setTimeout(resolve, ms));
}

function httpGetAsync(url, callback, errorCallback) {
    /*
     * Async HTTP get request
     * https://stackoverflow.com/a/4033310
     * xmlHttp.readyState 4 is DONE
     */
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.response);
        else if(xmlHttp.readyState == 4)
            errorCallback(xmlHttp.status);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

async function refresh() {
    /*
     * Refreshes the bus positions in the map
     * Runs in loop every minute to update the positions
     */
    httpGetAsync(busesEndpoint, function(response) {   
        console.log('Updating buses position');
        if (geoJSONLayer != null) {
            geoJSONLayer.remove();
        }
        
        geoJSONLayer = L.geoJSON(JSON.parse(response), {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: busIcon}).on('click',showBus);
            }
        }).addTo(map);

        // Remove error toast on success
        document.getElementById('updateErrorToast').className = '';
    }, function(response) {
        // Show error toast on error
        console.log('Error on update state = ' + response);
        document.getElementById('updateErrorToast').className = 'show';
    });

    await sleep(60000); // Sleep for a minute
    refresh();
}

async function showStops() {
    /*
     * Shows the bus stops positions in the map
     */
    httpGetAsync(stopsEndpoint, function(response) {   
        console.log('Showing bus stops position');
        
        L.geoJSON(JSON.parse(response), {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: stopIcon}).on('click',showStop);
            }
        }).addTo(map);
    }, async function(response) {
        // Show error toast on error
        console.log('Error on update stop state = ' + response);
        document.getElementById('updateErrorToast').className = 'show';

        await sleep(60000); // Sleep for a minute and try again
        showStops();
    });
}

function postComment() {
    var imageEncoded = prepareImage();
    var body = document.getElementById('commentBody').value;
    if (body=="") return;
    var emtCode = document.getElementById('formEmtCode').value;
    var userToken = document.getElementById('formUserToken').value;
    var request = new XMLHttpRequest();
    request.open("POST", urlComment);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");


    request.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE) {
            
            if (this.status == 200) {
                clearComments();
                showCommentList(emtCode);
            } else {
                alert('ERROR: status code: ' + request.status)
            }

            document.getElementById('commentForm').reset();
            emtCode = document.getElementById('formEmtCode').value = emtCode;
            document.getElementById('formUserToken').value = userToken;
        }
    }   
    
    request.send('image=' + imageEncoded +
        '&userToken=' + userToken +
        '&body=' + body +
        '&emtCode=' + emtCode);
}