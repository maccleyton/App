// Sistema de Equações Diferenciais
class DifferentialEquationsSolver {
    constructor() {
        this.edoList = document.getElementById('edoList');
        this.solverArea = document.getElementById('solverArea');
        this.parametersPanel = document.getElementById('parametersPanel');
        this.equationType = document.getElementById('equationType');
        
        this.currentEdo = null;
        this.solution = null;
        this.solutionHistory = JSON.parse(localStorage.getItem('edoHistory') || '[]');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Busca
        document.getElementById('searchInput').addEventListener('input', this.filterEdos.bind(this));
        
        // Filtros
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterEdosByCategory(e.target.dataset.filter);
            });
        });
        
        // EDOs
        document.querySelectorAll('.edo-item').forEach(item => {
            item.addEventListener('click', this.selectEdo.bind(this));
        });
        
        // Botões
        document.getElementById('solveBtn').addEventListener('click', () => this.solveEquation());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearEquation());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportSolution());
    }

    selectEdo(e) {
        const item = e.currentTarget;
        const edoId = item.dataset.edo;
        
        document.querySelectorAll('.edo-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        
        this.loadEdo(edoId);
    }

    loadEdo(edoId) {
        const edos = {
            'first-order-linear': {
                name: '1ª Ordem Linear',
                type: '1ª Ordem',
                equation: 'dy/dx + P(x)y = Q(x)',
                description: 'Equação diferencial linear de primeira ordem.',
                parameters: [
                    { name: 'P', label: 'P(x)', type: 'function', default: '1' },
                    { name: 'Q', label: 'Q(x)', type: 'function', default: 'x' },
                    { name: 'y0', label: 'y(0)', type: 'number', default: 1 },
                    { name: 'x0', label: 'x inicial', type: 'number', default: 0 },
                    { name: 'xf', label: 'x final', type: 'number', default: 10 }
                ],
                solve: (params) => this.solveFirstOrderLinear(params)
            },
            'separable': {
                name: 'Variáveis Separáveis',
                type: '1ª Ordem',
                equation: 'dy/dx = f(x)g(y)',
                description: 'Variáveis podem ser separadas.',
                parameters: [
                    { name: 'fx', label: 'f(x)', type: 'function', default: 'x' },
                    { name: 'gy', label: 'g(y)', type: 'function', default: 'y' },
                    { name: 'y0', label: 'y(0)', type: 'number', default: 1 },
                    { name: 'x0', label: 'x inicial', type: 'number', default: 0 },
                    { name: 'xf', label: 'x final', type: 'number', default: 10 }
                ],
                solve: (params) => this.solveSeparable(params)
            },
            'logistic': {
                name: 'Equação Logística',
                type: '1ª Ordem',
                equation: 'dy/dt = r y (1 - y/K)',
                description: 'Crescimento limitado por capacidade K.',
                parameters: [
                    { name: 'r', label: 'Taxa r', type: 'number', default: 0.5 },
                    { name: 'K', label: 'Capacidade K', type: 'number', default: 100 },
                    { name: 'y0', label: 'y(0)', type: 'number', default: 10 },
                    { name: 't0', label: 't inicial', type: 'number', default: 0 },
                    { name: 'tf', label: 't final', type: 'number', default: 50 }
                ],
                solve: (params) => this.solveLogistic(params)
            },
            'harmonic-oscillator': {
                name: 'Oscilador Harmônico',
                type: '2ª Ordem',
                equation: 'm d²x/dt² + k x = 0',
                description: 'Movimento harmônico simples.',
                parameters: [
                    { name: 'm', label: 'Massa m', type: 'number', default: 1 },
                    { name: 'k', label: 'Constante k', type: 'number', default: 1 },
                    { name: 'x0', label: 'x(0)', type: 'number', default: 1 },
                    { name: 'v0', label: 'v(0)', type: 'number', default: 0 },
                    { name: 't0', label: 't inicial', type: 'number', default: 0 },
                    { name: 'tf', label: 't final', type: 'number', default: 20 }
                ],
                solve: (params) => this.solveHarmonicOscillator(params)
            },
            'damped-oscillator': {
                name: 'Oscilador Amortecido',
                type: '2ª Ordem',
                equation: 'm d²x/dt² + c dx/dt + k x = 0',
                description: 'Amortecimento proporcional à velocidade.',
                parameters: [
                    { name: 'm', label: 'Massa m', type: 'number', default: 1 },
                    { name: 'c', label: 'Coef. c', type: 'number', default: 0.2 },
                    { name: 'k', label: 'Constante k', type: 'number', default: 1 },
                    { name: 'x0', label: 'x(0)', type: 'number', default: 1 },
                    { name: 'v0', label: 'v(0)', type: 'number', default: 0 },
                    { name: 't0', label: 't inicial', type: 'number', default: 0 },
                    { name: 'tf', label: 't final', type: 'number', default: 50 }
                ],
                solve: (params) => this.solveDampedOscillator(params)
            },
            'forced-oscillator': {
                name: 'Oscilador Forçado',
                type: '2ª Ordem',
                equation: 'm d²x/dt² + c dx/dt + k x = F(t)',
                description: 'Força externa aplicada.',
                parameters: [
                    { name: 'm', label: 'Massa m', type: 'number', default: 1 },
                    { name: 'c', label: 'Coef. c', type: 'number', default: 0.1 },
                    { name: 'k', label: 'Constante k', type: 'number', default: 1 },
                    { name: 'F', label: 'F(t)', type: 'function', default: 'sin(t)' },
                    { name: 'x0', label: 'x(0)', type: 'number', default: 0 },
                    { name: 'v0', label: 'v(0)', type: 'number', default: 0 },
                    { name: 't0', label: 't inicial', type: 'number', default: 0 },
                    { name: 'tf', label: 't final', type: 'number', default: 100 }
                ],
                solve: (params) => this.solveForcedOscillator(params)
            },
            'lorenz': {
                name: 'Sistema de Lorenz',
                type: 'Sistema',
                equation: 'Sistema caótico de 3 equações',
                description: 'Atrator estranho, sensível às condições iniciais.',
                parameters: [
                    { name: 'sigma', label: 'σ', type: 'number', default: 10 },
                    { name: 'rho', label: 'ρ', type: 'number', default: 28 },
                    { name: 'beta', label: 'β', type: 'number', default: 8/3 },
                    { name: 'x0', label: 'x(0)', type: 'number', default: 1 },
                    { name: 'y0', label: 'y(0)', type: 'number', default: 1 },
                    { name: 'z0', label: 'z(0)', type: 'number', default: 1 },
                    { name: 't0', label: 't inicial', type: 'number', default: 0 },
                    { name: 'tf', label: 't final', type: 'number', default: 50 }
                ],
                solve: (params) => this.solveLorenz(params)
            },
            'predator-prey': {
                name: 'Lotka-Volterra',
                type: 'Sistema',
                equation: 'Sistema predador-presa',
                description: 'Dinâmica populacional.',
                parameters: [
                    { name: 'a', label: 'a', type: 'number', default: 1 },
                    { name: 'b', label: 'b', type: 'number', default: 0.1 },
                    { name: 'c', label: 'c', type: 'number', default: 1 },
                    { name: 'd', label: 'd', type: 'number', default: 0.1 },
                    { name: 'x0', label: 'Presas x(0)', type: 'number', default: 10 },
                    { name: 'y0', label: 'Predadores y(0)', type: 'number', default: 5 },
                    { name: 't0', label: 't inicial', type: 'number', default: 0 },
                    { name: 'tf', label: 't final', type: 'number', default: 50 }
                ],
                solve: (params) => this.solvePredatorPrey(params)
            }
        };

        const edo = edos[edoId];
        if (!edo) return;

        this.currentEdo = { id: edoId, ...edo };
        this.renderSolver(edo);
        this.renderParameters(edo);
    }

    renderSolver(edo) {
        this.equationType.textContent = edo.type;
        
        let html = `
            <div class="equation-display">
                <div class="equation-latex">${edo.equation}</div>
                <div class="equation-description">${edo.description}</div>
            </div>
            
            <div class="solution-area">
                <canvas id="solutionCanvas" class="chart-canvas" style="height: 400px;"></canvas>
            </div>
            
            <div class="action-buttons">
                <button class="calculate-btn" id="solveEquationBtn">
                    <i class="fas fa-play"></i> Resolver
                </button>
                <button class="action-btn" id="animateSolutionBtn">
                    <i class="fas fa-film"></i> Animar
                </button>
                <button class="action-btn" id="phaseSpaceBtn">
                    <i class="fas fa-globe"></i> Espaço de Fase
                </button>
            </div>
        `;
        
        this.solverArea.innerHTML = html;
        
        // Event listeners
        document.getElementById('solveEquationBtn').addEventListener('click', () => this.solveEquation());
        document.getElementById('animateSolutionBtn').addEventListener('click', () => this.animateSolution());
        document.getElementById('phaseSpaceBtn').addEventListener('click', () => this.showPhaseSpace());
    }

    renderParameters(edo) {
        let html = `
            <div class="info-card">
                <h3 style="color: var(--accent); margin-bottom: var(--space-md);">
                    <i class="fas fa-cog"></i> Parâmetros
                </h3>
        `;
        
        edo.parameters.forEach(param => {
            html += `
                <div class="property-group">
                    <label class="property-label">
                        ${param.label}
                        <span class="variable-name">${param.name}</span>
                    </label>
            `;
            
            if (param.type === 'function') {
                html += `<input type="text" class="property-input" id="param-${param.name}" value="${param.default}" placeholder="Ex: x, sin(t), t^2">`;
            } else {
                html += `<input type="number" class="property-input" id="param-${param.name}" value="${param.default}" step="${param.name === 'tf' ? 1 : 0.1}">`;
            }
            
            html += `</div>`;
        });
        
        html += `
            <div class="action-buttons">
                <button class="action-btn primary" id="updateParamsBtn">
                    <i class="fas fa-sync"></i> Atualizar
                </button>
                <button class="action-btn" id="resetParamsBtn">
                    <i class="fas fa-undo"></i> Reset
                </button>
            </div>
        `;
        
        html += '</div>';
        
        this.parametersPanel.innerHTML = html;
        
        // Event listeners
        document.getElementById('updateParamsBtn').addEventListener('click', () => this.solveEquation());
        document.getElementById('resetParamsBtn').addEventListener('click', () => this.resetParameters());
    }

    getParameters() {
        const params = {};
        this.currentEdo.parameters.forEach(param => {
            const input = document.getElementById(`param-${param.name}`);
            if (param.type === 'number') {
                params[param.name] = parseFloat(input.value) || 0;
            } else {
                params[param.name] = input.value;
            }
        });
        return params;
    }

    solveEquation() {
        if (!this.currentEdo) return;
        
        const params = this.getParameters();
        
        try {
            const solution = this.currentEdo.solve(params);
            this.solution = solution;
            this.plotSolution(solution, params);
            this.addToHistory(solution, params);
        } catch (error) {
            alert('Erro ao resolver: ' + error.message);
        }
    }

    plotSolution(solution, params) {
        const canvas = document.getElementById('solutionCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Determinar número de variáveis
        const isSystem = solution.y0 && solution.y0.length > 1;
        const variables = isSystem ? solution.y0.length : 1;
        
        // Desenhar grid
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 1;
        for (let x = 0; x <= canvas.width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Encontrar min/max
        const t = solution.t;
        const y = solution.y;
        
        const minY = Math.min(...y);
        const maxY = Math.max(...y);
        const rangeY = maxY - minY || 1;
        
        // Desenhar cada variável
        const colors = ['#10b981', '#34d399', '#047857'];
        
        for (let varIdx = 0; varIdx < variables; varIdx++) {
            ctx.strokeStyle = colors[varIdx];
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            t.forEach((time, i) => {
                const x = padding + (time - t[0]) / (t[t.length - 1] - t[0]) * (canvas.width - 2 * padding);
                const value = isSystem ? y[i][varIdx] : y[i];
                const yPos = canvas.height - padding - (value - minY) / rangeY * (canvas.height - 2 * padding);
                
                if (i === 0) ctx.moveTo(x, yPos);
                else ctx.lineTo(x, yPos);
            });
            
            ctx.stroke();
        }
        
        // Legendas
        ctx.font = '12px Inter';
        ctx.fillStyle = '#e0e0e0';
        
        if (isSystem) {
            // Sistema - mostrar 3D hint
            ctx.fillText('Sistema de 3 variáveis', 10, 20);
        } else {
            ctx.fillText(`y(t) vs t`, 10, 20);
        }
        
        // Parâmetros
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px Inter';
        Object.entries(params).forEach(([key, val], index) => {
            ctx.fillText(`${key} = ${val}`, 10, 40 + index * 15);
        });
    }

    // Métodos de solução específicos
    solveFirstOrderLinear(params) {
        const { P, Q, y0, x0, xf } = params;
        
        // Implementação RK4 simples
        const n = 1000;
        const h = (xf - x0) / n;
        const t = [];
        const y = [];
        
        let x = x0;
        let y_val = y0;
        
        for (let i = 0; i <= n; i++) {
            t.push(x);
            y.push(y_val);
            
            // RK4 passo
            const k1 = this.evaluateLinear(x, y_val, P, Q);
            const k2 = this.evaluateLinear(x + h/2, y_val + h*k1/2, P, Q);
            const k3 = this.evaluateLinear(x + h/2, y_val + h*k2/2, P, Q);
            const k4 = this.evaluateLinear(x + h, y_val + h*k3, P, Q);
            
            y_val += (h/6) * (k1 + 2*k2 + 2*k3 + k4);
            x += h;
        }
        
        return { t, y };
    }

    evaluateLinear(x, y, P, Q) {
        // Avaliar P(x) e Q(x)
        const Px = this.evalFunction(P, x);
        const Qx = this.evalFunction(Q, x);
        return Qx - Px * y;
    }

    evalFunction(func, x) {
        // Parser simples de funções
        try {
            // Substituir ^ por **
            let expr = func.replace(/\^/g, '**');
            expr = expr.replace(/x/g, x);
            return eval(expr);
        } catch (e) {
            return x; // default
        }
    }

    solveSeparable(params) {
        const { fx, gy, y0, x0, xf } = params;
        
        const n = 1000;
        const h = (xf - x0) / n;
        const t = [];
        const y = [];
        
        let x = x0;
        let y_val = y0;
        
        for (let i = 0; i <= n; i++) {
            t.push(x);
            y.push(y_val);
            
            // Método de Euler simples
            y_val += h * this.evalFunction(fx, x) * this.evalFunction(gy, y_val);
            x += h;
        }
        
        return { t, y };
    }

    solveLogistic(params) {
        const { r, K, y0, t0, tf } = params;
        
        const n = 1000;
        const h = (tf - t0) / n;
        const t = [];
        const y = [];
        
        let time = t0;
        let y_val = y0;
        
        for (let i = 0; i <= n; i++) {
            t.push(time);
            y.push(y_val);
            
            // Equação logística
            y_val += h * r * y_val * (1 - y_val / K);
            time += h;
        }
        
        return { t, y };
    }

    solveHarmonicOscillator(params) {
        const { m, k, x0, v0, t0, tf } = params;
        
        const n = 1000;
        const h = (tf - t0) / n;
        const t = [];
        const y = [];
        
        let time = t0;
        let x = x0;
        let v = v0;
        const omega = Math.sqrt(k / m);
        
        for (let i = 0; i <= n; i++) {
            t.push(time);
            y.push([x, v]);
            
            // Método de Verlet
            const a = -omega * omega * x;
            x += v * h + 0.5 * a * h * h;
            const a_new = -omega * omega * x;
            v += 0.5 * (a + a_new) * h;
            
            time += h;
        }
        
        return { t, y };
    }

    solveDampedOscillator(params) {
        const { m, c, k, x0, v0, t0, tf } = params;
        
        const n = 1000;
        const h = (tf - t0) / n;
        const t = [];
        const y = [];
        
        let time = t0;
        let x = x0;
        let v = v0;
        
        for (let i = 0; i <= n; i++) {
            t.push(time);
            y.push([x, v]);
            
            // Aceleração
            const a = (-c * v - k * x) / m;
            
            // Euler-Cromer
            v += a * h;
            x += v * h;
            
            time += h;
        }
        
        return { t, y };
    }

    solveForcedOscillator(params) {
        const { m, c, k, F, x0, v0, t0, tf } = params;
        
        const n = 1000;
        const h = (tf - t0) / n;
        const t = [];
        const y = [];
        
        let time = t0;
        let x = x0;
        let v = v0;
        
        for (let i = 0; i <= n; i++) {
            t.push(time);
            y.push([x, v]);
            
            // Força externa
            const force = this.evalFunction(F, time);
            
            // Aceleração
            const a = (force - c * v - k * x) / m;
            
            // Euler-Cromer
            v += a * h;
            x += v * h;
            
            time += h;
        }
        
        return { t, y };
    }

    solveLorenz(params) {
        const { sigma, rho, beta, x0, y0, z0, t0, tf } = params;
        
        const n = 5000;
        const h = (tf - t0) / n;
        const t = [];
        const y = [];
        
        let time = t0;
        let x = x0, y_val = y0, z = z0;
        
        for (let i = 0; i <= n; i++) {
            t.push(time);
            y.push([x, y_val, z]);
            
            // Sistema de Lorenz
            const dx = sigma * (y_val - x);
            const dy = x * (rho - z) - y_val;
            const dz = x * y_val - beta * z;
            
            x += dx * h;
            y_val += dy * h;
            z += dz * h;
            
            time += h;
        }
        
        return { t, y };
    }

    solvePredatorPrey(params) {
        const { a, b, c, d, x0, y0, t0, tf } = params;
        
        const n = 2000;
        const h = (tf - t0) / n;
        const t = [];
        const y = [];
        
        let time = t0;
        let x = x0, y_val = y0;
        
        for (let i = 0; i <= n; i++) {
            t.push(time);
            y.push([x, y_val]);
            
            // Sistema Lotka-Volterra
            const dx = a * x - b * x * y_val;
            const dy = -c * y_val + d * x * y_val;
            
            x += dx * h;
            y_val += dy * h;
            
            time += h;
        }
        
        return { t, y };
    }

    animateSolution() {
        if (!this.solution) {
            alert('Resolva a equação primeiro');
            return;
        }
        
        const canvas = document.getElementById('solutionCanvas');
        const ctx = canvas.getContext('2d');
        
        // Salvar imagem atual
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        let frame = 0;
        const animate = () => {
            ctx.putImageData(imageData, 0, 0);
            
            // Desenhar ponto móvel
            const t = this.solution.t;
            const y = this.solution.y;
            const index = Math.floor((frame / 100) * (t.length - 1));
            
            if (index < t.length) {
                const x = t[index];
                const value = Array.isArray(y[0]) ? y[index][0] : y[index];
                
                // Converter para coordenadas do canvas
                const padding = 40;
                const xCanvas = padding + (x - t[0]) / (t[t.length - 1] - t[0]) * (canvas.width - 2 * padding);
                const yCanvas = canvas.height - padding - (value - Math.min(...y)) / (Math.max(...y) - Math.min(...y)) * (canvas.height - 2 * padding);
                
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.arc(xCanvas, yCanvas, 6, 0, 2 * Math.PI);
                ctx.fill();
            }
            
            frame++;
            if (frame < 100) requestAnimationFrame(animate);
        };
        
        animate();
    }

    showPhaseSpace() {
        if (!this.solution || !Array.isArray(this.solution.y[0])) {
            alert('Espaço de fase disponível apenas para sistemas');
            return;
        }
        
        // Criar novo canvas para 3D
        const canvas = document.createElement('canvas');
        canvas.className = 'chart-canvas';
        canvas.style.height = '400px';
        canvas.id = 'phaseCanvas';
        
        const oldCanvas = document.getElementById('solutionCanvas');
        oldCanvas.parentNode.replaceChild(canvas, oldCanvas);
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Desenhar trajetória 3D projetada
        const t = this.solution.t;
        const y = this.solution.y;
        
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        // Projeção simples (x vs y)
        y.forEach((point, i) => {
            const x = point[0];
            const y_val = point[1];
            
            const xCanvas = 50 + (x - Math.min(...y.map(p => p[0]))) / (Math.max(...y.map(p => p[0])) - Math.min(...y.map(p => p[0]))) * (canvas.width - 100);
            const yCanvas = canvas.height - 50 - (y_val - Math.min(...y.map(p => p[1]))) / (Math.max(...y.map(p => p[1])) - Math.min(...y.map(p => p[1]))) * (canvas.height - 100);
            
            if (i === 0) ctx.moveTo(xCanvas, yCanvas);
            else ctx.lineTo(xCanvas, yCanvas);
        });
        
        ctx.stroke();
        
        // Título
        ctx.fillStyle = '#e0e0e0';
        ctx.font = '14px Inter';
        ctx.fillText('Espaço de Fase (x vs y)', 10, 20);
    }

    addToHistory(solution, params) {
        const entry = {
            edo: this.currentEdo.id,
            name: this.currentEdo.name,
            params: params,
            timestamp: new Date().toISOString()
        };
        
        this.solutionHistory.unshift(entry);
        if (this.solutionHistory.length > 50) this.solutionHistory.pop();
        
        localStorage.setItem('edoHistory', JSON.stringify(this.solutionHistory));
    }

    resetParameters() {
        if (!this.currentEdo) return;
        
        this.currentEdo.parameters.forEach(param => {
            const input = document.getElementById(`param-${param.name}`);
            input.value = param.default;
        });
        
        this.solveEquation();
    }

    clearEquation() {
        if (!this.currentEdo) return;
        
        this.solutionArea.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-wave-square"></i>
                <h3>Selecione uma Equação Diferencial</h3>
                <p>Escolha um tipo de EDO da lista para configurar parâmetros e resolver interativamente.</p>
            </div>
        `;
        this.currentEdo = null;
    }

    filterEdos() {
        const term = document.getElementById('searchInput').value.toLowerCase();
        const items = document.querySelectorAll('.edo-item');
        
        items.forEach(item => {
            const name = item.querySelector('.element-name').textContent.toLowerCase();
            const symbol = item.querySelector('.element-symbol').textContent.toLowerCase();
            
            if (name.includes(term) || symbol.includes(term)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    filterEdosByCategory(category) {
        const items = document.querySelectorAll('.edo-item');
        
        items.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    exportSolution() {
        if (!this.solution) {
            alert('Resolva a equação primeiro');
            return;
        }
        
        const csv = this.solutionToCSV(this.solution);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentEdo.id}-solution.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    solutionToCSV(solution) {
        let csv = 't,y\n';
        solution.t.forEach((t, i) => {
            const y = solution.y[i];
            if (Array.isArray(y)) {
                csv += `${t},${y.join(',')}\n`;
            } else {
                csv += `${t},${y}\n`;
            }
        });
        return csv;
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new DifferentialEquationsSolver();
});
