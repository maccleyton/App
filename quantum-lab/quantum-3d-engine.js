// quantum-3d-engine.js
// Motor 3D para Quantum Lab usando Three.js e Cannon.js

class Quantum3DEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            1000
        );

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;

        // Física (Cannon.js)
        this.world = new CANNON.World();
        this.world.gravity.set(0, 0, 0); // Sem gravidade no espaço quântico

        // Câmera
        this.camera.position.set(0, 0, 15);
        this.camera.lookAt(0, 0, 0);

        // Iluminação
        this.setupLights();

        // Controles OrbitControls
        this.controls = new THREE.OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 50;

        // Resize
        window.addEventListener('resize', () => this.onResize());

        // Objetos renderizáveis
        this.renderObjects = [];

        console.log('✅ Quantum3DEngine inicializado');
    }

    setupLights() {
        // Luz ambiente
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambient);

        // Luz direcional
        const directional = new THREE.DirectionalLight(0xffffff, 0.8);
        directional.position.set(10, 10, 10);
        directional.castShadow = true;
        this.scene.add(directional);

        // Luzes pontuais coloridas (efeito quântico)
        const pointLight1 = new THREE.PointLight(0x10b981, 0.5, 50);
        pointLight1.position.set(5, 5, 5);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x2563eb, 0.5, 50);
        pointLight2.position.set(-5, -5, -5);
        this.scene.add(pointLight2);
    }

    addObject(mesh, body = null) {
        this.scene.add(mesh);
        if (body) {
            this.world.addBody(body);
            this.renderObjects.push({ mesh, body });
        }
    }

    removeObject(mesh) {
        this.scene.remove(mesh);
        const index = this.renderObjects.findIndex(obj => obj.mesh === mesh);
        if (index > -1) {
            if (this.renderObjects[index].body) {
                this.world.removeBody(this.renderObjects[index].body);
            }
            this.renderObjects.splice(index, 1);
        }
    }

    clearScene() {
        // Remover todos os objetos (exceto luzes)
        const objectsToRemove = [];
        this.scene.children.forEach(child => {
            if (child.type === 'Mesh' || child.type === 'Group') {
                objectsToRemove.push(child);
            }
        });

        objectsToRemove.forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        });

        this.renderObjects = [];
        this.world = new CANNON.World();
        this.world.gravity.set(0, 0, 0);
    }

    update(deltaTime) {
        // Atualizar física
        this.world.step(1/60, deltaTime, 3);

        // Sincronizar meshes com corpos físicos
        this.renderObjects.forEach(obj => {
            if (obj.body) {
                obj.mesh.position.copy(obj.body.position);
                obj.mesh.quaternion.copy(obj.body.quaternion);
            }
        });

        // Atualizar controles
        this.controls.update();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }

    // Helpers
    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }

    getWorld() {
        return this.world;
    }
}
