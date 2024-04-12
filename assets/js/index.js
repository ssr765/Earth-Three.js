import * as THREE from "three";
import earth from "../img/earth.jpg";
import space from "../img/space.webp";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Textures.
const texture = new THREE.TextureLoader().load(earth);
const bgTexture = new THREE.TextureLoader().load(space);
scene.background = bgTexture;
scene.backgroundIntensity = 0.05;

// Renderer.
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Earth globe.
const geometry = new THREE.SphereGeometry(2, 64, 64);
const material = new THREE.MeshBasicMaterial({ map: texture });
const earthGlobe = new THREE.Mesh(geometry, material);
scene.add(earthGlobe);

// Camera position.
camera.position.z = 5;

// Animation entry point.
function animate() {
  requestAnimationFrame(animate);

  if (!mouseDown) {
    // Bring back the animation to the start position.
    if (earthGlobe.rotation.y + Math.PI / 1000 > Math.PI * 2) earthGlobe.rotation.y = 0;
    earthGlobe.rotation.y += Math.PI / 1000;

    // Maintain the earth globe horizontally aligned with the center.
    if (earthGlobe.rotation.x > 0) {
      earthGlobe.rotation.x -= Math.abs(earthGlobe.rotation.x) / 100;
    } else if (earthGlobe.rotation.x < 0) {
      earthGlobe.rotation.x += Math.abs(earthGlobe.rotation.x) / 100;
    }

    // Fix the earth globe rotation to 0.
    if (Math.abs(earthGlobe.rotation.x) < 0.0005) {
      earthGlobe.rotation.x = 0;
    }
  }

  // Render the frame.
  renderer.render(scene, camera);
}

let mouseDown = false;

// Control the earth globe rotation with the mouse.
function onMouseMove(event) {
  // Do nothing if the mouse is not pressed.
  if (!mouseDown) {
    return;
  }

  // Rotate the earth globe with the mouse movement.
  const x = event.clientX / window.innerWidth;
  const y = event.clientY / window.innerHeight;

  let xRotation = y * Math.PI * 2 - Math.PI;
  earthGlobe.rotation.x = xRotation > 0 ? Math.min(xRotation, 1.5) : Math.max(xRotation, -1.5);
  earthGlobe.rotation.y = x * 2 * Math.PI;
}

function addMouseHandler(canvas) {
  // Control the mouse state.
  canvas.addEventListener("mousedown", () => {
    mouseDown = true;
  });

  canvas.addEventListener("mouseup", () => {
    mouseDown = false;
  });

  // Función para mover la earthGlobe.
  // Control the earth globe rotation with the mouse (if pressed).
  canvas.addEventListener(
    "mousemove",
    function (e) {
      onMouseMove(e);
    },
    false
  );
}

// Driver code.
addMouseHandler(renderer.domElement);
animate();
