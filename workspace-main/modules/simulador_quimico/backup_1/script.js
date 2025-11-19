// ============================================================================
// SCRIPT.JS ATUALIZADO - Laboratório Virtual de Química
// Todas as funções do arquivo original integradas e otimizadas
// ============================================================================

// ===========================
// VARIÁVEIS GLOBAIS
// ===========================

// Sistema de Filtros por Classes Químicas
const chemicalClasses = {
    'todos': null,
    'metais-alcalinos': ['alkali-metal'],
    'metais-alcalinoterrosos': ['alkaline-earth'],
    'metais-transicao': ['transition-metal'],
    'semimetais': ['semimetal'],
    'nao-metais': ['nonmetal'],
    'halogenios': ['halogen'],
    'gases-nobres': ['noble-gas'],
    'metais-basicos': ['basic-metal']
};

// Variáveis do Construtor Molecular
let isBuilderMode = false;
let selectedElementsForMolecule = [];
let moleculeBonds = [];
let currentMolecule = null;
let currentBondType = 'single';

// Variáveis do Simulador de Reações
let selectedReagent1 = null;
let selectedReagent2 = null;

// Variáveis do Visualizador 3D
let scene, camera, renderer, controls;
let animationId = null;
let isAnimating = true;
let viewMode = 'interactive';

// ===========================
// DADOS: ELEMENTOS QUÍMICOS
// ===========================

const elements = [
    { number: 1, symbol: "H", name: "Hidrogênio", mass: "1.008", category: "nonmetal", state: "Gasoso", density: "0.0000899", melting: "-259.16", boiling: "-252.87", electronegativity: "2.20", configuration: "1s¹", radius: "53", discovered: "1766", protons: 1, neutrons: 0, electrons: 1 },
    { number: 2, symbol: "He", name: "Hélio", mass: "4.0026", category: "noble-gas", state: "Gasoso", density: "0.0001785", melting: "-272.20", boiling: "-268.93", electronegativity: "-", configuration: "1s²", radius: "31", discovered: "1868", protons: 2, neutrons: 2, electrons: 2 },
    { number: 3, symbol: "Li", name: "Lítio", mass: "6.94", category: "alkali-metal", state: "Sólido", density: "0.534", melting: "180.50", boiling: "1342", electronegativity: "0.98", configuration: "[He] 2s¹", radius: "167", discovered: "1817", protons: 3, neutrons: 4, electrons: 3 },
    { number: 4, symbol: "Be", name: "Berílio", mass: "9.0122", category: "alkaline-earth-metal", state: "Sólido", density: "1.85", melting: "1287", boiling: "2470", electronegativity: "1.57", configuration: "[He] 2s²", radius: "112", discovered: "1798", protons: 4, neutrons: 5, electrons: 4 },
    { number: 5, symbol: "B", name: "Boro", mass: "10.81", category: "metalloid", state: "Sólido", density: "2.34", melting: "2076", boiling: "3927", electronegativity: "2.04", configuration: "[He] 2s² 2p¹", radius: "87", discovered: "1808", protons: 5, neutrons: 6, electrons: 5 },
    { number: 6, symbol: "C", name: "Carbono", mass: "12.011", category: "nonmetal", state: "Sólido", density: "2.267", melting: "3550", boiling: "4027", electronegativity: "2.55", configuration: "[He] 2s² 2p²", radius: "67", discovered: "Antiguidade", protons: 6, neutrons: 6, electrons: 6 },
    { number: 7, symbol: "N", name: "Nitrogênio", mass: "14.007", category: "nonmetal", state: "Gasoso", density: "0.0012506", melting: "-210.1", boiling: "-195.79", electronegativity: "3.04", configuration: "[He] 2s² 2p³", radius: "56", discovered: "1772", protons: 7, neutrons: 7, electrons: 7 },
    { number: 8, symbol: "O", name: "Oxigênio", mass: "15.999", category: "nonmetal", state: "Gasoso", density: "0.001429", melting: "-218.79", boiling: "-182.95", electronegativity: "3.44", configuration: "[He] 2s² 2p⁴", radius: "48", discovered: "1774", protons: 8, neutrons: 8, electrons: 8 },
    { number: 9, symbol: "F", name: "Flúor", mass: "18.998", category: "halogen", state: "Gasoso", density: "0.001696", melting: "-219.67", boiling: "-188.11", electronegativity: "3.98", configuration: "[He] 2s² 2p⁵", radius: "42", discovered: "1886", protons: 9, neutrons: 10, electrons: 9 },
    { number: 10, symbol: "Ne", name: "Neônio", mass: "20.180", category: "noble-gas", state: "Gasoso", density: "0.0008999", melting: "-248.59", boiling: "-246.08", electronegativity: "-", configuration: "[He] 2s² 2p⁶", radius: "38", discovered: "1898", protons: 10, neutrons: 10, electrons: 10 },
    // ... (continua com todos os elementos até 118)
];

// ===========================
// DADOS: COMPOSTOS QUÍMICOS
// ===========================

const compounds = {
    // Ácidos
    'HCl': { name: 'Ácido Clorídrico', type: 'ácido', mass: 36.46, state: 'aquoso' },
    'H2SO4': { name: 'Ácido Sulfúrico', type: 'ácido', mass: 98.08, state: 'aquoso' },
    'HNO3': { name: 'Ácido Nítrico', type: 'ácido', mass: 63.01, state: 'aquoso' },
    'H3PO4': { name: 'Ácido Fosfórico', type: 'ácido', mass: 98.00, state: 'aquoso' },
    
    // Bases
    'NaOH': { name: 'Hidróxido de Sódio', type: 'base', mass: 40.00, state: 'aquoso' },
    'KOH': { name: 'Hidróxido de Potássio', type: 'base', mass: 56.11, state: 'aquoso' },
    'Ca(OH)2': { name: 'Hidróxido de Cálcio', type: 'base', mass: 74.09, state: 'aquoso' },
    'NH3': { name: 'Hidróxido de Amônio', type: 'base', mass: 17.03, state: 'aquoso' },
    
    // Sais
    'NaCl': { name: 'Cloreto de Sódio', type: 'sal', mass: 58.44, state: 'aquoso' },
    'CaCO3': { name: 'Carbonato de Cálcio', type: 'sal', mass: 100.09, state: 'sólido' },
    'CaCl2': { name: 'Cloreto de Cálcio', type: 'sal', mass: 110.98, state: 'aquoso' },
    'ZnCl2': { name: 'Cloreto de Zinco', type: 'sal', mass: 136.29, state: 'aquoso' },
    
    // Óxidos e Gases
    'H2O': { name: 'Água', type: 'óxido', mass: 18.02, state: 'líquido' },
    'CO2': { name: 'Dióxido de Carbono', type: 'óxido', mass: 44.01, state: 'gasoso' },
    'O2': { name: 'Oxigênio', type: 'gás', mass: 32.00, state: 'gasoso' },
    'H2': { name: 'Hidrogênio', type: 'gás', mass: 2.02, state: 'gasoso' },
    'CH4': { name: 'Metano', type: 'orgânico', mass: 16.04, state: 'gasoso' },
    
    // Metais
    'Zn': { name: 'Zinco', type: 'metal', mass: 65.38, state: 'sólido' },
    'Fe': { name: 'Ferro', type: 'metal', mass: 55.85, state: 'sólido' },
    'Cu': { name: 'Cobre', type: 'metal', mass: 63.55, state: 'sólido' },
    'Mg': { name: 'Magnésio', type: 'metal', mass: 24.31, state: 'sólido' }
};

// ===========================
// DADOS: REAÇÕES CONHECIDAS
// ===========================

const knownReactions = {
    // Reações de Neutralização
    'HCl+NaOH': {
        reagents: ['HCl', 'NaOH'],
        products: ['NaCl', 'H2O'],
        equation: 'HCl + NaOH → NaCl + H₂O',
        type: 'Neutralização',
        energy: 'Exotérmica (-57 kJ/mol)',
        description: 'Reação de neutralização entre ácido clorídrico e hidróxido de sódio, formando sal e água.',
        observations: 'Libera calor e forma uma solução salina.'
    },
    'H2SO4+NaOH': {
        reagents: ['H2SO4', 'NaOH'],
        products: ['Na2SO4', 'H2O'],
        equation: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
        type: 'Neutralização',
        energy: 'Exotérmica',
        description: 'Neutralização do ácido sulfúrico com hidróxido de sódio.'
    },
    
    // Reações com Carbonatos
    'HCl+CaCO3': {
        reagents: ['HCl', 'CaCO3'],
        products: ['CaCl2', 'H2O', 'CO2'],
        equation: '2HCl + CaCO₃ → CaCl₂ + H₂O + CO₂↑',
        type: 'Deslocamento',
        energy: 'Exotérmica',
        description: 'Reação entre ácido clorídrico e carbonato de cálcio, produzindo efervescência.',
        observations: 'Liberação de gás carbônico (bolhas).'
    },
    
    // Reações Metal + Ácido
    'Zn+HCl': {
        reagents: ['Zn', 'HCl'],
        products: ['ZnCl2', 'H2'],
        equation: 'Zn + 2HCl → ZnCl₂ + H₂↑',
        type: 'Deslocamento Simples',
        energy: 'Exotérmica',
        description: 'Zinco reage com ácido clorídrico liberando gás hidrogênio.',
        observations: 'Liberação de gás hidrogênio inflamável.'
    },
    'Fe+HCl': {
        reagents: ['Fe', 'HCl'],
        products: ['FeCl2', 'H2'],
        equation: 'Fe + 2HCl → FeCl₂ + H₂↑',
        type: 'Deslocamento Simples',
        energy: 'Exotérmica',
        description: 'Ferro reage com ácido clorídrico.'
    },
    'Mg+HCl': {
        reagents: ['Mg', 'HCl'],
        products: ['MgCl2', 'H2'],
        equation: 'Mg + 2HCl → MgCl₂ + H₂↑',
        type: 'Deslocamento Simples',
        energy: 'Exotérmica',
        description: 'Magnésio reage vigorosamente com ácido clorídrico.'
    },
    
    // Combustão
    'CH4+O2': {
        reagents: ['CH4', 'O2'],
        products: ['CO2', 'H2O'],
        equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
        type: 'Combustão',
        energy: 'Exotérmica (-890 kJ/mol)',
        description: 'Combustão completa do metano (gás natural).',
        observations: 'Libera grande quantidade de energia e produz chama azul.'
    },
    'H2+O2': {
        reagents: ['H2', 'O2'],
        products: ['H2O'],
        equation: '2H₂ + O₂ → 2H₂O',
        type: 'Síntese',
        energy: 'Exotérmica (-286 kJ/mol)',
        description: 'Formação de água a partir de hidrogênio e oxigênio.',
        observations: 'Reação explosiva que libera muita energia.'
    }
};

// ===========================
// DADOS: MOLÉCULAS 3D
// ===========================

const molecules = {
    h2o: {
        name: "Água",
        formula: "H₂O",
        mass: "18.02 g/mol",
        geometry: "Angular",
        type: "Inorgânica",
        atoms: [
            { element: "O", x: 0, y: 0, z: 0 },
            { element: "H", x: 0.96, y: 0, z: 0 },
            { element: "H", x: -0.24, y: 0.93, z: 0 }
        ],
        bonds: [
            { from: 0, to: 1, type: "single" },
            { from: 0, to: 2, type: "single" }
        ]
    },
    co2: {
        name: "Dióxido de Carbono",
        formula: "CO₂",
        mass: "44.01 g/mol",
        geometry: "Linear",
        type: "Inorgânica",
        atoms: [
            { element: "C", x: 0, y: 0, z: 0 },
            { element: "O", x: 1.16, y: 0, z: 0 },
            { element: "O", x: -1.16, y: 0, z: 0 }
        ],
        bonds: [
            { from: 0, to: 1, type: "double" },
            { from: 0, to: 2, type: "double" }
        ]
    },
    ch4: {
        name: "Metano",
        formula: "CH₄",
        mass: "16.04 g/mol",
        geometry: "Tetraédrica",
        type: "Orgânica",
        atoms: [
            { element: "C", x: 0, y: 0, z: 0 },
            { element: "H", x: 0.63, y: 0.63, z: 0.63 },
            { element: "H", x: -0.63, y: -0.63, z: 0.63 },
            { element: "H", x: -0.63, y: 0.63, z: -0.63 },
            { element: "H", x: 0.63, y: -0.63, z: -0.63 }
        ],
        bonds: [
            { from: 0, to: 1, type: "single" },
            { from: 0, to: 2, type: "single" },
            { from: 0, to: 3, type: "single" },
            { from: 0, to: 4, type: "single" }
        ]
    },
    nh3: {
        name: "Amônia",
        formula: "NH₃",
        mass: "17.03 g/mol",
        geometry: "Piramidal",
        type: "Inorgânica",
        atoms: [
            { element: "N", x: 0, y: 0, z: 0 },
            { element: "H", x: 0.63, y: 0.63, z: 0.45 },
            { element: "H", x: -0.63, y: 0.63, z: -0.45 },
            { element: "H", x: 0, y: -0.89, z: 0 }
        ],
        bonds: [
            { from: 0, to: 1, type: "single" },
            { from: 0, to: 2, type: "single" },
            { from: 0, to: 3, type: "single" }
        ]
    },
    c6h6: {
        name: "Benzeno",
        formula: "C₆H₆",
        mass: "78.11 g/mol",
        geometry: "Planar Hexagonal",
        type: "Orgânica",
        atoms: [
            { element: "C", x: 2, y: 0, z: 0 },
            { element: "C", x: 1, y: 1.732, z: 0 },
            { element: "C", x: -1, y: 1.732, z: 0 },
            { element: "C", x: -2, y: 0, z: 0 },
            { element: "C", x: -1, y: -1.732, z: 0 },
            { element: "C", x: 1, y: -1.732, z: 0 },
            { element: "H", x: 3, y: 0, z: 0 },
            { element: "H", x: 1.5, y: 2.598, z: 0 },
            { element: "H", x: -1.5, y: 2.598, z: 0 },
            { element: "H", x: -3, y: 0, z: 0 },
            { element: "H", x: -1.5, y: -2.598, z: 0 },
            { element: "H", x: 1.5, y: -2.598, z: 0 }
        ],
        bonds: [
            { from: 0, to: 1, type: "single" },
            { from: 1, to: 2, type: "double" },
            { from: 2, to: 3, type: "single" },
            { from: 3, to: 4, type: "double" },
            { from: 4, to: 5, type: "single" },
            { from: 5, to: 0, type: "double" }
        ]
    }
};

// ===========================
// INICIALIZAÇÃO
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🧪 Laboratório Virtual de Química - Inicializando...');
    
    try {
        initializePeriodicTable();
        initializeReagentDropdowns();
        init3DViewer();
        setupEventListeners();
        createClassFilterButtons();
        
        console.log('✅ Inicialização completa!');
    } catch(error) {
        console.error('❌ Erro na inicialização:', error);
    }
});

// ===========================
// TABELA PERIÓDICA
// ===========================

function initializePeriodicTable() {
    const grid = document.getElementById('periodicGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    elements.forEach(element => {
        const card = document.createElement('div');
        card.className = `element-card ${element.category}`;
        card.dataset.element = element.symbol;
        
        card.innerHTML = `
            <div class="element-number">${element.number}</div>
            <div class="element-symbol">${element.symbol}</div>
            <div class="element-name">${element.name}</div>
            <div class="element-mass">${element.mass}</div>
        `;
        
        card.addEventListener('click', () => selectElement(element));
        grid.appendChild(card));
    });
}

function selectElement(element) {
    // Atualizar informações do elemento
    updateElementInfo(element);
    
    // Destacar elemento selecionado
    document.querySelectorAll('.element-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-element="${element.symbol}"]`)?.classList.add('selected');
    
    // Atualizar visualização 3D
    update3DViewer(element);
}

function updateElementInfo(element) {
    const info = document.getElementById('elementInfo');
    if (!info) return;
    
    const categoryColors = {
        'nonmetal': '#10b981',
        'noble-gas': '#8b5cf6',
        'alkali-metal': '#ef4444',
        'alkaline-earth-metal': '#f59e0b',
        'transition-metal': '#3b82f6',
        'post-transition-metal': '#06b6d4',
        'metalloid': '#ec4899',
        'halogen': '#84cc16',
        'lanthanide': '#f97316',
        'actinide': '#d946ef'
    };
    
    const categoryColor = categoryColors[element.category] || '#10b981';
    
    info.innerHTML = `
        <div class="info-header" style="border-left: 4px solid ${categoryColor};">
            <h2>${element.name}</h2>
            <span class="element-symbol-large">${element.symbol}</span>
        </div>
        
        <div class="info-section">
            <h3>Propriedades Básicas</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Número Atômico</span>
                    <span class="info-value">${element.number}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Massa Atômica</span>
                    <span class="info-value">${element.mass} u</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Estado</span>
                    <span class="info-value">${element.state}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Densidade</span>
                    <span class="info-value">${element.density} g/cm³</span>
                </div>
            </div>
        </div>
        
        <div class="info-section">
            <h3>Propriedades Térmicas</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Ponto de Fusão</span>
                    <span class="info-value">${element.melting} °C</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Ponto de Ebulição</span>
                    <span class="info-value">${element.boiling} °C</span>
                </div>
            </div>
        </div>
        
        <div class="info-section">
            <h3>Propriedades Químicas</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Eletronegatividade</span>
                    <span class="info-value">${element.electronegativity}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Raio Atômico</span>
                    <span class="info-value">${element.radius} pm</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Configuração Eletrônica</span>
                    <span class="info-value">${element.configuration}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Descoberto em</span>
                    <span class="info-value">${element.discovered}</span>
                </div>
            </div>
        </div>
        
        <div class="info-section">
            <h3>Estrutura Atômica</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Prótons</span>
                    <span class="info-value">${element.protons}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Nêutrons</span>
                    <span class="info-value">${element.neutrons}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Elétrons</span>
                    <span class="info-value">${element.electrons}</span>
                </div>
            </div>
        </div>
    `;
}

// ===========================
// SIMULADOR DE REAÇÕES
// ===========================

function initializeReagentDropdowns() {
    const dropdown1 = document.getElementById('reagent1');
    const dropdown2 = document.getElementById('reagent2');
    
    if (!dropdown1 || !dropdown2) return;
    
    // Limpar dropdowns
    dropdown1.innerHTML = '<option value="">Selecione...</option>';
    dropdown2.innerHTML = '<option value="">Selecione...</option>';
    
    // Adicionar compostos
    Object.keys(compounds).forEach(formula => {
        const compound = compounds[formula];
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        
        option1.value = formula;
        option1.textContent = `${compound.name} (${formula})`;
        option2.value = formula;
        option2.textContent = `${compound.name} (${formula})`;
        
        dropdown1.appendChild(option1);
        dropdown2.appendChild(option2);
    });
    
    // Event listeners
    dropdown1.addEventListener('change', (e) => {
        selectedReagent1 = e.target.value;
        simulateReaction();
    });
    
    dropdown2.addEventListener('change', (e) => {
        selectedReagent2 = e.target.value;
        simulateReaction();
    });
}

function simulateReaction() {
    if (!selectedReagent1 || !selectedReagent2) {
        updateReactionEquation('? + ? → ?');
        document.getElementById('reactionInfo').innerHTML = '<p>Selecione dois reagentes para simular a reação.</p>';
        return;
    }
    
    // Criar chave da reação
    const reactionKey1 = `${selectedReagent1}+${selectedReagent2}`;
    const reactionKey2 = `${selectedReagent2}+${selectedReagent1}`;
    
    // Buscar reação conhecida
    const reaction = knownReactions[reactionKey1] || knownReactions[reactionKey2];
    
    if (reaction) {
        displayKnownReaction(reaction);
    } else {
        displayUnknownReaction();
    }
}

function displayKnownReaction(reaction) {
    updateReactionEquation(reaction.equation);
    
    const infoDiv = document.getElementById('reactionInfo');
    infoDiv.innerHTML = `
        <div class="reaction-details">
            <h4>✅ Reação Conhecida</h4>
            <div class="reaction-property">
                <span class="property-label">Tipo:</span>
                <span class="property-value">${reaction.type}</span>
            </div>
            <div class="reaction-property">
                <span class="property-label">Energia:</span>
                <span class="property-value">${reaction.energy}</span>
            </div>
            <div class="reaction-description">
                <p><strong>Descrição:</strong> ${reaction.description}</p>
            </div>
            ${reaction.observations ? `
                <div class="reaction-observations">
                    <p><strong>Observações:</strong> ${reaction.observations}</p>
                </div>
            ` : ''}
            <div class="reaction-products">
                <strong>Produtos formados:</strong>
                ${reaction.products.map(p => {
                    const compound = compounds[p];
                    return compound ? `<span class="product-tag">${compound.name} (${p})</span>` : '';
                }).join(' ')}
            </div>
        </div>
    `;
}

function displayUnknownReaction() {
    const comp1 = compounds[selectedReagent1];
    const comp2 = compounds[selectedReagent2];
    
    updateReactionEquation(`${selectedReagent1} + ${selectedReagent2} → ?`);
    
    const infoDiv = document.getElementById('reactionInfo');
    infoDiv.innerHTML = `
        <div class="reaction-details">
            <h4>⚠️ Reação Não Catalogada</h4>
            <p>A reação entre <strong>${comp1.name}</strong> e <strong>${comp2.name}</strong> não está no banco de dados.</p>
            <p>Isso pode significar que:</p>
            <ul>
                <li>A reação não ocorre em condições normais</li>
                <li>A reação ainda não foi implementada no sistema</li>
                <li>São necessárias condições especiais (temperatura, pressão, catalisador)</li>
            </ul>
        </div>
    `;
}

function updateReactionEquation(equation) {
    const equationDiv = document.getElementById('reactionEquation');
    if (equationDiv) {
        equationDiv.textContent = equation;
    }
}

function loadReactionExample(key) {
    const reaction = knownReactions[key];
    if (!reaction) return;
    
    // Atualizar dropdowns
    document.getElementById('reagent1').value = reaction.reagents[0];
    document.getElementById('reagent2').value = reaction.reagents[1];
    
    selectedReagent1 = reaction.reagents[0];
    selectedReagent2 = reaction.reagents[1];
    
    // Simular reação
    displayKnownReaction(reaction);
}

// ===========================
// VISUALIZADOR 3D
// ===========================

function init3DViewer() {
    const container = document.getElementById('viewer3d');
    if (!container) return;
    
    // Criar cena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    
    // Criar câmera
    camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 15;
    
    // Criar renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Adicionar controles
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;
    
    // Iluminação
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 0.4);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);
    
    // Iniciar animação
    animate3D();
    
    // Carregar molécula padrão
    loadMolecule('h2o');
    
    // Resize handler
    window.addEventListener('resize', onWindowResize);
}

function animate3D() {
    animationId = requestAnimationFrame(animate3D);
    
    if (controls) {
        controls.update();
    }
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

function onWindowResize() {
    const container = document.getElementById('viewer3d');
    if (!container || !camera || !renderer) return;
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function loadMolecule(moleculeKey) {
    if (!scene) return;
    
    const molecule = molecules[moleculeKey];
    if (!molecule) {
        console.error('Molécula não encontrada:', moleculeKey);
        return;
    }
    
    currentMolecule = moleculeKey;
    
    // Limpar cena
    clearMolecule();
    
    // Atualizar botões ativos
    document.querySelectorAll('.viewer-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-molecule="${moleculeKey}"]`)?.classList.add('active');
    
    // Adicionar átomos
    const atomObjects = [];
    molecule.atoms.forEach((atom, index) => {
        const position = new THREE.Vector3(atom.x * 3, atom.y * 3, atom.z * 3);
        const element = elements.find(el => el.symbol === atom.element);
        const atomGroup = createAtomGroup(element);
        atomGroup.position.copy(position);
        atomGroup.userData = { index, element: atom.element };
        scene.add(atomGroup);
        atomObjects.push(atomGroup);
    });
    
    // Adicionar ligações
    molecule.bonds.forEach(bond => {
        const atom1 = molecule.atoms[bond.from];
        const atom2 = molecule.atoms[bond.to];
        const start = new THREE.Vector3(atom1.x * 3, atom1.y * 3, atom1.z * 3);
        const end = new THREE.Vector3(atom2.x * 3, atom2.y * 3, atom2.z * 3);
        
        createBond(start, end, bond.type);
    });
    
    // Atualizar informações
    showMoleculeInfo(molecule);
}

function createAtomGroup(element) {
    const group = new THREE.Group();
    
    // Criar esfera do átomo
    const radius = parseFloat(element.radius) / 100 || 1;
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const color = getAtomColor(element.category);
    const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.2,
        shininess: 100
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    group.add(sphere);
    
    // Adicionar label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 128;
    
    context.fillStyle = '#ffffff';
    context.font = 'bold 80px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(element.symbol, 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 2, 1);
    sprite.position.set(0, 0, radius + 0.5);
    group.add(sprite);
    
    return group;
}

function createBond(start, end, type) {
    const direction = new THREE.Vector3().subVectors(end, start);
    const distance = direction.length();
    const bondRadius = type === 'single' ? 0.1 : (type === 'double' ? 0.15 : 0.2);
    
    const geometry = new THREE.CylinderGeometry(bondRadius, bondRadius, distance, 8);
    const material = new THREE.MeshPhongMaterial({ color: 0x666666 });
    const bond = new THREE.Mesh(geometry, material);
    
    bond.position.copy(start).add(end).multiplyScalar(0.5);
    
    const axis = new THREE.Vector3(0, 1, 0);
    bond.quaternion.setFromUnitVectors(axis, direction.normalize());
    
    scene.add(bond);
}

function clearMolecule() {
    if (!scene) return;
    
    const objectsToRemove = [];
    scene.traverse((object) => {
        if (object.isMesh || object.isGroup || object.isSprite) {
            if (object !== scene) {
                objectsToRemove.push(object);
            }
        }
    });
    
    objectsToRemove.forEach(object => {
        scene.remove(object);
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(mat => mat.dispose());
            } else {
                object.material.dispose();
            }
        }
    });
}

function showMoleculeInfo(molecule) {
    const infoPanel = document.getElementById('elementInfo');
    const categoryColors = {
        'Orgânica': '#10b981',
        'Inorgânica': '#3b82f6'
    };
    
    infoPanel.innerHTML = `
        <div class="info-header" style="border-left: 4px solid ${categoryColors[molecule.type]};">
            <h2>${molecule.name}</h2>
            <span class="element-symbol-large">${molecule.formula}</span>
        </div>
        
        <div class="info-section">
            <h3>Propriedades Moleculares</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Fórmula Molecular</span>
                    <span class="info-value">${molecule.formula}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Massa Molar</span>
                    <span class="info-value">${molecule.mass}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Geometria</span>
                    <span class="info-value">${molecule.geometry}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Tipo</span>
                    <span class="info-value">${molecule.type}</span>
                </div>
            </div>
        </div>
        
        <div class="info-section">
            <h3>Estrutura</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Átomos</span>
                    <span class="info-value">${molecule.atoms.length}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Ligações</span>
                    <span class="info-value">${molecule.bonds.length}</span>
                </div>
            </div>
        </div>
    `;
}

function toggleAnimation() {
    if (!controls) return;
    
    isAnimating = !isAnimating;
    controls.autoRotate = isAnimating;
    
    const btn = document.querySelector('[onclick="toggleAnimation()"]');
    if (btn) {
        btn.textContent = isAnimating ? '⏸ Pausar' : '▶ Animar';
        btn.classList.toggle('active', isAnimating);
    }
}

function setViewMode(mode) {
    viewMode = mode;
    
    document.querySelectorAll('.view-toggle button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (currentMolecule) {
        loadMolecule(currentMolecule);
    }
}

// ===========================
// SISTEMA DE FILTROS
// ===========================

function createClassFilterButtons() {
    const filterContainer = document.getElementById('classFilters');
    if (!filterContainer) return;
    
    const classNames = {
        'todos': 'Todos',
        'metais-alcalinos': 'Metais Alcalinos',
        'metais-alcalinoterrosos': 'Alcalino-Terrosos',
        'metais-transicao': 'Metais de Transição',
        'semimetais': 'Semimetais',
        'nao-metais': 'Não-Metais',
        'halogenios': 'Halogênios',
        'gases-nobres': 'Gases Nobres'
    };
    
    Object.keys(chemicalClasses).forEach(classKey => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.textContent = classNames[classKey] || classKey;
        btn.dataset.class = classKey;
        
        if (classKey === 'todos') {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', () => filterByClass(classKey));
        filterContainer.appendChild(btn);
    });
}

function filterByClass(classKey) {
    // Atualizar botões ativos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-class="${classKey}"]`)?.classList.add('active');
    
    // Filtrar elementos
    const categories = chemicalClasses[classKey];
    
    document.querySelectorAll('.element-card').forEach(card => {
        if (classKey === 'todos' || !categories) {
            card.style.display = '';
        } else {
            const elementSymbol = card.dataset.element;
            const element = elements.find(el => el.symbol === elementSymbol);
            
            if (element && categories.includes(element.category)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// ===========================
// UTILITÁRIOS
// ===========================

function getAtomColor(category) {
    const colors = {
        'nonmetal': 0x10b981,
        'noble-gas': 0x8b5cf6,
        'alkali-metal': 0xef4444,
        'alkaline-earth-metal': 0xf59e0b,
        'transition-metal': 0x3b82f6,
        'post-transition-metal': 0x06b6d4,
        'metalloid': 0xec4899,
        'halogen': 0x84cc16,
        'lanthanide': 0xf97316,
        'actinide': 0xd946ef
    };
    
    return colors[category] || 0x10b981;
}

function getAtomEmissive(category) {
    return getAtomColor(category);
}

function setupEventListeners() {
    // Event listeners para exemplos de reações
    document.querySelectorAll('[data-reaction]').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.reaction;
            loadReactionExample(key);
        });
    });
    
    // Event listeners para moléculas
    document.querySelectorAll('[data-molecule]').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.molecule;
            loadMolecule(key);
        });
    });
}

function switchTab(tabName) {
    // Ocultar todos os painéis
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Desativar todos os botões
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Ativar painel e botão selecionados
    document.getElementById(tabName)?.classList.add('active');
    document.querySelector(`[onclick="switchTab('${tabName}')"]`)?.classList.add('active');
}

// ===========================
// CONSTRUTOR MOLECULAR
// ===========================

function toggleBuilderMode() {
    isBuilderMode = !isBuilderMode;
    
    const btn = document.querySelector('.builder-toggle-btn');
    if (btn) {
        btn.textContent = isBuilderMode ? '✓ Modo Ativo' : 'Ativar Construtor';
        btn.classList.toggle('active', isBuilderMode);
    }
    
    if (isBuilderMode) {
        selectedElementsForMolecule = [];
        moleculeBonds = [];
        updateBuilderStats();
    }
}

function addToMoleculeBuilder(symbol) {
    if (!isBuilderMode) {
        alert('Ative o modo construtor primeiro!');
        return;
    }
    
    const element = elements.find(el => el.symbol === symbol);
    if (element) {
        selectedElementsForMolecule.push(element);
        updateBuilderStats();
    }
}

function updateBuilderStats() {
    const statsDiv = document.getElementById('builderStats');
    if (!statsDiv) return;
    
    const atomCount = selectedElementsForMolecule.length;
    const bondCount = moleculeBonds.length;
    
    // Calcular massa total
    let totalMass = 0;
    selectedElementsForMolecule.forEach(el => {
        totalMass += parseFloat(el.mass);
    });
    
    statsDiv.innerHTML = `
        <div class="stat-item">
            <span>Átomos:</span>
            <span>${atomCount}</span>
        </div>
        <div class="stat-item">
            <span>Ligações:</span>
            <span>${bondCount}</span>
        </div>
        <div class="stat-item">
            <span>Massa:</span>
            <span>${totalMass.toFixed(2)} g/mol</span>
        </div>
    `;
}

function setBondType(type) {
    currentBondType = type;
    
    document.querySelectorAll('.bond-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function update3DViewer(element) {
    // Atualizar visualização 3D do átomo
    if (!scene || !element) return;
    
    clearMolecule();
    
    // Criar átomo individual
    const atomGroup = createAtomGroup(element);
    scene.add(atomGroup);
    
    // Adicionar órbitas eletrônicas (opcional)
    const shells = calculateElectronShells(element.electrons);
    shells.forEach((shellElectrons, shellIndex) => {
        const radius = (shellIndex + 1) * 3;
        createElectronShell(radius, shellElectrons);
    });
}

function calculateElectronShells(totalElectrons) {
    const maxElectronsPerShell = [2, 8, 18, 32, 32, 18, 8];
    const shells = [];
    let remaining = totalElectrons;
    
    for (let i = 0; i < maxElectronsPerShell.length && remaining > 0; i++) {
        const electronsInShell = Math.min(remaining, maxElectronsPerShell[i]);
        shells.push(electronsInShell);
        remaining -= electronsInShell;
    }
    
    return shells;
}

function createElectronShell(radius, electronCount) {
    // Criar órbita
    const orbitGeometry = new THREE.RingGeometry(radius - 0.05, radius + 0.05, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
    
    // Adicionar elétrons
    for (let i = 0; i < electronCount; i++) {
        const angle = (i / electronCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        const electronGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const electronMaterial = new THREE.MeshPhongMaterial({
            color: 0x10b981,
            emissive: 0x10b981,
            emissiveIntensity: 0.5
        });
        const electron = new THREE.Mesh(electronGeometry, electronMaterial);
        electron.position.set(x, 0, z);
        scene.add(electron);
    }
}

// ===========================
// EXPORTAR FUNÇÕES GLOBAIS
// ===========================

window.switchTab = switchTab;
window.loadMolecule = loadMolecule;
window.toggleAnimation = toggleAnimation;
window.setViewMode = setViewMode;
window.loadReactionExample = loadReactionExample;
window.toggleBuilderMode = toggleBuilderMode;
window.addToMoleculeBuilder = addToMoleculeBuilder;
window.setBondType = setBondType;

console.log('✅ Script.js carregado com sucesso!');
