// quantum-nucleus-model.js
// Modelo detalhado do núcleo atômico

class QuantumNucleusModel {
    constructor(engine) {
        this.engine = engine;
        this.protons = [];
        this.neutrons = [];
        this.isAnimating = false;

        console.log('✅ QuantumNucleusModel criado');
    }

    createAtom(element) {
        this.clear();

        // Criar prótons e nêutrons
        const total = element.protons + element.neutrons;
        const radius = Math.max(1, total * 0.08);

        // Distribuir prótons
        for (let i = 0; i < element.protons; i++) {
            this.createProton(radius, i, element.protons);
        }

        // Distribuir nêutrons
        for (let i = 0; i < element.neutrons; i++) {
            this.createNeutron(radius, i, element.neutrons);
        }

        console.log(`⚛️ Núcleo criado: ${element.protons}p + ${element.neutrons}n`);
    }

    createProton(radius, index, total) {
        // Distribuição esférica de Fibonacci
        const phi = Math.acos(1 - 2 * (index + 0.5) / total);
        const theta = Math.PI * (1 + Math.sqrt(5)) * index;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        const geometry = new THREE.SphereGeometry(0.3, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: 0xef4444,
            emissive: 0xef4444,
            emissiveIntensity: 0.4,
            roughness: 0.5,
            metalness: 0.7
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);

        this.protons.push({ mesh, velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01
        )});

        this.engine.addObject(mesh);
    }

    createNeutron(radius, index, total) {
        const phi = Math.acos(1 - 2 * (index + 0.5) / total);
        const theta = Math.PI * (1 + Math.sqrt(5)) * index + Math.PI;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        const geometry = new THREE.SphereGeometry(0.3, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: 0x3b82f6,
            emissive: 0x3b82f6,
            emissiveIntensity: 0.4,
            roughness: 0.5,
            metalness: 0.7
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);

        this.neutrons.push({ mesh, velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01
        )});

        this.engine.addObject(mesh);
    }

    update(deltaTime) {
        if (!this.isAnimating) return;

        // Vibração nuclear
        [...this.protons, ...this.neutrons].forEach(particle => {
            particle.mesh.position.add(particle.velocity);

            // Força de confinamento nuclear
            const dist = particle.mesh.position.length();
            if (dist > 0) {
                const force = 0.001 / (dist + 0.1);
                const direction = particle.mesh.position.clone().normalize();
                particle.velocity.sub(direction.multiplyScalar(force));
            }

            // Damping
            particle.velocity.multiplyScalar(0.95);
        });
    }

    start() {
        this.isAnimating = true;
    }

    stop() {
        this.isAnimating = false;
    }

    clear() {
        [...this.protons, ...this.neutrons].forEach(particle => {
            this.engine.removeObject(particle.mesh);
        });
        this.protons = [];
        this.neutrons = [];
    }
}
