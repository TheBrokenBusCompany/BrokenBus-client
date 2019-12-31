const imageEndpoint = 'https://brokenbus-server.herokuapp.com/api/v1/imgurTest/upload';
var file = null;

function handleFiles(e) {
    var ctx = document.getElementById('canvas').getContext('2d');
    var reader  = new FileReader();
    file = e.target.files[0];
    // load the image to get its width/height
    var img = new Image();
    img.onload = function() {
        // scale canvas to image
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        // draw image
        ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height );
    }
    // this is to load the image
    reader.onloadend = function () {
        img.src = reader.result;
    }
    // this is to read the file
   	reader.readAsDataURL(file);
}

function prepareImage() {
    if(document.getElementById('imgurUpload').value == '')
        return null;
    var canvas = document.getElementById('canvas');
        
    var dataURI = canvas.toDataURL();

    var encoded = dataURI.split(',')[1];
    
    return encoded;
}