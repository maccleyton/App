// PhysicsEngine.js - Motor de Física Cannon.js
class PhysicsEngine {
    constructor() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;

        this.bodies = [];
        this.materials = {};

        this.createMaterials();

        console.log('✅ PhysicsEngine inicializado');
    }

    createMaterials() {
        this.materials.default = new CANNON.Material('default');
        this.materials.particle = new CANNON.Material('particle');

        const contactMaterial = new CANNON.ContactMaterial(
            this.materials.default,
            this.materials.particle,
            {
                friction: 0.3,
                restitution: 0.7
            }
        );
        this.world.addContactMaterial(contactMaterial);
    }

    setGravity(x, y, z) {
        this.world.gravity.set(x, y, z);
    }

    createSphere(radius, position, mass = 1) {
        const shape = new CANNON.Sphere(radius);
        const body = new CANNON.Body({
            mass: mass,
            position: new CANNON.Vec3(position.x, position.y, position.z),
            shape: shape,
            material: this.materials.particle
        });

        this.world.addBody(body);
        this.bodies.push(body);

        return body;
    }

    createBox(size, position, mass = 1) {
        const shape = new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2));
        const body = new CANNON.Body({
            mass: mass,
            position: new CANNON.Vec3(position.x, position.y, position.z),
            shape: shape,
            material: this.materials.default
        });

        this.world.addBody(body);
        this.bodies.push(body);

        return body;
    }

    createPlane(position, rotation) {
        const shape = new CANNON.Plane();
        const body = new CANNON.Body({
            mass: 0,
            position: new CANNON.Vec3(position.x, position.y, position.z),
            shape: shape,
            material: this.materials.default
        });

        if (rotation) {
            body.quaternion.setFromEuler(rotation.x, rotation.y, rotation.z);
        }

        this.world.addBody(body);
        this.bodies.push(body);

        return body;
    }

    addBody(body) {
        this.world.addBody(body);
        this.bodies.push(body);
    }

    removeBody(body) {
        this.world.removeBody(body);
        const index = this.bodies.indexOf(body);
        if (index > -1) {
            this.bodies.splice(index, 1);
        }
    }

    applyForce(body, force, point) {
        body.applyForce(
            new CANNON.Vec3(force.x, force.y, force.z),
            point ? new CANNON.Vec3(point.x, point.y, point.z) : body.position
        );
    }

    applyImpulse(body, impulse, point) {
        body.applyImpulse(
            new CANNON.Vec3(impulse.x, impulse.y, impulse.z),
            point ? new CANNON.Vec3(point.x, point.y, point.z) : body.position
        );
    }

    setVelocity(body, velocity) {
        body.velocity.set(velocity.x, velocity.y, velocity.z);
    }

    update(deltaTime) {
        this.world.step(1/60, deltaTime, 3);
    }

    reset() {
        this.bodies.forEach(body => {
            this.world.removeBody(body);
        });
        this.bodies = [];
    }
}