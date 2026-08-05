// Configuración de Three.js y Universo Galáctico Dinámico
let scene, camera, renderer, stars, entity, glow;
let starGeo, starCount = 8000;
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
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas-3d'), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    starGeo = new THREE.BufferGeometry();
    let starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        starPos[i * 3] = (Math.random() - 0.5) * 1500;
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 1500;
        starPos[i * 3 + 2] = (Math.random() - 0.5) * 1500;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    let starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, transparent: true });
    stars = new THREE.Points(starGeo, starMaterial);
    scene.add(stars);

    createCosmos();

    const entityGeom = new THREE.SphereGeometry(1.2, 64, 64);
    const entityMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.4, wireframe: true });
    entity = new THREE.Mesh(entityGeom, entityMat);
    scene.add(entity);

    const innerLight = new THREE.PointLight(0x00ffff, 10, 20);
    entity.add(innerLight);

    const spriteMat = new THREE.SpriteMaterial({
        map: createGlowTexture(),
        color: 0x00ffff,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    glow = new THREE.Sprite(spriteMat);
    glow.scale.set(6, 6, 1);
    entity.add(glow);

    animate();
}

function createCosmos() {
    for (let i = 0; i < 60; i++) {
        const type = Math.random();
        let obj;
        if (type > 0.4) {
            const geom = new THREE.SphereGeometry(Math.random() * 8 + 2, 32, 32);
            const color = new THREE.Color().setHSL(Math.random(), 0.8, 0.4);
            const mat = new THREE.MeshBasicMaterial({ color: color, wireframe: Math.random() > 0.8 });
            obj = new THREE.Mesh(geom, mat);
        } else {
            const spriteMat = new THREE.SpriteMaterial({
                map: createGlowTexture(),
                color: new THREE.Color().setHSL(Math.random(), 1, 0.7),
                transparent: true,
                blending: THREE.AdditiveBlending,
                opacity: 0.3
            });
            obj = new THREE.Sprite(spriteMat);
            obj.scale.set(100, 100, 1);
        }
        resetCosmosObject(obj);
        scene.add(obj);
        cosmosObjects.push(obj);
    }
}

function resetCosmosObject(obj) {
    obj.position.x = (Math.random() - 0.5) * 1200;
    obj.position.y = (Math.random() - 0.5) * 1200;
    obj.position.z = -1500 - (Math.random() * 1000);
}

function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(0,255,255,0.8)');
    gradient.addColorStop(0.5, 'rgba(0,255,255,0.2)');
    gradient.addColorStop(1, 'rgba(0,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
}

function animate() {
    const positions = starGeo.attributes.position.array;
    for (let i = 0; i < starCount; i++) {
        positions[i * 3 + 2] += 4.5; 
        if (positions[i * 3 + 2] > 10) positions[i * 3 + 2] = -1500;
    }
    starGeo.attributes.position.needsUpdate = true;

    cosmosObjects.forEach(obj => {
        obj.position.z += 4.0;
        obj.rotation.x += 0.005;
        obj.rotation.y += 0.005;
        if (obj.position.z > 100) resetCosmosObject(obj);
    });

    entity.rotation.y += 0.01;
    entity.rotation.z += 0.005;
    
    let pulse = 1 + Math.sin(Date.now() * 0.005) * 0.15;
    entity.scale.set(pulse, pulse, pulse);
    glow.scale.set(6 * pulse, 6 * pulse, 1);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

const API_KEY = "AIzaSyAaS6zvPr0EE7VGzIrq_iSHgBtRy-uXb9A"; 

document.getElementById('btn-read').addEventListener('click', async () => {
    const user = document.getElementById('input-username').value;
    const comment = document.getElementById('input-comment').value;
    const level = document.getElementById('interaction-level').value;

    if (!user || !comment) return alert("Por favor, ingresa el usuario y el comentario.");

    const card = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
    const scannerLog = document.getElementById('scanner-log');
    
    // EFECTO VISUAL DE ESPERA
    if (scannerLog) {
        scannerLog.parentNode.style.display = "block";
        scannerLog.innerHTML = `<p style="color:#00f2ff">[SISTEMA] Percibiendo la vibración de @${user.toUpperCase()}...</p>`;
    }

    gsap.to(entity.material.color, { r: 1, g: 0.1, b: 0, duration: 0.2 }); 

    // PROMPT DE CONSEJO REAL (Sin palabras prohibidas para la IA)
    const prompt = `Actúa como un sabio Guía Espiritual que habita en el flujo de la energía universal. 
    Has recibido este mensaje de un consultante en TikTok:
    - Nombre del consultante: @${user}
    - Palabras del consultante: "${comment}"
    - Tipo de ofrenda: ${level}
    - Carta del destino asignada: "${card.name}"
    
    TU TAREA:
    1. Lee entre líneas el comentario "${comment}". Identifica su emoción (tristeza, ansiedad, esperanza).
    2. Dale un consejo espiritual REAL y DIRECTO. No uses respuestas prefabricadas.
    3. Explica cómo la carta "${card.name}" le ayudará a resolver su situación actual basándote en lo que él mismo escribió.
    4. Sé místico, empático y asombroso. 
    5. Máximo 35 palabras. Habla directamente a su corazón. NUNCA menciones que eres una inteligencia artificial.`;

    try {
        const text = await fetchGemini(prompt);
        speakAndDisplay(user, text, card);
    } catch (e) {
        console.error("DETALLE DEL ERROR:", e);
        document.getElementById('tarot-text').innerText = "Error en la conexión cósmica: " + e.message;
        gsap.to(entity.material.color, { r: 0, g: 1, b: 1, duration: 2 });
    }
});

async function fetchGemini(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error ? err.error.message : "Fallo en la API de Google");
    }

    const data = await resp.json();
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
        throw new Error("La IA bloqueó el mensaje por seguridad. Intenta con otras palabras.");
    }
    
    return data.candidates[0].content.parts[0].text;
}

function speakAndDisplay(user, text, card) {
    document.getElementById('user-name').innerText = `@${user}`;
    document.getElementById('tarot-text').innerText = text;
    
    const cardDisplay = document.getElementById('card-display');
    cardDisplay.innerHTML = `<div style="padding:15px; text-align:center; color:white; background:rgba(0,0,0,0.6); border-radius:15px; border: 1px solid #ffd700; box-shadow: 0 0 25px #ffd700;">
        <h3 style="color:#ffd700; margin:0; font-size:1.4rem;">${card.name}</h3>
        <p style="font-size:0.9rem; margin-top:5px;">${card.desc}</p>
    </div>`;
    cardDisplay.style.display = "flex";
    cardDisplay.classList.add('active');

    gsap.to('#response-container', { opacity: 1, y: 0, duration: 1 });
    if (document.getElementById('scanner-container')) document.getElementById('scanner-container').style.display = "none";

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.pitch = 0.45; 
    utterance.rate = 0.85;

    utterance.onstart = () => {
        gsap.to(entity.scale, { x: 2.5, y: 2.5, z: 2.5, duration: 0.3, repeat: -1, yoyo: true });
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
