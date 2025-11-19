// ============================= //
// QUANTUM LAB - MÓDULOS         //
// ============================= //

// Estado global dos módulos
const quantumState = {
    activeModule: null,
    energy: { level: 5, excited: 0, photons: 0 },
    magnetic: { intensity: 0, direction: 'up', active: false },
    temperature: { value: 25, state: 'Gasoso' },
    radiation: { active: false, type: 'Nenhuma', level: 0 },
    currentElement: null
};

// ===== INICIALIZAÇÃO DA TABELA PERIÓDICA ===== //
function initializePeriodicTable() {
    const periodicTableContainer = document.getElementById('periodicTable');
    
    if (!periodicTableContainer) {
        console.error('Container periodicTable não encontrado');
        return;
    }
    
    // Dados dos elementos
    const elements = [
        { number: 1, symbol: 'H', name: 'Hidrogênio', category: 'nonmetal', mass: '1.008', config: '1s¹', electronegativity: '2.20', melting: '-259°C', boiling: '-253°C' },
        { number: 2, symbol: 'He', name: 'Hélio', category: 'noble-gas', mass: '4.003', config: '1s²', electronegativity: '-', melting: '-272°C', boiling: '-269°C' },
        { number: 3, symbol: 'Li', name: 'Lítio', category: 'alkali-metal', mass: '6.94', config: '[He] 2s¹', electronegativity: '0.98', melting: '180°C', boiling: '1342°C' },
        { number: 4, symbol: 'Be', name: 'Berílio', category: 'alkaline-earth', mass: '9.012', config: '[He] 2s²', electronegativity: '1.57', melting: '1287°C', boiling: '2470°C' },
        { number: 5, symbol: 'B', name: 'Boro', category: 'metalloid', mass: '10.81', config: '[He] 2s² 2p¹', electronegativity: '2.04', melting: '2076°C', boiling: '3927°C' },
        { number: 6, symbol: 'C', name: 'Carbono', category: 'nonmetal', mass: '12.01', config: '[He] 2s² 2p²', electronegativity: '2.55', melting: '3550°C', boiling: '4027°C' },
        { number: 7, symbol: 'N', name: 'Nitrogênio', category: 'nonmetal', mass: '14.01', config: '[He] 2s² 2p³', electronegativity: '3.04', melting: '-210°C', boiling: '-196°C' },
        { number: 8, symbol: 'O', name: 'Oxigênio', category: 'nonmetal', mass: '16.00', config: '[He] 2s² 2p⁴', electronegativity: '3.44', melting: '-218°C', boiling: '-183°C' },
        { number: 9, symbol: 'F', name: 'Flúor', category: 'halogen', mass: '19.00', config: '[He] 2s² 2p⁵', electronegativity: '3.98', melting: '-220°C', boiling: '-188°C' },
        { number: 10, symbol: 'Ne', name: 'Neônio', category: 'noble-gas', mass: '20.18', config: '[He] 2s² 2p⁶', electronegativity: '-', melting: '-249°C', boiling: '-246°C' },
        { number: 11, symbol: 'Na', name: 'Sódio', category: 'alkali-metal', mass: '22.99', config: '[Ne] 3s¹', electronegativity: '0.93', melting: '98°C', boiling: '883°C' },
        { number: 12, symbol: 'Mg', name: 'Magnésio', category: 'alkaline-earth', mass: '24.31', config: '[Ne] 3s²', electronegativity: '1.31', melting: '650°C', boiling: '1090°C' },
        { number: 13, symbol: 'Al', name: 'Alumínio', category: 'post-transition', mass: '26.98', config: '[Ne] 3s² 3p¹', electronegativity: '1.61', melting: '660°C', boiling: '2519°C' },
        { number: 14, symbol: 'Si', name: 'Silício', category: 'metalloid', mass: '28.09', config: '[Ne] 3s² 3p²', electronegativity: '1.90', melting: '1414°C', boiling: '3265°C' },
        { number: 15, symbol: 'P', name: 'Fósforo', category: 'nonmetal', mass: '30.97', config: '[Ne] 3s² 3p³', electronegativity: '2.19', melting: '44°C', boiling: '280°C' },
        { number: 16, symbol: 'S', name: 'Enxofre', category: 'nonmetal', mass: '32.07', config: '[Ne] 3s² 3p⁴', electronegativity: '2.58', melting: '115°C', boiling: '445°C' },
        { number: 17, symbol: 'Cl', name: 'Cloro', category: 'halogen', mass: '35.45', config: '[Ne] 3s² 3p⁵', electronegativity: '3.16', melting: '-102°C', boiling: '-34°C' },
        { number: 18, symbol: 'Ar', name: 'Argônio', category: 'noble-gas', mass: '39.95', config: '[Ne] 3s² 3p⁶', electronegativity: '-', melting: '-189°C', boiling: '-186°C' },
        { number: 19, symbol: 'K', name: 'Potássio', category: 'alkali-metal', mass: '39.10', config: '[Ar] 4s¹', electronegativity: '0.82', melting: '63°C', boiling: '759°C' },
        { number: 20, symbol: 'Ca', name: 'Cálcio', category: 'alkaline-earth', mass: '40.08', config: '[Ar] 4s²', electronegativity: '1.00', melting: '842°C', boiling: '1484°C' }
    ];
    
    periodicTableContainer.innerHTML = '';
    
    elements.forEach(element => {
        const elementBtn = document.createElement('button');
        elementBtn.className = 'element-item';
        elementBtn.dataset.element = element.symbol;
        
        if (element.number === 1) {
            elementBtn.classList.add('active');
            quantumState.currentElement = element;
        }
        
        elementBtn.innerHTML = `
            <span class="element-number">${element.number}</span>
            <span class="element-symbol">${element.symbol}</span>
            <span class="element-name">${element.name}</span>
        `;
        
        elementBtn.addEventListener('click', () => {
            document.querySelectorAll('.element-item').forEach(el => el.classList.remove('active'));
            elementBtn.classList.add('active');
            updateElementInfo(element);
        });
        
        periodicTableContainer.appendChild(elementBtn);
    });
    
    console.log('✓ Tabela periódica inicializada com', elements.length, 'elementos');
}

// ===== ATUALIZAR INFORMAÇÕES DO ELEMENTO ===== //
function updateElementInfo(element) {
    quantumState.currentElement = element;
    
    document.getElementById('info-symbol').textContent = element.symbol;
    document.getElementById('info-name').textContent = element.name;
    document.getElementById('info-group').textContent = getCategoryName(element.category);
    document.getElementById('info-atomic-number').textContent = element.number;
    document.getElementById('info-atomic-mass').textContent = element.mass + ' u';
    document.getElementById('info-electron-config').textContent = element.config;
    document.getElementById('info-electronegativity').textContent = element.electronegativity;
    document.getElementById('info-melting-point').textContent = element.melting;
    document.getElementById('info-boiling-point').textContent = element.boiling;
    
    console.log('Elemento selecionado:', element.name);
}

function getCategoryName(category) {
    const categories = {
        'nonmetal': 'Não Metal',
        'noble-gas': 'Gás Nobre',
        'alkali-metal': 'Metal Alcalino',
        'alkaline-earth': 'Metal Alcalino-Terroso',
        'metalloid': 'Metaloide',
        'halogen': 'Halogênio',
        'post-transition': 'Pós-Transição'
    };
    return categories[category] || 'Outro';
}

// ===== INICIALIZAÇÃO DO CANVAS 3D ===== //
function initializeAtomViewer() {
    const container = document.getElementById('atomViewer');
    
    if (!container) {
        console.error('Container atomViewer não encontrado');
        return;
    }
    
    if (typeof THREE === 'undefined') {
        console.error('THREE.js não carregado');
        return;
    }
    
    // Criar cena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1f);
    
    // Criar câmera
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    
    // Criar renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Adicionar luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x10b981, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Criar núcleo (próton)
    const protonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const protonMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xef4444,
        emissive: 0xef4444,
        emissiveIntensity: 0.3
    });
    const proton = new THREE.Mesh(protonGeometry, protonMaterial);
    scene.add(proton);
    
    // Criar órbita do elétron
    const orbitGeometry = new THREE.TorusGeometry(2, 0.02, 16, 100);
    const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x10b981, 
        transparent: true, 
        opacity: 0.3 
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
    
    // Criar elétron
    const electronGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const electronMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3b82f6,
        emissive: 0x3b82f6,
        emissiveIntensity: 0.5
    });
    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    electron.position.set(2, 0, 0);
    scene.add(electron);
    
    // Animação
    let angle = 0;
    function animate() {
        requestAnimationFrame(animate);
        
        angle += 0.01;
        electron.position.x = Math.cos(angle) * 2;
        electron.position.z = Math.sin(angle) * 2;
        
        orbit.rotation.y += 0.005;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Redimensionar
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
    
    console.log('✓ Visualizador 3D inicializado');
    
    window.atomViewer = { scene, camera, renderer, proton, electron, orbit };
}

// ===== SISTEMA DE FERRAMENTAS CLICÁVEIS ===== //
function initializeToolSystem() {
    const toolItems = document.querySelectorAll('.tool-item');
    
    toolItems.forEach(item => {
        item.addEventListener('click', function() {
            const toolName = this.dataset.tool;
            
            // Visual feedback
            toolItems.forEach(t => {
                t.style.borderColor = 'var(--border-color)';
                t.style.background = 'var(--surface-bg)';
            });
            
            this.style.borderColor = 'var(--accent)';
            this.style.background = 'var(--accent-soft)';
            
            // Esconder todos os módulos
            document.querySelectorAll('.module-panel').forEach(m => {
                m.style.display = 'none';
            });
            
            // Mostrar módulo selecionado
            const moduleId = `module-${toolName}`;
            const module = document.getElementById(moduleId);
            if (module) {
                module.style.display = 'block';
                quantumState.activeModule = toolName;
                console.log('Módulo ativado:', toolName);
            }
        });
    });
}

// ===== MÓDULO: ADICIONAR ENERGIA ===== //
function initializeEnergyModule() {
    const slider = document.getElementById('energy-slider');
    const valueDisplay = document.getElementById('energy-value');
    const exciteBtn = document.getElementById('excite-btn');
    const resetBtn = document.getElementById('reset-energy-btn');
    
    if (slider && valueDisplay) {
        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            quantumState.energy.level = value;
            valueDisplay.textContent = `${value.toFixed(1)} eV`;
        });
    }
    
    if (exciteBtn) {
        exciteBtn.addEventListener('click', () => {
            const energyLevel = quantumState.energy.level;
            const count = Math.floor(energyLevel / 3) + Math.floor(Math.random() * 3);
            
            quantumState.energy.excited = count;
            quantumState.energy.photons = count;
            
            document.getElementById('excited-count').textContent = count;
            document.getElementById('photon-count').textContent = count;
            
            console.log(`⚡ Elétrons excitados: ${count} com ${energyLevel} eV`);
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            quantumState.energy = { level: 5, excited: 0, photons: 0 };
            slider.value = 5;
            valueDisplay.textContent = '5.0 eV';
            document.getElementById('excited-count').textContent = '0';
            document.getElementById('photon-count').textContent = '0';
        });
    }
}

// ===== MÓDULO: CAMPO MAGNÉTICO ===== //
function initializeMagneticModule() {
    const slider = document.getElementById('magnetic-slider');
    const valueDisplay = document.getElementById('magnetic-value');
    const directionBtns = document.querySelectorAll('.field-direction .control-btn');
    const applyBtn = document.getElementById('apply-magnetic-btn');
    const resetBtn = document.getElementById('reset-magnetic-btn');
    
    if (slider && valueDisplay) {
        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            quantumState.magnetic.intensity = value;
            valueDisplay.textContent = `${value.toFixed(1)} T`;
        });
    }
    
    directionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            directionBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            quantumState.magnetic.direction = this.dataset.direction;
        });
    });
    
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const intensity = quantumState.magnetic.intensity;
            if (intensity > 0) {
                quantumState.magnetic.active = true;
                document.getElementById('zeeman-effect').textContent = 'Ativo';
                document.getElementById('spin-aligned').textContent = Math.floor(intensity * 2);
                console.log(`🧲 Campo magnético: ${intensity} T`);
            }
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            quantumState.magnetic.active = false;
            slider.value = 0;
            valueDisplay.textContent = '0.0 T';
            document.getElementById('zeeman-effect').textContent = 'Inativo';
            document.getElementById('spin-aligned').textContent = '0';
        });
    }
}

// ===== MÓDULO: CONTROLAR TEMPERATURA ===== //
function initializeTemperatureModule() {
    const slider = document.getElementById('temperature-slider');
    const valueDisplay = document.getElementById('temperature-value');
    const presetBtns = document.querySelectorAll('.preset-temperatures .control-btn');
    const applyBtn = document.getElementById('apply-temperature-btn');
    const resetBtn = document.getElementById('reset-temperature-btn');
    
    function updateTemperature(temp) {
        quantumState.temperature.value = temp;
        valueDisplay.textContent = `${temp}°C`;
        
        let state;
        if (temp < -100) state = 'Sólido';
        else if (temp < 100) state = 'Líquido';
        else if (temp < 5000) state = 'Gasoso';
        else state = 'Plasma';
        
        quantumState.temperature.state = state;
        document.getElementById('physical-state').textContent = state;
    }
    
    if (slider && valueDisplay) {
        slider.addEventListener('input', (e) => {
            updateTemperature(parseInt(e.target.value));
        });
    }
    
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const temp = parseInt(this.dataset.temp);
            slider.value = temp;
            updateTemperature(temp);
        });
    });
    
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const temp = quantumState.temperature.value;
            const energy = Math.abs(temp * 0.008617);
            document.getElementById('thermal-energy').textContent = `${energy.toFixed(2)} eV`;
            console.log(`🌡️ Temperatura: ${temp}°C - Estado: ${quantumState.temperature.state}`);
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            slider.value = 25;
            updateTemperature(25);
            document.getElementById('thermal-energy').textContent = '0 eV';
        });
    }
}

// ===== MÓDULO: ESPECTRÔMETRO ===== //
function initializeSpectrometerModule() {
    const canvas = document.getElementById('spectrometer-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const lines = [
        { wl: 410, color: '#8b5cf6', intensity: 0.6 },
        { wl: 434, color: '#3b82f6', intensity: 0.7 },
        { wl: 486, color: '#06b6d4', intensity: 0.8 },
        { wl: 656, color: '#ef4444', intensity: 1.0 }
    ];
    
    lines.forEach(line => {
        const x = (line.wl - 380) / (750 - 380) * canvas.width;
        const h = canvas.height * line.intensity;
        
        ctx.fillStyle = line.color;
        ctx.fillRect(x - 2, canvas.height - h, 4, h);
        
        ctx.fillStyle = '#e0e0e0';
        ctx.font = '8px Inter';
        ctx.fillText(`${line.wl}nm`, x - 12, canvas.height - h - 4);
    });
    
    console.log('✓ Espectrômetro inicializado');
}

// ===== MÓDULO: DETECTOR DE RADIAÇÃO ===== //
function initializeRadiationModule() {
    const startBtn = document.getElementById('start-radiation-btn');
    
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const types = ['Alfa', 'Beta', 'Gama', 'Nêutrons'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            const randomLevel = (Math.random() * 0.5).toFixed(3);
            
            quantumState.radiation = { active: true, type: randomType, level: parseFloat(randomLevel) };
            
            document.getElementById('radiation-type').textContent = randomType;
            document.getElementById('radiation-level').textContent = `${randomLevel} Sv/h`;
            
            console.log(`☢️ Radiação: ${randomType} - ${randomLevel} Sv/h`);
        });
    }
}

// ===== FUNÇÕES DE CONTROLE DO CANVAS ===== //
function switchTab(tabName, btnElement) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

function toggleViewMode(mode, btnElement) {
    document.querySelectorAll('.canvas-controls .control-btn').forEach(btn => {
        if (!btn.textContent.includes('Animar')) {
            btn.classList.remove('active');
        }
    });
    btnElement.classList.add('active');
    console.log('Modo de visualização:', mode);
}

function toggleAnimation(btnElement) {
    btnElement.classList.toggle('active');
    const icon = btnElement.querySelector('i');
    if (btnElement.classList.contains('active')) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }
}

// ===== INICIALIZAÇÃO GERAL ===== //
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando Quantum Lab...');
    
    setTimeout(() => {
        initializePeriodicTable();
        initializeAtomViewer();
        initializeToolSystem();
        initializeEnergyModule();
        initializeMagneticModule();
        initializeTemperatureModule();
        initializeSpectrometerModule();
        initializeRadiationModule();
        
        console.log('✅ Quantum Lab inicializado com sucesso!');
    }, 100);
});

// Exportar estado para debug
window.quantumState = quantumState;
