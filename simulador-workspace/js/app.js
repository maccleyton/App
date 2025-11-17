// app.js - Aplicação Principal - Workspace Edition
class App {
    constructor() {
        this.sceneManager = null;
        this.physicsEngine = null;
        this.currentSimulator = null;
        this.simulators = {};
        this.isPlaying = false;
        this.simulationSpeed = 1.0;
        this.lastTime = 0;
        this.fps = 60;

        this.init();
    }

    init() {
        console.log('🚀 Iniciando Simulador Universal - Workspace Edition');

        this.sceneManager = new SceneManager('canvas3d');
        this.physicsEngine = new PhysicsEngine();

        this.simulators = {
            nuclear: new NuclearSimulator(this.sceneManager, this.physicsEngine),
            quantum: new QuantumSimulator(this.sceneManager, this.physicsEngine),
            cosmic: new CosmicSimulator(this.sceneManager, this.physicsEngine),
            molecular: new MolecularSimulator(this.sceneManager, this.physicsEngine),
            physics: new PhysicsSimulator(this.sceneManager, this.physicsEngine),
            biological: new BiologicalSimulator(this.sceneManager, this.physicsEngine),
            archaeological: new ArchaeologicalSimulator(this.sceneManager, this.physicsEngine),
            thermodynamic: new ThermodynamicSimulator(this.sceneManager, this.physicsEngine),
            climatic: new ClimaticSimulator(this.sceneManager, this.physicsEngine),
            cosmicai: new CosmicAISimulator(this.sceneManager, this.physicsEngine)
        };

        this.switchSimulator('nuclear');
        this.setupUI();
        this.animate();

        console.log('✅ 10 Simuladores carregados!');
    }

    setupUI() {
        // Navegação
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const simulatorName = e.currentTarget.dataset.simulator;
                this.switchSimulator(simulatorName);

                document.querySelectorAll('.nav-item').forEach(li => li.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // Controles de playback
        document.getElementById('btn-play').addEventListener('click', () => this.play());
        document.getElementById('btn-pause').addEventListener('click', () => this.pause());
        document.getElementById('btn-reset').addEventListener('click', () => this.reset());

        // Sliders
        document.getElementById('speed-slider').addEventListener('input', (e) => {
            this.simulationSpeed = parseFloat(e.target.value);
            document.getElementById('speed-value').textContent = this.simulationSpeed.toFixed(1) + 'x';
        });

        document.getElementById('temp-slider').addEventListener('input', (e) => {
            const temp = parseFloat(e.target.value);
            document.getElementById('temp-value').textContent = temp + ' K';
            if (this.currentSimulator && this.currentSimulator.setTemperature) {
                this.currentSimulator.setTemperature(temp);
            }
        });

        document.getElementById('pressure-slider').addEventListener('input', (e) => {
            const pressure = parseFloat(e.target.value);
            document.getElementById('pressure-value').textContent = pressure.toFixed(1) + ' atm';
            if (this.currentSimulator && this.currentSimulator.setPressure) {
                this.currentSimulator.setPressure(pressure);
            }
        });

        document.getElementById('gravity-slider').addEventListener('input', (e) => {
            const gravity = parseFloat(e.target.value);
            document.getElementById('gravity-value').textContent = gravity.toFixed(1) + ' m/s²';
            this.physicsEngine.setGravity(0, -gravity, 0);
        });
    }

    switchSimulator(name) {
        console.log(`🔄 Mudando para: ${name}`);

        if (this.currentSimulator) {
            if (this.currentSimulator.cleanup) {
                this.currentSimulator.cleanup();
            }
            this.pause();
        }

        this.sceneManager.clearScene();
        this.physicsEngine.reset();

        const simulator = this.simulators[name];

        if (simulator) {
            this.currentSimulator = simulator;
            if (simulator.init) {
                simulator.init();
            }

            const titles = {
                nuclear: { title: 'Simulador Nuclear', subtitle: 'Fusão, Fissão e Decaimento' },
                quantum: { title: 'Simulador Quântico', subtitle: 'Mecânica Quântica e Partículas' },
                cosmic: { title: 'Simulador Cósmico', subtitle: 'Sistema Solar e Astronomia' },
                molecular: { title: 'Simulador Molecular', subtitle: 'Química e Moléculas 3D' },
                physics: { title: 'Simulador Físico', subtitle: 'Colisões e Forças' },
                biological: { title: 'Simulador Biológico', subtitle: 'Células e Organismos' },
                archaeological: { title: 'Simulador Arqueológico', subtitle: 'Fósseis e Sítios' },
                thermodynamic: { title: 'Simulador Termodinâmico', subtitle: 'Calor e Energia' },
                climatic: { title: 'Simulador Climático', subtitle: 'Fenômenos Atmosféricos' },
                cosmicai: { title: 'IA Cósmica', subtitle: 'Civilizações e Kardashev' }
            };

            const info = titles[name] || { title: 'Simulador', subtitle: '' };
            document.getElementById('simulator-title').textContent = info.title;
            document.getElementById('simulator-subtitle').textContent = info.subtitle;

            setTimeout(() => this.play(), 500);
        }
    }

    play() {
        this.isPlaying = true;
        if (this.currentSimulator && this.currentSimulator.start) {
            this.currentSimulator.start();
        }

        document.getElementById('btn-play').classList.add('action-btn-primary');
        document.getElementById('btn-pause').classList.remove('action-btn-primary');
    }

    pause() {
        this.isPlaying = false;
        if (this.currentSimulator && this.currentSimulator.pause) {
            this.currentSimulator.pause();
        }

        document.getElementById('btn-play').classList.remove('action-btn-primary');
        document.getElementById('btn-pause').classList.add('action-btn-primary');
    }

    reset() {
        this.pause();
        if (this.currentSimulator && this.currentSimulator.reset) {
            this.currentSimulator.reset();
        }
        this.physicsEngine.reset();
    }

    animate(time = 0) {
        requestAnimationFrame((t) => this.animate(t));

        const deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;

        if (deltaTime > 0) {
            this.fps = Math.round(1 / deltaTime);
            document.getElementById('fps-value').textContent = this.fps;
        }

        if (this.isPlaying) {
            this.physicsEngine.update(deltaTime * this.simulationSpeed);

            if (this.currentSimulator && this.currentSimulator.update) {
                this.currentSimulator.update(deltaTime * this.simulationSpeed);
            }
        }

        this.sceneManager.render();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});