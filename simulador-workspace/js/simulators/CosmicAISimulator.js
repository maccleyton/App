// CosmicAISimulator.js - Simulador de IA Cósmica
class CosmicAISimulator {
    constructor(sceneManager, physicsEngine) {
        this.sceneManager = sceneManager;
        this.physics = physicsEngine;
        this.isRunning = false;

        // Civilização
        this.civilization = {
            name: 'Humanidade',
            kardashev: 0.73, // Tipo atual da Terra
            population: 8e9,
            energy: 1e13, // Watts
            technology: 0,
            planets: 1,
            stars: 0,
            galaxies: 0
        };

        // Tecnologias
        this.technologies = {
            nuclear: false,
            fusion: false,
            dysonSphere: false,
            warpDrive: false,
            AI: false,
            nanotech: false,
            consciousness: false,
            multiverse: false
        };

        // Universo
        this.planets = [];
        this.stars = [];
        this.colonies = [];
        this.megastructures = [];

        // Tempo (anos)
        this.year = 2025;
        this.timeScale = 1;

        console.log('✅ CosmicAISimulator criado - O Meta-Simulador!');
    }

    init() {
        this.createInterface();
        this.createUniverse();
        this.createEarth();
        this.physics.setGravity(0, 0, 0);
    }

    createInterface() {
        document.getElementById('specific-controls').innerHTML = `
            <h4>🌌 Civilização Cósmica</h4>

            <div class="control-group">
                <label style="color: #ffd700; font-weight: bold;">
                    Escala de Kardashev: <span id="kardashev-value">0.73</span>
                </label>
                <div style="font-size: 0.7rem; color: #888; margin: 5px 0;">
                    Tipo 0: Planetária | Tipo I: Controla planeta<br>
                    Tipo II: Controla estrela | Tipo III: Controla galáxia
                </div>
                <div style="width: 100%; height: 10px; background: rgba(99, 102, 241, 0.2); border-radius: 5px; margin-top: 5px;">
                    <div id="kardashev-bar" style="width: 24%; height: 100%; background: linear-gradient(90deg, #ff0000, #ffff00, #00ff00, #0000ff); border-radius: 5px;"></div>
                </div>
            </div>

            <div class="control-group">
                <label>Ano: <span id="year-display">2025</span></label>
                <div style="font-size: 0.75rem; color: #888;">
                    População: <span id="pop-display">8.0B</span>
                </div>
            </div>

            <div class="control-group">
                <label>Velocidade do Tempo: <span id="timescale-value">1</span>x</label>
                <input type="range" id="timescale-slider" min="1" max="1000" value="1">
            </div>

            <div class="control-group" style="background: rgba(255, 215, 0, 0.1); padding: 10px; border-radius: 8px;">
                <label style="color: #ffd700; font-weight: bold;">🔬 Árvore Tecnológica:</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-top: 8px; font-size: 0.85rem;">
                    <button id="tech-nuclear" class="tech-btn">☢️ Fusão</button>
                    <button id="tech-dyson" class="tech-btn">⭐ Dyson</button>
                    <button id="tech-warp" class="tech-btn">🚀 Warp</button>
                    <button id="tech-ai" class="tech-btn">🤖 Super-IA</button>
                    <button id="tech-nano" class="tech-btn">🔬 Nano</button>
                    <button id="tech-upload" class="tech-btn">🧠 Upload</button>
                </div>
            </div>

            <div class="control-buttons">
                <button id="btn-colonize" class="btn btn-primary">🪐 Colonizar</button>
                <button id="btn-dyson" class="btn">⭐ Esfera Dyson</button>
            </div>

            <div class="control-buttons">
                <button id="btn-seti" class="btn">📡 SETI</button>
                <button id="btn-drake" class="btn">🔢 Eq. Drake</button>
            </div>

            <div class="control-group" style="margin-top: 15px; padding: 10px; background: rgba(99, 102, 241, 0.1); border-radius: 8px;">
                <label style="color: #00d4ff; font-weight: bold;">Império:</label>
                <div id="empire-stats" style="font-family: monospace; font-size: 0.85rem; color: #fff; margin-top: 5px;">
                    Planetas: 1<br>
                    Estrelas: 0<br>
                    Galáxias: 0<br>
                    Energia: 1.0e13 W
                </div>
            </div>

            <style>
            .tech-btn {
                padding: 8px;
                background: rgba(99, 102, 241, 0.2);
                color: #888;
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.85rem;
            }
            .tech-btn:hover {
                background: rgba(99, 102, 241, 0.3);
            }
            .tech-btn.unlocked {
                background: rgba(0, 255, 0, 0.3);
                color: #0f0;
                border-color: #0f0;
            }
            </style>
        `;

        // Event listeners
        document.getElementById('timescale-slider').addEventListener('input', (e) => {
            this.timeScale = parseInt(e.target.value);
            document.getElementById('timescale-value').textContent = this.timeScale;
        });

        // Tech tree
        document.getElementById('tech-nuclear').addEventListener('click', () => this.researchTech('fusion'));
        document.getElementById('tech-dyson').addEventListener('click', () => this.researchTech('dysonSphere'));
        document.getElementById('tech-warp').addEventListener('click', () => this.researchTech('warpDrive'));
        document.getElementById('tech-ai').addEventListener('click', () => this.researchTech('AI'));
        document.getElementById('tech-nano').addEventListener('click', () => this.researchTech('nanotech'));
        document.getElementById('tech-upload').addEventListener('click', () => this.researchTech('consciousness'));

        // Actions
        document.getElementById('btn-colonize').addEventListener('click', () => this.colonizePlanet());
        document.getElementById('btn-dyson').addEventListener('click', () => this.buildDysonSphere());
        document.getElementById('btn-seti').addEventListener('click', () => this.runSETI());
        document.getElementById('btn-drake').addEventListener('click', () => this.calculateDrake());
    }

    createUniverse() {
        // Fundo estrelado
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = [];

        for (let i = 0; i < 5000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starPositions.push(x, y, z);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
        const starField = new THREE.Points(starGeometry, starMaterial);
        this.sceneManager.addObject(starField);
    }

    createEarth() {
        // Terra
        const earthGeometry = new THREE.SphereGeometry(2, 32, 32);
        const earthMaterial = new THREE.MeshStandardMaterial({
            color: 0x0077be,
            emissive: 0x0077be,
            emissiveIntensity: 0.2
        });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        earth.position.set(0, 0, 0);
        this.sceneManager.addObject(earth);

        // Continentes (manchas verdes)
        const landGeometry = new THREE.SphereGeometry(2.01, 16, 16);
        const landMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d5016,
            transparent: true,
            opacity: 0.8
        });
        const land = new THREE.Mesh(landGeometry, landMaterial);
        earth.add(land);

        this.planets.push({
            mesh: earth,
            name: 'Terra',
            colonized: true,
            kardashev: 0.73
        });

        // Sol
        const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
        const sunMaterial = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 1
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.position.set(30, 0, 0);
        this.sceneManager.addObject(sun);

        this.stars.push({ mesh: sun, hasDyson: false });
    }

    researchTech(tech) {
        if (this.technologies[tech]) {
            console.log(`⚠️ \${tech} já foi pesquisado`);
            return;
        }

        // Verificar pré-requisitos
        const prereqs = {
            fusion: () => this.year >= 2030,
            dysonSphere: () => this.technologies.fusion,
            warpDrive: () => this.technologies.fusion && this.civilization.kardashev >= 1.0,
            AI: () => this.year >= 2035,
            nanotech: () => this.technologies.AI,
            consciousness: () => this.technologies.AI && this.technologies.nanotech
        };

        if (prereqs[tech] && !prereqs[tech]()) {
            console.log(`⚠️ Pré-requisitos não atendidos para \${tech}`);
            return;
        }

        this.technologies[tech] = true;

        // Benefícios
        const benefits = {
            fusion: () => {
                this.civilization.energy *= 10;
                this.civilization.kardashev += 0.1;
            },
            dysonSphere: () => {
                this.civilization.kardashev += 0.5;
            },
            warpDrive: () => {
                console.log('🚀 Viagem FTL desbloqueada!');
            },
            AI: () => {
                this.timeScale *= 2;
                console.log('🤖 Singularidade Tecnológica!');
            },
            nanotech: () => {
                this.civilization.population *= 2;
            },
            consciousness: () => {
                console.log('🧠 Upload de consciência atingido!');
                this.civilization.kardashev += 0.2;
            }
        };

        if (benefits[tech]) benefits[tech]();

        // UI update
        const btnMap = {
            fusion: 'tech-nuclear',
            dysonSphere: 'tech-dyson',
            warpDrive: 'tech-warp',
            AI: 'tech-ai',
            nanotech: 'tech-nano',
            consciousness: 'tech-upload'
        };

        document.getElementById(btnMap[tech]).classList.add('unlocked');

        console.log(`✅ \${tech} pesquisado!`);
        this.updateStats();
    }

    colonizePlanet() {
        if (this.civilization.planets >= 10 && !this.technologies.warpDrive) {
            console.log('⚠️ Pesquise Warp Drive para colonizar mais planetas!');
            return;
        }

        const angle = Math.random() * Math.PI * 2;
        const distance = 10 + this.civilization.planets * 5;

        const planetGeometry = new THREE.SphereGeometry(1, 16, 16);
        const planetMaterial = new THREE.MeshStandardMaterial({
            color: Math.random() * 0xffffff,
            emissive: 0x004400,
            emissiveIntensity: 0.3
        });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.position.set(
            Math.cos(angle) * distance,
            (Math.random() - 0.5) * 5,
            Math.sin(angle) * distance
        );
        this.sceneManager.addObject(planet);

        this.planets.push({
            mesh: planet,
            name: `Colônia \${this.civilization.planets + 1}`,
            colonized: true
        });

        this.civilization.planets++;
        this.civilization.population *= 1.5;
        this.civilization.energy *= 1.2;
        this.civilization.kardashev += 0.01;

        // Linha de conexão
        const points = [
            new THREE.Vector3(0, 0, 0),
            planet.position
        ];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        this.sceneManager.addObject(line);

        console.log(`🪐 Planeta colonizado! Total: \${this.civilization.planets}`);
        this.updateStats();
    }

    buildDysonSphere() {
        if (!this.technologies.dysonSphere) {
            console.log('⚠️ Pesquise Esfera de Dyson primeiro!');
            return;
        }

        const sun = this.stars[0];
        if (sun.hasDyson) {
            console.log('⚠️ Estrela já tem Esfera de Dyson!');
            return;
        }

        // Criar esfera de Dyson
        const dysonGeometry = new THREE.SphereGeometry(7, 32, 32);
        const dysonMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const dyson = new THREE.Mesh(dysonGeometry, dysonMaterial);
        dyson.position.copy(sun.mesh.position);
        this.sceneManager.addObject(dyson);

        sun.hasDyson = true;
        sun.dysonMesh = dyson;

        this.civilization.stars++;
        this.civilization.energy *= 100;
        this.civilization.kardashev = Math.min(2.0, this.civilization.kardashev + 0.5);

        this.megastructures.push({ type: 'dyson', mesh: dyson });

        console.log('⭐ ESFERA DE DYSON CONSTRUÍDA! Tipo II alcançado!');
        this.updateStats();
    }

    runSETI() {
        console.log('📡 Iniciando busca por sinais alienígenas...');

        // Probabilidade baseada na Eq. de Drake
        const drakeN = this.calculateDrakeEquation();
        const probability = Math.min(drakeN / 1000, 0.1);

        if (Math.random() < probability) {
            // CONTATO!
            console.log('👽 SINAL DETECTADO! Civilização alienígena encontrada!');
            this.createAlienCivilization();
        } else {
            console.log('📡 Nenhum sinal detectado. Paradoxo de Fermi continua...');
        }
    }

    createAlienCivilization() {
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 200;

        const alienPlanetGeometry = new THREE.SphereGeometry(1.5, 16, 16);
        const alienPlanetMaterial = new THREE.MeshStandardMaterial({
            color: 0xff00ff,
            emissive: 0xff00ff,
            emissiveIntensity: 0.5
        });
        const alienPlanet = new THREE.Mesh(alienPlanetGeometry, alienPlanetMaterial);
        alienPlanet.position.set(
            Math.cos(angle) * distance,
            (Math.random() - 0.5) * 20,
            Math.sin(angle) * distance
        );
        this.sceneManager.addObject(alienPlanet);

        // Sinal de rádio
        for (let i = 0; i < 5; i++) {
            const ringGeometry = new THREE.RingGeometry(2 + i*2, 2.5 + i*2, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.5 - i*0.1,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.copy(alienPlanet.position);
            ring.lookAt(0, 0, 0);
            this.sceneManager.addObject(ring);
        }
    }

    calculateDrake() {
        const N = this.calculateDrakeEquation();

        console.log('🔢 EQUAÇÃO DE DRAKE:');
        console.log(`N = \${N.toFixed(2)} civilizações comunicantes`);
        console.log('Parâmetros:');
        console.log('  R* = 1.5 (formação estelar/ano)');
        console.log('  fp = 0.5 (estrelas com planetas)');
        console.log('  ne = 2 (planetas habitáveis)');
        console.log('  fl = 0.3 (vida surge)');
        console.log('  fi = 0.01 (vida inteligente)');
        console.log('  fc = 0.1 (comunicação)');
        console.log('  L = 10000 (anos comunicando)');
    }

    calculateDrakeEquation() {
        const R = 1.5;  // Taxa de formação estelar
        const fp = 0.5; // Fração com planetas
        const ne = 2;   // Planetas habitáveis por sistema
        const fl = 0.3; // Onde vida surge
        const fi = 0.01; // Vida inteligente
        const fc = 0.1;  // Civilizações comunicantes
        const L = 10000; // Tempo comunicando

        return R * fp * ne * fl * fi * fc * L;
    }

    updateStats() {
        // Kardashev
        this.civilization.kardashev = Math.min(3.0, this.civilization.kardashev);
        document.getElementById('kardashev-value').textContent = this.civilization.kardashev.toFixed(2);
        document.getElementById('kardashev-bar').style.width = (this.civilization.kardashev / 3 * 100) + '%';

        // População
        const popStr = this.civilization.population >= 1e9 ? 
            (this.civilization.population / 1e9).toFixed(1) + 'B' :
            (this.civilization.population / 1e6).toFixed(1) + 'M';
        document.getElementById('pop-display').textContent = popStr;

        // Império
        document.getElementById('empire-stats').innerHTML = `
            Planetas: \${this.civilization.planets}<br>
            Estrelas: \${this.civilization.stars}<br>
            Galáxias: \${this.civilization.galaxies}<br>
            Energia: \${this.civilization.energy.toExponential(1)} W
        `;

        // Partículas para o contador
        document.getElementById('particles-value').textContent = 
            this.planets.length + this.megastructures.length;
    }

    update(deltaTime) {
        if (!this.isRunning) return;

        // Avançar tempo
        this.year += deltaTime * this.timeScale / 10;
        document.getElementById('year-display').textContent = Math.floor(this.year);

        // Rotação dos planetas
        this.planets.forEach(planet => {
            planet.mesh.rotation.y += 0.01;
        });

        // Rotação das esferas de Dyson
        this.stars.forEach(star => {
            if (star.dysonMesh) {
                star.dysonMesh.rotation.y += 0.005;
                star.dysonMesh.rotation.x += 0.002;
            }
        });

        // Crescimento natural
        if (this.year > 2025) {
            this.civilization.technology += 0.001;
            this.civilization.energy *= 1.0001;
        }

        this.updateStats();
    }

    start() {
        this.isRunning = true;
        console.log('🌌 Civilização ativada! Conquiste o cosmos!');
    }

    pause() {
        this.isRunning = false;
    }

    reset() {
        this.year = 2025;
        this.civilization = {
            kardashev: 0.73,
            population: 8e9,
            energy: 1e13,
            planets: 1,
            stars: 0,
            galaxies: 0
        };
        this.technologies = {};
        this.updateStats();
    }

    cleanup() {
        this.planets.forEach(p => this.sceneManager.removeObject(p.mesh));
        this.megastructures.forEach(m => this.sceneManager.removeObject(m.mesh));
        this.planets = [];
        this.megastructures = [];
    }
}