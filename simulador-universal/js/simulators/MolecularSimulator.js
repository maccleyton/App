// MolecularSimulator.js - Simulador Molecular
class MolecularSimulator {
    constructor(sceneManager, physicsEngine) {
        this.sceneManager = sceneManager;
        this.physics = physicsEngine;
        this.isRunning = false;

        // Moléculas e átomos
        this.atoms = [];
        this.bonds = [];
        this.molecules = [];

        // Parâmetros
        this.temperature = 298; // K
        this.pH = 7;
        this.pressure = 1; // atm

        // Biblioteca de moléculas
        this.moleculeLibrary = this.initMoleculeLibrary();
        this.currentMolecule = 'water';

        console.log('✅ MolecularSimulator criado');
    }

    init() {
        this.createInterface();
        this.buildMolecule(this.currentMolecule);
    }

    initMoleculeLibrary() {
        return {
            water: { 
                name: 'Água (H₂O)',
                atoms: [
                    { element: 'O', pos: [0, 0, 0] },
                    { element: 'H', pos: [0.96, 0, 0] },
                    { element: 'H', pos: [-0.24, 0.93, 0] }
                ],
                bonds: [[0,1], [0,2]]
            },
            methane: {
                name: 'Metano (CH₄)',
                atoms: [
                    { element: 'C', pos: [0, 0, 0] },
                    { element: 'H', pos: [1, 1, 1] },
                    { element: 'H', pos: [-1, -1, 1] },
                    { element: 'H', pos: [-1, 1, -1] },
                    { element: 'H', pos: [1, -1, -1] }
                ],
                bonds: [[0,1], [0,2], [0,3], [0,4]]
            },
            ethanol: {
                name: 'Etanol (C₂H₅OH)',
                atoms: [
                    { element: 'C', pos: [0, 0, 0] },
                    { element: 'C', pos: [1.5, 0, 0] },
                    { element: 'O', pos: [2.5, 1, 0] },
                    { element: 'H', pos: [3.5, 1, 0] },
                    { element: 'H', pos: [-0.5, 1, 0] },
                    { element: 'H', pos: [-0.5, -1, 0] },
                    { element: 'H', pos: [1.5, 0, 1] },
                    { element: 'H', pos: [1.5, 0, -1] }
                ],
                bonds: [[0,1], [1,2], [2,3], [0,4], [0,5], [1,6], [1,7]]
            },
            benzene: {
                name: 'Benzeno (C₆H₆)',
                atoms: [
                    { element: 'C', pos: [1, 0, 0] },
                    { element: 'C', pos: [0.5, 0.87, 0] },
                    { element: 'C', pos: [-0.5, 0.87, 0] },
                    { element: 'C', pos: [-1, 0, 0] },
                    { element: 'C', pos: [-0.5, -0.87, 0] },
                    { element: 'C', pos: [0.5, -0.87, 0] }
                ],
                bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0]]
            },
            glucose: {
                name: 'Glicose (C₆H₁₂O₆)',
                atoms: [
                    { element: 'C', pos: [0, 0, 0] },
                    { element: 'C', pos: [1.5, 0, 0] },
                    { element: 'C', pos: [2, 1.5, 0] },
                    { element: 'C', pos: [1, 2.5, 0] },
                    { element: 'C', pos: [-0.5, 2, 0] },
                    { element: 'O', pos: [-0.5, 0.5, 0] },
                    { element: 'O', pos: [0, -1.5, 0] },
                    { element: 'O', pos: [2, -0.5, 0] },
                    { element: 'O', pos: [3.5, 1.5, 0] },
                    { element: 'O', pos: [1.5, 3.5, 0] }
                ],
                bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [0,6], [1,7], [2,8], [3,9]]
            },
            dna: {
                name: 'Base DNA (Adenina)',
                atoms: [
                    { element: 'N', pos: [0, 0, 0] },
                    { element: 'C', pos: [1, 1, 0] },
                    { element: 'N', pos: [2, 0.5, 0] },
                    { element: 'C', pos: [2, -1, 0] },
                    { element: 'C', pos: [1, -1.5, 0] },
                    { element: 'N', pos: [0, -1, 0] }
                ],
                bonds: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0]]
            },
            nacl: {
                name: 'Sal (NaCl) - Rede Cristalina',
                atoms: [
                    { element: 'Na', pos: [0, 0, 0] },
                    { element: 'Cl', pos: [1, 0, 0] },
                    { element: 'Na', pos: [2, 0, 0] },
                    { element: 'Cl', pos: [0, 1, 0] },
                    { element: 'Na', pos: [1, 1, 0] },
                    { element: 'Cl', pos: [2, 1, 0] }
                ],
                bonds: [[0,1], [1,2], [0,3], [3,4], [4,5], [1,4]]
            },
            co2: {
                name: 'Dióxido de Carbono (CO₂)',
                atoms: [
                    { element: 'O', pos: [-1.2, 0, 0] },
                    { element: 'C', pos: [0, 0, 0] },
                    { element: 'O', pos: [1.2, 0, 0] }
                ],
                bonds: [[0,1], [1,2]]
            }
        };
    }

    createInterface() {
        document.getElementById('specific-controls').innerHTML = `
            <h4>🧬 Controles Moleculares</h4>

            <div class="control-group">
                <label>Molécula:</label>
                <select id="molecule-type" style="width: 100%; padding: 8px; border-radius: 5px; background: rgba(99, 102, 241, 0.1); color: white; border: 1px solid rgba(99, 102, 241, 0.3);">
                    <option value="water">Água (H₂O)</option>
                    <option value="methane">Metano (CH₄)</option>
                    <option value="ethanol">Etanol (C₂H₅OH)</option>
                    <option value="benzene">Benzeno (C₆H₆)</option>
                    <option value="glucose">Glicose (C₆H₁₂O₆)</option>
                    <option value="dna">Base DNA (Adenina)</option>
                    <option value="nacl">Sal (NaCl) Cristal</option>
                    <option value="co2">CO₂</option>
                </select>
            </div>

            <div class="control-group">
                <label>pH: <span id="ph-value">7.0</span></label>
                <input type="range" id="ph-slider" min="0" max="14" step="0.1" value="7">
            </div>

            <div class="control-group">
                <label>Velocidade Rotação: <span id="rotation-speed-value">1.0</span>x</label>
                <input type="range" id="rotation-speed" min="0" max="5" step="0.1" value="1">
            </div>

            <div class="control-group">
                <label>
                    <input type="checkbox" id="show-bonds" checked> Mostrar Ligações
                </label>
            </div>

            <div class="control-group">
                <label>
                    <input type="checkbox" id="show-labels" checked> Mostrar Rótulos
                </label>
            </div>

            <div class="control-buttons">
                <button id="btn-add-molecule" class="btn">➕ Adicionar Molécula</button>
                <button id="btn-react" class="btn btn-primary">⚗️ Reagir</button>
            </div>

            <div class="control-group" style="margin-top: 15px; padding: 10px; background: rgba(99, 102, 241, 0.1); border-radius: 8px;">
                <label style="color: #00d4ff; font-weight: bold;">Propriedades:</label>
                <div id="molecule-info" style="font-family: monospace; font-size: 0.85rem; color: #fff; margin-top: 5px;">
                    Massa Molar: 0 g/mol<br>
                    Átomos: 0<br>
                    Ligações: 0
                </div>
            </div>
        `;

        document.getElementById('molecule-type').addEventListener('change', (e) => {
            this.currentMolecule = e.target.value;
            this.buildMolecule(e.target.value);
        });

        document.getElementById('ph-slider').addEventListener('input', (e) => {
            this.pH = parseFloat(e.target.value);
            document.getElementById('ph-value').textContent = this.pH.toFixed(1);
            this.updateMoleculeByPH();
        });

        document.getElementById('rotation-speed').addEventListener('input', (e) => {
            document.getElementById('rotation-speed-value').textContent = e.target.value;
        });

        document.getElementById('btn-add-molecule').addEventListener('click', () => this.addMoleculeInstance());
        document.getElementById('btn-react').addEventListener('click', () => this.triggerReaction());
    }

    buildMolecule(type) {
        this.clearMolecule();

        const molData = this.moleculeLibrary[type];
        if (!molData) return;

        const group = new THREE.Group();
        const atomObjects = [];

        // Criar átomos
        molData.atoms.forEach((atomData, index) => {
            const atom = this.createAtom(atomData.element, atomData.pos);
            atomObjects.push(atom);
            group.add(atom.mesh);
            this.atoms.push(atom);

            // Adicionar label
            if (document.getElementById('show-labels')?.checked !== false) {
                this.addAtomLabel(atom, atomData.element);
            }
        });

        // Criar ligações
        if (document.getElementById('show-bonds')?.checked !== false) {
            molData.bonds.forEach(bond => {
                const atom1 = atomObjects[bond[0]];
                const atom2 = atomObjects[bond[1]];
                const bondMesh = this.createBond(atom1, atom2);
                group.add(bondMesh);
                this.bonds.push(bondMesh);
            });
        }

        group.position.set(0, 0, 0);
        this.sceneManager.addObject(group);
        this.molecules.push(group);

        this.updateMoleculeInfo(molData);
    }

    createAtom(element, position) {
        const atomColors = {
            H: 0xffffff,  // Branco
            C: 0x909090,  // Cinza
            N: 0x0000ff,  // Azul
            O: 0xff0000,  // Vermelho
            S: 0xffff00,  // Amarelo
            P: 0xff8800,  // Laranja
            Na: 0x8800ff, // Roxo
            Cl: 0x00ff00  // Verde
        };

        const atomSizes = {
            H: 0.3,
            C: 0.5,
            N: 0.45,
            O: 0.45,
            S: 0.6,
            P: 0.55,
            Na: 0.7,
            Cl: 0.6
        };

        const radius = atomSizes[element] || 0.5;
        const color = atomColors[element] || 0xcccccc;

        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.3,
            roughness: 0.7
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position[0], position[1], position[2]);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return {
            element: element,
            mesh: mesh,
            position: new THREE.Vector3(position[0], position[1], position[2])
        };
    }

    createBond(atom1, atom2) {
        const start = atom1.mesh.position;
        const end = atom2.mesh.position;

        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();
        const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

        const geometry = new THREE.CylinderGeometry(0.1, 0.1, length, 8);
        const material = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0.5,
            roughness: 0.5
        });

        const bond = new THREE.Mesh(geometry, material);
        bond.position.copy(midpoint);

        // Orientar cilindro
        bond.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction.normalize()
        );

        return bond;
    }

    addAtomLabel(atom, element) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 128;

        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, 128, 128);

        context.font = 'Bold 48px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(element, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(0.5, 0.5, 1);
        sprite.position.copy(atom.mesh.position);
        sprite.position.y += 0.8;

        this.sceneManager.addObject(sprite);
        atom.label = sprite;
    }

    addMoleculeInstance() {
        const offset = {
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 5,
            z: (Math.random() - 0.5) * 10
        };

        const molData = this.moleculeLibrary[this.currentMolecule];
        const group = new THREE.Group();

        molData.atoms.forEach(atomData => {
            const atom = this.createAtom(atomData.element, [
                atomData.pos[0] + offset.x,
                atomData.pos[1] + offset.y,
                atomData.pos[2] + offset.z
            ]);
            group.add(atom.mesh);
        });

        group.position.set(offset.x, offset.y, offset.z);
        this.sceneManager.addObject(group);
        this.molecules.push(group);
    }

    triggerReaction() {
        console.log('⚗️ Reação química simulada!');

        // Animação de reação
        this.molecules.forEach(mol => {
            mol.children.forEach(child => {
                if (child.material) {
                    const originalColor = child.material.color.getHex();
                    child.material.color.setHex(0xffff00);

                    setTimeout(() => {
                        child.material.color.setHex(originalColor);
                    }, 500);
                }
            });
        });
    }

    updateMoleculeByPH() {
        // Simular mudança de cor baseado no pH
        const isAcidic = this.pH < 7;
        const isBasic = this.pH > 7;

        this.atoms.forEach(atom => {
            if (atom.element === 'O') {
                if (isAcidic) {
                    atom.mesh.material.color.setHex(0xff6666);
                } else if (isBasic) {
                    atom.mesh.material.color.setHex(0x6666ff);
                } else {
                    atom.mesh.material.color.setHex(0xff0000);
                }
            }
        });
    }

    updateMoleculeInfo(molData) {
        const atomicMasses = { H: 1, C: 12, N: 14, O: 16, S: 32, P: 31, Na: 23, Cl: 35.5 };

        const molarMass = molData.atoms.reduce((sum, atom) => {
            return sum + (atomicMasses[atom.element] || 0);
        }, 0);

        document.getElementById('molecule-info').innerHTML = `
            ${molData.name}<br>
            Massa Molar: ${molarMass.toFixed(2)} g/mol<br>
            Átomos: ${molData.atoms.length}<br>
            Ligações: ${molData.bonds.length}
        `;
    }

    clearMolecule() {
        this.molecules.forEach(mol => this.sceneManager.removeObject(mol));
        this.atoms.forEach(atom => {
            if (atom.label) this.sceneManager.removeObject(atom.label);
        });
        this.atoms = [];
        this.bonds = [];
        this.molecules = [];
    }

    update(deltaTime) {
        if (!this.isRunning) return;

        const rotationSpeed = parseFloat(document.getElementById('rotation-speed')?.value || 1);

        this.molecules.forEach(mol => {
            mol.rotation.y += 0.01 * rotationSpeed;
            mol.rotation.x += 0.005 * rotationSpeed;
        });

        document.getElementById('particles-value').textContent = this.atoms.length;
    }

    start() {
        this.isRunning = true;
    }

    pause() {
        this.isRunning = false;
    }

    reset() {
        this.buildMolecule(this.currentMolecule);
    }

    setTemperature(temp) {
        this.temperature = temp;
        // Temperatura afeta velocidade de vibração
        const vibrationFactor = temp / 298;
        this.molecules.forEach(mol => {
            mol.children.forEach(child => {
                if (child.position) {
                    child.position.x += (Math.random() - 0.5) * 0.01 * vibrationFactor;
                    child.position.y += (Math.random() - 0.5) * 0.01 * vibrationFactor;
                }
            });
        });
    }

    cleanup() {
        this.clearMolecule();
    }
}