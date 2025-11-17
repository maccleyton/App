// quantum-cloud-model.js
// Modelo de nuvem eletrônica (densidade probabilística quântica)

class QuantumCloudModel {
    constructor(engine) {
        this.engine = engine;
        this.nucleus = null;
        this.cloudParticles = [];
        this.currentElement = { symbol: 'H', protons: 1, neutrons: 0, electrons: 1 };
        this.isAnimating = false;

        console.log('✅ QuantumCloudModel criado');
    }

    // Criar átomo com nuvem eletrônica
    createAtom(element) {
        this.clear();
        this.currentElement = element;

        // Criar núcleo pequeno
        this.createNucleus(element.protons, element.neutrons);

        // Criar nuvem de probabilidade
        this.createElectronCloud(element.electrons);

        console.log(`☁️ Nuvem eletrônica criada: ${element.symbol}`);
    }

    createNucleus(protons, neutrons) {
        const nucleusSize = Math.max(0.3, (protons + neutrons) * 0.03);
        const geometry = new THREE.SphereGeometry(nucleusSize, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: 0xef4444,
            emissive: 0xef4444,
            emissiveIntensity: 0.5
        });

        this.nucleus = new THREE.Mesh(geometry, material);
        this.engine.addObject(this.nucleus);
    }

    createElectronCloud(electronCount) {
        const particleCount = electronCount * 300; // 300 partículas por elétron

        // Geometria de pontos
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        // Distribuir partículas em orbitais probabilísticos
        for (let i = 0; i < particleCount; i++) {
            // Orbital s (esférico)
            const shellIndex = Math.floor(i / 300) % 4;
            const radius = 2 + shellIndex * 1.5;

            // Distribuição gaussiana (probabilidade maior no raio médio)
            const r = this.gaussianRandom() * radius;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            // Cor verde com variação
            const brightness = 0.5 + Math.random() * 0.5;
            colors[i * 3] = 0.06 * brightness;      // R
            colors[i * 3 + 1] = 0.73 * brightness;  // G (verde)
            colors[i * 3 + 2] = 0.51 * brightness;  // B

            // Tamanho variado
            sizes[i] = Math.random() * 0.1 + 0.05;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Material de pontos
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending
        });

        const cloud = new THREE.Points(geometry, material);
        this.cloudParticles.push({ cloud, geometry, velocities: this.initVelocities(particleCount) });
        this.engine.addObject(cloud);
    }

    initVelocities(count) {
        const velocities = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            velocities[i * 3] = (Math.random() - 0.5) * 0.01;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
        }
        return velocities;
    }

    gaussianRandom() {
        // Box-Muller transform para distribuição gaussiana
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    update(deltaTime) {
        if (!this.isAnimating) return;

        // Rotação do núcleo
        if (this.nucleus) {
            this.nucleus.rotation.y += 0.01;
        }

        // Animação quântica da nuvem
        this.cloudParticles.forEach(({ cloud, geometry, velocities }) => {
            const positions = geometry.attributes.position.array;

            for (let i = 0; i < positions.length / 3; i++) {
                // Movimento browniano quântico
                positions[i * 3] += velocities[i * 3];
                positions[i * 3 + 1] += velocities[i * 3 + 1];
                positions[i * 3 + 2] += velocities[i * 3 + 2];

                // Força de atração ao centro (probabilidade maior perto do núcleo)
                const dist = Math.sqrt(
                    positions[i * 3] ** 2 +
                    positions[i * 3 + 1] ** 2 +
                    positions[i * 3 + 2] ** 2
                );

                if (dist > 0) {
                    const force = 0.001 / (dist + 0.1);
                    velocities[i * 3] -= positions[i * 3] * force;
                    velocities[i * 3 + 1] -= positions[i * 3 + 1] * force;
                    velocities[i * 3 + 2] -= positions[i * 3 + 2] * force;
                }

                // Damping
                velocities[i * 3] *= 0.99;
                velocities[i * 3 + 1] *= 0.99;
                velocities[i * 3 + 2] *= 0.99;
            }

            geometry.attributes.position.needsUpdate = true;

            // Rotação suave da nuvem
            cloud.rotation.y += 0.001;
            cloud.rotation.x += 0.0005;
        });
    }

    start() {
        this.isAnimating = true;
    }

    stop() {
        this.isAnimating = false;
    }

    clear() {
        if (this.nucleus) {
            this.engine.removeObject(this.nucleus);
            this.nucleus = null;
        }

        this.cloudParticles.forEach(({ cloud, geometry }) => {
            this.engine.removeObject(cloud);
            geometry.dispose();
        });
        this.cloudParticles = [];
    }
}
