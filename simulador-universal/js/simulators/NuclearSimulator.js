// NuclearSimulator.js - Simulador Nuclear
class NuclearSimulator {
    constructor(sceneManager, physicsEngine) {
        this.sceneManager = sceneManager;
        this.physics = physicsEngine;
        this.particles = [];
        this.nuclei = [];
        this.radiationRays = [];
        this.isRunning = false;
        this.simulationSpeed = 1.0;

        // Parâmetros físicos
        this.temperature = 298; // Kelvin
        this.magneticField = 0; // Tesla
        this.radiationLevel = 0;

        // Elementos da tabela periódica (simplificado)
        this.elements = {
            H: { protons: 1, neutrons: 0, mass: 1, color: 0xffffff },
            He: { protons: 2, neutrons: 2, mass: 4, color: 0xffff00 },
            Li: { protons: 3, neutrons: 4, mass: 7, color: 0xff00ff },
            U235: { protons: 92, neutrons: 143, mass: 235, color: 0x00ff00 },
            U238: { protons: 92, neutrons: 146, mass: 238, color: 0x00aa00 }
        };

        console.log('✅ NuclearSimulator criado');
    }

    init() {
        this.createInterface();
        this.createInitialParticles();
    }

    createInterface() {
        const specificControls = document.getElementById('specific-controls');
        specificControls.innerHTML = `
            <h4>☢️ Controles Nucleares</h4>

            <div class="control-group">
                <label>Tipo de Reação:</label>
                <select id="reaction-type" style="width: 100%; padding: 8px; border-radius: 5px; background: rgba(99, 102, 241, 0.1); color: white; border: 1px solid rgba(99, 102, 241, 0.3);">
                    <option value="fusion">Fusão Nuclear (H → He)</option>
                    <option value="fission">Fissão Nuclear (U-235)</option>
                    <option value="decay">Decaimento Radioativo</option>
                    <option value="collision">Colisão de Partículas</option>
                </select>
            </div>

            <div class="control-group">
                <label>Número de Partículas: <span id="particle-count-value">10</span></label>
                <input type="range" id="particle-count" min="1" max="100" value="10">
            </div>

            <div class="control-group">
                <label>Energia de Colisão: <span id="collision-energy-value">1.0</span> MeV</label>
                <input type="range" id="collision-energy" min="0.1" max="100" step="0.1" value="1">
            </div>

            <div class="control-buttons">
                <button id="btn-add-nucleus" class="btn">➕ Adicionar Núcleo</button>
                <button id="btn-trigger-reaction" class="btn btn-primary">⚡ Iniciar Reação</button>
            </div>

            <div class="control-group">
                <label>Nível de Radiação: <span id="radiation-level" style="color: #ef4444;">0 mSv</span></label>
                <div style="width: 100%; height: 10px; background: rgba(99, 102, 241, 0.2); border-radius: 5px; overflow: hidden;">
                    <div id="radiation-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #10b981, #f59e0b, #ef4444); transition: width 0.3s;"></div>
                </div>
            </div>
        `;

        // Event listeners
        document.getElementById('btn-add-nucleus').addEventListener('click', () => this.addNucleus());
        document.getElementById('btn-trigger-reaction').addEventListener('click', () => this.triggerReaction());
        document.getElementById('particle-count').addEventListener('input', (e) => {
            document.getElementById('particle-count-value').textContent = e.target.value;
        });
        document.getElementById('collision-energy').addEventListener('input', (e) => {
            document.getElementById('collision-energy-value').textContent = e.target.value;
        });
    }

    createInitialParticles() {
        // Criar alguns núcleos iniciais
        for (let i = 0; i < 5; i++) {
            this.addNucleus();
        }
    }

    addNucleus() {
        const element = this.elements.H;
        const position = {
            x: (Math.random() - 0.5) * 20,
            y: Math.random() * 10 + 5,
            z: (Math.random() - 0.5) * 20
        };

        // Criar mesh visual
        const geometry = new THREE.SphereGeometry(0.3, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: element.color,
            emissive: element.color,
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.2
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position.x, position.y, position.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Criar corpo físico
        const body = this.physics.createSphere(0.3, element.mass, position);
        body.velocity.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        );

        this.sceneManager.addObject(mesh);

        this.particles.push({
            mesh: mesh,
            body: body,
            element: 'H',
            energy: 1.0
        });

        // Adicionar glow effect
        const glowGeometry = new THREE.SphereGeometry(0.35, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: element.color,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        mesh.add(glow);
    }

    triggerReaction() {
        const reactionType = document.getElementById('reaction-type').value;
        const energy = parseFloat(document.getElementById('collision-energy').value);

        console.log(`🔥 Iniciando reação: ${reactionType} com energia ${energy} MeV`);

        switch(reactionType) {
            case 'fusion':
                this.simulateFusion();
                break;
            case 'fission':
                this.simulateFission();
                break;
            case 'decay':
                this.simulateDecay();
                break;
            case 'collision':
                this.simulateCollision(energy);
                break;
        }

        this.radiationLevel += energy * 10;
        this.updateRadiationDisplay();
    }

    simulateFusion() {
        // Fusão H + H → He
        if (this.particles.length >= 2) {
            const p1 = this.particles[0];
            const p2 = this.particles[1];

            // Remover partículas originais
            this.removeParticle(p1);
            this.removeParticle(p2);

            // Criar He
            const position = {
                x: (p1.mesh.position.x + p2.mesh.position.x) / 2,
                y: (p1.mesh.position.y + p2.mesh.position.y) / 2,
                z: (p1.mesh.position.z + p2.mesh.position.z) / 2
            };

            this.createHeliumNucleus(position);
            this.emitRadiation(position, 'gamma');
        }
    }

    simulateFission() {
        // Fissão de U-235
        if (this.particles.length > 0) {
            const particle = this.particles[0];
            const pos = particle.mesh.position;

            this.removeParticle(particle);

            // Criar fragmentos
            for (let i = 0; i < 3; i++) {
                const angle = (i / 3) * Math.PI * 2;
                const newPos = {
                    x: pos.x + Math.cos(angle) * 2,
                    y: pos.y,
                    z: pos.z + Math.sin(angle) * 2
                };
                this.addNucleus();
                this.emitRadiation(newPos, 'neutron');
            }
        }
    }

    simulateDecay() {
        // Decaimento radioativo
        this.particles.forEach(particle => {
            if (Math.random() < 0.1) {
                this.emitRadiation(particle.mesh.position, 'beta');
            }
        });
    }

    simulateCollision(energy) {
        // Aplicar energia às partículas
        this.particles.forEach(particle => {
            const force = {
                x: (Math.random() - 0.5) * energy * 100,
                y: (Math.random() - 0.5) * energy * 100,
                z: (Math.random() - 0.5) * energy * 100
            };
            this.physics.addForce(particle.body, force);
        });
    }

    createHeliumNucleus(position) {
        const element = this.elements.He;
        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: element.color,
            emissive: element.color,
            emissiveIntensity: 0.7
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position.x, position.y, position.z);

        const body = this.physics.createSphere(0.5, element.mass, position);

        this.sceneManager.addObject(mesh);
        this.particles.push({ mesh, body, element: 'He', energy: 2.0 });
    }

    emitRadiation(position, type) {
        const colors = {
            alpha: 0xff0000,
            beta: 0x0000ff,
            gamma: 0x00ff00,
            neutron: 0xffff00
        };

        const geometry = new THREE.CylinderGeometry(0.05, 0.05, 5, 8);
        const material = new THREE.MeshBasicMaterial({
            color: colors[type] || 0xffffff,
            transparent: true,
            opacity: 0.7
        });
        const ray = new THREE.Mesh(geometry, material);

        const angle = Math.random() * Math.PI * 2;
        ray.position.set(position.x, position.y, position.z);
        ray.rotation.z = Math.PI / 2;
        ray.rotation.y = angle;

        this.sceneManager.addObject(ray);
        this.radiationRays.push({ mesh: ray, life: 1.0 });
    }

    removeParticle(particle) {
        this.sceneManager.removeObject(particle.mesh);
        this.physics.removeBody(particle.body);
        const index = this.particles.indexOf(particle);
        if (index > -1) {
            this.particles.splice(index, 1);
        }
    }

    updateRadiationDisplay() {
        const level = Math.min(this.radiationLevel, 100);
        document.getElementById('radiation-level').textContent = `${level.toFixed(1)} mSv`;
        document.getElementById('radiation-bar').style.width = `${level}%`;

        // Decay da radiação
        this.radiationLevel *= 0.95;
    }

    update(deltaTime) {
        if (!this.isRunning) return;

        // Atualizar posições das partículas
        this.particles.forEach(particle => {
            particle.mesh.position.copy(particle.body.position);
            particle.mesh.quaternion.copy(particle.body.quaternion);

            // Rotação visual
            particle.mesh.rotation.x += 0.01;
            particle.mesh.rotation.y += 0.01;
        });

        // Atualizar raios de radiação
        this.radiationRays.forEach((ray, index) => {
            ray.life -= deltaTime * 0.5;
            ray.mesh.material.opacity = ray.life;

            if (ray.life <= 0) {
                this.sceneManager.removeObject(ray.mesh);
                this.radiationRays.splice(index, 1);
            }
        });

        // Atualizar display de radiação
        this.updateRadiationDisplay();

        // Atualizar estatísticas
        document.getElementById('particles-value').textContent = this.particles.length;
        document.getElementById('energy-value').textContent = 
            `${(this.particles.reduce((sum, p) => sum + p.energy, 0)).toFixed(2)} MeV`;
    }

    start() {
        this.isRunning = true;
    }

    pause() {
        this.isRunning = false;
    }

    reset() {
        this.particles.forEach(p => this.removeParticle(p));
        this.radiationRays.forEach(r => this.sceneManager.removeObject(r.mesh));
        this.particles = [];
        this.radiationRays = [];
        this.radiationLevel = 0;
        this.createInitialParticles();
    }

    setTemperature(temp) {
        this.temperature = temp;
        // Temperatura afeta velocidade das partículas
        const speedFactor = temp / 298;
        this.particles.forEach(particle => {
            particle.body.velocity.scale(speedFactor, particle.body.velocity);
        });
    }

    setMagneticField(field) {
        this.magneticField = field;
        // Campo magnético desvia partículas carregadas
        this.particles.forEach(particle => {
            if (particle.element !== 'neutron') {
                const force = {
                    x: particle.body.velocity.z * field * 0.1,
                    y: 0,
                    z: -particle.body.velocity.x * field * 0.1
                };
                this.physics.addForce(particle.body, force);
            }
        });
    }

    cleanup() {
        this.reset();
    }
}