// quantum-controllers.js
// Gerenciamento dos controles da UI

class QuantumControllers {
    constructor(app) {
        this.app = app;
        this.setupEventListeners();
        console.log('✅ QuantumControllers inicializado');
    }

    setupEventListeners() {
        // Modo de visualização
        const viewButtons = document.querySelectorAll('.view-mode-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                viewButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const mode = btn.dataset.mode;
                this.app.setViewMode(mode);
            });
        });

        // Excitação de elétrons
        const exciteBtn = document.getElementById('btn-excite');
        if (exciteBtn) {
            exciteBtn.addEventListener('click', () => {
                const energy = parseFloat(document.getElementById('energy-input').value);
                this.app.exciteElectrons(energy);
            });
        }

        // Campo magnético
        const magneticBtn = document.getElementById('btn-magnetic');
        if (magneticBtn) {
            magneticBtn.addEventListener('click', () => {
                const intensity = parseFloat(document.getElementById('magnetic-intensity').value);
                this.app.applyMagneticField(intensity);
            });
        }

        // Temperatura
        const tempSlider = document.getElementById('temp-slider');
        if (tempSlider) {
            tempSlider.addEventListener('input', (e) => {
                const temp = parseFloat(e.target.value);
                document.getElementById('temp-value').textContent = temp + ' °C';
                this.app.setTemperature(temp);
            });
        }

        // Tabela periódica
        const elementButtons = document.querySelectorAll('.element-btn');
        elementButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const symbol = btn.dataset.symbol;
                this.app.selectElement(symbol);
            });
        });
    }
}
