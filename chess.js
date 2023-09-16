import * as TRES from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Declarar variables globales
let escena, camara, renderizador, controles;

function inicializar() {
    // Inicializar la escena
    escena = new TRES.Scene();

    // Inicializar la cámara
    camara = new TRES.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camara.position.set(0, 49.249, 98.497);
    camara.rotation.set(-26.57, 0, 0);

    // Inicializar el renderizador
    renderizador = new TRES.WebGLRenderer();
    renderizador.shadowMap.enabled = true;
    renderizador.toneMapping = TRES.ReinhardToneMapping;
	renderizador.setPixelRatio(window.devicePixelRatio);
    renderizador.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderizador.domElement);

    // Inicializar controles de órbita
    controles = new OrbitControls(camara, renderizador.domElement);
    controles.enableDamping = true;
    controles.dampingFactor = 0.25;
    controles.screenSpacePanning = false;
    controles.maxPolarAngle = Math.PI / 2;

    // Configurar luces
    const luzDeBulbo = new TRES.PointLight(0xffffff, 1, 100, 0);
    luzDeBulbo.position.set(0, 20, 0);
    escena.add(luzDeBulbo);

    const luzHemisferica = new TRES.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);
    escena.add(luzHemisferica);

    const luzDireccional = new TRES.DirectionalLight(0xffffff, 1);
    luzDireccional.position.set(50, 50, 50);
    luzDireccional.castShadow = true;
    escena.add(luzDireccional);

    const luzAmbiente = new TRES.AmbientLight(0x404040, 1);
    escena.add(luzAmbiente);

    // Cargar modelos
    const cargador = new FBXLoader();
    cargador.load('../models/chess.fbx', (objeto) => {
        escena.add(objeto);

        const malla = objeto.getObjectByName('ChessBoard001');

        if (malla) {
            malla.receiveShadow = true;
        } else {
            console.error('Mesh01 no encontrado');
        }
    });

    // Escuchar cambios en el tamaño de la ventana
    window.addEventListener('resize', alCambiarTamanioDeVentana, false);

    // Comenzar la animación
    animar();
}

// Función para manejar el cambio en el tamaño de la ventana
function alCambiarTamanioDeVentana() {
    camara.aspect = window.innerWidth / window.innerHeight;
    camara.updateProjectionMatrix();
    renderizador.setSize(window.innerWidth, window.innerHeight);
}

// Función para animar la escena
function animar() {
    requestAnimationFrame(animar);

    // Actualizar controles de órbita
    controles.update();

    // Renderizar la escena
    renderizador.render(escena, camara);
}

// Iniciar el programa
inicializar();
