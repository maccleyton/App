// Visualizador de Dados Interativo
class DataVisualizer {
    constructor() {
        this.datasetsList = document.getElementById('datasetsList');
        this.visualizationArea = document.getElementById('visualizationArea');
        this.controlsPanel = document.getElementById('controlsPanel');
        this.datasetInfo = document.getElementById('datasetInfo');
        this.csvFileInput = document.getElementById('csvFileInput');
        
        this.currentDataset = null;
        this.currentChart = null;
        this.chartType = 'line';
        this.colorScheme = ['#10b981', '#34d399', '#047857', '#6b7280', '#9ca3af'];
        
        // Datasets de exemplo
        this.sampleDatasets = {
            sales: {
                name: 'Vendas 2024',
                category: 'sample',
                headers: ['Mês', 'Vendas', 'Custos', 'Lucro'],
                data: [
                    ['Jan', 45000, 30000, 15000],
                    ['Fev', 52000, 33000, 19000],
                    ['Mar', 48000, 31000, 17000],
                    ['Abr', 61000, 35000, 26000],
                    ['Mai', 58000, 34000, 24000],
                    ['Jun', 65000, 36000, 29000],
                    ['Jul', 72000, 38000, 34000],
                    ['Ago', 69000, 37000, 32000],
                    ['Set', 75000, 39000, 36000],
                    ['Out', 82000, 41000, 41000],
                    ['Nov', 78000, 40000, 38000],
                    ['Dez', 85000, 42000, 43000]
                ]
            },
            temperature: {
                name: 'Temperatura Global',
                category: 'sample',
                headers: ['Ano', 'Temperatura', 'CO₂'],
                data: [
                    [2000, 14.32, 369.52],
                    [2001, 14.47, 371.13],
                    [2002, 14.56, 373.22],
                    [2003, 14.56, 375.77],
                    [2004, 14.55, 377.49],
                    [2005, 14.63, 379.80],
                    [2006, 14.50, 381.85],
                    [2007, 14.50, 383.71],
                    [2008, 14.39, 385.59],
                    [2009, 14.50, 387.35],
                    [2010, 14.56, 389.85],
                    [2011, 14.53, 391.62],
                    [2012, 14.50, 393.82],
                    [2013, 14.52, 396.48],
                    [2014, 14.59, 398.60],
                    [2015, 14.71, 400.83],
                    [2016, 14.84, 404.24],
                    [2017, 14.76, 406.55],
                    [2018, 14.69, 408.52],
                    [2019, 14.78, 411.44],
                    [2020, 14.84, 414.24]
                ]
            },
            population: {
                name: 'Crescimento Populacional',
                category: 'sample',
                headers: ['Ano', 'População', 'Taxa Crescimento'],
                data: [
                    [2000, 6127700427, 1.24],
                    [2001, 6203674143, 1.22],
                    [2002, 6279733798, 1.20],
                    [2003, 6355715575, 1.18],
                    [2004, 6431566740, 1.16],
                    [2005, 6507241866, 1.14],
                    [2006, 6582716710, 1.13],
                    [2007, 6657993822, 1.11],
                    [2008, 6733108335, 1.09],
                    [2009, 6808114704, 1.07],
                    [2010, 6883022949, 1.05],
                    [2011, 6957846729, 1.03],
                    [2012, 7032603158, 1.01],
                    [2013, 7107304254, 0.99],
                    [2014, 7181954128, 0.97],
                    [2015, 7256490011, 0.95],
                    [2016, 7330893339, 0.93],
                    [2017, 7405131822, 0.91],
                    [2018, 7479237966, 0.89],
                    [2019, 7553266315, 0.87],
                    [2020, 7627222235, 0.85]
                ]
            },
            chemical: {
                name: 'Concentração vs Tempo',
                category: 'sample',
                headers: ['Tempo', '[A]', '[B]', '[C]'],
                data: [
                    [0, 1.00, 0.00, 0.00],
                    [1, 0.82, 0.18, 0.09],
                    [2, 0.67, 0.33, 0.16],
                    [3, 0.55, 0.45, 0.22],
                    [4, 0.45, 0.55, 0.28],
                    [5, 0.37, 0.63, 0.32],
                    [6, 0.30, 0.70, 0.35],
                    [7, 0.25, 0.75, 0.38],
                    [8, 0.20, 0.80, 0.40],
                    [9, 0.17, 0.83, 0.42],
                    [10, 0.14, 0.86, 0.43]
                ]
            },
            physics: {
                name: 'Movimento Harmônico',
                category: 'sample',
                headers: ['Tempo', 'Posição', 'Velocidade', 'Aceleração'],
                data: [
                    [0.0, 1.00, 0.00, -1.00],
                    [0.5, 0.88, -0.48, -0.88],
                    [1.0, 0.54, -0.84, -0.54],
                    [1.5, 0.07, -1.00, -0.07],
                    [2.0, -0.42, -0.91, 0.42],
                    [2.5, -0.80, -0.60, 0.80],
                    [3.0, -0.99, -0.14, 0.99],
                    [3.5, -0.94, 0.35, 0.94],
                    [4.0, -0.65, 0.76, 0.65],
                    [4.5, -0.21, 0.98, 0.21],
                    [5.0, 0.28, 0.96, -0.28],
                    [5.5, 0.71, 0.70, -0.71],
                    [6.0, 0.96, 0.28, -0.96],
                    [6.5, 0.99, -0.22, -0.99],
                    [7.0, 0.75, -0.66, -0.75],
                    [7.5, 0.35, -0.94, -0.35],
                    [8.0, -0.15, -0.99, 0.15],
                    [8.5, -0.62, -0.78, 0.62],
                    [9.0, -0.91, -0.42, 0.91],
                    [9.5, -0.98, 0.03, 0.98],
                    [10.0, -0.84, 0.54, 0.84]
                ]
            }
        };
        
        this.uploadedDatasets = JSON.parse(localStorage.getItem('uploadedDatasets') || '{}');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderDatasetsList();
    }

    setupEventListeners() {
        // Busca
        document.getElementById('searchInput').addEventListener('input', this.filterDatasets.bind(this));
        
        // Filtros
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterDatasetsByCategory(e.target.dataset.filter);
            });
        });
        
        // Datasets
        document.querySelectorAll('.dataset-item').forEach(item => {
            item.addEventListener('click', this.selectDataset.bind(this));
        });
        
        // Upload
        document.getElementById('uploadDatasetBtn').addEventListener('click', () => {
            this.csvFileInput.click();
        });
        
        this.csvFileInput.addEventListener('change', this.handleFileUpload.bind(this));
        
        // Botões do header
        document.getElementById('importBtn').addEventListener('click', () => {
            this.csvFileInput.click();
        });
        
        document.getElementById('chartTypeBtn').addEventListener('click', this.cycleChartType.bind(this));
        document.getElementById('exportChartBtn').addEventListener('click', this.exportChart.bind(this));
    }

    selectDataset(e) {
        const item = e.currentTarget;
        const datasetId = item.dataset.dataset;
        
        document.querySelectorAll('.dataset-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        
        this.loadDataset(datasetId);
    }

    loadDataset(datasetId) {
        const dataset = this.sampleDatasets[datasetId] || this.uploadedDatasets[datasetId];
        if (!dataset) return;
        
        this.currentDataset = { id: datasetId, ...dataset };
        this.renderVisualization(dataset);
        this.renderControls(dataset);
        this.updateDatasetInfo(dataset);
    }

    renderVisualization(dataset) {
        const headers = dataset.headers;
        const data = dataset.data;
        
        // Gerar cores para cada série
        const seriesCount = headers.length - 1;
        const colors = this.colorScheme.slice(0, seriesCount);
        
        let html = `
            <div class="chart-container">
                <canvas id="mainChart" class="chart-canvas"></canvas>
            </div>
            <div class="action-buttons" style="margin-top: var(--space-md);">
                <button class="action-btn" id="addSeriesBtn">
                    <i class="fas fa-plus"></i> Adicionar Série
                </button>
                <button class="action-btn" id="removeSeriesBtn">
                    <i class="fas fa-minus"></i> Remover Série
                </button>
                <button class="action-btn" id="animateChartBtn">
                    <i class="fas fa-play"></i> Animar
                </button>
            </div>
        `;
        
        this.visualizationArea.innerHTML = html;
        
        // Desenhar gráfico inicial
        setTimeout(() => this.drawChart(dataset, colors), 100);
        
        // Event listeners
        document.getElementById('addSeriesBtn')?.addEventListener('click', () => this.addSeries());
        document.getElementById('removeSeriesBtn')?.addEventListener('click', () => this.removeSeries());
        document.getElementById('animateChartBtn')?.addEventListener('click', () => this.animateChart());
    }

    drawChart(dataset, colors) {
        const canvas = document.getElementById('mainChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        const headers = dataset.headers;
        const data = dataset.data;
        const seriesCount = headers.length - 1;
        
        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calcular escalas
        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        
        const xValues = data.map(row => row[0]);
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);
        
        const yValues = [];
        for (let i = 1; i <= seriesCount; i++) {
            yValues.push(...data.map(row => row[i]));
        }
        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);
        
        // Desenhar eixos
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();
        
        // Desenhar séries
        for (let series = 1; series <= seriesCount; series++) {
            ctx.strokeStyle = colors[series - 1];
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            data.forEach((row, index) => {
                const x = padding + (row[0] - minX) / (maxX - minX) * chartWidth;
                const y = canvas.height - padding - (row[series] - minY) / (maxY - minY) * chartHeight;
                
                if (index === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
                
                // Pontos
                ctx.fillStyle = colors[series - 1];
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fill();
            });
            
            ctx.stroke();
        }
        
        // Legendas
        ctx.font = '12px Inter';
        headers.slice(1).forEach((header, index) => {
            const x = padding + index * 120;
            const y = 20;
            
            ctx.fillStyle = colors[index];
            ctx.fillRect(x, y - 10, 15, 15);
            
            ctx.fillStyle = '#e0e0e0';
            ctx.fillText(header, x + 20, y);
        });
        
        // Título
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 16px Inter';
        ctx.fillText(dataset.name, padding, 50);
    }

    renderControls(dataset) {
        const headers = dataset.headers;
        
        let html = `
            <div class="info-card">
                <h3 style="color: var(--accent); margin-bottom: var(--space-md);">
                    <i class="fas fa-sliders-h"></i> Controles
                </h3>
        `;
        
        // Filtros por série
        headers.slice(1).forEach((header, index) => {
            html += `
                <div class="property-group">
                    <label class="property-label">${header}</label>
                    <div class="filter-controls">
                        <input type="range" class="filter-slider" id="filter-${index}" 
                               min="0" max="100" value="100" data-series="${index}">
                        <span class="filter-value" id="value-${index}">100%</span>
                    </div>
                </div>
            `;
        });
        
        // Transformações
        html += `
            <div class="property-group">
                <label class="property-label">Transformação</label>
                <select class="property-select" id="transformSelect">
                    <option value="none">Nenhuma</option>
                    <option value="log">Logarítmica</option>
                    <option value="normalize">Normalizar</option>
                    <option value="derivative">Derivada</option>
                    <option value="cumulative">Acumulativa</option>
                </select>
            </div>
            
            <div class="property-group">
                <label class="property-label">Suavização</label>
                <input type="range" class="filter-slider" id="smoothSlider" 
                       min="0" max="10" value="0">
                <span class="filter-value" id="smoothValue">0</span>
            </div>
            
            <div class="action-buttons">
                <button class="action-btn primary" id="applyFiltersBtn">
                    <i class="fas fa-check"></i> Aplicar
                </button>
                <button class="action-btn" id="resetFiltersBtn">
                    <i class="fas fa-undo"></i> Reset
                </button>
            </div>
        `;
        
        html += '</div>';
        
        this.controlsPanel.innerHTML = html;
        this.setupControlsEvents(dataset);
    }

    setupControlsEvents(dataset) {
        // Sliders de filtro
        document.querySelectorAll('.filter-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                const series = e.target.dataset.series;
                document.getElementById(`value-${series}`).textContent = value + '%';
                this.applyFilters(dataset);
            });
        });
        
        // Transformação
        document.getElementById('transformSelect').addEventListener('change', () => {
            this.applyFilters(dataset);
        });
        
        // Suavização
        document.getElementById('smoothSlider').addEventListener('input', (e) => {
            document.getElementById('smoothValue').textContent = e.target.value;
            this.applyFilters(dataset);
        });
        
        // Botões
        document.getElementById('applyFiltersBtn').addEventListener('click', () => {
            this.applyFilters(dataset);
        });
        
        document.getElementById('resetFiltersBtn').addEventListener('click', () => {
            this.resetFilters(dataset);
        });
    }

    applyFilters(dataset) {
        // Aplicar filtros ao dataset
        const transformedData = [...dataset.data];
        const headers = dataset.headers;
        const seriesCount = headers.length - 1;
        
        // Filtros por série
        for (let i = 0; i < seriesCount; i++) {
            const filterValue = parseInt(document.getElementById(`filter-${i}`)?.value || 100);
            const factor = filterValue / 100;
            
            transformedData.forEach(row => {
                row[i + 1] = row[i + 1] * factor;
            });
        }
        
        // Transformação
        const transform = document.getElementById('transformSelect')?.value;
        if (transform === 'log') {
            transformedData.forEach(row => {
                for (let i = 1; i < headers.length; i++) {
                    if (row[i] > 0) row[i] = Math.log(row[i]);
                }
            });
        } else if (transform === 'normalize') {
            transformedData.forEach((row, index) => {
                const sum = row.slice(1).reduce((a, b) => a + b, 0);
                if (sum > 0) {
                    for (let i = 1; i < headers.length; i++) {
                        row[i] = row[i] / sum * 100;
                    }
                }
            });
        }
        
        // Redesenhar gráfico
        const tempDataset = { ...dataset, data: transformedData };
        this.drawChart(tempDataset, this.colorScheme);
    }

    resetFilters(dataset) {
        // Resetar todos os controles
        document.querySelectorAll('.filter-slider').forEach(slider => {
            slider.value = 100;
            const series = slider.dataset.series;
            if (series) document.getElementById(`value-${series}`).textContent = '100%';
        });
        
        document.getElementById('transformSelect').value = 'none';
        document.getElementById('smoothSlider').value = 0;
        document.getElementById('smoothValue').textContent = '0';
        
        this.drawChart(dataset, this.colorScheme);
    }

    updateDatasetInfo(dataset) {
        const rows = dataset.data.length;
        const cols = dataset.headers.length - 1;
        this.datasetInfo.textContent = `${rows} pontos, ${cols} séries`;
    }

    filterDatasets() {
        const term = document.getElementById('searchInput').value.toLowerCase();
        const items = document.querySelectorAll('.dataset-item');
        
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

    filterDatasetsByCategory(category) {
        const items = document.querySelectorAll('.dataset-item');
        const allDatasets = { ...this.sampleDatasets, ...this.uploadedDatasets };
        
        items.forEach(item => {
            const datasetId = item.dataset.dataset;
            const dataset = allDatasets[datasetId];
            
            if (category === 'all' || (dataset && dataset.category === category)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    renderDatasetsList() {
        // Já renderizado no HTML
    }

    cycleChartType() {
        const types = ['line', 'bar', 'scatter', 'area'];
        const currentIndex = types.indexOf(this.chartType);
        this.chartType = types[(currentIndex + 1) % types.length];
        
        // Atualizar ícone
        const icons = ['fa-chart-line', 'fa-chart-bar', 'fa-chart-scatter', 'fa-chart-area'];
        const btn = document.getElementById('chartTypeBtn');
        btn.innerHTML = `<i class="fas ${icons[(currentIndex + 1) % types.length]}"></i>`;
        
        // Redesenhar
        if (this.currentDataset) {
            this.renderVisualization(this.currentDataset);
        }
    }

    animateChart() {
        if (!this.currentDataset) return;
        
        const canvas = document.getElementById('mainChart');
        const ctx = canvas.getContext('2d');
        
        let frame = 0;
        const animate = () => {
            ctx.save();
            ctx.globalAlpha = Math.sin(frame * 0.05) * 0.3 + 0.7;
            this.drawChart(this.currentDataset, this.colorScheme);
            ctx.restore();
            
            frame++;
            if (frame < 100) requestAnimationFrame(animate);
        };
        
        animate();
    }

    exportChart() {
        if (!this.currentDataset) return;
        
        const canvas = document.getElementById('mainChart');
        const url = canvas.toDataURL('image/png');
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentDataset.id}-chart.png`;
        a.click();
    }

    handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const csv = event.target.result;
            this.parseCSV(csv, file.name);
        };
        reader.readAsText(file);
    }

    parseCSV(csv, filename) {
        const lines = csv.split('\n').filter(line => line.trim());
        if (lines.length < 2) return;
        
        const headers = lines[0].split(',').map(h => h.trim());
        const data = lines.slice(1).map(line => {
            return line.split(',').map((val, index) => {
                return index === 0 ? val.trim() : parseFloat(val.trim()) || 0;
            });
        });
        
        const datasetId = 'upload-' + Date.now();
        const dataset = {
            name: filename.replace('.csv', ''),
            category: 'uploaded',
            headers: headers,
            data: data
        };
        
        // Salvar
        this.uploadedDatasets[datasetId] = dataset;
        localStorage.setItem('uploadedDatasets', JSON.stringify(this.uploadedDatasets));
        
        // Adicionar à lista
        this.addUploadedDatasetToList(datasetId, dataset);
        
        // Selecionar
        this.loadDataset(datasetId);
    }

    addUploadedDatasetToList(datasetId, dataset) {
        const list = document.getElementById('datasetsList');
        const item = document.createElement('div');
        item.className = 'element-item dataset-item';
        item.dataset.dataset = datasetId;
        item.dataset.category = 'uploaded';
        item.innerHTML = `
            <span class="element-number"><i class="fas fa-upload"></i></span>
            <span class="element-symbol">CSV</span>
            <span class="element-name">${dataset.name}</span>
        `;
        
        item.addEventListener('click', this.selectDataset.bind(this));
        list.appendChild(item);
    }

    addSeries() {
        if (!this.currentDataset) return;
        alert('Funcionalidade de adicionar série - em desenvolvimento');
    }

    removeSeries() {
        if (!this.currentDataset) return;
        alert('Funcionalidade de remover série - em desenvolvimento');
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new DataVisualizer();
});
