// Fórmulas Interativas - Sistema de Cálculo
class InteractiveFormulas {
    constructor() {
        this.formulasList = document.getElementById('formulasList');
        this.calculatorArea = document.getElementById('calculatorArea');
        this.resultsPanel = document.getElementById('resultsPanel');
        this.searchInput = document.getElementById('searchInput');
        this.formulaCategory = document.getElementById('formulaCategory');
        this.emptyResults = document.getElementById('emptyResults');
        
        this.currentFormula = null;
        this.history = JSON.parse(localStorage.getItem('formulaHistory') || '[]');
        this.favorites = JSON.parse(localStorage.getItem('formulaFavorites') || '[]');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadHistory();
    }

    setupEventListeners() {
        // Busca de fórmulas
        this.searchInput.addEventListener('input', this.filterFormulas.bind(this));
        
        // Filtros de categoria
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterFormulasByCategory(e.target.dataset.filter);
            });
        });
        
        // Fórmulas
        document.querySelectorAll('.formula-item').forEach(item => {
            item.addEventListener('click', this.selectFormula.bind(this));
        });
        
        // Botões do header
        document.getElementById('historyBtn').addEventListener('click', () => this.showHistoryView());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearInputs());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportResults());
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearHistory());
    }

    selectFormula(e) {
        const item = e.currentTarget;
        const formulaId = item.dataset.formula;
        
        // Remover seleção anterior
        document.querySelectorAll('.formula-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        
        // Carregar fórmula
        this.loadFormula(formulaId);
    }

    loadFormula(formulaId) {
        const formulas = {
            quadratic: {
                name: 'Equação Quadrática',
                category: 'Matemática',
                latex: 'x = (-b ± √(b² - 4ac)) / 2a',
                description: 'Resolve equações do segundo grau da forma ax² + bx + c = 0',
                variables: [
                    { name: 'a', label: 'Coeficiente a', unit: '', default: 1, step: 0.1 },
                    { name: 'b', label: 'Coeficiente b', unit: '', default: 0, step: 0.1 },
                    { name: 'c', label: 'Coeficiente c', unit: '', default: 0, step: 0.1 }
                ],
                calculate: (a, b, c) => {
                    const discriminant = b * b - 4 * a * c;
                    if (discriminant < 0) {
                        return { error: 'Não existem raízes reais (Δ < 0)' };
                    }
                    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                    return { x1, x2, discriminant };
                }
            },
            pythagorean: {
                name: 'Teorema de Pitágoras',
                category: 'Matemática',
                latex: 'c = √(a² + b²)',
                description: 'Calcula a hipotenusa de um triângulo retângulo',
                variables: [
                    { name: 'a', label: 'Cateto a', unit: 'm', default: 3, step: 0.1 },
                    { name: 'b', label: 'Cateto b', unit: 'm', default: 4, step: 0.1 }
                ],
                calculate: (a, b) => {
                    const c = Math.sqrt(a * a + b * b);
                    return { c, area: (a * b) / 2, perimeter: a + b + c };
                }
            },
            circle: {
                name: 'Área do Círculo',
                category: 'Matemática',
                latex: 'A = πr²',
                description: 'Calcula a área e circunferência de um círculo',
                variables: [
                    { name: 'r', label: 'Raio', unit: 'm', default: 1, step: 0.1 }
                ],
                calculate: (r) => {
                    const area = Math.PI * r * r;
                    const circumference = 2 * Math.PI * r;
                    const diameter = 2 * r;
                    return { area, circumference, diameter };
                }
            },
            'compound-interest': {
                name: 'Juros Compostos',
                category: 'Financeiro',
                latex: 'M = C(1 + i)^t',
                description: 'Calcula montante com juros compostos',
                variables: [
                    { name: 'C', label: 'Capital inicial', unit: 'R$', default: 1000, step: 100 },
                    { name: 'i', label: 'Taxa de juros', unit: '%', default: 10, step: 0.1 },
                    { name: 't', label: 'Tempo', unit: 'meses', default: 12, step: 1 }
                ],
                calculate: (C, i, t) => {
                    const rate = i / 100;
                    const M = C * Math.pow(1 + rate, t);
                    const interest = M - C;
                    return { M, interest, totalRate: (interest / C) * 100 };
                }
            },
            velocity: {
                name: 'Velocidade Média',
                category: 'Física',
                latex: 'v = Δs / Δt',
                description: 'Calcula velocidade média',
                variables: [
                    { name: 'distance', label: 'Distância', unit: 'm', default: 100, step: 1 },
                    { name: 'time', label: 'Tempo', unit: 's', default: 10, step: 0.1 }
                ],
                calculate: (distance, time) => {
                    if (time === 0) return { error: 'Tempo não pode ser zero' };
                    const velocity = distance / time;
                    return { velocity, distance, time };
                }
            },
            'kinetic-energy': {
                name: 'Energia Cinética',
                category: 'Física',
                latex: 'Ec = ½mv²',
                description: 'Calcula energia cinética de um objeto',
                variables: [
                    { name: 'm', label: 'Massa', unit: 'kg', default: 10, step: 0.1 },
                    { name: 'v', label: 'Velocidade', unit: 'm/s', default: 5, step: 0.1 }
                ],
                calculate: (m, v) => {
                    const energy = 0.5 * m * v * v;
                    const momentum = m * v;
                    return { energy, momentum };
                }
            },
            gravity: {
                name: 'Força Gravitacional',
                category: 'Física',
                latex: 'F = G(m₁m₂)/r²',
                description: 'Calcula força gravitacional entre dois corpos',
                variables: [
                    { name: 'm1', label: 'Massa 1', unit: 'kg', default: 1000, step: 1 },
                    { name: 'm2', label: 'Massa 2', unit: 'kg', default: 1000, step: 1 },
                    { name: 'r', label: 'Distância', unit: 'm', default: 1, step: 0.1 }
                ],
                calculate: (m1, m2, r) => {
                    if (r === 0) return { error: 'Distância não pode ser zero' };
                    const G = 6.67430e-11;
                    const force = G * (m1 * m2) / (r * r);
                    return { force };
                }
            },
            'molar-mass': {
                name: 'Massa Molar',
                category: 'Química',
                latex: 'M = m/n',
                description: 'Calcula massa molar',
                variables: [
                    { name: 'm', label: 'Massa', unit: 'g', default: 100, step: 1 },
                    { name: 'n', label: 'Quantidade de matéria', unit: 'mol', default: 2, step: 0.1 }
                ],
                calculate: (m, n) => {
                    if (n === 0) return { error: 'Quantidade não pode ser zero' };
                    const M = m / n;
                    return { M };
                }
            },
            density: {
                name: 'Densidade',
                category: 'Física',
                latex: 'ρ = m/V',
                description: 'Calcula densidade de um material',
                variables: [
                    { name: 'm', label: 'Massa', unit: 'kg', default: 10, step: 0.1 },
                    { name: 'V', label: 'Volume', unit: 'm³', default: 1, step: 0.1 }
                ],
                calculate: (m, V) => {
                    if (V === 0) return { error: 'Volume não pode ser zero' };
                    const density = m / V;
                    return { density };
                }
            },
            'ideal-gas': {
                name: 'Gases Ideais',
                category: 'Química',
                latex: 'PV = nRT',
                description: 'Lei dos gases ideais',
                variables: [
                    { name: 'P', label: 'Pressão', unit: 'atm', default: 1, step: 0.1 },
                    { name: 'V', label: 'Volume', unit: 'L', default: 22.4, step: 0.1 },
                    { name: 'n', label: 'Mols', unit: 'mol', default: 1, step: 0.1 },
                    { name: 'T', label: 'Temperatura', unit: 'K', default: 273.15, step: 1 }
                ],
                calculate: (P, V, n, T) => {
                    const R = 0.082057;
                    // Pode resolver para qualquer variável
                    if (P === 0) {
                        const result = n * R * T / V;
                        return { P: result };
                    } else if (V === 0) {
                        const result = n * R * T / P;
                        return { V: result };
                    } else if (n === 0) {
                        const result = P * V / (R * T);
                        return { n: result };
                    } else if (T === 0) {
                        const result = P * V / (n * R);
                        return { T: result };
                    }
                    return { PV: P * V, nRT: n * R * T };
                }
            }
        };

        const formula = formulas[formulaId];
        if (!formula) return;

        this.currentFormula = { id: formulaId, ...formula };
        this.renderCalculator(formula);
    }

    renderCalculator(formula) {
        this.formulaCategory.textContent = formula.category;
        
        let html = `
            <div class="formula-display">
                <div class="formula-latex">${formula.latex}</div>
                <div class="formula-description">${formula.description}</div>
                <button class="favorite-btn ${this.favorites.includes(formula.id) ? 'active' : ''}" id="favoriteBtn">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            
            <div class="input-grid">
        `;

        formula.variables.forEach(variable => {
            const isFullWidth = formula.variables.length % 2 !== 0 && 
                              variable === formula.variables[formula.variables.length - 1];
            html += `
                <div class="input-group ${isFullWidth ? 'full-width' : ''}">
                    <label class="input-label">
                        ${variable.label}
                        <span class="variable-name">${variable.name}</span>
                        ${variable.unit ? `<select class="unit-selector" data-variable="${variable.name}">
                            <option value="${variable.unit}">${variable.unit}</option>
                        </select>` : ''}
                    </label>
                    <input type="number" class="input-field" id="var-${variable.name}" 
                           value="${variable.default}" step="${variable.step || 0.1}">
                </div>
            `;
        });

        html += `
            </div>
            
            <button class="calculate-btn" id="calculateBtn">
                <i class="fas fa-play"></i>
                Calcular
            </button>
            
            <div id="resultArea"></div>
        `;

        this.calculatorArea.innerHTML = html;

        // Event listeners
        document.getElementById('calculateBtn').addEventListener('click', this.calculate.bind(this));
        document.getElementById('favoriteBtn').addEventListener('click', this.toggleFavorite.bind(this));
        
        // Calcular ao mudar valores
        const inputs = document.querySelectorAll('.input-field');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                setTimeout(() => this.calculate(), 500);
            });
        });

        // Cálculo inicial
        setTimeout(() => this.calculate(), 100);
    }

    calculate() {
        if (!this.currentFormula) return;

        const values = {};
        let hasError = false;

        this.currentFormula.variables.forEach(variable => {
            const input = document.getElementById(`var-${variable.name}`);
            const value = parseFloat(input.value) || 0;
            
            if (isNaN(value)) {
                input.classList.add('error');
                hasError = true;
            } else {
                input.classList.remove('error');
                values[variable.name] = value;
            }
        });

        if (hasError) return;

        try {
            const result = this.currentFormula.calculate(values);
            
            if (result.error) {
                this.showError(result.error);
                return;
            }

            this.showResult(result, values);
            this.addToHistory(result, values);
        } catch (error) {
            this.showError('Erro no cálculo');
        }
    }

    showResult(result, inputs) {
        const resultArea = document.getElementById('resultArea');
        
        let html = '<div class="result-card">';
        html += '<div class="result-main">';
        
        // Mostrar resultado principal
        const mainResult = Object.entries(result)[0];
        html += `<div class="result-value">${mainResult[1].toFixed(4)}</div>`;
        html += `<div class="result-label">${mainResult[0]}</div>`;
        html += '</div>';
        
        // Detalhes
        html += '<div class="result-details">';
        Object.entries(result).forEach(([key, value], index) => {
            if (index === 0) return; // Pular primeiro (já mostrado)
            html += `
                <div class="detail-row">
                    <span class="detail-label">${key}:</span>
                    <span class="detail-value">${value.toFixed(4)}</span>
                </div>
            `;
        });
        html += '</div>';
        
        // Inputs
        html += '<div class="result-details" style="border-top: 1px solid var(--border-color); margin-top: var(--space-sm);">';
        Object.entries(inputs).forEach(([key, value]) => {
            html += `
                <div class="detail-row">
                    <span class="detail-label">${key}:</span>
                    <span class="detail-value">${value.toFixed(2)}</span>
                </div>
            `;
        });
        html += '</div>';
        
        // Botões de ação
        html += '<div class="action-buttons">';
        html += '<button class="action-btn" id="copyResult"><i class="fas fa-copy"></i> Copiar</button>';
        html += '<button class="action-btn" id="chartResult"><i class="fas fa-chart-line"></i> Gráfico</button>';
        html += '</div>';
        
        html += '</div>';
        
        resultArea.innerHTML = html;
        
        // Event listeners
        document.getElementById('copyResult').addEventListener('click', () => {
            const text = `${mainResult[0]}: ${mainResult[1].toFixed(4)}`;
            navigator.clipboard.writeText(text);
        });
        
        document.getElementById('chartResult').addEventListener('click', () => {
            this.showChart(result, inputs);
        });
    }

    showError(message) {
        const resultArea = document.getElementById('resultArea');
        resultArea.innerHTML = `
            <div class="result-card" style="border-color: var(--danger);">
                <div class="result-main">
                    <div class="result-value" style="color: var(--danger);">
                        <i class="fas fa-exclamation-triangle"></i> Erro
                    </div>
                    <div class="result-label">${message}</div>
                </div>
            </div>
        `;
    }

    showChart(result, inputs) {
        const resultArea = document.getElementById('resultArea');
        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container';
        chartContainer.innerHTML = '<canvas class="chart-canvas" id="chartCanvas"></canvas>';
        resultArea.appendChild(chartContainer);
        
        // Simples gráfico de exemplo
        const canvas = document.getElementById('chartCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Exemplo: gráfico de variação
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < canvas.width; i += 10) {
            const x = i / canvas.width * 10;
            const y = Math.sin(x) * 50 + canvas.height / 2;
            if (i === 0) ctx.moveTo(i, y);
            else ctx.lineTo(i, y);
        }
        
        ctx.stroke();
    }

    addToHistory(result, inputs) {
        const entry = {
            formula: this.currentFormula.name,
            formulaId: this.currentFormula.id,
            inputs: { ...inputs },
            result: { ...result },
            timestamp: new Date().toISOString()
        };
        
        this.history.unshift(entry);
        if (this.history.length > 50) this.history.pop();
        
        localStorage.setItem('formulaHistory', JSON.stringify(this.history));
        this.renderHistory();
    }

    loadHistory() {
        this.renderHistory();
    }

    renderHistory() {
        if (this.history.length === 0) {
            this.emptyResults.style.display = 'flex';
            return;
        }
        
        this.emptyResults.style.display = 'none';
        
        let html = '';
        this.history.slice(0, 10).forEach(entry => {
            const firstResult = Object.entries(entry.result)[0];
            const inputStr = Object.entries(entry.inputs)
                .map(([k, v]) => `${k}: ${v.toFixed(2)}`)
                .join(', ');
            
            html += `
                <div class="history-item" data-formula="${entry.formulaId}">
                    <div class="history-formula">${entry.formula}</div>
                    <div class="history-params">${inputStr}</div>
                    <div class="history-result">${firstResult[0]} = ${firstResult[1].toFixed(4)}</div>
                    <div class="history-timestamp">${new Date(entry.timestamp).toLocaleString()}</div>
                </div>
            `;
        });
        
        this.resultsPanel.innerHTML = html;
        
        // Event listeners
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const formulaId = e.currentTarget.dataset.formula;
                this.loadFormula(formulaId);
                
                // Selecionar item na lista
                document.querySelectorAll('.formula-item').forEach(i => {
                    if (i.dataset.formula === formulaId) {
                        i.click();
                    }
                });
            });
        });
    }

    toggleFavorite() {
        if (!this.currentFormula) return;
        
        const btn = document.getElementById('favoriteBtn');
        const index = this.favorites.indexOf(this.currentFormula.id);
        
        if (index === -1) {
            this.favorites.push(this.currentFormula.id);
            btn.classList.add('active');
        } else {
            this.favorites.splice(index, 1);
            btn.classList.remove('active');
        }
        
        localStorage.setItem('formulaFavorites', JSON.stringify(this.favorites));
    }

    filterFormulas() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const items = document.querySelectorAll('.formula-item');
        
        items.forEach(item => {
            const name = item.querySelector('.element-name').textContent.toLowerCase();
            const symbol = item.querySelector('.element-symbol').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || symbol.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    filterFormulasByCategory(category) {
        const items = document.querySelectorAll('.formula-item');
        
        items.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    clearInputs() {
        if (!this.currentFormula) return;
        
        this.currentFormula.variables.forEach(variable => {
            const input = document.getElementById(`var-${variable.name}`);
            input.value = variable.default || 0;
        });
        
        this.calculate();
    }

    showHistoryView() {
        // Alternar entre histórico e resultados
        this.renderHistory();
    }

    clearHistory() {
        if (confirm('Limpar histórico de cálculos?')) {
            this.history = [];
            localStorage.removeItem('formulaHistory');
            this.renderHistory();
        }
    }

    exportResults() {
        if (this.history.length === 0) {
            alert('Nenhum resultado para exportar');
            return;
        }
        
        let csv = 'Data,Hora,Fórmula,Variáveis,Resultado\n';
        
        this.history.forEach(entry => {
            const date = new Date(entry.timestamp);
            const dateStr = date.toLocaleDateString();
            const timeStr = date.toLocaleTimeString();
            const inputs = Object.entries(entry.inputs)
                .map(([k, v]) => `${k}:${v.toFixed(2)}`)
                .join(';');
            const result = Object.entries(entry.result)
                .map(([k, v]) => `${k}=${v.toFixed(4)}`)
                .join(';');
            
            csv += `${dateStr},${timeStr},"${entry.formula}","${inputs}","${result}"\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resultados-formulas.csv';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new InteractiveFormulas();
});
