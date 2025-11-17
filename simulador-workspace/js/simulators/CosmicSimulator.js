// CosmicSimulator.js - Simulador Cósmico
class CosmicSimulator {
    constructor(sceneManager, physicsEngine) {
        this.sceneManager = sceneManager;
        this.physics = physicsEngine;
        this.isRunning = false;
        this.bodies = [];
        this.particles = [];
        this.G = 6.674e-11;
        this.currentScenario = 'solar-system';
        console.log('✅ CosmicSimulator criado');
    }

    init() {
        this.createInterface();
        this.setupScenario(this.currentScenario);
        this.physics.setGravity(0, 0, 0);
    }

    createInterface() {
        document.getElementById('specific-controls').innerHTML = `
            <h4>🌌 Controles Cósmicos</h4>
            <div class="control-group">
                <label>Cenário:</label>
                <select id="cosmic-scenario" style="width: 100%; padding: 8px; border-radius: 5px; background: rgba(99, 102, 241, 0.1); color: white; border: 1px solid rgba(99, 102, 241, 0.3);">
                    <option value="solar-system">Sistema Solar</option>
                    <option value="binary-stars">Estrelas Binárias</option>
                    <option value="black-hole">Buraco Negro + Disco</option>
                    <option value="galaxy">Galáxia Espiral</option>
                    <option value="galaxy-collision">Colisão de Galáxias</option>
                    <option value="n-body">N-Body (100+ corpos)</option>
                </select>
            </div>
            <div class="control-group">
                <label>Força Gravitacional: <span id="gravity-strength-value">1.0</span>x</label>
                <input type="range" id="gravity-strength" min="0.1" max="5" step="0.1" value="1">
            </div>
            <div class="control-buttons">
                <button id="btn-supernova" class="btn btn-primary">💥 Supernova</button>
                <button id="btn-add-planet" class="btn">🪐 Add Planeta</button>
            </div>
        `;

        document.getElementById('cosmic-scenario').addEventListener('change', (e) => {
            this.currentScenario = e.target.value;
            this.setupScenario(e.target.value);
        });

        document.getElementById('gravity-strength').addEventListener('input', (e) => {
            this.G = 6.674e-11 * parseFloat(e.target.value);
            document.getElementById('gravity-strength-value').textContent = e.target.value;
        });

        document.getElementById('btn-supernova').addEventListener('click', () => this.triggerSupernova());
        document.getElementById('btn-add-planet').addEventListener('click', () => this.addRandomPlanet());
    }

    setupScenario(type) {
        this.clearSimulation();
        switch(type) {
            case 'solar-system': this.createSolarSystem(); break;
            case 'binary-stars': this.createBinaryStars(); break;
            case 'black-hole': this.createBlackHole(); break;
            case 'galaxy': this.createGalaxy(); break;
            case 'galaxy-collision': this.createGalaxyCollision(); break;
            case 'n-body': this.createNBodySystem(); break;
        }
    }

    createSolarSystem() {
        this.createBody({ type: 'star', mass: 1000, radius: 2, color: 0xffaa00, 
            pos: [0,0,0], vel: [0,0,0], name: 'Sol' });

        const planets = [
            { name: 'Terra', distance: 10, mass: 10, radius: 0.5, color: 0x0077be, speed: 0.1 },
            { name: 'Marte', distance: 13, mass: 6, radius: 0.4, color: 0xdc4b4b, speed: 0.08 },
            { name: 'Júpiter', distance: 20, mass: 100, radius: 1.2, color: 0xc88b3a, speed: 0.05 }
        ];

        planets.forEach(p => {
            const angle = Math.random() * Math.PI * 2;
            this.createBody({
                type: 'planet', mass: p.mass, radius: p.radius, color: p.color,
                pos: [Math.cos(angle) * p.distance, 0, Math.sin(angle) * p.distance],
                vel: [-Math.sin(angle) * p.speed, 0, Math.cos(angle) * p.speed],
                name: p.name
            });
        });
    }

    createBinaryStars() {
        this.createBody({ type: 'star', mass: 500, radius: 1.5, color: 0x4444ff,
            pos: [-10, 0, 0], vel: [0, 0.05, 0] });
        this.createBody({ type: 'star', mass: 500, radius: 1.5, color: 0xff4444,
            pos: [10, 0, 0], vel: [0, -0.05, 0] });
    }

    createBlackHole() {
        this.createBody({ type: 'black-hole', mass: 2000, radius: 1, color: 0x000000,
            pos: [0, 0, 0], vel: [0, 0, 0] });

        for (let i = 0; i < 50; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 6 + Math.random() * 6;
            const speed = Math.sqrt(1000 / distance) * 0.02;
            this.createBody({
                type: 'particle', mass: 1, radius: 0.1, color: 0xffaa00,
                pos: [Math.cos(angle) * distance, (Math.random()-0.5)*0.5, Math.sin(angle) * distance],
                vel: [-Math.sin(angle) * speed, 0, Math.cos(angle) * speed]
            });
        }
    }

    createGalaxy() {
        this.createBody({ type: 'black-hole', mass: 5000, radius: 2, color: 0x000000,
            pos: [0, 0, 0], vel: [0, 0, 0] });

        for (let arm = 0; arm < 4; arm++) {
            const armAngle = (arm / 4) * Math.PI * 2;
            for (let i = 0; i < 50; i++) {
                const t = i / 50;
                const distance = 5 + t * 40;
                const spiralAngle = armAngle + t * Math.PI * 3;
                const speed = Math.sqrt(5000 / distance) * 0.01;

                this.createBody({
                    type: 'star', mass: 5, radius: 0.2, color: 0xffaa00,
                    pos: [Math.cos(spiralAngle) * distance, (Math.random()-0.5)*2, Math.sin(spiralAngle) * distance],
                    vel: [-Math.sin(spiralAngle) * speed, 0, Math.cos(spiralAngle) * speed]
                });
            }
        }
    }

    createGalaxyCollision() {
        this.createMiniGalaxy(-30, 0, 0, 0.05, 0);
        this.createMiniGalaxy(30, 0, 0, -0.05, 0);
    }

    createMiniGalaxy(ox, oy, oz, vx, vz) {
        this.createBody({ type: 'black-hole', mass: 1000, radius: 1, color: 0x000000,
            pos: [ox, oy, oz], vel: [vx, 0, vz] });

        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 3 + Math.random() * 12;
            const speed = Math.sqrt(1000 / distance) * 0.01;
            this.createBody({
                type: 'star', mass: 5, radius: 0.2, color: 0xffaa00,
                pos: [ox + Math.cos(angle) * distance, oy + (Math.random()-0.5), oz + Math.sin(angle) * distance],
                vel: [vx - Math.sin(angle) * speed, 0, vz + Math.cos(angle) * speed]
            });
        }
    }

    createNBodySystem() {
        for (let i = 0; i < 100; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 5 + Math.random() * 30;
            this.createBody({
                type: 'star', mass: 10 + Math.random() * 50, radius: 0.3, color: Math.random() * 0xffffff,
                pos: [Math.cos(angle) * distance, (Math.random()-0.5)*10, Math.sin(angle) * distance],
                vel: [(Math.random()-0.5)*0.1, (Math.random()-0.5)*0.05, (Math.random()-0.5)*0.1]
            });
        }
    }

    createBody(cfg) {
        const geometry = new THREE.SphereGeometry(cfg.radius, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: cfg.color,
            emissive: cfg.type === 'star' ? cfg.color : 0x000000,
            emissiveIntensity: cfg.type === 'star' ? 0.8 : 0
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
        this.sceneManager.addObject(mesh);

        this.bodies.push({
            mesh, type: cfg.type, mass: cfg.mass, radius: cfg.radius,
            position: new THREE.Vector3(...cfg.pos),
            velocity: new THREE.Vector3(...cfg.vel),
            acceleration: new THREE.Vector3(0, 0, 0),
            destroyed: false
        });
    }

    addRandomPlanet() {
        const angle = Math.random() * Math.PI * 2;
        const distance = 15 + Math.random() * 20;
        const speed = Math.sqrt(500 / distance) * 0.02;
        this.createBody({
            type: 'planet', mass: 15, radius: 0.5, color: Math.random() * 0xffffff,
            pos: [Math.cos(angle) * distance, 0, Math.sin(angle) * distance],
            vel: [-Math.sin(angle) * speed, 0, Math.cos(angle) * speed]
        });
    }

    triggerSupernova() {
        const star = this.bodies.find(b => b.type === 'star' && !b.destroyed);
        if (!star) return;

        for (let i = 0; i < 100; i++) {
            const angle = Math.random() * Math.PI * 2;
            const elevation = (Math.random()-0.5) * Math.PI;
            const speed = 0.2 + Math.random() * 0.3;

            const particleGeo = new THREE.SphereGeometry(0.1, 8, 8);
            const particleMat = new THREE.MeshBasicMaterial({ color: 0xff6600 });
            const particle = new THREE.Mesh(particleGeo, particleMat);
            particle.position.copy(star.position);
            this.sceneManager.addObject(particle);

            this.particles.push({
                mesh: particle,
                velocity: new THREE.Vector3(
                    Math.cos(angle) * Math.cos(elevation) * speed,
                    Math.sin(elevation) * speed,
                    Math.sin(angle) * Math.cos(elevation) * speed
                ),
                life: 3.0
            });
        }

        this.sceneManager.removeObject(star.mesh);
        star.destroyed = true;
    }

    calculateGravity() {
        for (let i = 0; i < this.bodies.length; i++) {
            const bodyA = this.bodies[i];
            if (bodyA.destroyed) continue;
            bodyA.acceleration.set(0, 0, 0);

            for (let j = 0; j < this.bodies.length; j++) {
                if (i === j) continue;
                const bodyB = this.bodies[j];
                if (bodyB.destroyed) continue;

                const dx = bodyB.position.x - bodyA.position.x;
                const dy = bodyB.position.y - bodyA.position.y;
                const dz = bodyB.position.z - bodyA.position.z;
                const distSq = dx*dx + dy*dy + dz*dz;
                const dist = Math.sqrt(distSq);

                if (dist < (bodyA.radius + bodyB.radius)) {
                    if (bodyA.mass > bodyB.mass) {
                        bodyA.mass += bodyB.mass;
                        this.sceneManager.removeObject(bodyB.mesh);
                        bodyB.destroyed = true;
                    }
                    continue;
                }

                const force = (this.G * bodyA.mass * bodyB.mass) / (distSq + 0.1);
                bodyA.acceleration.x += (force * dx / dist) / bodyA.mass;
                bodyA.acceleration.y += (force * dy / dist) / bodyA.mass;
                bodyA.acceleration.z += (force * dz / dist) / bodyA.mass;
            }
        }
    }

    update(deltaTime) {
        if (!this.isRunning) return;

        this.calculateGravity();

        this.bodies.forEach(body => {
            if (body.destroyed) return;
            body.velocity.add(body.acceleration.clone().multiplyScalar(deltaTime));
            body.position.add(body.velocity.clone().multiplyScalar(deltaTime));
            body.mesh.position.copy(body.position);
            body.mesh.rotation.y += 0.01;
        });

        this.particles.forEach((p, i) => {
            p.mesh.position.add(p.velocity);
            p.life -= deltaTime;
            if (p.life <= 0) {
                this.sceneManager.removeObject(p.mesh);
                this.particles.splice(i, 1);
            }
        });

        document.getElementById('particles-value').textContent = this.bodies.filter(b => !b.destroyed).length;
    }

    clearSimulation() {
        this.bodies.forEach(b => this.sceneManager.removeObject(b.mesh));
        this.particles.forEach(p => this.sceneManager.removeObject(p.mesh));
        this.bodies = [];
        this.particles = [];
    }

    start() { this.isRunning = true; }
    pause() { this.isRunning = false; }
    reset() { this.setupScenario(this.currentScenario); }
    cleanup() { this.clearSimulation(); }
}