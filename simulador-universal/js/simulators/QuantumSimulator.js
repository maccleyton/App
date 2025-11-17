// QuantumSimulator.js - Simulador Quântico
class QuantumSimulator {
    constructor(sceneManager, physicsEngine) {
        this.sceneManager = sceneManager;
        this.physics = physicsEngine;
        this.isRunning = false;

        // Partículas quânticas
        this.particles = [];
        this.waveFunctions = [];
        this.entangledPairs = [];

        // Parâmetros quânticos
        this.planckConstant = 6.626e-34; // J·s
        this.hbar = 1.055e-34; // ℏ (h-bar)
        this.uncertainty = 0.5; // Δx·Δp

        // Experimentos
        this.currentExperiment = 'orbitals';

        console.log('✅ QuantumSimulator criado');
    }

    init() {
        this.createInterface();
        this.setupExperiment(this.currentExperiment);
    }

    createInterface() {
        const specificControls = document.getElementById('specific-controls');
        specificControls.innerHTML = `
            <h4>⚛️ Controles Quânticos</h4>

            <div class="control-group">
                <label>Experimento:</label>
                <select id="quantum-experiment" style="width: 100%; padding: 8px; border-radius: 5px; background: rgba(99, 102, 241, 0.1); color: white; border: 1px solid rgba(99, 102, 241, 0.3);">
                    <option value="orbitals">Orbitais Atômicos (s, p, d, f)</option>
                    <option value="double-slit">Dupla Fenda</option>
                    <option value="tunneling">Tunelamento Quântico</option>
                    <option value="entanglement">Entrelaçamento</option>
                    <option value="superposition">Superposição (Schrödinger)</option>
                    <option value="photoelectric">Efeito Fotoelétrico</option>
                    <option value="spin">Experimento Stern-Gerlach</option>
                </select>
            </div>

            <div class="control-group">
                <label>Energia: <span id="quantum-energy-value">1.0</span> eV</label>
                <input type="range" id="quantum-energy" min="0.1" max="100" step="0.1" value="1">
            </div>

            <div class="control-group">
                <label>Incerteza (ΔxΔp/ℏ): <span id="uncertainty-value">0.5</span></label>
                <input type="range" id="uncertainty-slider" min="0.1" max="10" step="0.1" value="0.5">
            </div>

            <div class="control-group">
                <label>Comprimento de Onda: <span id="wavelength-value">500</span> nm</label>
                <input type="range" id="wavelength-slider" min="100" max="1000" step="10" value="500">
            </div>

            <div class="control-buttons">
                <button id="btn-measure" class="btn btn-primary">📏 Medir (Colapso)</button>
                <button id="btn-reset-quantum" class="btn">🔄 Novo Experimento</button>
            </div>

            <div class="control-group" style="margin-top: 15px; padding: 10px; background: rgba(99, 102, 241, 0.1); border-radius: 8px;">
                <label style="color: #00d4ff; font-weight: bold;">Estado Quântico:</label>
                <div id="quantum-state" style="font-family: monospace; font-size: 0.85rem; color: #fff; margin-top: 5px;">
                    |ψ⟩ = α|0⟩ + β|1⟩
                </div>
            </div>
        `;

        // Event listeners
        document.getElementById('quantum-experiment').addEventListener('change', (e) => {
            this.currentExperiment = e.target.value;
            this.setupExperiment(this.currentExperiment);
        });

        document.getElementById('quantum-energy').addEventListener('input', (e) => {
            document.getElementById('quantum-energy-value').textContent = e.target.value;
        });

        document.getElementById('uncertainty-slider').addEventListener('input', (e) => {
            this.uncertainty = parseFloat(e.target.value);
            document.getElementById('uncertainty-value').textContent = e.target.value;
        });

        document.getElementById('wavelength-slider').addEventListener('input', (e) => {
            document.getElementById('wavelength-value').textContent = e.target.value;
            this.updateWavelength(parseFloat(e.target.value));
        });

        document.getElementById('btn-measure').addEventListener('click', () => this.measureQuantumState());
        document.getElementById('btn-reset-quantum').addEventListener('click', () => this.reset());
    }

    setupExperiment(type) {
        // Limpar experimento anterior
        this.clearExperiment();

        switch(type) {
            case 'orbitals':
                this.createAtomicOrbitals();
                break;
            case 'double-slit':
                this.createDoubleSlit();
                break;
            case 'tunneling':
                this.createTunneling();
                break;
            case 'entanglement':
                this.createEntanglement();
                break;
            case 'superposition':
                this.createSuperposition();
                break;
            case 'photoelectric':
                this.createPhotoelectric();
                break;
            case 'spin':
                this.createSternGerlach();
                break;
        }

        console.log(`🔬 Experimento iniciado: \${type}`);
    }

    createAtomicOrbitals() {
        // Criar núcleo
        const nucleusGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const nucleusMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.5
        });
        const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        this.sceneManager.addObject(nucleus);
        this.particles.push(nucleus);

        // Criar orbitais (s, p, d)
        this.createOrbital('s', 0x00ffff, 2);
        this.createOrbital('p', 0xff00ff, 3);
        this.createOrbital('d', 0xffff00, 4);

        // Adicionar elétrons
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 3 + Math.random() * 2;

            const electronGeometry = new THREE.SphereGeometry(0.15, 16, 16);
            const electronMaterial = new THREE.MeshStandardMaterial({
                color: 0x0088ff,
                emissive: 0x0088ff,
                emissiveIntensity: 0.7
            });
            const electron = new THREE.Mesh(electronGeometry, electronMaterial);

            electron.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius * 0.5,
                Math.sin(angle * 2) * radius * 0.3
            );

            electron.userData.angle = angle;
            electron.userData.radius = radius;
            electron.userData.speed = 0.02 + Math.random() * 0.02;

            this.sceneManager.addObject(electron);
            this.particles.push(electron);
        }

        this.updateQuantumState('|ψ⟩ = Σ ψₙₗₘ(r,θ,φ) Yₗᵐ(θ,φ)');
    }

    createOrbital(type, color, radius) {
        let geometry;

        switch(type) {
            case 's':
                geometry = new THREE.SphereGeometry(radius, 32, 32);
                break;
            case 'p':
                geometry = new THREE.TorusGeometry(radius, 0.5, 16, 32);
                break;
            case 'd':
                geometry = new THREE.TorusKnotGeometry(radius * 0.6, 0.3, 64, 8, 2, 3);
                break;
        }

        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.15,
            wireframe: true
        });

        const orbital = new THREE.Mesh(geometry, material);
        this.sceneManager.addObject(orbital);
        this.particles.push(orbital);

        return orbital;
    }

    createDoubleSlit() {
        // Criar parede com duas fendas
        const wallGeometry = new THREE.BoxGeometry(10, 8, 0.2);
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.8
        });
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.z = 0;
        this.sceneManager.addObject(wall);
        this.particles.push(wall);

        // Criar fendas
        const slitGeometry = new THREE.BoxGeometry(0.3, 2, 0.3);
        const slitMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.5
        });

        const slit1 = new THREE.Mesh(slitGeometry, slitMaterial);
        slit1.position.set(0, 1.5, 0);
        this.sceneManager.addObject(slit1);
        this.particles.push(slit1);

        const slit2 = new THREE.Mesh(slitGeometry, slitMaterial);
        slit2.position.set(0, -1.5, 0);
        this.sceneManager.addObject(slit2);
        this.particles.push(slit2);

        // Criar tela de detecção
        const screenGeometry = new THREE.PlaneGeometry(10, 8);
        const screenMaterial = new THREE.MeshBasicMaterial({
            color: 0x111111,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.z = 5;
        this.sceneManager.addObject(screen);
        this.particles.push(screen);

        this.updateQuantumState('|ψ⟩ = 1/√2(|fenda1⟩ + |fenda2⟩)');
    }

    createTunneling() {
        // Criar barreira de potencial
        const barrierGeometry = new THREE.BoxGeometry(2, 6, 6);
        const barrierMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.5,
            emissive: 0xff0000,
            emissiveIntensity: 0.3
        });
        const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
        barrier.position.x = 0;
        this.sceneManager.addObject(barrier);
        this.particles.push(barrier);

        // Criar partícula que vai tunelar
        const particleGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.7
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(-5, 0, 0);
        particle.userData.velocity = 0.1;
        particle.userData.tunneling = false;
        this.sceneManager.addObject(particle);
        this.particles.push(particle);

        this.updateQuantumState('|ψ⟩ = e^(ikx) + Ae^(-κx) [tunelamento]');
    }

    createEntanglement() {
        // Criar par de partículas entrelaçadas
        const particle1 = this.createQuantumParticle(-3, 0, 0, 0xff0000, 'up');
        const particle2 = this.createQuantumParticle(3, 0, 0, 0x0000ff, 'down');

        particle1.userData.entangled = particle2;
        particle2.userData.entangled = particle1;

        this.entangledPairs.push({ p1: particle1, p2: particle2 });

        // Criar linha de conexão
        const points = [
            new THREE.Vector3(-3, 0, 0),
            new THREE.Vector3(3, 0, 0)
        ];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineDashedMaterial({
            color: 0xffff00,
            dashSize: 0.3,
            gapSize: 0.2,
            transparent: true,
            opacity: 0.6
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.computeLineDistances();
        this.sceneManager.addObject(line);
        this.particles.push(line);

        this.updateQuantumState('|ψ⟩ = 1/√2(|↑↓⟩ - |↓↑⟩) [Bell State]');
    }

    createQuantumParticle(x, y, z, color, spin) {
        const geometry = new THREE.SphereGeometry(0.4, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.6
        });
        const particle = new THREE.Mesh(geometry, material);
        particle.position.set(x, y, z);
        particle.userData.spin = spin;
        particle.userData.measured = false;

        // Adicionar seta de spin
        const arrowDir = new THREE.Vector3(0, spin === 'up' ? 1 : -1, 0);
        const arrowHelper = new THREE.ArrowHelper(arrowDir, particle.position, 1, color, 0.3, 0.2);
        this.sceneManager.addObject(arrowHelper);
        this.particles.push(arrowHelper);

        this.sceneManager.addObject(particle);
        this.particles.push(particle);

        return particle;
    }

    createSuperposition() {
        // Criar "caixa de Schrödinger"
        const boxGeometry = new THREE.BoxGeometry(4, 4, 4);
        const boxMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        this.sceneManager.addObject(box);
        this.particles.push(box);

        // Criar partícula em superposição
        const particle1 = this.createQuantumParticle(-1, 0, 0, 0x00ff00, 'up');
        const particle2 = this.createQuantumParticle(1, 0, 0, 0xff0000, 'down');

        particle1.material.transparent = true;
        particle1.material.opacity = 0.5;
        particle2.material.transparent = true;
        particle2.material.opacity = 0.5;

        particle1.userData.superposition = true;
        particle2.userData.superposition = true;

        this.updateQuantumState('|ψ⟩ = 1/√2(|vivo⟩ + |morto⟩)');
    }

    createPhotoelectric() {
        // Criar superfície metálica
        const surfaceGeometry = new THREE.BoxGeometry(8, 0.2, 4);
        const surfaceMaterial = new THREE.MeshStandardMaterial({
            color: 0xc0c0c0,
            metalness: 0.9,
            roughness: 0.1
        });
        const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
        surface.position.y = -2;
        this.sceneManager.addObject(surface);
        this.particles.push(surface);

        this.updateQuantumState('E = hν - φ [Einstein 1905]');
    }

    createSternGerlach() {
        // Criar magneto
        const magnetGeometry = new THREE.BoxGeometry(1, 4, 2);
        const magnetMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.3
        });
        const magnet = new THREE.Mesh(magnetGeometry, magnetMaterial);
        magnet.position.x = 0;
        this.sceneManager.addObject(magnet);
        this.particles.push(magnet);

        this.updateQuantumState('|ψ⟩ = α|↑⟩ + β|↓⟩ → medição');
    }

    measureQuantumState() {
        console.log('📏 Medindo estado quântico...');

        this.particles.forEach(particle => {
            if (particle.userData.superposition) {
                if (Math.random() > 0.5) {
                    particle.material.opacity = 1;
                    particle.material.color.setHex(0x00ff00);
                    console.log('Resultado: |vivo⟩');
                } else {
                    particle.material.opacity = 0.2;
                    console.log('Resultado: |morto⟩');
                }
                particle.userData.superposition = false;
            }
        });

        this.updateQuantumState('|ψ⟩ → |estado_medido⟩ [colapso]');
    }

    updateWavelength(wavelength) {
        const color = this.wavelengthToColor(wavelength);
        this.particles.forEach(particle => {
            if (particle.userData.isPhoton) {
                particle.material.color.setHex(color);
                particle.material.emissive.setHex(color);
            }
        });
    }

    wavelengthToColor(wavelength) {
        if (wavelength < 380) return 0x8b00ff;
        if (wavelength < 450) return 0x0000ff;
        if (wavelength < 495) return 0x00ffff;
        if (wavelength < 570) return 0x00ff00;
        if (wavelength < 590) return 0xffff00;
        if (wavelength < 620) return 0xff8800;
        if (wavelength < 750) return 0xff0000;
        return 0xff0088;
    }

    updateQuantumState(state) {
        document.getElementById('quantum-state').textContent = state;
    }

    clearExperiment() {
        this.particles.forEach(p => this.sceneManager.removeObject(p));
        this.waveFunctions.forEach(w => this.sceneManager.removeObject(w));
        this.particles = [];
        this.waveFunctions = [];
        this.entangledPairs = [];
    }

    update(deltaTime) {
        if (!this.isRunning) return;

        // Animar partículas
        this.particles.forEach((particle) => {
            // Orbitais - elétrons orbitando
            if (particle.userData.angle !== undefined) {
                particle.userData.angle += particle.userData.speed;
                const radius = particle.userData.radius;
                particle.position.x = Math.cos(particle.userData.angle) * radius;
                particle.position.y = Math.sin(particle.userData.angle) * radius * 0.5;
                particle.position.z = Math.sin(particle.userData.angle * 2) * radius * 0.3;

                particle.rotation.x += 0.1;
                particle.rotation.y += 0.1;
            }

            // Tunelamento
            if (particle.userData.velocity !== undefined && !particle.userData.tunneling) {
                particle.position.x += particle.userData.velocity;

                if (particle.position.x > -2 && particle.position.x < 2) {
                    if (Math.random() < 0.3) {
                        particle.userData.tunneling = true;
                        particle.material.opacity = 0.5;
                    }
                }

                if (particle.position.x > 2) {
                    particle.material.opacity = 1;
                }
            }

            // Spin precession
            if (particle.userData.spin && particle.rotation) {
                particle.rotation.y += 0.05;
            }
        });

        document.getElementById('particles-value').textContent = this.particles.length;
    }

    start() {
        this.isRunning = true;
    }

    pause() {
        this.isRunning = false;
    }

    reset() {
        this.setupExperiment(this.currentExperiment);
    }

    cleanup() {
        this.clearExperiment();
    }
}