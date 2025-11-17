// BiologicalSimulator.js - Simulador Biológico
class BiologicalSimulator {
    constructor(sceneManager, physicsEngine) {
        this.sceneManager = sceneManager;
        this.physics = physicsEngine;
        this.isRunning = false;

        // Organismos
        this.cells = [];
        this.organelles = [];
        this.bacteria = [];
        this.viruses = [];

        // Ambiente
        this.nutrients = [];
        this.oxygen = 100;
        this.co2 = 0;
        this.waterLevel = 100;

        // Parâmetros
        this.populationSize = 10;
        this.mutationRate = 0.01;
        this.currentScenario = 'cell';

        console.log('✅ BiologicalSimulator criado');
    }

    init() {
        this.createInterface();
        this.setupScenario(this.currentScenario);
        this.physics.setGravity(0, 0, 0);
    }

    createInterface() {
        document.getElementById('specific-controls').innerHTML = `
            <h4>🦠 Controles Biológicos</h4>

            <div class="control-group">
                <label>Cenário:</label>
                <select id="bio-scenario" style="width: 100%; padding: 8px; border-radius: 5px; background: rgba(99, 102, 241, 0.1); color: white; border: 1px solid rgba(99, 102, 241, 0.3);">
                    <option value="cell">Célula Eucariótica</option>
                    <option value="bacteria">Bactérias</option>
                    <option value="virus">Vírus e Infecção</option>
                    <option value="mitosis">Mitose Celular</option>
                    <option value="photosynthesis">Fotossíntese</option>
                    <option value="ecosystem">Ecossistema Micro</option>
                    <option value="evolution">Evolução e Seleção</option>
                </select>
            </div>

            <div class="control-group">
                <label>População: <span id="population-value">10</span></label>
                <input type="range" id="population-slider" min="1" max="50" value="10">
            </div>

            <div class="control-group">
                <label>Taxa de Mutação: <span id="mutation-value">1</span>%</label>
                <input type="range" id="mutation-slider" min="0" max="10" step="0.1" value="1">
            </div>

            <div class="control-group">
                <label>Oxigênio (O₂): <span id="oxygen-value">100</span>%</label>
                <div style="width: 100%; height: 8px; background: rgba(99, 102, 241, 0.2); border-radius: 4px;">
                    <div id="oxygen-bar" style="width: 100%; height: 100%; background: #00ff00; border-radius: 4px;"></div>
                </div>
            </div>

            <div class="control-buttons">
                <button id="btn-add-cell" class="btn">🧬 Adicionar Célula</button>
                <button id="btn-divide" class="btn btn-primary">🔬 Dividir</button>
            </div>

            <div class="control-buttons">
                <button id="btn-add-nutrient" class="btn">🍃 Add Nutriente</button>
                <button id="btn-infection" class="btn">🦠 Infecção</button>
            </div>

            <div class="control-group" style="margin-top: 15px; padding: 10px; background: rgba(99, 102, 241, 0.1); border-radius: 8px;">
                <label style="color: #00d4ff; font-weight: bold;">Estatísticas:</label>
                <div id="bio-stats" style="font-family: monospace; font-size: 0.85rem; color: #fff; margin-top: 5px;">
                    Células Vivas: 0<br>
                    Gerações: 0<br>
                    Taxa de Sobrevivência: 100%
                </div>
            </div>
        `;

        document.getElementById('bio-scenario').addEventListener('change', (e) => {
            this.currentScenario = e.target.value;
            this.setupScenario(e.target.value);
        });

        document.getElementById('population-slider').addEventListener('input', (e) => {
            this.populationSize = parseInt(e.target.value);
            document.getElementById('population-value').textContent = e.target.value;
        });

        document.getElementById('mutation-slider').addEventListener('input', (e) => {
            this.mutationRate = parseFloat(e.target.value) / 100;
            document.getElementById('mutation-value').textContent = e.target.value;
        });

        document.getElementById('btn-add-cell').addEventListener('click', () => this.addCell());
        document.getElementById('btn-divide').addEventListener('click', () => this.triggerMitosis());
        document.getElementById('btn-add-nutrient').addEventListener('click', () => this.addNutrients());
        document.getElementById('btn-infection').addEventListener('click', () => this.infectCells());

        this.setupScenario('cell');
    }

    setupScenario(type) {
        this.clearAll();

        switch(type) {
            case 'cell':
                this.createEukaryoticCell();
                break;
            case 'bacteria':
                this.createBacteriaColony();
                break;
            case 'virus':
                this.createVirusScenario();
                break;
            case 'mitosis':
                this.createMitosisDemo();
                break;
            case 'photosynthesis':
                this.createPhotosynthesis();
                break;
            case 'ecosystem':
                this.createMicroEcosystem();
                break;
            case 'evolution':
                this.createEvolutionDemo();
                break;
        }
    }

    createEukaryoticCell() {
        // Célula grande
        const cellGeometry = new THREE.SphereGeometry(3, 32, 32);
        const cellMaterial = new THREE.MeshStandardMaterial({
            color: 0x88ff88,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const cell = new THREE.Mesh(cellGeometry, cellMaterial);
        this.sceneManager.addObject(cell);

        this.cells.push({
            mesh: cell,
            position: new THREE.Vector3(0, 0, 0),
            health: 100,
            energy: 100,
            age: 0,
            generation: 1
        });

        // Núcleo
        const nucleus = this.createOrganelle('nucleus', 0, 0, 0, 1, 0x0000ff);
        this.organelles.push(nucleus);

        // Mitocôndrias (powerhouse!)
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const mito = this.createOrganelle('mitochondria', 
                Math.cos(angle) * 2, 
                Math.sin(angle) * 1.5, 
                0, 
                0.4, 
                0xff0000
            );
            this.organelles.push(mito);
        }

        // Ribossomos (pequenos)
        for (let i = 0; i < 15; i++) {
            const x = (Math.random() - 0.5) * 5;
            const y = (Math.random() - 0.5) * 5;
            const z = (Math.random() - 0.5) * 5;
            const ribo = this.createOrganelle('ribosome', x, y, z, 0.15, 0xffff00);
            this.organelles.push(ribo);
        }

        // Retículo endoplasmático
        const erGeometry = new THREE.TorusGeometry(1.5, 0.2, 8, 16);
        const erMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff00ff,
            wireframe: true
        });
        const er = new THREE.Mesh(erGeometry, erMaterial);
        this.sceneManager.addObject(er);
        this.organelles.push({ mesh: er, type: 'er' });
    }

    createOrganelle(type, x, y, z, radius, color) {
        const geometry = new THREE.SphereGeometry(radius, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.4
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        this.sceneManager.addObject(mesh);

        return {
            mesh: mesh,
            type: type,
            position: new THREE.Vector3(x, y, z)
        };
    }

    createBacteriaColony() {
        for (let i = 0; i < this.populationSize; i++) {
            this.createBacterium(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 20
            );
        }
    }

    createBacterium(x, y, z) {
        // Corpo (bastonete)
        const bodyGeometry = new THREE.CapsuleGeometry(0.3, 1, 8, 16);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            metalness: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(x, y, z);
        body.rotation.z = Math.random() * Math.PI;
        this.sceneManager.addObject(body);

        // Flagelo
        const flagellumPoints = [];
        for (let i = 0; i < 20; i++) {
            flagellumPoints.push(new THREE.Vector3(
                i * 0.1,
                Math.sin(i * 0.5) * 0.2,
                0
            ));
        }
        const flagellumGeometry = new THREE.BufferGeometry().setFromPoints(flagellumPoints);
        const flagellumMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const flagellum = new THREE.Line(flagellumGeometry, flagellumMaterial);
        flagellum.position.copy(body.position);
        flagellum.position.x -= 0.5;
        this.sceneManager.addObject(flagellum);

        this.bacteria.push({
            body: body,
            flagellum: flagellum,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.1
            ),
            health: 100,
            age: 0
        });
    }

    createVirusScenario() {
        // Criar célula hospedeira
        this.createEukaryoticCell();

        // Criar vírus
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            this.createVirus(
                Math.cos(angle) * 10,
                Math.sin(angle) * 10,
                0
            );
        }
    }

    createVirus(x, y, z) {
        // Capsídeo (icosaedro)
        const capsidGeometry = new THREE.IcosahedronGeometry(0.5, 0);
        const capsidMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            wireframe: true
        });
        const capsid = new THREE.Mesh(capsidGeometry, capsidMaterial);
        capsid.position.set(x, y, z);
        this.sceneManager.addObject(capsid);

        // Material genético (centro)
        const genomeGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const genomeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.5
        });
        const genome = new THREE.Mesh(genomeGeometry, genomeMaterial);
        capsid.add(genome);

        this.viruses.push({
            mesh: capsid,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2
            ),
            infected: false
        });
    }

    createMitosisDemo() {
        // Célula que vai se dividir
        const cellGeometry = new THREE.SphereGeometry(2, 32, 32);
        const cellMaterial = new THREE.MeshStandardMaterial({
            color: 0x88ff88,
            transparent: true,
            opacity: 0.4
        });
        const cell = new THREE.Mesh(cellGeometry, cellMaterial);
        this.sceneManager.addObject(cell);

        // Cromossomos
        for (let i = 0; i < 4; i++) {
            const chromo = this.createChromosome(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                0
            );
            this.organelles.push(chromo);
        }

        this.cells.push({
            mesh: cell,
            dividing: false,
            phase: 'interphase'
        });
    }

    createChromosome(x, y, z) {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0.5, 0.3);
        shape.lineTo(0, 0.8);
        shape.lineTo(-0.5, 0.3);
        shape.lineTo(0, 0);

        const extrudeSettings = { depth: 0.1, bevelEnabled: false };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        this.sceneManager.addObject(mesh);

        return { mesh: mesh, type: 'chromosome' };
    }

    createPhotosynthesis() {
        // Cloroplasto
        const chloroGeometry = new THREE.SphereGeometry(2, 32, 32);
        const chloroMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.5
        });
        const chloroplast = new THREE.Mesh(chloroGeometry, chloroMaterial);
        this.sceneManager.addObject(chloroplast);

        // Luz solar (fótons)
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const photon = this.createOrganelle('photon', 
                    -10, 
                    (Math.random() - 0.5) * 4, 
                    (Math.random() - 0.5) * 4, 
                    0.2, 
                    0xffff00
                );
                photon.velocity = new THREE.Vector3(0.3, 0, 0);
                this.organelles.push(photon);
            }, i * 500);
        }

        this.cells.push({ mesh: chloroplast, type: 'chloroplast' });
    }

    createMicroEcosystem() {
        // Mix de organismos
        for (let i = 0; i < 5; i++) {
            this.createBacterium(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 15
            );
        }

        // Adicionar nutrientes
        for (let i = 0; i < 20; i++) {
            this.addNutrients();
        }
    }

    createEvolutionDemo() {
        // População inicial com variação
        for (let i = 0; i < this.populationSize; i++) {
            const size = 0.5 + Math.random() * 0.5;
            const color = new THREE.Color().setHSL(Math.random(), 1, 0.5);

            const geometry = new THREE.SphereGeometry(size, 16, 16);
            const material = new THREE.MeshStandardMaterial({ color: color.getHex() });
            const organism = new THREE.Mesh(geometry, material);

            organism.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 20
            );

            this.sceneManager.addObject(organism);

            this.cells.push({
                mesh: organism,
                fitness: Math.random(),
                size: size,
                generation: 1,
                health: 100
            });
        }
    }

    addCell() {
        const x = (Math.random() - 0.5) * 15;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 15;

        if (this.currentScenario === 'bacteria') {
            this.createBacterium(x, y, z);
        } else {
            const cellGeometry = new THREE.SphereGeometry(1, 16, 16);
            const cellMaterial = new THREE.MeshStandardMaterial({
                color: 0x88ff88,
                transparent: true,
                opacity: 0.5
            });
            const cell = new THREE.Mesh(cellGeometry, cellMaterial);
            cell.position.set(x, y, z);
            this.sceneManager.addObject(cell);

            this.cells.push({
                mesh: cell,
                health: 100,
                generation: 1
            });
        }
    }

    triggerMitosis() {
        if (this.cells.length === 0) return;

        const cell = this.cells[0];
        const pos = cell.mesh.position;

        // Criar duas células filhas
        for (let i = 0; i < 2; i++) {
            const newCell = cell.mesh.clone();
            newCell.position.set(
                pos.x + (i - 0.5) * 2,
                pos.y,
                pos.z
            );
            newCell.scale.set(0.8, 0.8, 0.8);
            this.sceneManager.addObject(newCell);

            this.cells.push({
                mesh: newCell,
                health: 100,
                generation: (cell.generation || 1) + 1
            });
        }

        console.log('🔬 Mitose concluída!');
    }

    addNutrients() {
        const nutrient = this.createOrganelle('nutrient',
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 20,
            0.3,
            0x00ff00
        );
        this.nutrients.push(nutrient);
    }

    infectCells() {
        if (this.cells.length === 0 || this.viruses.length === 0) return;

        const cell = this.cells[0];
        const virus = this.viruses[0];

        // Mover vírus em direção à célula
        const direction = new THREE.Vector3()
            .subVectors(cell.mesh.position, virus.mesh.position)
            .normalize()
            .multiplyScalar(0.5);

        virus.velocity.copy(direction);
        virus.infected = true;

        console.log('🦠 Vírus atacando célula!');
    }

    updateBioStats() {
        const liveCells = this.cells.filter(c => c.health > 0).length + this.bacteria.length;
        const maxGen = Math.max(...this.cells.map(c => c.generation || 1), 1);

        document.getElementById('bio-stats').innerHTML = `
            Células Vivas: ${liveCells}<br>
            Gerações: ${maxGen}<br>
            Nutrientes: ${this.nutrients.length}
        `;
    }

    update(deltaTime) {
        if (!this.isRunning) return;

        // Atualizar bactérias
        this.bacteria.forEach(bac => {
            bac.body.position.add(bac.velocity);
            bac.flagellum.position.copy(bac.body.position);
            bac.flagellum.position.x -= 0.5;

            // Movimento browniano
            bac.velocity.x += (Math.random() - 0.5) * 0.01;
            bac.velocity.z += (Math.random() - 0.5) * 0.01;

            // Rotação
            bac.body.rotation.y += 0.02;

            // Limites
            if (Math.abs(bac.body.position.x) > 20) bac.velocity.x *= -1;
            if (Math.abs(bac.body.position.z) > 20) bac.velocity.z *= -1;
        });

        // Atualizar vírus
        this.viruses.forEach(virus => {
            virus.mesh.position.add(virus.velocity);
            virus.mesh.rotation.x += 0.05;
            virus.mesh.rotation.y += 0.03;

            // Verificar infecção
            if (virus.infected && this.cells.length > 0) {
                const cell = this.cells[0];
                const dist = virus.mesh.position.distanceTo(cell.mesh.position);
                if (dist < 3) {
                    cell.health -= 10;
                    if (cell.health <= 0) {
                        cell.mesh.material.color.setHex(0xff0000);
                        console.log('💀 Célula infectada morreu!');
                    }
                }
            }
        });

        // Animar organelas
        this.organelles.forEach(org => {
            if (org.type === 'mitochondria') {
                org.mesh.rotation.y += 0.02;
            }
            if (org.type === 'ribosome') {
                org.mesh.position.y += Math.sin(Date.now() * 0.002) * 0.01;
            }
            if (org.type === 'photon' && org.velocity) {
                org.mesh.position.add(org.velocity);
                if (org.mesh.position.x > 10) {
                    this.sceneManager.removeObject(org.mesh);
                }
            }
        });

        // Consumo de oxigênio
        this.oxygen -= 0.05;
        if (this.oxygen < 0) this.oxygen = 0;
        document.getElementById('oxygen-value').textContent = Math.round(this.oxygen);
        document.getElementById('oxygen-bar').style.width = this.oxygen + '%';

        this.updateBioStats();
        document.getElementById('particles-value').textContent = 
            this.cells.length + this.bacteria.length;
    }

    clearAll() {
        this.cells.forEach(c => this.sceneManager.removeObject(c.mesh));
        this.organelles.forEach(o => this.sceneManager.removeObject(o.mesh));
        this.bacteria.forEach(b => {
            this.sceneManager.removeObject(b.body);
            this.sceneManager.removeObject(b.flagellum);
        });
        this.viruses.forEach(v => this.sceneManager.removeObject(v.mesh));
        this.nutrients.forEach(n => this.sceneManager.removeObject(n.mesh));

        this.cells = [];
        this.organelles = [];
        this.bacteria = [];
        this.viruses = [];
        this.nutrients = [];
        this.oxygen = 100;
    }

    start() {
        this.isRunning = true;
    }

    pause() {
        this.isRunning = false;
    }

    reset() {
        this.setupScenario(this.currentScenario);
    }

    setTemperature(temp) {
        // Temperatura afeta metabolismo
        const metabolismRate = temp / 298;
        this.bacteria.forEach(bac => {
            bac.velocity.multiplyScalar(metabolismRate);
        });
    }

    cleanup() {
        this.clearAll();
    }
}