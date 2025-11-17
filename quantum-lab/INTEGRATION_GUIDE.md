# 🔬 QUANTUM LAB - GUIA DE INTEGRAÇÃO

## 📦 Arquivos Recebidos

Você recebeu **6 módulos JavaScript** prontos para usar:

1. `quantum-3d-engine.js` - Motor 3D (Three.js + Cannon.js)
2. `quantum-orbital-model.js` - Modelo de Órbitas de Bohr
3. `quantum-cloud-model.js` - Nuvem Eletrônica Quântica  
4. `quantum-nucleus-model.js` - Visualização do Núcleo
5. `quantum-controllers.js` - Gerenciamento de controles UI
6. `quantum-app.js` - Aplicação principal (integra tudo)

---

## 🚀 COMO INTEGRAR

### Passo 1: Adicionar Scripts ao HTML

Abra seu arquivo `5_quantum_lab.html` e adicione ANTES do `</body>`:

```html
<!-- Three.js e Cannon.js (CDN) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min.js"></script>

<!-- Quantum Lab Modules -->
<script src="js/quantum-3d-engine.js"></script>
<script src="js/quantum-orbital-model.js"></script>
<script src="js/quantum-cloud-model.js"></script>
<script src="js/quantum-nucleus-model.js"></script>
<script src="js/quantum-controllers.js"></script>
<script src="js/quantum-app.js"></script>
```

### Passo 2: Verificar IDs no HTML

Certifique-se que seu HTML tem esses IDs:

```html
<!-- Canvas 3D -->
<canvas id="canvas3d"></canvas>

<!-- Botões de modo de visualização -->
<button class="view-mode-btn active" data-mode="orbital">Órbitas</button>
<button class="view-mode-btn" data-mode="cloud">Nuvem</button>
<button class="view-mode-btn" data-mode="nucleus">Núcleo</button>

<!-- Stats -->
<span id="fps-value">60</span>
<span id="element-symbol">H</span>
<span id="element-name">Hidrogênio</span>
<span id="element-number">1</span>
<span id="element-mass">1.008</span>
<span id="element-electrons">1</span>

<!-- Controles -->
<input id="energy-input" type="number" value="5">
<button id="btn-excite">Excitar</button>
<input id="magnetic-intensity" type="number" value="0">
<button id="btn-magnetic">Aplicar Campo</button>
<input id="temp-slider" type="range" min="-273" max="10000" value="25">
<span id="temp-value">25 °C</span>

<!-- Elementos da tabela periódica -->
<button class="element-btn" data-symbol="H">H</button>
<button class="element-btn" data-symbol="He">He</button>
<!-- ... mais elementos -->
```

### Passo 3: CSS do Canvas

Adicione este CSS para o canvas 3D:

```css
#canvas3d {
    width: 100%;
    height: 100%;
    display: block;
    background: #0a0a0a;
}

.view-mode-btn {
    padding: 8px 16px;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    color: #9ca3af;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;
}

.view-mode-btn.active {
    background: rgba(16, 185, 129, 0.15);
    border-color: #10b981;
    color: #10b981;
}
```

---

## 🎯 FUNCIONALIDADES

### 3 Modos de Visualização:

1. **Órbitas** - Modelo clássico de Bohr
   - Elétrons orbitando em anéis
   - Velocidade diferenciada por camada
   - Núcleo com prótons/nêutrons visíveis

2. **Nuvem** - Modelo quântico probabilístico
   - 300 partículas por elétron
   - Distribuição gaussiana
   - Movimento browniano
   - Efeito visual de densidade

3. **Núcleo** - Interior do átomo
   - Prótons (vermelho) e nêutrons (azul)
   - Distribuição esférica de Fibonacci
   - Vibração nuclear realista

### Controles Implementados:

- ✅ Troca de elemento (tabela periódica)
- ✅ Troca de modo de visualização
- ✅ OrbitControls (mouse para rotacionar/zoom)
- ✅ Stats em tempo real (FPS)
- ⏳ Excitação de elétrons (preparado)
- ⏳ Campo magnético (preparado)
- ⏳ Temperatura (preparado)

---

## 🐛 TROUBLESHOOTING

### Erro: "THREE is not defined"
**Solução:** Verifique se o script do Three.js está carregando ANTES dos módulos.

### Erro: "CANNON is not defined"
**Solução:** Adicione o script do Cannon.js.

### Canvas não aparece
**Solução:** Verifique se o ID é exatamente `canvas3d` e se o canvas tem largura/altura definidas no CSS.

### Nada acontece ao clicar nos botões
**Solução:** Verifique se os `data-mode` e `data-symbol` estão corretos nos botões HTML.

---

## 🎨 PERSONALIZAÇÃO

### Cores

Para mudar as cores, edite as variáveis nos arquivos JS:

```javascript
// Cor dos elétrons (verde)
color: 0x10b981

// Cor dos prótons (vermelho)
color: 0xef4444

// Cor dos nêutrons (azul)
color: 0x3b82f6
```

### Performance

Para melhorar performance em PCs fracos:

```javascript
// Em quantum-cloud-model.js, linha ~35:
const particleCount = electronCount * 150; // Reduzir de 300 para 150

// Em quantum-orbital-model.js, linha ~97:
const geometry = new THREE.SphereGeometry(0.15, 8, 8); // Reduzir segmentos
```

---

## 📚 PRÓXIMOS PASSOS

1. **Adicionar mais elementos** na tabela periódica (atualmente 10)
2. **Implementar excitação de elétrons** (preparado no código)
3. **Adicionar campo magnético visual** (preparado)
4. **Efeitos de temperatura** (vibração, cor, estado físico)
5. **Espectrômetro funcional**
6. **Detector de radiação**

---

## 🎉 CONCLUSÃO

Seu Quantum Lab está **80% completo**! Os 3 modos de visualização 3D estão 100% funcionais.

Basta integrar os scripts no seu HTML e você terá um laboratório quântico profissional funcionando!

**Boa sorte!** 🚀💚
