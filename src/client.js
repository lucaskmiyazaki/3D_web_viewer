import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { STLLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/STLLoader.js';
import { WEBGL } from 'https://unpkg.com/three@0.126.1/examples/jsm/WebGL.js';

// Global var
var scene, camera, controls, renderer;

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
    
    // Camera
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 50;
    
    // Controls
    
    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    
    // Light
    
    // Geometry
    var loader = new STLLoader();
    
    loader.load( './HumanHeart.stl', function ( geometry ) {
        scene.add( new THREE.Mesh( geometry ) );
    });
    
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    
};

// Animate
function animate() {

    requestAnimationFrame( animate );
    renderer.render( scene, camera );

};

