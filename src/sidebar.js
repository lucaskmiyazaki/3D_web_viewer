import * as Dropzone from 'https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.8.1/min/dropzone.min.js';
//import * as Dropzone from 'https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.8.1/dropzone.js';


console.log(typeof(Dropzone));
var sideBarArea = document.getElementById("sidebar");
var myDropzone = new Dropzone("div#myId", { url: "/temp"});
sideBarArea.appendChild(myDropzone);