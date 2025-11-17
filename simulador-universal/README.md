# 🌌 Simulador Universal 3D

Aplicação web interativa com 8 simuladores científicos em 3D usando Three.js e Cannon.js.

## 🎯 Simuladores Implementados

### ☢️ Simulador Nuclear (✅ Funcional)
- Fusão nuclear (H → He)
- Fissão nuclear (U-235)
- Decaimento radioativo
- Colisão de partículas
- Emissão de radiação (alfa, beta, gama)
- Detector de radiação em tempo real

### ⚡ Simulador Físico (🚧 Em desenvolvimento)
- Acelerador de partículas
- Colisões de alta energia
- Nucleossíntese estelar

### 🌌 Simulador Cósmico (🚧 Em desenvolvimento)
- Sistemas N-body
- Formação de galáxias
- Buracos negros

### 🧬 Simulador Molecular (🚧 Em desenvolvimento)
- Editor de moléculas 3D
- Reações químicas
- Cristalografia

### 🦠 Simulador Biológico (🚧 Em desenvolvimento)
- Células e organelas
- Ecossistemas

### 🦴 Simulador Arqueológico (🚧 Em desenvolvimento)
- Datação por carbono-14
- Reconstrução de fósseis

### 🔥 Simulador Termodinâmico (🚧 Em desenvolvimento)
- Máquinas térmicas
- Ciclos termodinâmicos

### 🌪️ Simulador Climático (🚧 Em desenvolvimento)
- Fenômenos climáticos
- Efeito estufa

## 🚀 Como Usar

### Método 1: Abrir direto no navegador
1. Extraia o arquivo ZIP
2. Abra o arquivo `index.html` no navegador

### Método 2: Servidor local (recomendado)
```bash
# Com Python 3
python -m http.server 8000

# Com Node.js
npx http-server

# Com PHP
php -S localhost:8000
```

Depois acesse: `http://localhost:8000`

## 📁 Estrutura de Arquivos

```
simulador-universal/
├── index.html
├── styles.css
├── README.md
└── js/
    ├── core/
    │   ├── SceneManager.js
    │   ├── PhysicsEngine.js
    │   └── ControlsManager.js
    ├── simulators/
    │   ├── NuclearSimulator.js (✅)
    │   ├── PhysicsSimulator.js
    │   ├── CosmicSimulator.js
    │   ├── MolecularSimulator.js
    │   ├── BiologicalSimulator.js
    │   ├── ArchaeologicalSimulator.js
    │   ├── ThermodynamicSimulator.js
    │   └── ClimaticSimulator.js
    └── app.js
```

## 🎮 Controles

### Navegação 3D
- **Mouse esquerdo + arrastar**: Mover câmera
- **Scroll**: Zoom in/out

### Controles de Simulação
- **▶️ Play**: Iniciar simulação
- **⏸️ Pause**: Pausar simulação
- **🔄 Reset**: Reiniciar simulação

### Parâmetros Físicos
- **Temperatura**: 1K - 10.000K
- **Pressão**: 0 - 1.000 atm
- **Gravidade**: 0 - 100 m/s²
- **Campo Magnético**: 0 - 100 Tesla

## 🛠️ Tecnologias

- **Three.js** v0.169.0 - Renderização 3D WebGL
- **Cannon.js** v0.20.0 - Motor de física
- **JavaScript ES6+** - Lógica da aplicação
- **CSS3** - Interface moderna

## 📊 Performance

- **FPS**: 60 (depende do hardware)
- **Partículas simultâneas**: até 1.000+
- **Resolução de física**: 60 steps/segundo

## 🐛 Debug

Abra o Console do navegador (F12) para ver logs detalhados.

## 📄 Licença

Projeto educacional livre para uso e modificação.

---

Desenvolvido com ⚛️ para explorar o universo através da ciência!
