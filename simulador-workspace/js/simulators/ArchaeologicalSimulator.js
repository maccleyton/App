// ArchaeologicalSimulator.js - Simulador Arqueológico
class ArchaeologicalSimulator {
    constructor(sceneManager, physicsEngine) {
        this.sceneManager = sceneManager;
        this.physics = physicsEngine;
        this.isRunning = false;

        // Artefatos e fósseis
        this.artifacts = [];
        this.fossils = [];
        this.layers = [];

        // Datação
        this.carbonDatingActive = false;
        this.currentAge = 0;
        this.excavationDepth = 0;

        // Cenário
        this.currentSite = 'fossil';

        console.log('✅ ArchaeologicalSimulator criado');
    }

    init() {
        this.createInterface();
        this.setupSite(this.currentSite);
        this.physics.setGravity(0, -9.8, 0);
    }

    createInterface() {
        document.getElementById('specific-controls').innerHTML = `
            <h4>🦴 Controles Arqueológicos</h4>

            <div class="control-group">
                <label>Sítio Arqueológico:</label>
                <select id="archaeological-site" style="width: 100%; padding: 8px; border-radius: 5px; background: rgba(99, 102, 241, 0.1); color: white; border: 1px solid rgba(99, 102, 241, 0.3);">
                    <option value="fossil">Escavação de Fóssil</option>
                    <option value="carbon-dating">Datação por C-14</option>
                    <option value="pottery">Cerâmica Antiga</option>
                    <option value="dinosaur">Dinossauro T-Rex</option>
                    <option value="human-evolution">Evolução Humana</option>
                    <option value="pyramid">Pirâmide Egípcia</option>
                    <option value="stratigraphy">Estratigrafia</option>
                </select>
            </div>

            <div class="control-group">
                <label>Profundidade: <span id="depth-value">0</span> m</label>
                <input type="range" id="depth-slider" min="0" max="50" value="0">
            </div>

            <div class="control-group">
                <label>Idade Estimada: <span id="age-value">0</span> anos</label>
                <div style="font-size: 0.75rem; color: #888; margin-top: 5px;">
                    Método: <span id="dating-method">-</span>
                </div>
            </div>

            <div class="control-buttons">
                <button id="btn-excavate" class="btn btn-primary">⛏️ Escavar</button>
                <button id="btn-date" class="btn">📅 Datar (C-14)</button>
            </div>

            <div class="control-buttons">
                <button id="btn-reconstruct" class="btn">🔧 Reconstruir</button>
                <button id="btn-scan" class="btn">🔍 Scanner 3D</button>
            </div>

            <div class="control-group" style="margin-top: 15px; padding: 10px; background: rgba(99, 102, 241, 0.1); border-radius: 8px;">
                <label style="color: #00d4ff; font-weight: bold;">Descobertas:</label>
                <div id="discoveries" style="font-family: monospace; font-size: 0.85rem; color: #fff; margin-top: 5px;">
                    Artefatos: 0<br>
                    Fósseis: 0<br>
                    Era: Desconhecida
                </div>
            </div>
        `;

        document.getElementById('archaeological-site').addEventListener('change', (e) => {
            this.currentSite = e.target.value;
            this.setupSite(e.target.value);
        });

        document.getElementById('depth-slider').addEventListener('input', (e) => {
            this.excavationDepth = parseFloat(e.target.value);
            document.getElementById('depth-value').textContent = e.target.value;
            this.updateLayerVisibility();
        });

        document.getElementById('btn-excavate').addEventListener('click', () => this.excavate());
        document.getElementById('btn-date').addEventListener('click', () => this.carbonDate());
        document.getElementById('btn-reconstruct').addEventListener('click', () => this.reconstruct());
        document.getElementById('btn-scan').addEventListener('click', () => this.scan3D());
    }

    setupSite(type) {
        this.clearSite();

        switch(type) {
            case 'fossil':
                this.createFossilSite();
                break;
            case 'carbon-dating':
                this.createCarbonDatingSite();
                break;
            case 'pottery':
                this.createPotterySite();
                break;
            case 'dinosaur':
                this.createDinosaurSite();
                break;
            case 'human-evolution':
                this.createHumanEvolutionSite();
                break;
            case 'pyramid':
                this.createPyramidSite();
                break;
            case 'stratigraphy':
                this.createStratigraphySite();
                break;
        }
    }

    createFossilSite() {
        // Solo/Terreno
        const groundGeometry = new THREE.BoxGeometry(30, 1, 30);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8b7355,
            roughness: 0.9
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.position.y = -0.5;
        ground.receiveShadow = true;
        this.sceneManager.addObject(ground);

        // Criar crânio fóssil parcialmente enterrado
        this.createSkull(0, -2, 0);

        // Ossos espalhados
        for (let i = 0; i < 5; i++) {
            const bone = this.createBone(
                (Math.random() - 0.5) * 15,
                -Math.random() * 3,
                (Math.random() - 0.5) * 15
            );
            this.fossils.push(bone);
        }
    }

    createSkull(x, y, z) {
        // Crânio simplificado
        const skullGeometry = new THREE.SphereGeometry(1.5, 16, 16);
        const skullMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4c4a8,
            roughness: 0.8
        });
        const skull = new THREE.Mesh(skullGeometry, skullMaterial);
        skull.position.set(x, y, z);
        skull.scale.set(1, 0.8, 1);
        this.sceneManager.addObject(skull);

        // Órbitas oculares
        const eyeGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.5, 0.2, 1.2);
        skull.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.5, 0.2, 1.2);
        skull.add(rightEye);

        this.fossils.push({ mesh: skull, type: 'skull', age: 50000 });
        return skull;
    }

    createBone(x, y, z) {
        const boneGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
        const boneMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4c4a8,
            roughness: 0.7
        });
        const bone = new THREE.Mesh(boneGeometry, boneMaterial);
        bone.position.set(x, y, z);
        bone.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        this.sceneManager.addObject(bone);

        return { mesh: bone, type: 'bone', age: 40000 + Math.random() * 30000 };
    }

    createCarbonDatingSite() {
        // Artefato de madeira
        const woodGeometry = new THREE.BoxGeometry(3, 0.5, 1);
        const woodMaterial = new THREE.MeshStandardMaterial({
            color: 0x5d4e37,
            roughness: 0.9
        });
        const wood = new THREE.Mesh(woodGeometry, woodMaterial);
        wood.position.set(0, 0, 0);
        this.sceneManager.addObject(wood);

        // Átomo C-14 (representação)
        const c14Geometry = new THREE.SphereGeometry(0.3, 16, 16);
        const c14Material = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 0.5
        });

        for (let i = 0; i < 10; i++) {
            const c14 = new THREE.Mesh(c14Geometry, c14Material);
            c14.position.set(
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 1
            );
            this.sceneManager.addObject(c14);
            this.artifacts.push({ mesh: c14, type: 'c14', halfLife: 5730 });
        }

        this.artifacts.push({ mesh: wood, type: 'wood', age: 12000 });
    }

    createPotterySite() {
        // Vasos cerâmicos quebrados
        for (let i = 0; i < 3; i++) {
            const pottery = this.createPottery(
                (i - 1) * 4,
                0,
                0
            );
            this.artifacts.push(pottery);
        }
    }

    createPottery(x, y, z) {
        const potteryGeometry = new THREE.CylinderGeometry(1, 0.8, 2, 16);
        const potteryMaterial = new THREE.MeshStandardMaterial({
            color: 0xcd853f,
            roughness: 0.8
        });
        const pottery = new THREE.Mesh(potteryGeometry, potteryMaterial);
        pottery.position.set(x, y, z);
        this.sceneManager.addObject(pottery);

        return { mesh: pottery, type: 'pottery', age: 3000 };
    }

    createDinosaurSite() {
        // Esqueleto de T-Rex simplificado

        // Crânio grande
        const skull = this.createSkull(0, 3, -2);
        skull.scale.set(2, 1.5, 2);

        // Coluna vertebral
        for (let i = 0; i < 10; i++) {
            const vertebra = this.createBone(i * 0.8 - 4, 2, 0);
            vertebra.mesh.scale.set(0.5, 0.5, 0.5);
            this.fossils.push(vertebra);
        }

        // Costelas
        for (let i = 0; i < 6; i++) {
            const rib = this.createBone(i * 0.8 - 2, 2, 1.5);
            rib.mesh.rotation.z = Math.PI / 4;
            rib.mesh.scale.set(0.3, 1.5, 0.3);
        }

        // Pernas (fêmures)
        const leg1 = this.createBone(-1, 0, 2);
        leg1.mesh.scale.set(0.8, 2, 0.8);
        leg1.age = 65000000; // 65 milhões de anos

        const leg2 = this.createBone(1, 0, 2);
        leg2.mesh.scale.set(0.8, 2, 0.8);
        leg2.age = 65000000;

        this.updateAge(65000000, 'Estratigrafia + Argônio-40');
    }

    createHumanEvolutionSite() {
        // Linha do tempo da evolução humana
        const species = [
            { name: 'Australopithecus', age: 3000000, x: -10 },
            { name: 'Homo habilis', age: 2000000, x: -5 },
            { name: 'Homo erectus', age: 1500000, x: 0 },
            { name: 'Neanderthal', age: 200000, x: 5 },
            { name: 'Homo sapiens', age: 50000, x: 10 }
        ];

        species.forEach(sp => {
            const skull = this.createSkull(sp.x, 1, 0);
            skull.userData.name = sp.name;
            skull.userData.age = sp.age;

            // Label
            this.addLabel(skull, sp.name + '\n' + (sp.age/1000).toFixed(0) + 'k anos');
        });
    }

    createPyramidSite() {
        // Pirâmide
        const pyramidGeometry = new THREE.ConeGeometry(8, 12, 4);
        const pyramidMaterial = new THREE.MeshStandardMaterial({
            color: 0xdaa520,
            flatShading: true
        });
        const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
        pyramid.position.y = 6;
        pyramid.rotation.y = Math.PI / 4;
        this.sceneManager.addObject(pyramid);

        // Hieróglifos (cubos decorativos)
        for (let i = 0; i < 10; i++) {
            const hieroglyph = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, 0.3, 0.1),
                new THREE.MeshStandardMaterial({ color: 0x000000 })
            );
            hieroglyph.position.set(
                (Math.random() - 0.5) * 6,
                Math.random() * 10,
                8.1
            );
            this.sceneManager.addObject(hieroglyph);
        }

        this.artifacts.push({ mesh: pyramid, type: 'pyramid', age: 4500 });
        this.updateAge(4500, 'Histórico');
    }

    createStratigraphySite() {
        // Camadas geológicas
        const layers = [
            { age: 1000, color: 0x8b4513, y: -1, label: 'Medieval' },
            { age: 5000, color: 0xa0522d, y: -3, label: 'Bronze' },
            { age: 10000, color: 0xcd853f, y: -5, label: 'Neolítico' },
            { age: 50000, color: 0xd2691e, y: -7, label: 'Paleolítico' },
            { age: 100000, color: 0x8b7355, y: -9, label: 'Pleistoceno' }
        ];

        layers.forEach(layer => {
            const layerGeometry = new THREE.BoxGeometry(30, 2, 30);
            const layerMaterial = new THREE.MeshStandardMaterial({
                color: layer.color,
                transparent: true,
                opacity: 0.8
            });
            const layerMesh = new THREE.Mesh(layerGeometry, layerMaterial);
            layerMesh.position.y = layer.y;
            this.sceneManager.addObject(layerMesh);

            this.layers.push({
                mesh: layerMesh,
                age: layer.age,
                depth: Math.abs(layer.y),
                label: layer.label
            });

            // Adicionar artefato na camada
            const artifact = this.createBone(
                (Math.random() - 0.5) * 10,
                layer.y,
                (Math.random() - 0.5) * 10
            );
            artifact.age = layer.age;
        });
    }

    addLabel(object, text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;

        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, 512, 128);

        context.font = 'Bold 32px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(text, 256, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(4, 1, 1);
        sprite.position.y = 2;
        object.add(sprite);
    }

    excavate() {
        console.log('⛏️ Escavando...');

        // Revelar fósseis baseado na profundidade
        this.fossils.forEach(fossil => {
            if (fossil.mesh.position.y > -this.excavationDepth) {
                fossil.mesh.material.opacity = 1;
                fossil.mesh.visible = true;
            }
        });

        // Efeito de escavação (partículas de poeira)
        for (let i = 0; i < 20; i++) {
            const dustGeometry = new THREE.SphereGeometry(0.1, 4, 4);
            const dustMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x8b7355,
                transparent: true,
                opacity: 0.5
            });
            const dust = new THREE.Mesh(dustGeometry, dustMaterial);
            dust.position.set(
                (Math.random() - 0.5) * 10,
                0,
                (Math.random() - 0.5) * 10
            );
            this.sceneManager.addObject(dust);

            setTimeout(() => {
                this.sceneManager.removeObject(dust);
            }, 2000);
        }

        this.updateDiscoveries();
    }

    carbonDate() {
        console.log('📅 Datando por Carbono-14...');
        this.carbonDatingActive = true;

        // Simular decaimento de C-14
        let age = 0;
        const interval = setInterval(() => {
            age += 1000;
            this.updateAge(age, 'Carbono-14');

            if (age >= 50000) {
                clearInterval(interval);
                this.carbonDatingActive = false;
            }
        }, 100);
    }

    reconstruct() {
        console.log('🔧 Reconstruindo artefato...');

        // Animar reconstrução
        this.fossils.forEach(fossil => {
            if (fossil.mesh.visible) {
                fossil.mesh.material.color.setHex(0xffffff);
                setTimeout(() => {
                    fossil.mesh.material.color.setHex(0xd4c4a8);
                }, 500);
            }
        });
    }

    scan3D() {
        console.log('🔍 Scanner 3D ativado...');

        // Efeito de scanner (linhas verdes)
        const scannerGeometry = new THREE.PlaneGeometry(30, 30);
        const scannerMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const scanner = new THREE.Mesh(scannerGeometry, scannerMaterial);
        scanner.rotation.x = Math.PI / 2;
        scanner.position.y = -5;
        this.sceneManager.addObject(scanner);

        // Animar scanner subindo
        let y = -5;
        const scanInterval = setInterval(() => {
            y += 0.5;
            scanner.position.y = y;

            if (y > 5) {
                clearInterval(scanInterval);
                this.sceneManager.removeObject(scanner);
            }
        }, 50);
    }

    updateLayerVisibility() {
        this.layers.forEach(layer => {
            if (layer.depth <= this.excavationDepth) {
                layer.mesh.material.opacity = 0.3;
            } else {
                layer.mesh.material.opacity = 0.8;
            }
        });
    }

    updateAge(age, method) {
        this.currentAge = age;
        document.getElementById('age-value').textContent = age.toLocaleString();
        document.getElementById('dating-method').textContent = method;
    }

    updateDiscoveries() {
        const visibleFossils = this.fossils.filter(f => f.mesh.visible).length;
        const visibleArtifacts = this.artifacts.filter(a => a.mesh.visible).length;

        let era = 'Desconhecida';
        if (this.currentAge < 5000) era = 'Histórica';
        else if (this.currentAge < 50000) era = 'Pré-História';
        else if (this.currentAge < 1000000) era = 'Pleistoceno';
        else era = 'Paleontológica';

        document.getElementById('discoveries').innerHTML = `
            Artefatos: ${visibleArtifacts}<br>
            Fósseis: ${visibleFossils}<br>
            Era: ${era}
        `;
    }

    update(deltaTime) {
        if (!this.isRunning) return;

        // Rotação suave de artefatos
        this.artifacts.forEach(artifact => {
            if (artifact.mesh && artifact.type === 'pottery') {
                artifact.mesh.rotation.y += 0.01;
            }
        });

        this.updateDiscoveries();
        document.getElementById('particles-value').textContent = 
            this.fossils.length + this.artifacts.length;
    }

    clearSite() {
        this.fossils.forEach(f => this.sceneManager.removeObject(f.mesh));
        this.artifacts.forEach(a => this.sceneManager.removeObject(a.mesh));
        this.layers.forEach(l => this.sceneManager.removeObject(l.mesh));

        this.fossils = [];
        this.artifacts = [];
        this.layers = [];
        this.excavationDepth = 0;
        this.currentAge = 0;
    }

    start() {
        this.isRunning = true;
    }

    pause() {
        this.isRunning = false;
    }

    reset() {
        this.setupSite(this.currentSite);
    }

    cleanup() {
        this.clearSite();
    }
}