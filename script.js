// Configuración de Three.js
let scene, camera, renderer, stars, entity, glow;
let starGeo, starCount = 6000;
let cosmosObjects = []; 

const TAROT_CARDS = [
    { name: "El Loco", desc: "Nuevos comienzos, fe, espontaneidad." },
    { name: "El Mago", desc: "Acción, consciencia, poder personal." },
    { name: "La Sacerdotisa", desc: "Intuición, misterio, subconsciente." },
    { name: "La Emperatriz", desc: "Fecundidad, naturaleza, abundancia." },
    { name: "El Emperador", desc: "Autoridad, estructura, control." },
    { name: "El Hierofante", desc: "Tradición, conformismo, sabiduría." },
    { name: "Los Enamorados", desc: "Unión, dualidad, elecciones." },
    { name: "El Carro", desc: "Victoria, determinación, control." },
    { name: "La Fuerza", desc: "Valor, paciencia, compasión." },
    { name: "El Ermitaño", desc: "Introspección, soledad, guía." },
    { name: "La Rueda de la Fortuna", desc: "Cambio, destino, ciclos." },
    { name: "La Justicia", desc: "Equilibrio, verdad, ley." },
    { name: "El Colgado", desc: "Pausa, sacrificio, nueva perspectiva." },
    { name: "La Muerte", desc: "Final de un ciclo, transformación." },
    { name: "La Templanza", desc: "Equilibrio, moderación, paciencia." },
    { name: "El Diablo", desc: "Adicción, materialismo, sombras." },
    { name: "La Torre", desc: "Cambio súbito, revelación, caída." },
    { name: "La Estrella", desc: "Esperanza, espiritualidad, renovación." },
    { name: "La Luna", desc: "Miedo, ilusión, subconsciente." },
    { name: "El Sol", desc: "Éxito, vitalidad, alegría." },
    { name: "El Juicio", desc: "Renacimiento, llamado, perdón." },
    { name: "El Mundo", desc: "Cumplimiento, viaje, integración." }
];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas-3d'), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

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

    createCosmos();

    const entityGeom = new THREE.SphereGeometry(1, 64, 64);
    const entityMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });
    entity = new THREE.Mesh(entityGeom, entityMat);
    scene.add(entity);

    const innerLight = new THREE.PointLight(0x00ffff, 5, 15);
    entity.add(innerLight);

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

function createCosmos() {
    for (let i = 0; i < 40; i++) {
        const type = Math.random();
        let obj;
        if (type > 0.6) {
            const geom = new THREE.SphereGeometry(Math.random() * 6 + 1, 32, 32);
            const color = new THREE.Color().setHSL(Math.random(), 0.7, 0.5);
            const mat = new THREE.MeshBasicMaterial({ color: color, wireframe: Math.random() > 0.7 });
            obj = new THREE.Mesh(geom, mat);
        } else {
            const spriteMat = new THREE.SpriteMaterial({
                map: createGlowTexture(),
                color: new THREE.Color().setHSL(Math.random(), 1, 0.7),
                transparent: true,
                blending: THREE.AdditiveBlending,
                opacity: 0.4
            });
            obj = new THREE.Sprite(spriteMat);
            obj.scale.set(50, 50, 1);
        }
        resetCosmosObject(obj);
        scene.add(obj);
        cosmosObjects.push(obj);
    }
}

function resetCosmosObject(obj) {
    obj.position.x = (Math.random() - 0.5) * 600;
    obj.position.y = (Math.random() - 0.5) * 600;
    obj.position.z = -1000 - (Math.random() * 800);
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
    return new THREE.CanvasTexture(canvas);
}

function animate() {
    const positions = starGeo.attributes.position.array;
    for (let i = 0; i < starCount; i++) {
        positions[i * 3 + 2] += 3.0; 
        if (positions[i * 3 + 2] > 5) positions[i * 3 + 2] = -1000;
    }
    starGeo.attributes.position.needsUpdate = true;

    cosmosObjects.forEach(obj => {
        obj.position.z += 2.5;
        obj.rotation.x += 0.005;
        obj.rotation.y += 0.005;
        if (obj.position.z > 50) resetCosmosObject(obj);
    });

    entity.rotation.y += 0.008;
    entity.rotation.z += 0.003;
    
    let pulse = 1 + Math.sin(Date.now() * 0.003) * 0.12;
    entity.scale.set(pulse, pulse, pulse);
    glow.scale.set(4 * pulse, 4 * pulse, 1);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

const API_KEY = "AIzaSyAaS6zvPr0EE7VGzIrq_iSHgBtRy-uXb9A"; 

// LA INTELIGENCIA DE RASTREO (Algoritmo de Detección)
async function getDigitalAura() {
    const now = new Date();
    // Simulamos una investigación profunda en milisegundos
    return {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        localHour: now.getHours(),
        browserLanguage: navigator.language,
        platform: navigator.platform,
        connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
        // Generamos un hash de "personalidad digital" basado en el nombre y metadatos
        digitalVibration: Math.random().toString(36).substring(7),
        isNightWalker: now.getHours() > 22 || now.getHours() < 5
    };
}

document.getElementById('btn-read').addEventListener('click', async () => {
    const user = document.getElementById('input-username').value;
    const level = document.getElementById('interaction-level').value;

    if (!user) return alert("Ingresa el usuario de TikTok");

    const card = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
    const aura = await getDigitalAura();

    // Visual de "Investigando..."
    document.getElementById('tarot-text').innerText = "Investigando rastro digital del alma...";
    gsap.to(entity.material.color, { r: 1, g: 0.5, b: 0, duration: 0.3 }); // Color de alerta/escaneo

    // El Prompt ahora incluye la "investigación" del algoritmo
    const prompt = `Actúa como una Entidad de Luz que ha hackeado el algoritmo cósmico de TikTok. 
    En milisegundos has investigado a @${user}. 
    DATOS DETECTADOS:
    - Nivel de Sacrificio/Regalo: ${level}
    - Rastro Temporal: ${aura.timezone} (Hora local: ${aura.localHour}:00)
    - Espectro de Dispositivo: ${aura.platform}
    - Vibración Digital Única: ${aura.digitalVibration}
    - Carta del Destino: "${card.name}"
    
    Basado en estos datos "seguros", deduce hipotéticamente qué le preocupa o qué busca este usuario sin que él te lo haya dicho. 
    Dile una lectura de tarot ÚNICA, mística y aterradoramente precisa de máximo 25 palabras. 
    Habla como si pudieras ver su historial de vida a través de sus acciones digitales. 
    NO repitas respuestas. Sé directo y profético.`;

    try {
        const text = await fetchGemini(prompt);
        speakAndDisplay(user, text, card);
    } catch (e) {
        speakAndDisplay(user, "El rastro digital se ha desvanecido en el vacío...", card);
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

function speakAndDisplay(user, text, card) {
    document.getElementById('user-name').innerText = `@${user}`;
    document.getElementById('tarot-text').innerText = text;
    
    const cardDisplay = document.getElementById('card-display');
    cardDisplay.innerHTML = `<div style="padding:15px; text-align:center; color:white;">
        <h3 style="color:#ffd700; margin:0; font-size:1.3rem; text-shadow: 0 0 10px #000;">${card.name}</h3>
        <p style="font-size:0.9rem; margin-top:5px; text-shadow: 0 0 5px #000;">${card.desc}</p>
    </div>`;
    cardDisplay.style.display = "flex";
    cardDisplay.classList.add('active');

    gsap.to('#response-container', { opacity: 1, y: 0, duration: 1 });

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.pitch = 0.5;
    utterance.rate = 0.8;

    utterance.onstart = () => {
        gsap.to(entity.scale, { x: 2, y: 2, z: 2, duration: 0.3, repeat: -1, yoyo: true });
        gsap.to(entity.material.color, { r: 1, g: 1, b: 1, duration: 0.2 });
    };
    utterance.onend = () => {
        gsap.killTweensOf(entity.scale);
        gsap.to(entity.scale, { x: 1, y: 1, z: 1, duration: 1 });
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
