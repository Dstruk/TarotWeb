// Configuración de Three.js
let scene, camera, renderer, stars, entity, glow;
let starGeo, starCount = 6000;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas-3d'), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // 1. Universo en Movimiento (Campo de Estrellas)
    starGeo = new THREE.BufferGeometry();
    let starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        starPos[i * 3] = (Math.random() - 0.5) * 1000;
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 1000;
        starPos[i * 3 + 2] = (Math.random() - 0.5) * 1000;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    let starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, transparent: true });
    stars = new THREE.Points(starGeo, starMaterial);
    scene.add(stars);

    // 2. La Entidad de Luz (Esfera de Energía)
    const entityGeom = new THREE.SphereGeometry(1, 64, 64);
    const entityMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });
    entity = new THREE.Mesh(entityGeom, entityMat);
    scene.add(entity);

    // Brillo interno
    const innerLight = new THREE.PointLight(0x00ffff, 5, 15);
    entity.add(innerLight);

    // Aura exterior (Glow)
    const spriteMat = new THREE.SpriteMaterial({
        map: createGlowTexture(),
        color: 0x00ffff,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    glow = new THREE.Sprite(spriteMat);
    glow.scale.set(4, 4, 1);
    entity.add(glow);

    animate();
}

function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(0,255,255,0.8)');
    gradient.addColorStop(0.5, 'rgba(0,255,255,0.3)');
    gradient.addColorStop(1, 'rgba(0,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

function animate() {
    // Viaje estelar (Las estrellas vienen hacia nosotros)
    const positions = starGeo.attributes.position.array;
    for (let i = 0; i < starCount; i++) {
        positions[i * 3 + 2] += 2.5; // Velocidad hacia adelante
        if (positions[i * 3 + 2] > 500) positions[i * 3 + 2] = -500;
    }
    starGeo.attributes.position.needsUpdate = true;

    // Movimiento de la entidad
    entity.rotation.y += 0.005;
    entity.rotation.z += 0.002;
    
    // Pulso suave
    let pulse = 1 + Math.sin(Date.now() * 0.002) * 0.1;
    entity.scale.set(pulse, pulse, pulse);
    glow.scale.set(4 * pulse, 4 * pulse, 1);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// 3. IA y Voz
const API_KEY = "TU_API_KEY_AQUI"; // REEMPLAZA ESTO

document.getElementById('btn-read').addEventListener('click', async () => {
    const user = document.getElementById('input-username').value;
    const level = document.getElementById('interaction-level').value;

    if (!user) return alert("Ingresa el usuario de TikTok");

    // Animación de "Cargando/Meditando"
    gsap.to(entity.material.color, { r: 1, g: 1, b: 1, duration: 1 });
    gsap.to(glow.material.color, { r: 1, g: 1, b: 1, duration: 1 });

    const prompt = `Eres una entidad de luz celestial viajando por el cosmos. 
    Analiza al usuario @${user} que ha dado un ${level}. 
    Dale una lectura de tarot mística y profética. 
    Sé breve (25 palabras máximo). Habla directamente a su alma.`;

    try {
        const text = await fetchGemini(prompt);
        speakAndDisplay(user, text);
    } catch (e) {
        speakAndDisplay(user, "Las sombras bloquean mi visión cósmica...");
    }
});

async function fetchGemini(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await resp.json();
    return data.candidates[0].content.parts[0].text;
}

function speakAndDisplay(user, text) {
    // Mostrar texto
    document.getElementById('user-name').innerText = `@${user}`;
    document.getElementById('tarot-text').innerText = text;
    gsap.to('#response-container', { opacity: 1, y: 0, duration: 1 });

    // Configurar Voz
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.pitch = 0.5; // Voz más profunda/mística
    utterance.rate = 0.8;  // Más lenta para efecto dramático

    // Sincronizar brillo con la voz
    utterance.onstart = () => {
        gsap.to(entity.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.5, repeat: -1, yoyo: true });
    };
    utterance.onend = () => {
        gsap.set(entity.scale, { x: 1, y: 1, z: 1 });
        gsap.to(entity.material.color, { r: 0, g: 1, b: 1, duration: 2 });
    };

    window.speechSynthesis.speak(utterance);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
