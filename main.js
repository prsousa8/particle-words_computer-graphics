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

// Carregar fonte e criar partículas
const fontLoader = new FontLoader();
fontLoader.load("https://threejs.org/examples/fonts/optimer_regular.typeface.json", (font) => {
    const letters = "PPGEEC"; // Palavra pode ser dinâmica, basta mudar essa variável
    const spacing = 10; // Ajuste do espaçamento entre letras
    let totalWidth = 0; // Largura total da palavra

    // Calcular a largura total da palavra
    for (let i = 0; i < letters.length; i++) {
        const textGeometry = new TextGeometry(letters[i], {
            font: font,
            size: 12,
            height: 1,
            curveSegments: 12,
        });
        textGeometry.computeBoundingBox();
        totalWidth += textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x + spacing;
    }

    let currentPosX = -totalWidth / 2;

    // Criar partículas para cada letra com base na largura total da palavra
    for (let i = 0; i < letters.length; i++) {
        const textGeometry = new TextGeometry(letters[i], {
            font: font,
            size: 12,
            height: 1,
            curveSegments: 12,
        });

        textGeometry.computeBoundingBox();
        const letterWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;

        // Centralizar as letras
        currentPosX += letterWidth / 2;

        const letterPoints = textGeometry.getAttribute("position").array;
        const letterColor = getRandomColor();

        // Criar partículas para cada letra
        createParticles(letterPoints, letterColor, currentPosX, i, spacing);

        // Ajustar a posição X para a próxima letra
        currentPosX += letterWidth / 2 + spacing;
    }
});

let particles = [];
let particleGeometries = [];
let particleMaterials = [];

function createParticles(letterPoints, color, posX, letterIndex, spacing) {
    const particleCount = letterPoints.length / 3;
    const particleGeometry = new THREE.BufferGeometry();
    const startPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const randomOffsets = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        // Atribuindo posições aleatórias para dispersão inicial
        startPositions[i * 3] = (Math.random() - 0.5) * 200;
        startPositions[i * 3 + 1] = (Math.random() - 0.5) * 200;
        startPositions[i * 3 + 2] = (Math.random() - 0.5) * 50;

        // Movendo as partículas para as posições das letras
        targetPositions[i * 3] = letterPoints[i * 3] + posX;
        targetPositions[i * 3 + 1] = letterPoints[i * 3 + 1];
        targetPositions[i * 3 + 2] = letterPoints[i * 3 + 2];

        // Criando valores de deslocamento aleatório para o movimento contínuo
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
            // Movendo as partículas em direção às posições das letras
            posArray[j] += (targetArray[j] - posArray[j]) * 0.03;

            // Movendo as partículas aleatoriamente para criar o movimento contínuo
            posArray[j] += Math.sin(Date.now() * 0.001 + randomOffsetArray[j] * 10) * 0.1;
        }

        particleGeometries[i].attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
}

// Ajuste da tela ao redimensionar
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
