// SceneManager.js - Gerenciador de Cena Three.js
class SceneManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            2000
        );

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });

        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;

        this.camera.position.set(0, 10, 30);
        this.camera.lookAt(0, 0, 0);

        this.setupLights();
        this.setupControls();
        this.setupResize();

        console.log('✅ SceneManager inicializado');
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(-10, 10, -10);
        this.scene.add(pointLight);
    }

	setupControls() {
		// Escolha: 'orbit' ou 'manual'
		const controlMode = 'orbit'; // ← MUDE AQUI: 'orbit' ou 'manual'
		
		if (controlMode === 'orbit') {
			// ═══════════════════════════════════════════
			// MODO ORBIT - Rotação ao redor do objeto
			// ═══════════════════════════════════════════
			this.controls = new THREE.OrbitControls(this.camera, this.canvas);
			
			// Configurações
			this.controls.enableDamping = true;
			this.controls.dampingFactor = 0.05;
			this.controls.enablePan = true; // Botão direito = pan
			this.controls.enableZoom = true; // Scroll = zoom
			this.controls.enableRotate = true; // Botão esquerdo = rotação
			
			// Limites
			this.controls.minDistance = 5;
			this.controls.maxDistance = 100;
			this.controls.maxPolarAngle = Math.PI;
			this.controls.minPolarAngle = 0;
			
			console.log('🎮 OrbitControls ativado');
			
		} else {
			// ═══════════════════════════════════════════
			// MODO MANUAL - Pan simples
			// ═══════════════════════════════════════════
			this.isDragging = false;
			this.previousMousePosition = { x: 0, y: 0 };

			this.canvas.addEventListener('mousedown', (e) => {
				this.isDragging = true;
				this.previousMousePosition = { x: e.clientX, y: e.clientY };
			});

			this.canvas.addEventListener('mousemove', (e) => {
				if (this.isDragging) {
					const deltaX = e.clientX - this.previousMousePosition.x;
					const deltaY = e.clientY - this.previousMousePosition.y;

					this.camera.position.x -= deltaX * 0.05;
					this.camera.position.y += deltaY * 0.05;
					this.camera.lookAt(0, 0, 0);

					this.previousMousePosition = { x: e.clientX, y: e.clientY };
				}
			});

			this.canvas.addEventListener('mouseup', () => {
				this.isDragging = false;
			});

			this.canvas.addEventListener('wheel', (e) => {
				e.preventDefault();
				this.camera.position.z += e.deltaY * 0.05;
				this.camera.position.z = Math.max(5, Math.min(100, this.camera.position.z));
				this.camera.lookAt(0, 0, 0);
			});
			
			console.log('🎮 Controles manuais ativados');
		}
	}


    setupResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        });
    }

    addObject(object) {
        this.scene.add(object);
    }

    removeObject(object) {
        this.scene.remove(object);
    }

    clearScene() {
        while(this.scene.children.length > 0) {
            const object = this.scene.children[0];
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(mat => mat.dispose());
                } else {
                    object.material.dispose();
                }
            }
            this.scene.remove(object);
        }
        this.setupLights();
    }

	render() {
		// Atualizar OrbitControls (se estiver ativo)
		if (this.controls) {
			this.controls.update();
		}
		
		this.renderer.render(this.scene, this.camera);
	}
}