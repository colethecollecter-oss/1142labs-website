// 1142 LABS - WebGL Shader Effects System

class WebGLShaderSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found:', canvasId);
            return;
        }
        
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }
        
        this.time = 0;
        this.mouse = { x: 0.5, y: 0.5 };
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => this.updateMouse(e));
        this.setupShaders();
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        if (this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    updateMouse(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = (e.clientX - rect.left) / rect.width;
        this.mouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
    }
    
    setupShaders() {
        // Vertex Shader
        const vertexShaderSource = `
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;
        
        // Fragment Shader - Neural Network Visualization
        const fragmentShaderSource = `
            precision mediump float;
            uniform float time;
            uniform vec2 resolution;
            uniform vec2 mouse;
            
            // Noise function
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }
            
            // Neural network node
            float neuron(vec2 uv, vec2 pos, float size) {
                float dist = length(uv - pos);
                return smoothstep(size, size * 0.5, dist);
            }
            
            // Synaptic connection
            float connection(vec2 uv, vec2 start, vec2 end, float width) {
                vec2 dir = end - start;
                vec2 norm = normalize(vec2(-dir.y, dir.x));
                vec2 toPoint = uv - start;
                float along = dot(toPoint, normalize(dir));
                float across = abs(dot(toPoint, norm));
                
                float len = length(dir);
                if (along < 0.0 || along > len) return 0.0;
                
                return smoothstep(width, width * 0.5, across);
            }
            
            // Main shader
            void main() {
                vec2 uv = gl_FragCoord.xy / resolution.xy;
                uv = uv * 2.0 - 1.0;
                uv.x *= resolution.x / resolution.y;
                
                vec3 color = vec3(0.0);
                
                // Background gradient
                float gradient = length(uv) * 0.5;
                color += vec3(0.05, 0.1, 0.2) * (1.0 - gradient);
                
                // Neural network nodes
                float nodes = 0.0;
                for (int i = 0; i < 20; i++) {
                    float fi = float(i);
                    vec2 pos = vec2(
                        sin(time * 0.3 + fi * 0.5) * 0.8,
                        cos(time * 0.2 + fi * 0.7) * 0.6
                    );
                    
                    float pulse = sin(time * 2.0 + fi) * 0.5 + 0.5;
                    nodes += neuron(uv, pos, 0.02 + pulse * 0.01);
                }
                
                // Cyan neurons
                color += vec3(0.0, 1.0, 1.0) * nodes * 2.0;
                
                // Synaptic connections
                float connections = 0.0;
                for (int i = 0; i < 10; i++) {
                    float fi = float(i);
                    vec2 start = vec2(
                        sin(time * 0.3 + fi * 0.5) * 0.8,
                        cos(time * 0.2 + fi * 0.7) * 0.6
                    );
                    vec2 end = vec2(
                        sin(time * 0.3 + (fi + 1.0) * 0.5) * 0.8,
                        cos(time * 0.2 + (fi + 1.0) * 0.7) * 0.6
                    );
                    
                    float pulse = sin(time * 3.0 + fi * 0.5) * 0.5 + 0.5;
                    connections += connection(uv, start, end, 0.002) * pulse;
                }
                
                // Magenta connections
                color += vec3(0.9, 0.3, 0.6) * connections * 3.0;
                
                // Mouse interaction
                float mouseDist = length(uv - (mouse * 2.0 - 1.0));
                float mouseGlow = exp(-mouseDist * 3.0);
                color += vec3(0.0, 1.0, 1.0) * mouseGlow * 0.5;
                
                // Scanline effect
                float scanline = sin(uv.y * 100.0 + time * 2.0) * 0.05;
                color += scanline;
                
                // Vignette
                float vignette = 1.0 - length(uv * 0.5);
                color *= vignette;
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;
        
        // Compile shaders
        const vertexShader = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
        const fragmentShader = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);
        
        // Create program
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);
        
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Program link error:', this.gl.getProgramInfoLog(this.program));
            return;
        }
        
        this.gl.useProgram(this.program);
        
        // Setup geometry (full screen quad)
        const vertices = new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
             1,  1
        ]);
        
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        
        const positionLocation = this.gl.getAttribLocation(this.program, 'position');
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
        
        // Get uniform locations
        this.timeLocation = this.gl.getUniformLocation(this.program, 'time');
        this.resolutionLocation = this.gl.getUniformLocation(this.program, 'resolution');
        this.mouseLocation = this.gl.getUniformLocation(this.program, 'mouse');
    }
    
    compileShader(source, type) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    animate() {
        this.time += 0.016; // ~60fps
        
        // Update uniforms
        this.gl.uniform1f(this.timeLocation, this.time);
        this.gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
        this.gl.uniform2f(this.mouseLocation, this.mouse.x, this.mouse.y);
        
        // Draw
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        
        requestAnimationFrame(() => this.animate());
    }
}

// DNA Helix Shader Effect
class DNAHelixShader {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.gl = this.canvas.getContext('webgl');
        if (!this.gl) return;
        
        this.time = 0;
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.setupShaders();
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
    
    setupShaders() {
        const vertexShaderSource = `
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;
        
        const fragmentShaderSource = `
            precision mediump float;
            uniform float time;
            uniform vec2 resolution;
            
            void main() {
                vec2 uv = gl_FragCoord.xy / resolution.xy;
                uv = uv * 2.0 - 1.0;
                uv.x *= resolution.x / resolution.y;
                
                vec3 color = vec3(0.0);
                
                // DNA helix strands
                float y = uv.y;
                float strand1 = sin(y * 10.0 + time) * 0.3;
                float strand2 = sin(y * 10.0 + time + 3.14159) * 0.3;
                
                // Cyan strand
                float dist1 = abs(uv.x - strand1);
                color += vec3(0.0, 1.0, 1.0) * smoothstep(0.02, 0.0, dist1);
                
                // Magenta strand
                float dist2 = abs(uv.x - strand2);
                color += vec3(0.9, 0.3, 0.6) * smoothstep(0.02, 0.0, dist2);
                
                // Base pairs
                for (float i = -1.0; i <= 1.0; i += 0.1) {
                    float s1 = sin(i * 10.0 + time) * 0.3;
                    float s2 = sin(i * 10.0 + time + 3.14159) * 0.3;
                    
                    if (abs(uv.y - i) < 0.01) {
                        float connection = smoothstep(0.005, 0.0, abs(uv.x - mix(s1, s2, 0.5)));
                        color += vec3(0.5, 0.5, 1.0) * connection;
                    }
                }
                
                // Glow
                color += vec3(0.0, 0.5, 0.5) * 0.1;
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;
        
        const vertexShader = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
        const fragmentShader = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);
        
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);
        this.gl.useProgram(this.program);
        
        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        
        const positionLocation = this.gl.getAttribLocation(this.program, 'position');
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
        
        this.timeLocation = this.gl.getUniformLocation(this.program, 'time');
        this.resolutionLocation = this.gl.getUniformLocation(this.program, 'resolution');
    }
    
    compileShader(source, type) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        return shader;
    }
    
    animate() {
        this.time += 0.016;
        
        this.gl.uniform1f(this.timeLocation, this.time);
        this.gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
        
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize neural network shader if canvas exists
    if (document.getElementById('neural-shader-canvas')) {
        new WebGLShaderSystem('neural-shader-canvas');
    }
    
    // Initialize DNA helix shader if canvas exists
    if (document.getElementById('dna-shader-canvas')) {
        new DNAHelixShader('dna-shader-canvas');
    }
});
