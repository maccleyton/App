// quantum-app.js
// Aplicação principal do Quantum Lab

class QuantumApp {
    constructor() {
        this.engine = null;
        this.orbitalModel = null;
        this.cloudModel = null;
        this.nucleusModel = null;
        this.currentModel = null;
        this.viewMode = 'orbital'; // orbital | cloud | nucleus
        this.isRunning = false;
        this.lastTime = 0;

        // Dados dos elementos
        this.elements = this.loadPeriodicTable();
        this.currentElement = this.elements[0]; // Hidrogênio

        this.init();
    }

    init() {
        // Inicializar motor 3D
        this.engine = new Quantum3DEngine('canvas3d');

        // Inicializar modelos
        this.orbitalModel = new QuantumOrbitalModel(this.engine);
        this.cloudModel = new QuantumCloudModel(this.engine);
        this.nucleusModel = new QuantumNucleusModel(this.engine);

        // Inicializar controles
        this.controllers = new QuantumControllers(this);

        // Criar átomo inicial (Hidrogênio)
        this.setViewMode('orbital');
        this.selectElement('H');

        // Iniciar loop de renderização
        this.start();

        console.log('🚀 QuantumApp inicializado');
    }

    setViewMode(mode) {
        this.viewMode = mode;

        // Parar modelo atual
        if (this.currentModel) {
            this.currentModel.stop();
            this.currentModel.clear();
        }

        // Ativar novo modelo
        switch(mode) {
            case 'orbital':
                this.currentModel = this.orbitalModel;
                break;
            case 'cloud':
                this.currentModel = this.cloudModel;
                break;
            case 'nucleus':
                this.currentModel = this.nucleusModel;
                break;
        }

        // Recriar átomo no novo modo
        this.currentModel.createAtom(this.currentElement);
        this.currentModel.start();

        console.log(`🔄 Modo alterado para: ${mode}`);
    }

    selectElement(symbol) {
        const element = this.elements.find(el => el.symbol === symbol);
        if (element) {
            this.currentElement = element;
            if (this.currentModel) {
                this.currentModel.clear();
                this.currentModel.createAtom(element);
                this.currentModel.start();
            }
            this.updateElementInfo(element);
            console.log(`🧪 Elemento selecionado: ${element.name} (${symbol})`);
        }
    }

    updateElementInfo(element) {
        document.getElementById('element-symbol').textContent = element.symbol;
        document.getElementById('element-name').textContent = element.name;
        document.getElementById('element-number').textContent = element.protons;
        document.getElementById('element-mass').textContent = element.mass + ' u';
        document.getElementById('element-electrons').textContent = element.electrons;
    }

    exciteElectrons(energy) {
        console.log(`⚡ Excitando elétrons com ${energy} eV`);
        // Implementar excitação
    }

    applyMagneticField(intensity) {
        console.log(`🧲 Aplicando campo magnético: ${intensity} T`);
        // Implementar campo magnético
    }

    setTemperature(temp) {
        console.log(`🌡️ Temperatura: ${temp} °C`);
        // Implementar efeitos térmicos
    }

    start() {
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
    }

    animate(time = 0) {
        if (!this.isRunning) return;

        requestAnimationFrame((t) => this.animate(t));

        const deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;

        // Atualizar modelo atual
        if (this.currentModel) {
            this.currentModel.update(deltaTime);
        }

        // Atualizar engine
        this.engine.update(deltaTime);
        this.engine.render();

        // Atualizar FPS
        if (deltaTime > 0) {
            const fps = Math.round(1 / deltaTime);
            document.getElementById('fps-value').textContent = fps;
        }
    }

    loadPeriodicTable() {
        // Primeiros 20 elementos
        return [
            { symbol: 'H', name: 'Hidrogênio', protons: 1, neutrons: 0, electrons: 1, mass: 1.008 },
            { symbol: 'He', name: 'Hélio', protons: 2, neutrons: 2, electrons: 2, mass: 4.003 },
            { symbol: 'Li', name: 'Lítio', protons: 3, neutrons: 4, electrons: 3, mass: 6.941 },
            { symbol: 'Be', name: 'Berílio', protons: 4, neutrons: 5, electrons: 4, mass: 9.012 },
            { symbol: 'B', name: 'Boro', protons: 5, neutrons: 6, electrons: 5, mass: 10.811 },
            { symbol: 'C', name: 'Carbono', protons: 6, neutrons: 6, electrons: 6, mass: 12.011 },
            { symbol: 'N', name: 'Nitrogênio', protons: 7, neutrons: 7, electrons: 7, mass: 14.007 },
            { symbol: 'O', name: 'Oxigênio', protons: 8, neutrons: 8, electrons: 8, mass: 15.999 },
            { symbol: 'F', name: 'Flúor', protons: 9, neutrons: 10, electrons: 9, mass: 18.998 },
            { symbol: 'Ne', name: 'Neônio', protons: 10, neutrons: 10, electrons: 10, mass: 20.180 },
            // Adicione mais elementos conforme necessário
        ];
    }
}

// Inicializar ao carregar
document.addEventListener('DOMContentLoaded', () => {
    window.quantumApp = new QuantumApp();
});
