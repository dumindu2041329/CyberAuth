// Cyberpunk Three.js Scene
class CyberpunkScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.geometryObjects = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        
        this.init();
        this.createParticles();
        this.createGeometry();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x0a0a0f, 50, 200);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 50;

        // Renderer setup
        const canvas = document.getElementById('cyberpunk-canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x0a0a0f, 0.1);
    }

    createParticles() {
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        // Cyberpunk colors
        const colorPalette = [
            new THREE.Color(0x00f0ff), // Neon cyan
            new THREE.Color(0xff00ff), // Neon pink
            new THREE.Color(0x9d00ff), // Neon purple
            new THREE.Color(0xffff00), // Neon yellow
        ];

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random positions in a sphere
            positions[i3] = (Math.random() - 0.5) * 200;
            positions[i3 + 1] = (Math.random() - 0.5) * 200;
            positions[i3 + 2] = (Math.random() - 0.5) * 200;

            // Random colors from palette
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Random sizes
            sizes[i] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Particle material with custom shader
        const material = new THREE.ShaderMaterial({
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                varying float vAlpha;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    
                    // Distance-based alpha
                    vAlpha = 1.0 - (length(mvPosition.xyz) / 100.0);
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vAlpha;
                
                void main() {
                    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    alpha *= vAlpha;
                    
                    // Neon glow effect
                    vec3 glowColor = vColor * (1.0 + sin(gl_FragCoord.x * 0.01 + gl_FragCoord.y * 0.01) * 0.3);
                    gl_FragColor = vec4(glowColor, alpha);
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createGeometry() {
        // Create floating geometric shapes
        this.createTorus();
        this.createIcosahedron();
        this.createWireframeSphere();
        this.createGridPlane();
    }

    createTorus() {
        const geometry = new THREE.TorusGeometry(8, 2, 8, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        
        const torus = new THREE.Mesh(geometry, material);
        torus.position.set(-30, 20, -20);
        torus.rotation.x = Math.PI / 4;
        
        this.geometryObjects.push({
            mesh: torus,
            rotationSpeed: { x: 0.01, y: 0.02, z: 0.005 }
        });
        
        this.scene.add(torus);
    }

    createIcosahedron() {
        const geometry = new THREE.IcosahedronGeometry(6, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            wireframe: true,
            transparent: true,
            opacity: 0.7
        });
        
        const icosahedron = new THREE.Mesh(geometry, material);
        icosahedron.position.set(35, -15, -15);
        
        this.geometryObjects.push({
            mesh: icosahedron,
            rotationSpeed: { x: 0.015, y: 0.01, z: 0.02 }
        });
        
        this.scene.add(icosahedron);
    }

    createWireframeSphere() {
        const geometry = new THREE.SphereGeometry(10, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0x9d00ff,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(0, -30, -25);
        
        this.geometryObjects.push({
            mesh: sphere,
            rotationSpeed: { x: 0.005, y: 0.015, z: 0.01 }
        });
        
        this.scene.add(sphere);
    }

    createGridPlane() {
        // Create cyberpunk grid
        const size = 100;
        const divisions = 20;
        const gridHelper = new THREE.GridHelper(size, divisions, 0x00f0ff, 0x00f0ff);
        gridHelper.position.y = -40;
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.3;
        
        // Rotate grid for perspective effect
        gridHelper.rotation.x = Math.PI / 2;
        gridHelper.rotation.z = Math.PI / 6;
        
        this.scene.add(gridHelper);
    }

    setupEventListeners() {
        // Mouse movement
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.01;

        // Rotate particles
        if (this.particles) {
            this.particles.rotation.x = this.time * 0.1;
            this.particles.rotation.y = this.time * 0.05;
            
            // Mouse interaction
            this.particles.rotation.x += this.mouse.y * 0.1;
            this.particles.rotation.y += this.mouse.x * 0.1;
        }

        // Animate geometry objects
        this.geometryObjects.forEach(obj => {
            obj.mesh.rotation.x += obj.rotationSpeed.x;
            obj.mesh.rotation.y += obj.rotationSpeed.y;
            obj.mesh.rotation.z += obj.rotationSpeed.z;
            
            // Floating animation
            obj.mesh.position.y += Math.sin(this.time + obj.mesh.position.x * 0.01) * 0.05;
        });

        // Camera movement based on mouse
        this.camera.position.x += (this.mouse.x * 5 - this.camera.position.x) * 0.02;
        this.camera.position.y += (-this.mouse.y * 5 - this.camera.position.y) * 0.02;
        this.camera.lookAt(this.scene.position);

        // Pulse effect for particles
        if (this.particles && this.particles.material.uniforms) {
            this.particles.material.uniforms.time = { value: this.time };
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the scene when the page loads
window.addEventListener('load', () => {
    new CyberpunkScene();
});
