import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { STLLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/STLLoader.js';
import { AMFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/AMFLoader.js';
import { PLYLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/PLYLoader.js';
import { OBJLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/OBJLoader.js';
import { GCodeLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GCodeLoader.js';
import { WEBGL } from 'https://unpkg.com/three@0.126.1/examples/jsm/WebGL.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls';

// Global var
var scene, camera, controls, renderer, table;
var objects = [];
var currentObject = 0;
const rotationOffsetX = - Math.PI / 2;

// --- SIDEBAR ------------------------
const toggleBtn = document.querySelector('.sidebar-toggle');
const closeBtn  = document.querySelector('.close-btn');
const sidebar   = document.querySelector('.sidebar');
//const iconBtn   = document.querySelector('.icon-btn');

toggleBtn.addEventListener('click', function(){
    //using toggle
    sidebar.classList.toggle('show-sidebar');
});

closeBtn.addEventListener('click', function(){
    sidebar.classList.remove('show-sidebar');
});

const objectBtn  = document.getElementById('object-btn');
const slicerBtn  = document.getElementById('slicer-btn');
const controlBtn = document.getElementById('control-btn');
const printBtn   = document.getElementById('print-btn');

const mainPanel   = document.getElementsByClassName('main-panel')[0];
    
for(var child=mainPanel.firstChild; child!==null; child=child.nextSibling) {
    if(child.tagName === 'UL'){
        child.style.visibility = "hidden";
    }
}

function iconClick(event) {
    const id = event.target.id;

    const mainPanel   = document.getElementsByClassName('main-panel')[0];
    const currentPanel = document.getElementById(id+"-panel");

    if(typeof(currentPanel) === 'object' && currentPanel !== null){
        for(var child=mainPanel.firstChild; child!==null; child=child.nextSibling) {
            if(child.tagName === 'UL'){
                child.style.visibility = "hidden";
            }
        }
    
        mainPanel.insertBefore(currentPanel, mainPanel.firstChild);
        currentPanel.style.visibility = "visible"; 
    }    
}

objectBtn.addEventListener('click',  iconClick);
slicerBtn.addEventListener('click',  iconClick);
controlBtn.addEventListener('click', iconClick); 
printBtn.addEventListener('click',   iconClick);

// --- SIDEBAR ------------------------


init();
// Compatibility Check
if ( WEBGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WEBGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


// Init
function init() {

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 'skyblue' );

    // Camera
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 80;
    camera.position.y = 80;
    controls = new OrbitControls( camera, renderer.domElement );
    
    // Light
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    var ambientLight = new THREE.AmbientLightProbe( 0xffffff, 0.2 )
    scene.add( ambientLight );
    var topLightSource = new THREE.PointLight( 0xffffff, 0.9, 2000 );
    topLightSource.position.set( 0, 500, 0 ); //default; light shining from top
    topLightSource.castShadow = true; // default false
    scene.add( topLightSource );
    var rightLightSource = new THREE.PointLight( 0xffffff, 0.6, 100 );
    rightLightSource.position.set( 50, -10, 0 ); //default; light shining from top
    rightLightSource.castShadow = true; // default false
    scene.add( rightLightSource );
    var leftLightSource = new THREE.PointLight( 0xffffff, 0.6, 100 );
    leftLightSource.position.set( -50, -10, 0 ); //default; light shining from top
    leftLightSource.castShadow = true; // default false
    scene.add( leftLightSource );

    // Material
    //const objectMaterial = new THREE.MeshLambertMaterial ( { color: 0xff0000 } );
    //onst objectMaterial = new THREE.MeshStandardMaterial ( { color: 0xff0000 } );
    //const tableMaterial = new THREE.MeshLambertMaterial( { color: 0xff64b4 } );
    const tableMaterial = new THREE.MeshPhongMaterial( { color: 0xff64b4 } );

    // Table
    const cube = new THREE.BoxGeometry(100, 10, 100);
    cube.castShadow = false; //default is false
    cube.receiveShadow = true; //default
    table = new THREE.Mesh( cube, tableMaterial );
    table.position.z = -5;
    scene.add( table );
    const wiretable  = new THREE.WireframeGeometry( cube );
    const line = new THREE.Line( wiretable );
    line.material.depthTest = true;
    line.material.opacity = 0.4;
    line.material.transparent = true;
    line.position.z = -5;
    scene.add(line);


    // Objects
    var request = new XMLHttpRequest();
    var models;
    request.open('GET', '/models', false); // false == not async
    request.send();

    if (request.status >= 200 && request.status < 400) {
        var resp = request.responseText;
        models = JSON.parse(resp)["models"];
        for (var i = 0; i < models.length; i++){
            var filename = models[i];
            loadModel(filename);
        }
    }

    // Helper
    //var helper = new THREE.PointLightHelper( topLightSource, 100 );
    //scene.add( helper );
};

// Animate
function animate() {

    requestAnimationFrame( animate );
    controls.update()
    renderer.render( scene, camera );

    if (camera.position.y <= -10){
        table.visible = false;
    } else{
        table.visible = true;
    }

};

// Loader
function loadGcode(filename, object) {
    const box = new THREE.Box3();
    object.geometry.computeBoundingBox();
    box.copy( object.geometry.boundingBox ).applyMatrix4( object.matrixWorld );
    var positionOffsetY = (object.position.y - box.min.y);

    if (filename.includes("gcode")){
        const loader = new GCodeLoader();
        loader.load( filename, function ( gcodeRender ) {
            gcodeRender.position.set( - 100 + object.position.x, 
                                      - 20  + object.position.y ,
                                        100 + object.position.z);
            scene.add( gcodeRender );
            object.visible = false;
        })
    }
}

function loadObject(object) {
    scene.add( object );
    objects.push(object); 

    const box = new THREE.Box3();
    object.geometry.computeBoundingBox();
    box.copy( object.geometry.boundingBox ).applyMatrix4( object.matrixWorld );
    var positionOffsetY = (object.position.y - box.min.y);
    object.position.y += positionOffsetY;
    object.rotation.x = rotationOffsetX;
}

function loadModel(filename) {
    const objectMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
    var loader

    if        (filename.includes(".stl")){

        loader = new STLLoader();
        loader.load("models/"+filename, function ( geometry ) {
            geometry.castShadow = true; //default is false
            geometry.receiveShadow = true; //default
            var object = new THREE.Mesh( geometry, objectMaterial );
            loadObject(object);
        });

    } else if (filename.includes(".obj")){

        loader = new OBJLoader();
        loader.load("models/"+filename,
            // called when resource is loaded
            function ( object ) {
                loadObject(object);
            },
            // called when loading is in progresses
            function ( xhr ) {
        
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        
            },
            // called when loading has errors
            function ( error ) {
        
                console.log( 'An error happened' );
        
            }
        );

    } else if (filename.includes(".ply")){
        loader = new PLYLoader();
        loader.load("models/"+filename, function ( geometry ) {
            geometry.castShadow = true; //default is false
            geometry.receiveShadow = true; //default
            var object = new THREE.Mesh( geometry, objectMaterial );
            loadObject(object);
        });
    } else if (filename.includes(".amf")){
        loader = new AMFLoader();
        loader.load("models/"+filename,
            // called when resource is loaded
            function ( object ) {
                loadObject(object);
            },
            // called when loading is in progresses
            function ( xhr ) {
        
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        
            },
            // called when loading has errors
            function ( error ) {
        
                console.log( 'An error happened' );
        
            }
        );
    } else {
        window.alert("format not supported");
        return;
    }
    
    
}

// Object Control
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = String.fromCharCode(event.which);
    var rotationIncr = 0.1; 
    var TranslationIncr = 2; 
    var scaleIncr = 0.01; 
    var object = objects[currentObject];

    if        (keyCode === "A") {
        object.rotation.y -= rotationIncr;
    } else if (keyCode === "D") {
        object.rotation.y += rotationIncr;
    } else if (keyCode === "W") {
        object.rotation.x -= rotationIncr;
    } else if (keyCode === "S") {
        object.rotation.x += rotationIncr;
    } else if (keyCode === "R") {
        object.rotation.z -= rotationIncr;
    } else if (keyCode === "F") {
        object.rotation.z += rotationIncr;
    } else if (keyCode === "G") {
        object.position.x -= TranslationIncr;
    } else if (keyCode === "J") {
        object.position.x += TranslationIncr;
    } else if (keyCode === "H") {
        object.position.y -= TranslationIncr;
    } else if (keyCode === "Y") {
        object.position.y += TranslationIncr;
    } else if (keyCode === "I") {
        object.position.z -= TranslationIncr;
    } else if (keyCode === "K") {
        object.position.z += TranslationIncr;
    } else if (keyCode === "L") {
        object.scale.x -= scaleIncr;
        object.scale.y -= scaleIncr;
        object.scale.z -= scaleIncr;
    } else if (keyCode === "O") {
        object.scale.x += scaleIncr;
        object.scale.y += scaleIncr;
        object.scale.z += scaleIncr;
    } else if (keyCode === "M") {
        var request = new XMLHttpRequest();
        var models;
        request.onreadystatechange = function() {
            if (this.status >= 200 && this.status < 400){
                loadGcode("gcode/HumanHeart.gcode", object);
            } else{
                console.log(this.error);
            }
        }
        request.open('POST', '/slic3r', true); // false == not async
        request.setRequestHeader("Content-Type", "application/json");
        var data = JSON.stringify({ "position": {"x": object.position.x,
                                                 "y": object.position.y,
                                                 "z": object.position.z},
                                    "rotation": {"x": object.rotation.x - rotationOffsetX,
                                                 "y": object.rotation.y,
                                                 "z": object.rotation.z},
                                    "scale":    {"x": object.scale.x,
                                                 "y": object.scale.y,
                                                 "z": object.scale.z},
                                 });
        console.log(data);
        request.send(data);

    } else if (keyCode >= "0" && keyCode <= "9") {
        currentObject = parseInt(keyCode);
    } else {
        return;
    }
    plotTable();
};

// Console Status
function plotTable(){
    //console.clear();
    var object = objects[currentObject];

    var table = {
        "position": {"x": object.position.x,
                     "y": object.position.y,
                     "z": object.position.z},
        "rotation": {"x": object.rotation.x - rotationOffsetX,
                     "y": object.rotation.y,
                     "z": object.rotation.z},
        "scale":    {"x": object.scale.x,
                     "y": object.scale.y,
                     "z": object.scale.z},
    };
    console.table(table); 
}