// quantum-orbital-model.js
// Modelo de órbitas atômicas (Modelo de Bohr)

class QuantumOrbitalModel {
    constructor(engine) {
        this.engine = engine;
        this.nucleus = null;
        this.electrons = [];
        this.orbits = [];
        this.currentElement = { symbol: 'H', protons: 1, neutrons: 0, electrons: 1 };
        this.isAnimating = false;

        console.log('✅ QuantumOrbitalModel criado');
    }

    // Criar átomo com órbitas
    createAtom(element) {
        this.clear();
        this.currentElement = element;

        // Criar núcleo
        this.createNucleus(element.protons, element.neutrons);

        // Criar órbitas e elétrons
        this.createElectronShells(element.electrons);

        console.log(`🔬 Átomo criado: ${element.symbol} (${element.electrons} elétrons)`);
    }

    createNucleus(protons, neutrons) {
        // Núcleo no centro
        const nucleusSize = Math.max(0.5, (protons + neutrons) * 0.05);
        const geometry = new THREE.SphereGeometry(nucleusSize, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: 0xef4444,
            emissive: 0xef4444,
            emissiveIntensity: 0.3,
            roughness: 0.5,
            metalness: 0.7
        });

        this.nucleus = new THREE.Mesh(geometry, material);
        this.engine.addObject(this.nucleus);

        // Partículas no núcleo (visual)
        this.addNucleusParticles(protons, neutrons, nucleusSize);
    }

    addNucleusParticles(protons, neutrons, radius) {
        const particleSize = radius * 0.15;

        // Prótons (vermelho)
        for (let i = 0; i < Math.min(protons, 20); i++) {
            const angle = (i / protons) * Math.PI * 2;
            const distance = radius * 0.7;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            const geometry = new THREE.SphereGeometry(particleSize, 8, 8);
            const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const proton = new THREE.Mesh(geometry, material);
            proton.position.set(x, y, 0);

            this.nucleus.add(proton);
        }

        // Nêutrons (azul)
        for (let i = 0; i < Math.min(neutrons, 20); i++) {
            const angle = (i / neutrons) * Math.PI * 2 + Math.PI / neutrons;
            const distance = radius * 0.7;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            const geometry = new THREE.SphereGeometry(particleSize, 8, 8);
            const material = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
            const neutron = new THREE.Mesh(geometry, material);
            neutron.position.set(x, y, 0);

            this.nucleus.add(neutron);
        }
    }

    createElectronShells(electronCount) {
        // Distribuição eletrônica: 2, 8, 18, 32...
        const shellCapacities = [2, 8, 18, 32, 32, 18, 8];
        let remainingElectrons = electronCount;
        let shellIndex = 0;

        while (remainingElectrons > 0 && shellIndex < shellCapacities.length) {
            const electronsInShell = Math.min(remainingElectrons, shellCapacities[shellIndex]);
            const radius = 2 + shellIndex * 1.5; // Raio da órbita

            // Criar órbita visual
            this.createOrbitRing(radius);

            // Criar elétrons nesta camada
            this.createElectronsInShell(electronsInShell, radius, shellIndex);

            remainingElectrons -= electronsInShell;
            shellIndex++;
        }
    }

    createOrbitRing(radius) {
        const geometry = new THREE.TorusGeometry(radius, 0.02, 16, 100);
        const material = new THREE.MeshBasicMaterial({
            color: 0x10b981,
            opacity: 0.3,
            transparent: true
        });

        const orbit = new THREE.Mesh(geometry, material);
        orbit.rotation.x = Math.PI / 2;

        this.orbits.push(orbit);
        this.engine.addObject(orbit);
    }

    createElectronsInShell(count, radius, shellIndex) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const electron = this.createElectron(radius, angle, shellIndex);
            this.electrons.push(electron);
        }
    }

    createElectron(radius, angle, shellIndex) {
        const geometry = new THREE.SphereGeometry(0.15, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: 0x10b981,
            emissive: 0x10b981,
            emissiveIntensity: 0.5,
            roughness: 0.3,
            metalness: 0.8
        });

        const mesh = new THREE.Mesh(geometry, material);

        // Glow effect
        const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x10b981,
            transparent: true,
            opacity: 0.2
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        mesh.add(glow);

        this.engine.addObject(mesh);

        return {
            mesh,
            radius,
            angle,
            speed: 0.5 / (shellIndex + 1), // Mais lento nas camadas externas
            shellIndex
        };
    }

    update(deltaTime) {
        if (!this.isAnimating) return;

        // Rotação do núcleo
        if (this.nucleus) {
            this.nucleus.rotation.y += 0.01;
        }

        // Movimento dos elétrons nas órbitas
        this.electrons.forEach(electron => {
            electron.angle += electron.speed * deltaTime;

            const x = Math.cos(electron.angle) * electron.radius;
            const z = Math.sin(electron.angle) * electron.radius;

            electron.mesh.position.set(x, 0, z);
            electron.mesh.rotation.y += 0.1;
        });
    }

    start() {
        this.isAnimating = true;
    }

    stop() {
        this.isAnimating = false;
    }

    clear() {
        // Remover núcleo
        if (this.nucleus) {
            this.engine.removeObject(this.nucleus);
            this.nucleus = null;
        }

        // Remover órbitas
        this.orbits.forEach(orbit => this.engine.removeObject(orbit));
        this.orbits = [];

        // Remover elétrons
        this.electrons.forEach(electron => this.engine.removeObject(electron.mesh));
        this.electrons = [];
    }
}
