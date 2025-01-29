import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

// Configuração da cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 0, 100);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Iluminação
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Função para gerar cor aleatória
function getRandomColor() {
    return new THREE.Color(Math.random(), Math.random(), Math.random());
}

let particles = [];
let particleGeometries = [];
let particleMaterials = [];
let word = "PPGEEC";
let fontLoaded = null;

// Criar input para digitar a palavra
const inputElement = document.createElement("input");
inputElement.type = "text";
inputElement.value = word;
inputElement.style.position = "absolute";
inputElement.style.top = "20px";
inputElement.style.left = "20px";
inputElement.style.padding = "5px";
inputElement.style.fontSize = "16px";
document.body.appendChild(inputElement);

// Criar botão para gerar as partículas
const buttonElement = document.createElement("button");
buttonElement.textContent = "Gerar Partículas";
buttonElement.style.position = "absolute";
buttonElement.style.top = "60px";
buttonElement.style.left = "20px";
document.body.appendChild(buttonElement);

// Atualizar a palavra ao digitar
inputElement.addEventListener("input", (event) => {
    word = event.target.value;
});

// Função para carregar a fonte e criar as partículas
const fontLoader = new FontLoader();
fontLoader.load("https://threejs.org/examples/fonts/optimer_regular.typeface.json", (font) => {
    fontLoaded = font;
});

// Função para criar partículas para a palavra
function updateParticles() {
    // Limpa partículas antigas
    particles.forEach(p => scene.remove(p));
    particles = [];
    particleGeometries = [];
    particleMaterials = [];

    if (!word || !fontLoaded) return;

    const letters = word;
    const spacing = 10;
    let totalWidth = 0;

    // Calcular a largura total da palavra
    for (let i = 0; i < letters.length; i++) {
        const textGeometry = new TextGeometry(letters[i], {
            font: fontLoaded,
            size: 12,
            height: 1,
            curveSegments: 12,
        });
        textGeometry.computeBoundingBox();
        totalWidth += textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x + spacing;
    }

    let currentPosX = -totalWidth / 2;

    for (let i = 0; i < letters.length; i++) {
        const textGeometry = new TextGeometry(letters[i], {
            font: fontLoaded,
            size: 12,
            height: 1,
            curveSegments: 12,
        });

        textGeometry.computeBoundingBox();
        const letterWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
        currentPosX += letterWidth / 2;

        const letterPoints = textGeometry.getAttribute("position").array;
        const letterColor = getRandomColor();

        createParticles(letterPoints, letterColor, currentPosX, i, spacing);
        currentPosX += letterWidth / 2 + spacing;
    }
}

// Função para criar partículas para uma letra
function createParticles(letterPoints, color, posX, letterIndex, spacing) {
    const particleCount = letterPoints.length / 3;
    const particleGeometry = new THREE.BufferGeometry();
    const startPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const randomOffsets = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        startPositions[i * 3] = (Math.random() - 0.5) * 200;
        startPositions[i * 3 + 1] = (Math.random() - 0.5) * 200;
        startPositions[i * 3 + 2] = (Math.random() - 0.5) * 50;

        targetPositions[i * 3] = letterPoints[i * 3] + posX;
        targetPositions[i * 3 + 1] = letterPoints[i * 3 + 1];
        targetPositions[i * 3 + 2] = letterPoints[i * 3 + 2];

        randomOffsets[i * 3] = (Math.random() - 0.5) * 0.2;
        randomOffsets[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
        randomOffsets[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(startPositions, 3));
    particleGeometry.setAttribute("target", new THREE.BufferAttribute(targetPositions, 3));
    particleGeometry.setAttribute("randomOffset", new THREE.BufferAttribute(randomOffsets, 3));

    const materialWithColor = new THREE.PointsMaterial({ size: 0.4, color: color });
    const particleSystem = new THREE.Points(particleGeometry, materialWithColor);

    particles.push(particleSystem);
    particleGeometries.push(particleGeometry);
    particleMaterials.push(materialWithColor);

    scene.add(particleSystem);
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    for (let i = 0; i < particles.length; i++) {
        const posArray = particleGeometries[i].attributes.position.array;
        const targetArray = particleGeometries[i].attributes.target.array;
        const randomOffsetArray = particleGeometries[i].attributes.randomOffset.array;

        for (let j = 0; j < posArray.length; j++) {
            posArray[j] += (targetArray[j] - posArray[j]) * 0.03;
            posArray[j] += Math.sin(Date.now() * 0.001 + randomOffsetArray[j] * 10) * 0.1;
        }

        particleGeometries[i].attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
}

// Gerar partículas ao pressionar o botão
buttonElement.addEventListener("click", () => {
    if (fontLoaded) {
        updateParticles();
    }
});

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
