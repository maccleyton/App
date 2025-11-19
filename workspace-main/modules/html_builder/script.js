// Page Builder - Sistema de Arrastar e Soltar
class PageBuilder {
    constructor() {
        this.canvas = document.getElementById('pageContainer');
        this.componentsList = document.getElementById('componentsList');
        this.propertiesPanel = document.getElementById('propertiesPanel');
        this.elementCount = document.getElementById('elementCount');
        this.canvasDimensions = document.getElementById('canvasDimensions');
        
        this.selectedElement = null;
        this.draggedElement = null;
        this.elementCounter = 0;
        this.elements = new Map();
        this.isPreviewMode = false;
        this.canvasScale = 0.5;
        
        this.init();
    }

    init() {
        this.setupDragAndDrop();
        this.setupEventListeners();
        this.setupFilters();
        this.updateCanvasScale();
    }

    setupDragAndDrop() {
        // Configurar elementos arrastáveis
        const draggables = document.querySelectorAll('.draggable-component');
        draggables.forEach(element => {
            element.addEventListener('dragstart', this.handleDragStart.bind(this));
            element.addEventListener('dragend', this.handleDragEnd.bind(this));
        });

        // Configurar canvas como zona de drop
        this.canvas.addEventListener('dragover', this.handleDragOver.bind(this));
        this.canvas.addEventListener('drop', this.handleDrop.bind(this));
        this.canvas.addEventListener('dragleave', this.handleDragLeave.bind(this));
    }

    setupEventListeners() {
        // Botões do header
        document.getElementById('previewBtn').addEventListener('click', this.togglePreview.bind(this));
        document.getElementById('clearBtn').addEventListener('click', this.clearCanvas.bind(this));
        document.getElementById('exportBtn').addEventListener('click', this.exportHTML.bind(this));

        // Busca de componentes
        document.getElementById('searchInput').addEventListener('input', this.filterComponents.bind(this));

        // Clique no canvas para desselecionar
        this.canvas.addEventListener('click', (e) => {
            if (e.target === this.canvas) {
                this.deselectElement();
            }
        });

        // Zoom do canvas
        this.setupZoomControls();
    }

    setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterComponentsByCategory(e.target.dataset.filter);
            });
        });
    }

    setupZoomControls() {
        const controls = document.createElement('div');
        controls.className = 'canvas-controls';
        controls.innerHTML = `
            <div class="zoom-control">
                <button class="zoom-btn" id="zoomOut"><i class="fas fa-minus"></i></button>
                <span class="zoom-level" id="zoomLevel">${Math.round(this.canvasScale * 100)}%</span>
                <button class="zoom-btn" id="zoomIn"><i class="fas fa-plus"></i></button>
                <button class="zoom-btn" id="zoomFit"><i class="fas fa-compress"></i></button>
            </div>
        `;
        this.canvas.parentElement.appendChild(controls);

        document.getElementById('zoomIn').addEventListener('click', () => this.setZoom(this.canvasScale + 0.1));
        document.getElementById('zoomOut').addEventListener('click', () => this.setZoom(this.canvasScale - 0.1));
        document.getElementById('zoomFit').addEventListener('click', () => this.fitZoom());
    }

    handleDragStart(e) {
        this.draggedElement = e.target.closest('.draggable-component');
        this.draggedElement.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('component', this.draggedElement.dataset.component);
    }

    handleDragEnd(e) {
        e.target.closest('.draggable-component').classList.remove('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        this.canvas.style.backgroundColor = 'var(--accent-soft)';
    }

    handleDragLeave(e) {
        if (e.target === this.canvas) {
            this.canvas.style.backgroundColor = '';
        }
    }

    handleDrop(e) {
        e.preventDefault();
        this.canvas.style.backgroundColor = '';
        
        const componentType = e.dataTransfer.getData('component');
        if (!componentType) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.canvasScale;
        const y = (e.clientY - rect.top) / this.canvasScale;
        
        this.createElement(componentType, x, y);
    }

    createElement(type, x, y) {
        const elementId = `element-${++this.elementCounter}`;
        const element = document.createElement('div');
        element.className = 'canvas-element';
        element.id = elementId;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        
        // Criar conteúdo baseado no tipo
        const content = this.createElementContent(type, elementId);
        element.innerHTML = content + `<div class="element-handle"><i class="fas fa-times"></i></div>`;
        
        // Adicionar ao canvas
        this.canvas.appendChild(element);
        
        // Armazenar dados do elemento
        const elementData = {
            id: elementId,
            type: type,
            x: x,
            y: y,
            properties: this.getDefaultProperties(type)
        };
        this.elements.set(elementId, elementData);
        
        // Configurar interações
        this.setupElementInteractions(element);
        
        // Selecionar elemento
        this.selectElement(element);
        
        // Atualizar contador
        this.updateElementCount();
        
        // Remover estado vazio
        this.updateEmptyState();
    }

    createElementContent(type, elementId) {
        const contents = {
            button: `<button class="element-button">Botão</button>`,
            text: `<p class="element-text">Texto de exemplo</p>`,
            heading: `<h1 class="element-heading">Título</h1>`,
            image: `<div class="element-image"><i class="fas fa-image"></i> Imagem</div>`,
            container: `<div class="element-container">Container</div>`,
            grid: `<div class="element-grid">
                <div class="grid-cell">1</div>
                <div class="grid-cell">2</div>
                <div class="grid-cell">3</div>
                <div class="grid-cell">4</div>
                <div class="grid-cell">5</div>
                <div class="grid-cell">6</div>
            </div>`,
            input: `<input type="text" class="property-input" placeholder="Input" style="width: 200px;">`,
            textarea: `<textarea class="property-input property-textarea" placeholder="Textarea" style="width: 200px; height: 80px;"></textarea>`
        };
        return contents[type] || `<div>Elemento</div>`;
    }

    getDefaultProperties(type) {
        const defaults = {
            button: { text: 'Botão', backgroundColor: '#10b981', color: '#0a0a0a', width: 'auto', height: 'auto' },
            text: { content: 'Texto de exemplo', fontSize: '11px', color: '#e0e0e0', width: 'auto', height: 'auto' },
            heading: { content: 'Título', fontSize: '16px', color: '#10b981', width: 'auto', height: 'auto' },
            image: { src: '', alt: 'Imagem', width: '200px', height: '150px' },
            container: { width: '200px', height: '150px', backgroundColor: 'transparent' },
            grid: { columns: '3', gap: '8px', width: '300px', height: '200px' },
            input: { placeholder: 'Input', width: '200px', type: 'text' },
            textarea: { placeholder: 'Textarea', width: '200px', height: '80px' }
        };
        return { ...defaults[type] };
    }

    setupElementInteractions(element) {
        // Seleção
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectElement(element);
        });

        // Arrastar elemento existente
        let isDragging = false;
        let startX, startY, initialX, initialY;

        element.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('element-handle')) return;
            if (this.isPreviewMode) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = element.offsetLeft;
            initialY = element.offsetTop;
            element.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const dx = (e.clientX - startX) / this.canvasScale;
            const dy = (e.clientY - startY) / this.canvasScale;
            
            element.style.left = `${initialX + dx}px`;
            element.style.top = `${initialY + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'move';
                
                // Atualizar dados
                const elementId = element.id;
                const data = this.elements.get(elementId);
                if (data) {
                    data.x = element.offsetLeft;
                    data.y = element.offsetTop;
                }
            }
        });

        // Botão de deletar
        const deleteBtn = element.querySelector('.element-handle');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteElement(element);
        });
    }

    selectElement(element) {
        // Desselecionar anterior
        this.deselectElement();
        
        // Selecionar novo
        this.selectedElement = element;
        element.classList.add('selected');
        
        // Carregar propriedades
        this.loadProperties(element);
    }

    deselectElement() {
        if (this.selectedElement) {
            this.selectedElement.classList.remove('selected');
            this.selectedElement = null;
        }
        this.showEmptyProperties();
    }

    loadProperties(element) {
        const elementId = element.id;
        const data = this.elements.get(elementId);
        if (!data) return;

        const properties = data.properties;
        const type = data.type;

        let html = `
            <div class="info-card">
                <div class="property-group">
                    <label class="property-label">ID do Elemento</label>
                    <input type="text" class="property-input" value="${elementId}" readonly>
                </div>
                <div class="property-group">
                    <label class="property-label">Tipo</label>
                    <input type="text" class="property-input" value="${type}" readonly>
                </div>
        `;

        // Propriedades específicas por tipo
        switch (type) {
            case 'button':
                html += `
                    <div class="property-group">
                        <label class="property-label">Texto</label>
                        <input type="text" class="property-input" id="prop-text" value="${properties.text}">
                    </div>
                    <div class="property-grid">
                        <div class="property-group">
                            <label class="property-label">Cor de Fundo</label>
                            <input type="color" class="property-color" id="prop-bgColor" value="${properties.backgroundColor}">
                        </div>
                        <div class="property-group">
                            <label class="property-label">Cor do Texto</label>
                            <input type="color" class="property-color" id="prop-color" value="${properties.color}">
                        </div>
                    </div>
                `;
                break;
            case 'text':
                html += `
                    <div class="property-group">
                        <label class="property-label">Conteúdo</label>
                        <textarea class="property-input property-textarea" id="prop-content">${properties.content}</textarea>
                    </div>
                    <div class="property-group">
                        <label class="property-label">Tamanho da Fonte</label>
                        <input type="text" class="property-input" id="prop-fontSize" value="${properties.fontSize}">
                    </div>
                `;
                break;
            case 'heading':
                html += `
                    <div class="property-group">
                        <label class="property-label">Conteúdo</label>
                        <input type="text" class="property-input" id="prop-content" value="${properties.content}">
                    </div>
                    <div class="property-group">
                        <label class="property-label">Tamanho da Fonte</label>
                        <input type="text" class="property-input" id="prop-fontSize" value="${properties.fontSize}">
                    </div>
                `;
                break;
            case 'image':
                html += `
                    <div class="property-group">
                        <label class="property-label">URL da Imagem</label>
                        <input type="text" class="property-input" id="prop-src" value="${properties.src}" placeholder="http://...">
                    </div>
                    <div class="property-group">
                        <label class="property-label">Texto Alternativo</label>
                        <input type="text" class="property-input" id="prop-alt" value="${properties.alt}">
                    </div>
                `;
                break;
            case 'container':
                html += `
                    <div class="property-group">
                        <label class="property-label">Largura</label>
                        <input type="text" class="property-input" id="prop-width" value="${properties.width}">
                    </div>
                    <div class="property-group">
                        <label class="property-label">Altura</label>
                        <input type="text" class="property-input" id="prop-height" value="${properties.height}">
                    </div>
                `;
                break;
            case 'grid':
                html += `
                    <div class="property-group">
                        <label class="property-label">Número de Colunas</label>
                        <input type="number" class="property-input" id="prop-columns" value="${properties.columns}" min="1" max="12">
                    </div>
                    <div class="property-group">
                        <label class="property-label">Espaçamento (gap)</label>
                        <input type="text" class="property-input" id="prop-gap" value="${properties.gap}">
                    </div>
                `;
                break;
        }

        // Propriedades comuns
        html += `
            <div class="property-grid">
                <div class="property-group">
                    <label class="property-label">Largura</label>
                    <input type="text" class="property-input" id="prop-width" value="${properties.width}">
                </div>
                <div class="property-group">
                    <label class="property-label">Altura</label>
                    <input type="text" class="property-input" id="prop-height" value="${properties.height}">
                </div>
            </div>
            <div class="action-buttons">
                <button class="action-btn danger" id="deleteElement">Deletar</button>
                <button class="action-btn primary" id="duplicateElement">Duplicar</button>
            </div>
        `;

        this.propertiesPanel.innerHTML = html;

        // Configurar listeners das propriedades
        this.setupPropertyListeners(element);
    }

    setupPropertyListeners(element) {
        const inputs = this.propertiesPanel.querySelectorAll('.property-input, .property-color, .property-select');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updateElementProperties(element));
        });

        // Botões de ação
        const deleteBtn = document.getElementById('deleteElement');
        const duplicateBtn = document.getElementById('duplicateElement');
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteElement(element));
        }
        
        if (duplicateBtn) {
            duplicateBtn.addEventListener('click', () => this.duplicateElement(element));
        }
    }

    updateElementProperties(element) {
        const elementId = element.id;
        const data = this.elements.get(elementId);
        if (!data) return;

        const properties = data.properties;
        const type = data.type;

        // Atualizar propriedades do objeto
        Object.keys(properties).forEach(key => {
            const input = document.getElementById(`prop-${key}`);
            if (input) {
                properties[key] = input.type === 'color' ? input.value : input.value;
            }
        });

        // Aplicar mudanças visuais
        const contentElement = element.querySelector(`.element-${type}`);
        if (contentElement) {
            switch (type) {
                case 'button':
                    contentElement.textContent = properties.text;
                    contentElement.style.backgroundColor = properties.backgroundColor;
                    contentElement.style.color = properties.color;
                    break;
                case 'text':
                    contentElement.textContent = properties.content;
                    contentElement.style.fontSize = properties.fontSize;
                    contentElement.style.color = properties.color;
                    break;
                case 'heading':
                    contentElement.textContent = properties.content;
                    contentElement.style.fontSize = properties.fontSize;
                    contentElement.style.color = properties.color;
                    break;
                case 'image':
                    if (properties.src) {
                        contentElement.innerHTML = `<img src="${properties.src}" alt="${properties.alt}" style="max-width: 100%; max-height: 100%; border-radius: var(--radius-sm);">`;
                    }
                    break;
                case 'container':
                    contentElement.style.width = properties.width;
                    contentElement.style.height = properties.height;
                    contentElement.style.backgroundColor = properties.backgroundColor;
                    break;
                case 'grid':
                    contentElement.style.gridTemplateColumns = `repeat(${properties.columns}, 1fr)`;
                    contentElement.style.gap = properties.gap;
                    contentElement.style.width = properties.width;
                    contentElement.style.height = properties.height;
                    break;
                case 'input':
                    contentElement.placeholder = properties.placeholder;
                    contentElement.style.width = properties.width;
                    break;
                case 'textarea':
                    contentElement.placeholder = properties.placeholder;
                    contentElement.style.width = properties.width;
                    contentElement.style.height = properties.height;
                    break;
            }
        }

        // Atualizar dimensões do elemento
        if (properties.width !== 'auto') element.style.width = properties.width;
        if (properties.height !== 'auto') element.style.height = properties.height;
    }

    deleteElement(element) {
        const elementId = element.id;
        this.elements.delete(elementId);
        element.remove();
        this.deselectElement();
        this.updateElementCount();
        this.updateEmptyState();
    }

    duplicateElement(element) {
        const elementId = element.id;
        const data = this.elements.get(elementId);
        if (!data) return;

        const newX = data.x + 20;
        const newY = data.y + 20;
        
        this.createElement(data.type, newX, newY);
        
        // Copiar propriedades para o novo elemento
        const newElement = this.selectedElement;
        const newData = this.elements.get(newElement.id);
        newData.properties = { ...data.properties };
        
        this.loadProperties(newElement);
        this.updateElementProperties(newElement);
    }

    showEmptyProperties() {
        this.propertiesPanel.innerHTML = `
            <div class="info-card">
                <p style="color: var(--text-secondary); text-align: center; padding: 20px;">
                    <i class="fas fa-hand-pointer" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                    Selecione um elemento para editar suas propriedades
                </p>
            </div>
        `;
    }

    filterComponents() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const components = document.querySelectorAll('.draggable-component');
        
        components.forEach(component => {
            const name = component.querySelector('.element-name').textContent.toLowerCase();
            const symbol = component.querySelector('.element-symbol').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || symbol.includes(searchTerm)) {
                component.style.display = 'flex';
            } else {
                component.style.display = 'none';
            }
        });
    }

    filterComponentsByCategory(category) {
        const components = document.querySelectorAll('.draggable-component');
        
        components.forEach(component => {
            if (category === 'all' || component.dataset.category === category) {
                component.style.display = 'flex';
            } else {
                component.style.display = 'none';
            }
        });
    }

    updateElementCount() {
        const count = this.elements.size;
        this.elementCount.textContent = `${count} elemento${count !== 1 ? 's' : ''}`;
    }

    updateEmptyState() {
        const emptyState = this.canvas.querySelector('.empty-canvas');
        if (this.elements.size === 0 && !emptyState) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-canvas';
            emptyDiv.innerHTML = `
                <i class="fas fa-mouse-pointer"></i>
                <p>Arraste componentes para cá</p>
                <small>Comece construindo sua página</small>
            `;
            this.canvas.appendChild(emptyDiv);
        } else if (this.elements.size > 0 && emptyState) {
            emptyState.remove();
        }
    }

    setZoom(scale) {
        this.canvasScale = Math.max(0.1, Math.min(2, scale));
        this.updateCanvasScale();
    }

    updateCanvasScale() {
        const canvas = document.getElementById('pageCanvas');
        canvas.style.transform = `scale(${this.canvasScale})`;
        
        const zoomLevel = document.getElementById('zoomLevel');
        if (zoomLevel) {
            zoomLevel.textContent = `${Math.round(this.canvasScale * 100)}%`;
        }
    }

    fitZoom() {
        const container = this.canvas.parentElement;
        const canvas = document.getElementById('pageCanvas');
        const availableWidth = container.clientWidth - 60;
        const availableHeight = container.clientHeight - 60;
        
        const scaleX = availableWidth / 1920;
        const scaleY = availableHeight / 1080;
        const scale = Math.min(scaleX, scaleY, 1);
        
        this.setZoom(scale);
    }

    togglePreview() {
        this.isPreviewMode = !this.isPreviewMode;
        const btn = document.getElementById('previewBtn');
        const canvas = document.getElementById('pageCanvas');
        
        if (this.isPreviewMode) {
            btn.classList.add('active');
            canvas.classList.add('preview-mode');
            this.deselectElement();
        } else {
            btn.classList.remove('active');
            canvas.classList.remove('preview-mode');
        }
    }

    clearCanvas() {
        if (this.elements.size === 0) return;
        
        if (confirm('Tem certeza que deseja limpar todo o canvas?')) {
            this.elements.clear();
            this.canvas.innerHTML = '';
            this.deselectElement();
            this.updateElementCount();
            this.updateEmptyState();
        }
    }

    exportHTML() {
        let html = `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n`;
        html += `    <meta charset="UTF-8">\n`;
        html += `    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n`;
        html += `    <title>Minha Página</title>\n`;
        html += `    <style>\n`;
        html += `        * { margin: 0; padding: 0; box-sizing: border-box; }\n`;
        html += `        body { font-family: 'Inter', sans-serif; background: #0a0a0a; color: #e0e0e0; }\n`;
        html += `        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }\n`;
        html += `    </style>\n`;
        html += `</head>\n<body>\n`;
        html += `    <div class="container">\n`;

        // Exportar elementos
        this.elements.forEach(data => {
            const element = document.getElementById(data.id);
            const contentElement = element.querySelector(`[class*="element-"]`);
            if (contentElement) {
                const clone = contentElement.cloneNode(true);
                // Remover classes internas
                clone.className = '';
                html += `        ${clone.outerHTML}\n`;
            }
        });

        html += `    </div>\n`;
        html += `</body>\n</html>`;

        // Download do arquivo
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'minha-pagina.html';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new PageBuilder();
});
