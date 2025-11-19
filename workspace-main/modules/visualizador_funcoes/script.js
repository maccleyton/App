// Visualizador de Funções
class FunctionVisualizer {
    constructor() {
        this.functionsList = document.getElementById('functionsList');
        this.plotArea = document.getElementById('plotArea');
        this.controlsPanel = document.getElementById('controlsPanel');
        this.functionInput = document.getElementById('functionInput');
        this.plotInfo = document.getElementById('plotInfo');
        
        this.functions = [
            { id: 'sin', expr: 'sin(x)', name: 'Seno', color: '#10b981' },
            { id: 'cos', expr: 'cos(x)', name: 'Cosseno', color: '#34d399' },
            { id: 'quad', expr: 'x^2', name: 'Quadrática', color: '#047857' },
            { id: 'exp', expr: 'exp(x)', name: 'Exponencial', color: '#6b7280' },
            { id: 'ln', expr: 'log(x)', name: 'Logaritmo', color: '#9ca3af' },
            { id: 'inv', expr: '1/x', name: 'Recíproca', color: '#ef4444' }
        ];
        
        this.activeFunctions = new Set();
        this.plotRange = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };
        this.canvas = null;
        this.ctx = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCanvas();
    }

    setupEventListeners() {
        // Funções da lista
        document.querySelectorAll('.function-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const funcExpr = e.currentTarget.dataset.function;
                this.toggleFunction(funcExpr);
            });
        });
        
        // Input customizado
        this.functionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addCustomFunction();
            }
        });
        
        // Botões
        document.getElementById('plotBtn').addEventListener('click', () => this.plotFunctions());
        document.getElementById('addFunctionBtn').addEventListener('click', () => this.addCustomFunction());
        document.getElementById('customFunctionBtn').addEventListener('click', () => this.addCustomFunction());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportPlot());
    }

    setupCanvas() {
        const canvas = document.createElement('canvas');
        canvas.className = 'chart-canvas';
        canvas.style.height = '400px';
        canvas.id = 'plotCanvas';
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    toggleFunction(funcExpr) {
        const funcObj = this.functions.find(f => f.expr === funcExpr);
        if (!funcObj) return;
        
        const item = document.querySelector(`[data-function="${funcExpr}"]`);
        
        if (this.activeFunctions.has(funcExpr)) {
            this.activeFunctions.delete(funcExpr);
            item.classList.remove('selected');
        } else {
            this.activeFunctions.add(funcExpr);
            item.classList.add('selected');
        }
        
        this.plotFunctions();
        this.updatePlotInfo();
    }

    addCustomFunction() {
        const expr = this.functionInput.value.trim();
        if (!expr) return;
        
        // Criar novo objeto função
        const id = 'custom-' + Date.now();
        const color = this.generateColor();
        
        const newFunc = {
            id: id,
            expr: expr,
            name: expr,
            color: color
        };
        
        this.functions.push(newFunc);
        this.activeFunctions.add(expr);
        
        // Adicionar à lista
        this.addFunctionToList(newFunc);
        
        // Limpar input
        this.functionInput.value = '';
        
        // Plotar
        this.plotFunctions();
        this.updatePlotInfo();
    }

    addFunctionToList(funcObj) {
        const list = document.getElementById('functionsList');
        const item = document.createElement('div');
        item.className = 'element-item function-item selected';
        item.dataset.function = funcObj.expr;
        
        item.innerHTML = `
            <span class="element-number"><i class="fas fa-plus"></i></span>
            <span class="element-symbol" style="color: ${funcObj.color}">${funcObj.name}</span>
            <span class="element-name">Custom</span>
            <button class="compound-delete" style="margin-left: auto;" data-func="${funcObj.expr}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.compound-delete')) {
                this.toggleFunction(funcObj.expr);
            }
        });
        
        // Botão de deletar
        const deleteBtn = item.querySelector('.compound-delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeFunction(funcObj.expr);
            item.remove();
        });
        
        list.appendChild(item);
    }

    removeFunction(funcExpr) {
        this.activeFunctions.delete(funcExpr);
        this.functions = this.functions.filter(f => f.expr !== funcExpr);
        this.plotFunctions();
        this.updatePlotInfo();
    }

    generateColor() {
        const colors = ['#10b981', '#34d399', '#047857', '#6b7280', '#9ca3af', '#ef4444', '#f59e0b', '#8b5cf6'];
        const usedColors = this.functions.map(f => f.color);
        const available = colors.filter(c => !usedColors.includes(c));
        return available[0] || colors[Math.floor(Math.random() * colors.length)];
    }

    plotFunctions() {
        if (this.activeFunctions.size === 0) {
            this.plotArea.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chart-line"></i>
                    <h3>Plot de Funções</h3>
                    <p>Selecione funções da lista ou adicione uma função customizada para visualizar o gráfico.</p>
                </div>
            `;
            return;
        }
        
        // Mostrar canvas
        this.plotArea.innerHTML = '';
        this.plotArea.appendChild(this.canvas);
        
        // Configurar canvas
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Desenhar eixos
        this.drawAxes();
        
        // Plotar cada função ativa
        this.activeFunctions.forEach(funcExpr => {
            const funcObj = this.functions.find(f => f.expr === funcExpr);
            if (funcObj) {
                this.plotFunction(funcObj);
            }
        });
        
        // Desenhar legendas
        this.drawLegend();
    }

    drawAxes() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const padding = 40;
        
        // Eixos X e Y
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2;
        
        // Eixo X
        ctx.beginPath();
        ctx.moveTo(padding, height / 2);
        ctx.lineTo(width - padding, height / 2);
        ctx.stroke();
        
        // Eixo Y
        ctx.beginPath();
        ctx.moveTo(width / 2, padding);
        ctx.lineTo(width / 2, height - padding);
        ctx.stroke();
        
        // Marcadores
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1;
        ctx.font = '10px Inter';
        ctx.fillStyle = '#9ca3af';
        
        // Marcadores X
        for (let x = -8; x <= 8; x += 2) {
            const xCanvas = width / 2 + (x / 10) * (width - 2 * padding);
            ctx.beginPath();
            ctx.moveTo(xCanvas, height / 2 - 5);
            ctx.lineTo(xCanvas, height / 2 + 5);
            ctx.stroke();
            ctx.fillText(x.toString(), xCanvas - 5, height / 2 + 20);
        }
        
        // Marcadores Y
        for (let y = -8; y <= 8; y += 2) {
            const yCanvas = height / 2 - (y / 10) * (height - 2 * padding);
            ctx.beginPath();
            ctx.moveTo(width / 2 - 5, yCanvas);
            ctx.lineTo(width / 2 + 5, yCanvas);
            ctx.stroke();
            ctx.fillText(y.toString(), width / 2 - 20, yCanvas + 3);
        }
        
        // Origem
        ctx.fillStyle = '#e0e0e0';
        ctx.fillText('0', width / 2 - 15, height / 2 + 20);
    }

    plotFunction(funcObj) {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const padding = 40;
        
        const xScale = (width - 2 * padding) / (this.plotRange.xMax - this.plotRange.xMin);
        const yScale = (height - 2 * padding) / (this.plotRange.yMax - this.plotRange.yMin);
        
        ctx.strokeStyle = funcObj.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        let firstPoint = true;
        
        for (let xCanvas = padding; xCanvas <= width - padding; xCanvas += 1) {
            const x = this.plotRange.xMin + (xCanvas - padding) / xScale;
            
            try {
                const y = this.evaluateFunction(funcObj.expr, x);
                const yCanvas = height / 2 - y * yScale;
                
                if (yCanvas >= padding && yCanvas <= height - padding) {
                    if (firstPoint) {
                        ctx.moveTo(xCanvas, yCanvas);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(xCanvas, yCanvas);
                    }
                } else {
                    firstPoint = true; // Quebrar linha
                }
            } catch (e) {
                firstPoint = true; // Quebrar linha em erros
            }
        }
        
        ctx.stroke();
    }

    evaluateFunction(expr, x) {
        // Substituir ^ por ** e x pela variável
        let func = expr.replace(/\^/g, '**');
        func = func.replace(/x/g, `(${x})`);
        func = func.replace(/sin/g, 'Math.sin');
        func = func.replace(/cos/g, 'Math.cos');
        func = func.replace(/tan/g, 'Math.tan');
        func = func.replace(/log/g, 'Math.log');
        func = func.replace(/ln/g, 'Math.log');
        func = func.replace(/exp/g, 'Math.exp');
        func = func.replace(/sqrt/g, 'Math.sqrt');
        func = func.replace(/abs/g, 'Math.abs');
        
        try {
            return eval(func);
        } catch (e) {
            return NaN;
        }
    }

    drawLegend() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        
        let y = 20;
        this.activeFunctions.forEach(funcExpr => {
            const funcObj = this.functions.find(f => f.expr === funcExpr);
            if (!funcObj) return;
            
            ctx.fillStyle = funcObj.color;
            ctx.fillRect(width - 150, y, 15, 15);
            
            ctx.fillStyle = '#e0e0e0';
            ctx.font = '12px Inter';
            ctx.fillText(funcObj.name, width - 130, y + 12);
            
            y += 25;
        });
    }

    updatePlotInfo() {
        const count = this.activeFunctions.size;
        this.plotInfo.textContent = `${count} função${count !== 1 ? 's' : ''} ativa${count !== 1 ? 's' : ''}`;
    }

    exportPlot() {
        if (this.activeFunctions.size === 0) {
            alert('Nenhuma função para exportar');
            return;
        }
        
        const url = this.canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'function-plot.png';
        a.click();
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new FunctionVisualizer();
});
