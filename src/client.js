import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { STLLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/STLLoader.js';
import { WEBGL } from 'https://unpkg.com/three@0.126.1/examples/jsm/WebGL.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls';

// Global var
var scene, camera, controls, renderer, light;

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
    
    // Controls
    controls = new OrbitControls( camera, renderer.domElement );
    
    // Light
    //var AmbientLight = new THREE.AmbientLight( 0x404040 ); // soft white light scene.add( light );
    var ambientLight = new THREE.AmbientLightProbe( 0xffffff, 0.3 )
    scene.add( ambientLight );
    light = new THREE.PointLight( 0xffffff, 1, 100 );
    light.position.set( 0, 50, 0 ); //default; light shining from top
    light.castShadow = true; // default false
    scene.add( light );

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
    
    // Material
    const material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );

    // Geometry
    var loader = new STLLoader();
    
    loader.load( './HumanHeart.stl', function ( geometry ) {
        geometry.castShadow = true; //default is false
        geometry.receiveShadow = true; //default
        scene.add( new THREE.Mesh( geometry, material ) );
    });

    // Helper
    const helper = new THREE.CameraHelper( light.shadow.camera );
    scene.add( helper );
    
};

// Animate
function animate() {

    requestAnimationFrame( animate );
    controls.update()
    renderer.render( scene, camera );

};

