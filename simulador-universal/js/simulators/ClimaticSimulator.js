// ClimaticSimulator.js - Simulador Climático
class ClimaticSimulator {
    constructor(sceneManager, physicsEngine) {
        this.sceneManager = sceneManager;
        this.physics = physicsEngine;
        this.isRunning = false;

        // Elementos climáticos
        this.clouds = [];
        this.raindrops = [];
        this.snowflakes = [];
        this.lightning = [];
        this.winds = [];

        // Atmosfera
        this.atmosphere = null;
        this.greenhouse = [];

        // Parâmetros
        this.temperature = 15; // °C
        this.humidity = 50; // %
        this.co2Level = 400; // ppm
        this.windSpeed = 10; // km/h

        console.log('✅ ClimaticSimulator criado');
    }

    init() {
        this.createInterface();
        this.createAtmosphere();
        this.setupWeather('sunny');
        this.physics.setGravity(0, -9.8, 0);
    }

    createInterface() {
        document.getElementById('specific-controls').innerHTML = `
            <h4>🌪️ Controles Climáticos</h4>

            <div class="control-group">
                <label>Fenômeno:</label>
                <select id="weather-type" style="width: 100%; padding: 8px; border-radius: 5px; background: rgba(99, 102, 241, 0.1); color: white; border: 1px solid rgba(99, 102, 241, 0.3);">
                    <option value="sunny">☀️ Ensolarado</option>
                    <option value="rain">🌧️ Chuva</option>
                    <option value="storm">⛈️ Tempestade</option>
                    <option value="snow">❄️ Neve</option>
                    <option value="tornado">🌪️ Tornado</option>
                    <option value="hurricane">🌀 Furacão</option>
                    <option value="greenhouse">🌡️ Efeito Estufa</option>
                </select>
            </div>

            <div class="control-group">
                <label>Temperatura: <span id="temp-display">15</span>°C</label>
                <input type="range" id="climate-temp" min="-50" max="50" value="15">
            </div>

            <div class="control-group">
                <label>Umidade: <span id="humidity-display">50</span>%</label>
                <input type="range" id="humidity-slider" min="0" max="100" value="50">
            </div>

            <div class="control-group">
                <label>CO₂: <span id="co2-display">400</span> ppm</label>
                <input type="range" id="co2-slider" min="280" max="800" value="400">
                <div style="font-size: 0.75rem; color: #888; margin-top: 3px;">
                    Pré-industrial: 280 ppm | Atual: ~420 ppm
                </div>
            </div>

            <div class="control-group">
                <label>Vento: <span id="wind-display">10</span> km/h</label>
                <input type="range" id="wind-slider" min="0" max="200" value="10">
            </div>

            <div class="control-buttons">
                <button id="btn-rain" class="btn btn-primary">🌧️ Fazer Chover</button>
                <button id="btn-lightning" class="btn">⚡ Relâmpago</button>
            </div>

            <div class="control-group" style="margin-top: 15px; padding: 10px; background: rgba(99, 102, 241, 0.1); border-radius: 8px;">
                <label style="color: #00d4ff; font-weight: bold;">Condições:</label>
                <div id="climate-stats" style="font-family: monospace; font-size: 0.85rem; color: #fff; margin-top: 5px;">
                    Clima: Ensolarado<br>
                    Nuvens: 0<br>
                    Precipitação: 0 mm/h
                </div>
            </div>
        `;

        document.getElementById('weather-type').addEventListener('change', (e) => {
            this.setupWeather(e.target.value);
        });

        document.getElementById('climate-temp').addEventListener('input', (e) => {
            this.temperature = parseFloat(e.target.value);
            document.getElementById('temp-display').textContent = this.temperature.toFixed(0);
        });

        document.getElementById('humidity-slider').addEventListener('input', (e) => {
            this.humidity = parseFloat(e.target.value);
            document.getElementById('humidity-display').textContent = this.humidity.toFixed(0);
        });

        document.getElementById('co2-slider').addEventListener('input', (e) => {
            this.co2Level = parseFloat(e.target.value);
            document.getElementById('co2-display').textContent = this.co2Level.toFixed(0);
            this.updateGreenhouseEffect();
        });

        document.getElementById('wind-slider').addEventListener('input', (e) => {
            this.windSpeed = parseFloat(e.target.value);
            document.getElementById('wind-display').textContent = this.windSpeed.toFixed(0);
        });

        document.getElementById('btn-rain').addEventListener('click', () => this.makeItRain());
        document.getElementById('btn-lightning').addEventListener('click', () => this.createLightning());
    }

    createAtmosphere() {
        // Esfera atmosférica
        const atmoGeometry = new THREE.SphereGeometry(20, 32, 32);
        const atmoMaterial = new THREE.MeshBasicMaterial({
            color: 0x87ceeb,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        this.atmosphere = new THREE.Mesh(atmoGeometry, atmoMaterial);
        this.sceneManager.addObject(this.atmosphere);

        // Sol
        const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
        const sunMaterial = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 1
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.position.set(15, 15, -15);
        this.sceneManager.addObject(sun);

        // Glow do sol
        const glowGeometry = new THREE.SphereGeometry(3.5, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        sun.add(glow);

        // Terra (plano)
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d5016,
            roughness: 0.9
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -10;
        ground.receiveShadow = true;
        this.sceneManager.addObject(ground);
    }

    setupWeather(type) {
        this.clearWeather();

        switch(type) {
            case 'sunny':
                // Já tem sol
                break;
            case 'rain':
                this.createRain();
                break;
            case 'storm':
                this.createStorm();
                break;
            case 'snow':
                this.createSnow();
                break;
            case 'tornado':
                this.createTornado();
                break;
            case 'hurricane':
                this.createHurricane();
                break;
            case 'greenhouse':
                this.createGreenhouseDemo();
                break;
        }
    }

    createClouds(count) {
        for (let i = 0; i < count; i++) {
            const cloudGroup = new THREE.Group();

            // Nuvem feita de esferas
            for (let j = 0; j < 5; j++) {
                const cloudGeometry = new THREE.SphereGeometry(1 + Math.random(), 16, 16);
                const cloudMaterial = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.8
                });
                const cloudPart = new THREE.Mesh(cloudGeometry, cloudMaterial);
                cloudPart.position.set(
                    (Math.random() - 0.5) * 3,
                    (Math.random() - 0.5),
                    (Math.random() - 0.5) * 3
                );
                cloudGroup.add(cloudPart);
            }

            cloudGroup.position.set(
                (Math.random() - 0.5) * 30,
                8 + Math.random() * 5,
                (Math.random() - 0.5) * 30
            );

            this.sceneManager.addObject(cloudGroup);
            this.clouds.push({
                mesh: cloudGroup,
                velocity: new THREE.Vector3((Math.random()-0.5)*0.1, 0, 0)
            });
        }
    }

    createRain() {
        this.createClouds(5);

        // Gotas de chuva
        for (let i = 0; i < 200; i++) {
            const dropGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
            const dropMaterial = new THREE.MeshBasicMaterial({
                color: 0x4444ff,
                transparent: true,
                opacity: 0.6
            });
            const drop = new THREE.Mesh(dropGeometry, dropMaterial);
            drop.position.set(
                (Math.random() - 0.5) * 40,
                10 + Math.random() * 10,
                (Math.random() - 0.5) * 40
            );
            this.sceneManager.addObject(drop);

            this.raindrops.push({
                mesh: drop,
                velocity: -0.5 - Math.random() * 0.3
            });
        }
    }

    createStorm() {
        this.createRain();

        // Nuvens mais escuras
        this.clouds.forEach(cloud => {
            cloud.mesh.children.forEach(part => {
                part.material.color.setHex(0x333333);
            });
        });

        // Relâmpagos periódicos
        this.stormActive = true;
        this.lightningTimer = 0;
    }

    createSnow() {
        this.createClouds(8);

        // Flocos de neve
        for (let i = 0; i < 150; i++) {
            const snowGeometry = new THREE.OctahedronGeometry(0.1, 0);
            const snowMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const flake = new THREE.Mesh(snowGeometry, snowMaterial);
            flake.position.set(
                (Math.random() - 0.5) * 40,
                10 + Math.random() * 10,
                (Math.random() - 0.5) * 40
            );
            this.sceneManager.addObject(flake);

            this.snowflakes.push({
                mesh: flake,
                velocity: -0.1 - Math.random() * 0.1,
                drift: (Math.random() - 0.5) * 0.05
            });
        }
    }

    createTornado() {
        // Funil do tornado
        const tornadoGeometry = new THREE.ConeGeometry(3, 15, 32, 1, true);
        const tornadoMaterial = new THREE.MeshBasicMaterial({
            color: 0x888888,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        const tornado = new THREE.Mesh(tornadoGeometry, tornadoMaterial);
        tornado.position.y = -2;
        this.sceneManager.addObject(tornado);

        this.tornado = tornado;

        // Detritos girando
        for (let i = 0; i < 50; i++) {
            const debrisGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const debrisMaterial = new THREE.MeshBasicMaterial({ color: 0x8b7355 });
            const debris = new THREE.Mesh(debrisGeometry, debrisMaterial);

            const angle = (i / 50) * Math.PI * 2;
            const radius = 1 + Math.random() * 2;
            debris.position.set(
                Math.cos(angle) * radius,
                Math.random() * 10,
                Math.sin(angle) * radius
            );

            this.sceneManager.addObject(debris);
            this.winds.push({
                mesh: debris,
                angle: angle,
                radius: radius,
                height: debris.position.y
            });
        }
    }

    createHurricane() {
        // Vista de cima do furacão (espiral)
        const hurricaneGroup = new THREE.Group();

        for (let i = 0; i < 8; i++) {
            const armGeometry = new THREE.TorusGeometry(5 + i*2, 1, 8, 32, Math.PI * 1.5);
            const armMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.6
            });
            const arm = new THREE.Mesh(armGeometry, armMaterial);
            arm.rotation.z = (i / 8) * Math.PI * 0.5;
            hurricaneGroup.add(arm);
        }

        hurricaneGroup.position.y = 5;
        hurricaneGroup.rotation.x = -Math.PI / 2;
        this.sceneManager.addObject(hurricaneGroup);

        this.hurricane = hurricaneGroup;
    }

    createGreenhouseDemo() {
        // Camada de CO2
        for (let i = 0; i < 50; i++) {
            const co2Geometry = new THREE.SphereGeometry(0.3, 8, 8);
            const co2Material = new THREE.MeshBasicMaterial({
                color: 0xff6600,
                transparent: true,
                opacity: 0.5
            });
            const co2 = new THREE.Mesh(co2Geometry, co2Material);
            co2.position.set(
                (Math.random() - 0.5) * 30,
                5 + Math.random() * 10,
                (Math.random() - 0.5) * 30
            );
            this.sceneManager.addObject(co2);

            this.greenhouse.push({
                mesh: co2,
                velocity: new THREE.Vector3(
                    (Math.random()-0.5)*0.05,
                    (Math.random()-0.5)*0.05,
                    (Math.random()-0.5)*0.05
                )
            });
        }

        // Raios de calor
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.createHeatRay();
            }, i * 500);
        }
    }

    createHeatRay() {
        const rayGeometry = new THREE.CylinderGeometry(0.1, 0.1, 20, 8);
        const rayMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6600,
            transparent: true,
            opacity: 0.6
        });
        const ray = new THREE.Mesh(rayGeometry, rayMaterial);
        ray.position.set(
            (Math.random() - 0.5) * 20,
            0,
            (Math.random() - 0.5) * 20
        );
        ray.rotation.z = Math.PI / 2;
        this.sceneManager.addObject(ray);

        setTimeout(() => {
            this.sceneManager.removeObject(ray);
        }, 2000);
    }

    makeItRain() {
        for (let i = 0; i < 50; i++) {
            const dropGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
            const dropMaterial = new THREE.MeshBasicMaterial({
                color: 0x4444ff,
                transparent: true,
                opacity: 0.6
            });
            const drop = new THREE.Mesh(dropGeometry, dropMaterial);
            drop.position.set(
                (Math.random() - 0.5) * 30,
                15,
                (Math.random() - 0.5) * 30
            );
            this.sceneManager.addObject(drop);

            this.raindrops.push({
                mesh: drop,
                velocity: -0.5
            });
        }
    }

    createLightning() {
        const points = [];
        let x = (Math.random() - 0.5) * 20;
        let y = 15;
        let z = (Math.random() - 0.5) * 20;

        points.push(new THREE.Vector3(x, y, z));

        for (let i = 0; i < 20; i++) {
            x += (Math.random() - 0.5) * 2;
            y -= 0.8;
            z += (Math.random() - 0.5) * 2;
            points.push(new THREE.Vector3(x, y, z));
        }

        const lightningGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lightningMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 3
        });
        const lightning = new THREE.Line(lightningGeometry, lightningMaterial);
        this.sceneManager.addObject(lightning);

        // Flash
        if (this.atmosphere) {
            this.atmosphere.material.opacity = 0.5;
        }

        setTimeout(() => {
            this.sceneManager.removeObject(lightning);
            if (this.atmosphere) {
                this.atmosphere.material.opacity = 0.1;
            }
        }, 200);
    }

    updateGreenhouseEffect() {
        const factor = (this.co2Level - 280) / 520; // Normalizado
        this.temperature = 15 + factor * 20; // Aquecimento
        document.getElementById('temp-display').textContent = this.temperature.toFixed(1);
    }

    updateStats() {
        let clima = 'Ensolarado';
        if (this.clouds.length > 0) clima = 'Nublado';
        if (this.raindrops.length > 0) clima = 'Chuvoso';
        if (this.snowflakes.length > 0) clima = 'Nevando';
        if (this.tornado) clima = 'Tornado!';
        if (this.hurricane) clima = 'Furacão!';

        const precipitacao = (this.raindrops.length + this.snowflakes.length) / 10;

        document.getElementById('climate-stats').innerHTML = `
            Clima: ${clima}<br>
            Nuvens: ${this.clouds.length}<br>
            Precipitação: ${precipitacao.toFixed(1)} mm/h
        `;
    }

    update(deltaTime) {
        if (!this.isRunning) return;

        // Mover nuvens
        this.clouds.forEach(cloud => {
            cloud.mesh.position.add(cloud.velocity);
            if (Math.abs(cloud.mesh.position.x) > 40) {
                cloud.velocity.x *= -1;
            }
        });

        // Chuva caindo
        this.raindrops.forEach((drop, i) => {
            drop.mesh.position.y += drop.velocity;
            if (drop.mesh.position.y < -10) {
                this.sceneManager.removeObject(drop.mesh);
                this.raindrops.splice(i, 1);
            }
        });

        // Neve caindo
        this.snowflakes.forEach((flake, i) => {
            flake.mesh.position.y += flake.velocity;
            flake.mesh.position.x += flake.drift;
            flake.mesh.rotation.x += 0.05;
            flake.mesh.rotation.y += 0.05;

            if (flake.mesh.position.y < -10) {
                this.sceneManager.removeObject(flake.mesh);
                this.snowflakes.splice(i, 1);
            }
        });

        // Tornado girando
        if (this.tornado) {
            this.tornado.rotation.y += 0.1;
        }

        this.winds.forEach(wind => {
            wind.angle += 0.1;
            wind.mesh.position.x = Math.cos(wind.angle) * wind.radius;
            wind.mesh.position.z = Math.sin(wind.angle) * wind.radius;
            wind.mesh.rotation.x += 0.1;
            wind.mesh.rotation.y += 0.1;
        });

        // Furacão girando
        if (this.hurricane) {
            this.hurricane.rotation.z += 0.05;
        }

        // Gases estufa
        this.greenhouse.forEach(gas => {
            gas.mesh.position.add(gas.velocity);

            // Bounce
            if (Math.abs(gas.mesh.position.x) > 20) gas.velocity.x *= -1;
            if (Math.abs(gas.mesh.position.z) > 20) gas.velocity.z *= -1;
            if (gas.mesh.position.y > 15 || gas.mesh.position.y < 3) gas.velocity.y *= -1;
        });

        // Tempestade - relâmpagos automáticos
        if (this.stormActive) {
            this.lightningTimer += deltaTime;
            if (this.lightningTimer > 3) {
                this.createLightning();
                this.lightningTimer = 0;
            }
        }

        this.updateStats();
        document.getElementById('particles-value').textContent = 
            this.clouds.length + this.raindrops.length + this.snowflakes.length;
    }

    clearWeather() {
        this.clouds.forEach(c => this.sceneManager.removeObject(c.mesh));
        this.raindrops.forEach(r => this.sceneManager.removeObject(r.mesh));
        this.snowflakes.forEach(s => this.sceneManager.removeObject(s.mesh));
        this.winds.forEach(w => this.sceneManager.removeObject(w.mesh));
        this.greenhouse.forEach(g => this.sceneManager.removeObject(g.mesh));
        if (this.tornado) this.sceneManager.removeObject(this.tornado);
        if (this.hurricane) this.sceneManager.removeObject(this.hurricane);

        this.clouds = [];
        this.raindrops = [];
        this.snowflakes = [];
        this.winds = [];
        this.greenhouse = [];
        this.tornado = null;
        this.hurricane = null;
        this.stormActive = false;
    }

    start() {
        this.isRunning = true;
    }

    pause() {
        this.isRunning = false;
    }

    reset() {
        const currentWeather = document.getElementById('weather-type').value;
        this.setupWeather(currentWeather);
    }

    setTemperature(temp) {
        this.temperature = temp;
    }

    cleanup() {
        this.clearWeather();
    }
}