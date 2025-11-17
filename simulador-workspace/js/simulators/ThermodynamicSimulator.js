// ThermodynamicSimulator.js - Simulador Termodinâmico
class ThermodynamicSimulator {
    constructor(sceneManager, physicsEngine) {
        this.sceneManager = sceneManager;
        this.physics = physicsEngine;
        this.isRunning = false;

        // Partículas térmicas
        this.gasParticles = [];
        this.heatParticles = [];

        // Motores e máquinas
        this.engine = null;
        this.piston = null;

        // Parâmetros termodinâmicos
        this.temperature = 300; // K
        this.pressure = 1; // atm
        this.volume = 100; // L
        this.entropy = 0;
        this.efficiency = 0;

        // Ciclo
        this.currentCycle = 'carnot';
        this.cyclePhase = 0;

        console.log('✅ ThermodynamicSimulator criado');
    }

    init() {
        this.createInterface();
        this.setupCycle(this.currentCycle);
        this.physics.setGravity(0, 0, 0);
    }

    createInterface() {
        document.getElementById('specific-controls').innerHTML = `
            <h4>🔥 Controles Termodinâmicos</h4>

            <div class="control-group">
                <label>Sistema:</label>
                <select id="thermo-system" style="width: 100%; padding: 8px; border-radius: 5px; background: rgba(99, 102, 241, 0.1); color: white; border: 1px solid rgba(99, 102, 241, 0.3);">
                    <option value="carnot">Ciclo de Carnot</option>
                    <option value="otto">Ciclo Otto (Motor)</option>
                    <option value="stirling">Motor Stirling</option>
                    <option value="heat-transfer">Transferência de Calor</option>
                    <option value="entropy">Entropia e Desordem</option>
                    <option value="phase-change">Mudança de Fase</option>
                    <option value="maxwell">Demônio de Maxwell</option>
                </select>
            </div>

            <div class="control-group">
                <label>Temperatura: <span id="temp-display">300</span> K</label>
                <input type="range" id="temp-control" min="0" max="1000" value="300">
            </div>

            <div class="control-group">
                <label>Pressão: <span id="pressure-display">1.0</span> atm</label>
                <input type="range" id="pressure-control" min="0.1" max="10" step="0.1" value="1">
            </div>

            <div class="control-group">
                <label>Volume: <span id="volume-display">100</span> L</label>
                <input type="range" id="volume-control" min="10" max="500" value="100">
            </div>

            <div class="control-buttons">
                <button id="btn-heat" class="btn btn-primary">🔥 Aquecer</button>
                <button id="btn-cool" class="btn">❄️ Resfriar</button>
            </div>

            <div class="control-buttons">
                <button id="btn-compress" class="btn">⬇️ Comprimir</button>
                <button id="btn-expand" class="btn">⬆️ Expandir</button>
            </div>

            <div class="control-group" style="margin-top: 15px; padding: 10px; background: rgba(99, 102, 241, 0.1); border-radius: 8px;">
                <label style="color: #00d4ff; font-weight: bold;">Estado Termodinâmico:</label>
                <div id="thermo-state" style="font-family: monospace; font-size: 0.85rem; color: #fff; margin-top: 5px;">
                    T = 300 K<br>
                    P = 1.0 atm<br>
                    V = 100 L<br>
                    Eficiência: 0%
                </div>
            </div>
        `;

        document.getElementById('thermo-system').addEventListener('change', (e) => {
            this.currentCycle = e.target.value;
            this.setupCycle(e.target.value);
        });

        document.getElementById('temp-control').addEventListener('input', (e) => {
            this.temperature = parseFloat(e.target.value);
            document.getElementById('temp-display').textContent = this.temperature.toFixed(0);
            this.updateParticleSpeed();
        });

        document.getElementById('pressure-control').addEventListener('input', (e) => {
            this.pressure = parseFloat(e.target.value);
            document.getElementById('pressure-display').textContent = this.pressure.toFixed(1);
        });

        document.getElementById('volume-control').addEventListener('input', (e) => {
            this.volume = parseFloat(e.target.value);
            document.getElementById('volume-display').textContent = this.volume.toFixed(0);
            this.updateContainerSize();
        });

        document.getElementById('btn-heat').addEventListener('click', () => this.addHeat());
        document.getElementById('btn-cool').addEventListener('click', () => this.removeHeat());
        document.getElementById('btn-compress').addEventListener('click', () => this.compress());
        document.getElementById('btn-expand').addEventListener('click', () => this.expand());
    }

    setupCycle(type) {
        this.clearSystem();

        switch(type) {
            case 'carnot':
                this.createCarnotEngine();
                break;
            case 'otto':
                this.createOttoEngine();
                break;
            case 'stirling':
                this.createStirlingEngine();
                break;
            case 'heat-transfer':
                this.createHeatTransfer();
                break;
            case 'entropy':
                this.createEntropyDemo();
                break;
            case 'phase-change':
                this.createPhaseChange();
                break;
            case 'maxwell':
                this.createMaxwellDemon();
                break;
        }
    }

    createCarnotEngine() {
        // Container (cilindro)
        const cylinderGeometry = new THREE.CylinderGeometry(3, 3, 8, 32);
        const cylinderMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        this.sceneManager.addObject(cylinder);
        this.engine = { container: cylinder };

        // Pistão
        const pistonGeometry = new THREE.CylinderGeometry(2.8, 2.8, 0.5, 32);
        const pistonMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
        const piston = new THREE.Mesh(pistonGeometry, pistonMaterial);
        piston.position.y = 3;
        this.sceneManager.addObject(piston);
        this.piston = piston;

        // Partículas de gás
        this.createGasParticles(50);

        // Reservatórios térmicos
        this.createHeatReservoir(-8, 0, true); // Quente
        this.createHeatReservoir(8, 0, false); // Frio
    }

    createGasParticles(count) {
        for (let i = 0; i < count; i++) {
            const geometry = new THREE.SphereGeometry(0.15, 8, 8);
            const material = new THREE.MeshStandardMaterial({
                color: this.temperatureToColor(this.temperature),
                emissive: this.temperatureToColor(this.temperature),
                emissiveIntensity: 0.5
            });
            const particle = new THREE.Mesh(geometry, material);

            particle.position.set(
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 5
            );

            this.sceneManager.addObject(particle);

            this.gasParticles.push({
                mesh: particle,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1
                )
            });
        }
    }

    createHeatReservoir(x, y, hot) {
        const geometry = new THREE.BoxGeometry(2, 3, 2);
        const material = new THREE.MeshStandardMaterial({
            color: hot ? 0xff0000 : 0x0000ff,
            emissive: hot ? 0xff0000 : 0x0000ff,
            emissiveIntensity: 0.6
        });
        const reservoir = new THREE.Mesh(geometry, material);
        reservoir.position.set(x, y, 0);
        this.sceneManager.addObject(reservoir);

        return reservoir;
    }

    createOttoEngine() {
        // Motor de combustão interna simplificado
        this.createCarnotEngine();

        // Vela de ignição
        const sparkGeometry = new THREE.ConeGeometry(0.3, 1, 8);
        const sparkMaterial = new THREE.MeshStandardMaterial({
            color: 0xffaa00,
            emissive: 0xffaa00,
            emissiveIntensity: 0.8
        });
        const spark = new THREE.Mesh(sparkGeometry, sparkMaterial);
        spark.position.y = 5;
        this.sceneManager.addObject(spark);
    }

    createStirlingEngine() {
        // Motor Stirling com dois cilindros
        for (let i = 0; i < 2; i++) {
            const cylinderGeometry = new THREE.CylinderGeometry(2, 2, 6, 32);
            const cylinderMaterial = new THREE.MeshStandardMaterial({
                color: 0x888888,
                transparent: true,
                opacity: 0.4
            });
            const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
            cylinder.position.x = (i - 0.5) * 6;
            this.sceneManager.addObject(cylinder);

            // Pistão
            const pistonGeometry = new THREE.CylinderGeometry(1.8, 1.8, 0.5, 32);
            const pistonMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
            const piston = new THREE.Mesh(pistonGeometry, pistonMaterial);
            piston.position.x = cylinder.position.x;
            piston.position.y = 2;
            this.sceneManager.addObject(piston);
        }

        this.createGasParticles(30);
    }

    createHeatTransfer() {
        // Duas barras de metal
        const bar1Geometry = new THREE.BoxGeometry(1, 10, 1);
        const bar1Material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.8
        });
        const bar1 = new THREE.Mesh(bar1Geometry, bar1Material);
        bar1.position.x = -3;
        this.sceneManager.addObject(bar1);

        const bar2Geometry = new THREE.BoxGeometry(1, 10, 1);
        const bar2Material = new THREE.MeshStandardMaterial({
            color: 0x0000ff,
            emissive: 0x0000ff,
            emissiveIntensity: 0.5
        });
        const bar2 = new THREE.Mesh(bar2Geometry, bar2Material);
        bar2.position.x = 3;
        this.sceneManager.addObject(bar2);

        // Partículas de calor transferindo
        setInterval(() => {
            if (this.isRunning) {
                this.createHeatParticle(-3, (Math.random()-0.5)*8, 3);
            }
        }, 500);
    }

    createHeatParticle(x, y, targetX) {
        const geometry = new THREE.SphereGeometry(0.2, 8, 8);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xff6600,
            transparent: true,
            opacity: 0.8
        });
        const particle = new THREE.Mesh(geometry, material);
        particle.position.set(x, y, 0);
        this.sceneManager.addObject(particle);

        this.heatParticles.push({
            mesh: particle,
            targetX: targetX,
            speed: 0.05
        });
    }

    createEntropyDemo() {
        // Estado ordenado vs desordenado

        // Lado esquerdo: ordenado (baixa entropia)
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                const geometry = new THREE.SphereGeometry(0.3, 16, 16);
                const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
                const particle = new THREE.Mesh(geometry, material);
                particle.position.set(-8 + i*0.8, -2 + j*0.8, 0);
                this.sceneManager.addObject(particle);

                this.gasParticles.push({
                    mesh: particle,
                    velocity: new THREE.Vector3(0, 0, 0),
                    ordered: true
                });
            }
        }

        // Lado direito: desordenado (alta entropia)
        for (let i = 0; i < 25; i++) {
            const geometry = new THREE.SphereGeometry(0.3, 16, 16);
            const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
            const particle = new THREE.Mesh(geometry, material);
            particle.position.set(
                6 + (Math.random()-0.5)*4,
                (Math.random()-0.5)*4,
                (Math.random()-0.5)*2
            );
            this.sceneManager.addObject(particle);

            this.gasParticles.push({
                mesh: particle,
                velocity: new THREE.Vector3(
                    (Math.random()-0.5)*0.2,
                    (Math.random()-0.5)*0.2,
                    (Math.random()-0.5)*0.1
                ),
                ordered: false
            });
        }
    }

    createPhaseChange() {
        // Sólido -> Líquido -> Gás

        // Estrutura cristalina (sólido)
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 4; k++) {
                    const geometry = new THREE.SphereGeometry(0.2, 8, 8);
                    const material = new THREE.MeshStandardMaterial({ color: 0x0088ff });
                    const particle = new THREE.Mesh(geometry, material);
                    particle.position.set(i-2, j-2, k-2);
                    this.sceneManager.addObject(particle);

                    this.gasParticles.push({
                        mesh: particle,
                        velocity: new THREE.Vector3(0, 0, 0),
                        phase: 'solid'
                    });
                }
            }
        }
    }

    createMaxwellDemon() {
        // Parede divisória
        const wallGeometry = new THREE.BoxGeometry(0.2, 8, 8);
        const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        this.sceneManager.addObject(wall);

        // Porta (pequena abertura)
        const doorGeometry = new THREE.BoxGeometry(0.3, 1, 1);
        const doorMaterial = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.5
        });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.y = 0;
        this.sceneManager.addObject(door);

        // Partículas em ambos os lados
        for (let i = 0; i < 20; i++) {
            const geometry = new THREE.SphereGeometry(0.2, 8, 8);
            const speed = Math.random();
            const material = new THREE.MeshStandardMaterial({
                color: speed > 0.5 ? 0xff0000 : 0x0000ff
            });
            const particle = new THREE.Mesh(geometry, material);
            particle.position.set(
                (Math.random()-0.5)*14,
                (Math.random()-0.5)*6,
                (Math.random()-0.5)*6
            );
            this.sceneManager.addObject(particle);

            this.gasParticles.push({
                mesh: particle,
                velocity: new THREE.Vector3(
                    (Math.random()-0.5)*0.2,
                    (Math.random()-0.5)*0.2,
                    (Math.random()-0.5)*0.2
                ),
                speed: speed
            });
        }
    }

    addHeat() {
        console.log('🔥 Adicionando calor...');
        this.temperature += 50;
        this.updateParticleSpeed();
        this.updateState();
    }

    removeHeat() {
        console.log('❄️ Removendo calor...');
        this.temperature = Math.max(0, this.temperature - 50);
        this.updateParticleSpeed();
        this.updateState();
    }

    compress() {
        console.log('⬇️ Comprimindo...');
        this.volume = Math.max(10, this.volume - 20);
        this.pressure += 0.5;
        this.updateContainerSize();
        this.updateState();
    }

    expand() {
        console.log('⬆️ Expandindo...');
        this.volume = Math.min(500, this.volume + 20);
        this.pressure = Math.max(0.1, this.pressure - 0.3);
        this.updateContainerSize();
        this.updateState();
    }

    updateParticleSpeed() {
        const speedFactor = Math.sqrt(this.temperature / 300);
        this.gasParticles.forEach(p => {
            if (p.velocity) {
                const currentSpeed = p.velocity.length();
                if (currentSpeed > 0) {
                    p.velocity.normalize().multiplyScalar(0.1 * speedFactor);
                }
                p.mesh.material.color.setHex(this.temperatureToColor(this.temperature));
                if (p.mesh.material.emissive) {
                    p.mesh.material.emissive.setHex(this.temperatureToColor(this.temperature));
                }
            }
        });
    }

    updateContainerSize() {
        if (this.engine && this.engine.container) {
            const scale = this.volume / 100;
            this.engine.container.scale.set(scale, scale, scale);
        }
    }

    temperatureToColor(temp) {
        if (temp < 200) return 0x0000ff;
        if (temp < 400) return 0x00ffff;
        if (temp < 600) return 0x00ff00;
        if (temp < 800) return 0xffff00;
        return 0xff0000;
    }

    updateState() {
        // Calcular eficiência de Carnot
        const Tc = 300;
        const Th = this.temperature;
        this.efficiency = Th > Tc ? ((Th - Tc) / Th * 100) : 0;

        document.getElementById('thermo-state').innerHTML = `
            T = ${this.temperature.toFixed(0)} K<br>
            P = ${this.pressure.toFixed(1)} atm<br>
            V = ${this.volume.toFixed(0)} L<br>
            Eficiência: ${this.efficiency.toFixed(1)}%
        `;
    }

    update(deltaTime) {
        if (!this.isRunning) return;

        // Atualizar partículas de gás
        this.gasParticles.forEach(p => {
            if (p.velocity) {
                p.mesh.position.add(p.velocity);

                // Colisão com paredes (bounce)
                const limit = this.volume / 20;
                if (Math.abs(p.mesh.position.x) > limit) p.velocity.x *= -1;
                if (Math.abs(p.mesh.position.y) > limit) p.velocity.y *= -1;
                if (Math.abs(p.mesh.position.z) > limit) p.velocity.z *= -1;

                // Desordem gradual
                if (!p.ordered) {
                    p.velocity.x += (Math.random()-0.5)*0.001;
                    p.velocity.y += (Math.random()-0.5)*0.001;
                }
            }
        });

        // Atualizar partículas de calor
        this.heatParticles.forEach((p, i) => {
            const dx = p.targetX - p.mesh.position.x;
            p.mesh.position.x += Math.sign(dx) * p.speed;

            if (Math.abs(dx) < 0.5) {
                this.sceneManager.removeObject(p.mesh);
                this.heatParticles.splice(i, 1);
            }
        });

        // Animar pistão (ciclo)
        if (this.piston) {
            this.cyclePhase += 0.02;
            this.piston.position.y = 2 + Math.sin(this.cyclePhase) * 1.5;
        }

        this.updateState();
        document.getElementById('particles-value').textContent = this.gasParticles.length;
    }

    clearSystem() {
        this.gasParticles.forEach(p => this.sceneManager.removeObject(p.mesh));
        this.heatParticles.forEach(p => this.sceneManager.removeObject(p.mesh));
        this.gasParticles = [];
        this.heatParticles = [];
        this.engine = null;
        this.piston = null;
    }

    start() {
        this.isRunning = true;
    }

    pause() {
        this.isRunning = false;
    }

    reset() {
        this.setupCycle(this.currentCycle);
    }

    setTemperature(temp) {
        this.temperature = temp;
        this.updateParticleSpeed();
    }

    cleanup() {
        this.clearSystem();
    }
}