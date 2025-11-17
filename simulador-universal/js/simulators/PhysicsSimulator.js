// PhysicsSimulator.js - Simulador de Física de Partículas
class PhysicsSimulator {
    constructor(sceneManager, physicsEngine) {
        this.sceneManager = sceneManager;
        this.physics = physicsEngine;
        this.isRunning = false;

        // Partículas
        this.particles = [];
        this.collisionEvents = [];
        this.trails = [];

        // Acelerador
        this.accelerator = null;
        this.beamEnergy = 1; // TeV

        // Partículas elementares
        this.particleTypes = {
            electron: { name: 'Elétron', mass: 0.511, charge: -1, color: 0x0088ff },
            positron: { name: 'Pósitron', mass: 0.511, charge: 1, color: 0xff0088 },
            proton: { name: 'Próton', mass: 938.3, charge: 1, color: 0xff0000 },
            neutron: { name: 'Nêutron', mass: 939.6, charge: 0, color: 0x888888 },
            photon: { name: 'Fóton', mass: 0, charge: 0, color: 0xffff00 },
            neutrino: { name: 'Neutrino', mass: 0.001, charge: 0, color: 0x00ffff },
            quark: { name: 'Quark', mass: 2.3, charge: 0.67, color: 0xff00ff },
            higgs: { name: 'Bóson de Higgs', mass: 125000, charge: 0, color: 0xffd700 }
        };

        console.log('✅ PhysicsSimulator criado');
    }

    init() {
        this.createInterface();
        this.createAccelerator();
        this.physics.setGravity(0, 0, 0);
    }

    createInterface() {
        document.getElementById('specific-controls').innerHTML = `
            <h4>⚡ Controles de Física</h4>

            <div class="control-group">
                <label>Tipo de Experimento:</label>
                <select id="physics-experiment" style="width: 100%; padding: 8px; border-radius: 5px; background: rgba(99, 102, 241, 0.1); color: white; border: 1px solid rgba(99, 102, 241, 0.3);">
                    <option value="electron-positron">Colisão e⁻ + e⁺</option>
                    <option value="proton-proton">Colisão p + p (LHC)</option>
                    <option value="beta-decay">Decaimento Beta</option>
                    <option value="pair-production">Produção de Pares</option>
                    <option value="compton">Espalhamento Compton</option>
                    <option value="higgs">Busca do Higgs</option>
                    <option value="nucleosynthesis">Nucleossíntese</option>
                </select>
            </div>

            <div class="control-group">
                <label>Energia do Feixe: <span id="beam-energy-value">1.0</span> TeV</label>
                <input type="range" id="beam-energy" min="0.1" max="14" step="0.1" value="1">
            </div>

            <div class="control-group">
                <label>Intensidade: <span id="beam-intensity-value">10</span> partículas/s</label>
                <input type="range" id="beam-intensity" min="1" max="50" step="1" value="10">
            </div>

            <div class="control-group">
                <label>
                    <input type="checkbox" id="show-trails" checked> Mostrar Rastros
                </label>
            </div>

            <div class="control-buttons">
                <button id="btn-fire-beam" class="btn btn-primary">🔫 Disparar Feixe</button>
                <button id="btn-collide" class="btn">💥 Forçar Colisão</button>
            </div>

            <div class="control-group" style="margin-top: 15px; padding: 10px; background: rgba(99, 102, 241, 0.1); border-radius: 8px;">
                <label style="color: #00d4ff; font-weight: bold;">Detector:</label>
                <div id="detector-info" style="font-family: monospace; font-size: 0.85rem; color: #fff; margin-top: 5px;">
                    Colisões: 0<br>
                    Energia Total: 0 GeV<br>
                    Partículas Detectadas: 0
                </div>
            </div>
        `;

        document.getElementById('physics-experiment').addEventListener('change', (e) => {
            this.setupExperiment(e.target.value);
        });

        document.getElementById('beam-energy').addEventListener('input', (e) => {
            this.beamEnergy = parseFloat(e.target.value);
            document.getElementById('beam-energy-value').textContent = e.target.value;
        });

        document.getElementById('beam-intensity').addEventListener('input', (e) => {
            document.getElementById('beam-intensity-value').textContent = e.target.value;
        });

        document.getElementById('btn-fire-beam').addEventListener('click', () => this.fireBeam());
        document.getElementById('btn-collide').addEventListener('click', () => this.forceCollision());

        this.setupExperiment('electron-positron');
    }

    createAccelerator() {
        // Criar anel do acelerador
        const ringGeometry = new THREE.TorusGeometry(15, 0.3, 16, 100);
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: 0x4444ff,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x0000ff,
            emissiveIntensity: 0.3
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        this.sceneManager.addObject(ring);
        this.accelerator = ring;

        // Detector central
        const detectorGeometry = new THREE.CylinderGeometry(3, 3, 6, 32);
        const detectorMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.7
        });
        const detector = new THREE.Mesh(detectorGeometry, detectorMaterial);
        detector.rotation.z = Math.PI / 2;
        this.sceneManager.addObject(detector);
    }

    setupExperiment(type) {
        this.clearParticles();
        console.log(`🔬 Experimento: \${type}`);

        switch(type) {
            case 'electron-positron':
                this.createBeamParticles('electron', -15, 1);
                this.createBeamParticles('positron', 15, -1);
                break;
            case 'proton-proton':
                this.createBeamParticles('proton', -15, 1);
                this.createBeamParticles('proton', 15, -1);
                break;
            case 'beta-decay':
                this.createBetaDecay();
                break;
            case 'pair-production':
                this.createPairProduction();
                break;
            case 'compton':
                this.createComptonScattering();
                break;
            case 'higgs':
                this.createHiggsSearch();
                break;
            case 'nucleosynthesis':
                this.createNucleosynthesis();
                break;
        }
    }

    createBeamParticles(type, x, direction) {
        for (let i = 0; i < 3; i++) {
            const particle = this.createParticle(type, {
                x: x,
                y: (Math.random() - 0.5) * 2,
                z: (Math.random() - 0.5) * 2
            });

            particle.velocity.set(direction * this.beamEnergy * 0.5, 0, 0);
            this.particles.push(particle);
        }
    }

    createParticle(type, position) {
        const pType = this.particleTypes[type];

        const geometry = new THREE.SphereGeometry(0.3, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: pType.color,
            emissive: pType.color,
            emissiveIntensity: 0.6,
            metalness: 0.5
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position.x, position.y, position.z);
        this.sceneManager.addObject(mesh);

        // Glow
        const glowGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: pType.color,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        mesh.add(glow);

        return {
            mesh: mesh,
            type: type,
            mass: pType.mass,
            charge: pType.charge,
            velocity: new THREE.Vector3(0, 0, 0),
            position: new THREE.Vector3(position.x, position.y, position.z),
            trail: [],
            destroyed: false
        };
    }

    createBetaDecay() {
        // Nêutron que decai em próton + elétron + neutrino
        const neutron = this.createParticle('neutron', { x: 0, y: 0, z: 0 });
        this.particles.push(neutron);

        setTimeout(() => {
            if (!neutron.destroyed) {
                // Decaimento
                this.sceneManager.removeObject(neutron.mesh);
                neutron.destroyed = true;

                // Produtos
                const proton = this.createParticle('proton', { x: 0, y: 0, z: 0 });
                proton.velocity.set(0.5, 0, 0);
                this.particles.push(proton);

                const electron = this.createParticle('electron', { x: 0, y: 0, z: 0 });
                electron.velocity.set(-0.7, 0.3, 0);
                this.particles.push(electron);

                const neutrino = this.createParticle('neutrino', { x: 0, y: 0, z: 0 });
                neutrino.velocity.set(-0.3, -0.5, 0);
                this.particles.push(neutrino);

                console.log('☢️ Decaimento Beta: n → p + e⁻ + νₑ');
            }
        }, 2000);
    }

    createPairProduction() {
        // Fóton de alta energia cria par e⁻/e⁺
        const photon = this.createParticle('photon', { x: -10, y: 0, z: 0 });
        photon.velocity.set(2, 0, 0);
        this.particles.push(photon);

        photon.pairProduction = true;
    }

    createComptonScattering() {
        // Fóton colide com elétron
        const photon = this.createParticle('photon', { x: -10, y: 0, z: 0 });
        photon.velocity.set(1.5, 0, 0);
        this.particles.push(photon);

        const electron = this.createParticle('electron', { x: 5, y: 0, z: 0 });
        electron.velocity.set(-0.2, 0, 0);
        this.particles.push(electron);
    }

    createHiggsSearch() {
        // Colisão de prótons busca Higgs
        this.createBeamParticles('proton', -15, 1);
        this.createBeamParticles('proton', 15, -1);

        this.higgsSearch = true;
    }

    createNucleosynthesis() {
        // Fusão de prótons e nêutrons
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const proton = this.createParticle('proton', {
                x: Math.cos(angle) * 5,
                y: Math.sin(angle) * 5,
                z: 0
            });
            proton.velocity.set(-Math.cos(angle) * 0.3, -Math.sin(angle) * 0.3, 0);
            this.particles.push(proton);
        }
    }

    fireBeam() {
        const intensity = parseInt(document.getElementById('beam-intensity').value);
        const experiment = document.getElementById('physics-experiment').value;

        for (let i = 0; i < intensity; i++) {
            setTimeout(() => {
                if (experiment === 'electron-positron') {
                    const e1 = this.createParticle('electron', { 
                        x: -15, 
                        y: (Math.random()-0.5)*2, 
                        z: (Math.random()-0.5)*2 
                    });
                    e1.velocity.set(this.beamEnergy * 0.5, 0, 0);
                    this.particles.push(e1);

                    const e2 = this.createParticle('positron', { 
                        x: 15, 
                        y: (Math.random()-0.5)*2, 
                        z: (Math.random()-0.5)*2 
                    });
                    e2.velocity.set(-this.beamEnergy * 0.5, 0, 0);
                    this.particles.push(e2);
                }
            }, i * 100);
        }
    }

    forceCollision() {
        if (this.particles.length < 2) return;

        const p1 = this.particles[0];
        const p2 = this.particles[1];

        p1.velocity.set(1, 0, 0);
        p2.velocity.set(-1, 0, 0);
    }

    checkCollisions() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];

                if (p1.destroyed || p2.destroyed) continue;

                const dist = p1.position.distanceTo(p2.position);

                if (dist < 1) {
                    this.handleCollision(p1, p2);
                }
            }
        }

        // Pair production
        this.particles.forEach(p => {
            if (p.pairProduction && p.position.x > 0 && !p.destroyed) {
                this.sceneManager.removeObject(p.mesh);
                p.destroyed = true;

                const electron = this.createParticle('electron', { 
                    x: p.position.x, 
                    y: p.position.y, 
                    z: p.position.z 
                });
                electron.velocity.set(0.5, 0.5, 0);
                this.particles.push(electron);

                const positron = this.createParticle('positron', { 
                    x: p.position.x, 
                    y: p.position.y, 
                    z: p.position.z 
                });
                positron.velocity.set(0.5, -0.5, 0);
                this.particles.push(positron);

                console.log('✨ Produção de pares: γ → e⁻ + e⁺');
            }
        });
    }

    handleCollision(p1, p2) {
        this.collisionEvents.push({
            pos: p1.position.clone(),
            time: Date.now()
        });

        // Aniquilação e⁻ + e⁺
        if ((p1.type === 'electron' && p2.type === 'positron') ||
            (p1.type === 'positron' && p2.type === 'electron')) {

            this.sceneManager.removeObject(p1.mesh);
            this.sceneManager.removeObject(p2.mesh);
            p1.destroyed = true;
            p2.destroyed = true;

            // Criar fótons
            for (let i = 0; i < 2; i++) {
                const angle = Math.random() * Math.PI * 2;
                const photon = this.createParticle('photon', {
                    x: p1.position.x,
                    y: p1.position.y,
                    z: p1.position.z
                });
                photon.velocity.set(
                    Math.cos(angle) * 2,
                    Math.sin(angle) * 2,
                    0
                );
                this.particles.push(photon);
            }

            console.log('💥 Aniquilação: e⁻ + e⁺ → 2γ');
            this.createExplosion(p1.position);
        }

        // Busca do Higgs (raro!)
        if (this.higgsSearch && p1.type === 'proton' && p2.type === 'proton') {
            if (Math.random() < 0.01) { // 1% de chance
                const higgs = this.createParticle('higgs', {
                    x: (p1.position.x + p2.position.x) / 2,
                    y: (p1.position.y + p2.position.y) / 2,
                    z: (p1.position.z + p2.position.z) / 2
                });
                higgs.velocity.set(0, 0, 0);
                this.particles.push(higgs);

                console.log('🎉 BÓSON DE HIGGS DETECTADO!');
                this.createExplosion(higgs.position, 0xffd700);
            }
        }

        // Compton scattering
        if ((p1.type === 'photon' && p2.type === 'electron') ||
            (p1.type === 'electron' && p2.type === 'photon')) {

            const photon = p1.type === 'photon' ? p1 : p2;
            const electron = p1.type === 'electron' ? p1 : p2;

            // Deflexão
            const newDir = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                0
            ).normalize();

            photon.velocity.copy(newDir.multiplyScalar(1.5));
            electron.velocity.copy(newDir.clone().negate().multiplyScalar(0.5));

            console.log('🔄 Espalhamento Compton');
        }
    }

    createExplosion(position, color = 0xffff00) {
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const geometry = new THREE.SphereGeometry(0.1, 8, 8);
            const material = new THREE.MeshBasicMaterial({ color: color });
            const particle = new THREE.Mesh(geometry, material);

            particle.position.copy(position);
            this.sceneManager.addObject(particle);

            const velocity = new THREE.Vector3(
                Math.cos(angle) * 0.5,
                Math.sin(angle) * 0.5,
                (Math.random() - 0.5) * 0.5
            );

            this.collisionEvents.push({
                mesh: particle,
                velocity: velocity,
                life: 1.0
            });
        }
    }

    updateDetectorInfo() {
        const totalEnergy = this.particles.reduce((sum, p) => {
            if (!p.destroyed) {
                return sum + p.velocity.length() * p.mass;
            }
            return sum;
        }, 0);

        document.getElementById('detector-info').innerHTML = `
            Colisões: ${this.collisionEvents.filter(e => e.time).length}<br>
            Energia Total: ${totalEnergy.toFixed(2)} GeV<br>
            Partículas: ${this.particles.filter(p => !p.destroyed).length}
        `;
    }

    update(deltaTime) {
        if (!this.isRunning) return;

        // Rotação do acelerador
        if (this.accelerator) {
            this.accelerator.rotation.z += 0.005;
        }

        // Atualizar partículas
        this.particles.forEach(p => {
            if (p.destroyed) return;

            p.position.add(p.velocity.clone().multiplyScalar(deltaTime));
            p.mesh.position.copy(p.position);

            // Rastros
            if (document.getElementById('show-trails')?.checked) {
                p.trail.push(p.position.clone());
                if (p.trail.length > 50) p.trail.shift();
            }

            // Remover se muito longe
            if (p.position.length() > 50) {
                this.sceneManager.removeObject(p.mesh);
                p.destroyed = true;
            }
        });

        // Verificar colisões
        this.checkCollisions();

        // Atualizar explosões
        this.collisionEvents.forEach((event, i) => {
            if (event.mesh) {
                event.mesh.position.add(event.velocity);
                event.life -= deltaTime;
                event.mesh.material.opacity = event.life;

                if (event.life <= 0) {
                    this.sceneManager.removeObject(event.mesh);
                    this.collisionEvents.splice(i, 1);
                }
            }
        });

        this.updateDetectorInfo();
        document.getElementById('particles-value').textContent = 
            this.particles.filter(p => !p.destroyed).length;
    }

    clearParticles() {
        this.particles.forEach(p => this.sceneManager.removeObject(p.mesh));
        this.collisionEvents.forEach(e => {
            if (e.mesh) this.sceneManager.removeObject(e.mesh);
        });
        this.particles = [];
        this.collisionEvents = [];
        this.higgsSearch = false;
    }

    start() {
        this.isRunning = true;
    }

    pause() {
        this.isRunning = false;
    }

    reset() {
        this.setupExperiment(document.getElementById('physics-experiment').value);
    }

    cleanup() {
        this.clearParticles();
    }
}