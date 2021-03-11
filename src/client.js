import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { STLLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/STLLoader.js';
import { WEBGL } from 'https://unpkg.com/three@0.126.1/examples/jsm/WebGL.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls';

// Global var
var scene, camera, controls, renderer, light, object;
var clock = new THREE.Clock();

init();
// Compatibility Check
if ( WEBGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WEBGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}

// Init
function init() {

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 'skyblue' );

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // Camera
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 50;
    controls = new OrbitControls( camera, renderer.domElement );
    
    // Light
    var ambientLight = new THREE.AmbientLightProbe( 0xffffff, 0.35 )
    scene.add( ambientLight );
    var topLightSource = new THREE.PointLight( 0xffffff, 1, 100 );
    topLightSource.position.set( 0, 50, 0 ); //default; light shining from top
    topLightSource.castShadow = true; // default false
    scene.add( topLightSource );
    var rightLightSource = new THREE.PointLight( 0xffffff, 0.8, 100 );
    rightLightSource.position.set( 50, -50, 0 ); //default; light shining from top
    rightLightSource.castShadow = true; // default false
    scene.add( rightLightSource );
    var leftLightSource = new THREE.PointLight( 0xffffff, 0.8, 100 );
    leftLightSource.position.set( -50, -50, 0 ); //default; light shining from top
    leftLightSource.castShadow = true; // default false
    scene.add( leftLightSource );

    // Material
    const material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );

    // Geometry
    var loader = new STLLoader();
    
    loader.load( './HumanHeart.stl', function ( geometry ) {
        geometry.castShadow = true; //default is false
        geometry.receiveShadow = true; //default
        object = new THREE.Mesh( geometry, material );
        scene.add( object );
    });

};

// Animate
function animate() {

    requestAnimationFrame( animate );
    controls.update()
    renderer.render( scene, camera );

};

// Object Control
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = String.fromCharCode(event.which);
    var rotationIncr = 0.1; 
    var TranslationIncr = 2; 
    var scaleIncr = 0.01; 
	var totalRunTime = clock.getElapsedTime();

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
    }
    plotTable();
};

function plotTable(){
    console.clear();
    var table = {
        "position": {"x": object.position.x,
                     "y": object.position.y,
                     "z": object.position.z},
        "rotation": {"x": object.rotation.x,
                     "y": object.rotation.y,
                     "z": object.rotation.z},
        "scale":    {"x": object.scale.x,
                     "y": object.scale.y,
                     "z": object.scale.z},
    };
    console.table(table); 
}