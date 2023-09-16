import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Global variables
let scene, camera, renderer, controls;

// Initialize the environment
function initialize() {
    // Initialize the scene
    scene = new THREE.Scene();

    // Initialize the camera
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 49.249, 98.497);
    camera.rotation.set(-26.57, 0, 0);

    // Initialize the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Initialize orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    // Set up lighting
    setupLighting();

    // Load models
    loadModels();

    // Listen for window resizing
    window.addEventListener('resize', onWindowResize, false);

    // Start the animation
    animate();
}

// Set up lighting in the scene
function setupLighting() {
    const bulbLight = new THREE.PointLight(0xffffff, 1, 100, 0);
    bulbLight.position.set(0, 20, 0);
    scene.add(bulbLight);

    const hemisphericLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);
    scene.add(hemisphericLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
}

// Load models into the scene
function loadModels() {
    const loader = new FBXLoader();
    loader.load('../models/chess.fbx', (object) => {
        scene.add(object);
        const mesh = object.getObjectByName('ChessBoard001');

        if (mesh) {
            mesh.receiveShadow = true;
        } else {
            console.error('ChessBoard001 not found');
        }
    });
}

// Handle window resizing
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animate the scene
function animate() {
    requestAnimationFrame(animate);

    // Update orbit controls
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
}

// Initialize the program
initialize();
