// 1142 LABS - Advanced Particle Systems

class AdvancedParticleSystem {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found:', canvasId);
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: null, y: null, radius: 150 };
        
        // Options
        this.options = {
            particleCount: options.particleCount || 100,
            particleColor: options.particleColor || '#00FFFF',
            connectionColor: options.connectionColor || '#EC4899',
            maxDistance: options.maxDistance || 150,
            particleSize: options.particleSize || 3,
            speed: options.speed || 0.5,
            mouseInteraction: options.mouseInteraction !== false,
            glow: options.glow !== false,
            trails: options.trails || false
        };
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        if (this.options.mouseInteraction) {
            this.canvas.addEventListener('mousemove', (e) => this.updateMouse(e));
            this.canvas.addEventListener('mouseleave', () => this.clearMouse());
        }
        
        this.createParticles();
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }
    
    updateMouse(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }
    
    clearMouse() {
        this.mouse.x = null;
        this.mouse.y = null;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.options.speed,
                vy: (Math.random() - 0.5) * this.options.speed,
                size: Math.random() * this.options.particleSize + 1,
                color: this.options.particleColor,
                opacity: Math.random() * 0.5 + 0.5,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    drawParticle(particle) {
        // Pulsing effect
        const pulse = Math.sin(Date.now() * 0.002 + particle.pulsePhase) * 0.3 + 0.7;
        const size = particle.size * pulse;
        
        this.ctx.save();
        
        if (this.options.glow) {
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = particle.color;
        }
        
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Inner glow
        if (this.options.glow) {
            this.ctx.globalAlpha = particle.opacity * 0.5;
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, size * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    drawConnection(p1, p2, distance) {
        const opacity = (1 - distance / this.options.maxDistance) * 0.5;
        
        this.ctx.save();
        this.ctx.globalAlpha = opacity;
        this.ctx.strokeStyle = this.options.connectionColor;
        this.ctx.lineWidth = 1;
        
        if (this.options.glow) {
            this.ctx.shadowBlur = 5;
            this.ctx.shadowColor = this.options.connectionColor;
        }
        
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    updateParticle(particle) {
        // Mouse interaction
        if (this.mouse.x !== null && this.mouse.y !== null) {
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const angle = Math.atan2(dy, dx);
                particle.vx += Math.cos(angle) * force * 0.1;
                particle.vy += Math.sin(angle) * force * 0.1;
            }
        }
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Boundary check with wrapping
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;
        
        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;
    }
    
    animate() {
        // Clear canvas
        if (this.options.trails) {
            this.ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Update and draw particles
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.options.maxDistance) {
                    this.drawConnection(this.particles[i], this.particles[j], distance);
                }
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Neurotransmitter Particle System
class NeurotransmitterSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.molecules = [];
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.createMolecules();
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }
    
    createMolecules() {
        const types = [
            { name: 'dopamine', color: '#00FFFF', symbol: 'DA' },
            { name: 'serotonin', color: '#EC4899', symbol: '5-HT' },
            { name: 'norepinephrine', color: '#6D28D9', symbol: 'NE' },
            { name: 'gaba', color: '#10B981', symbol: 'GABA' }
        ];
        
        for (let i = 0; i < 50; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            this.molecules.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                type: type,
                size: Math.random() * 10 + 5,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.05
            });
        }
    }
    
    drawMolecule(molecule) {
        this.ctx.save();
        this.ctx.translate(molecule.x, molecule.y);
        this.ctx.rotate(molecule.rotation);
        
        // Glow effect
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = molecule.type.color;
        
        // Outer ring
        this.ctx.strokeStyle = molecule.type.color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, molecule.size, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Inner structure (simplified molecular structure)
        this.ctx.fillStyle = molecule.type.color;
        this.ctx.globalAlpha = 0.6;
        
        // Central node
        this.ctx.beginPath();
        this.ctx.arc(0, 0, molecule.size * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Bonds
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            const x = Math.cos(angle) * molecule.size * 0.7;
            const y = Math.sin(angle) * molecule.size * 0.7;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, molecule.size * 0.15, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.strokeStyle = molecule.type.color;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
        
        // Label
        this.ctx.globalAlpha = 0.8;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = `${molecule.size * 0.4}px Orbitron, sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(molecule.type.symbol, 0, 0);
        
        this.ctx.restore();
    }
    
    updateMolecule(molecule) {
        molecule.x += molecule.vx;
        molecule.y += molecule.vy;
        molecule.rotation += molecule.rotationSpeed;
        
        // Boundary check with bounce
        if (molecule.x < 0 || molecule.x > this.canvas.width) {
            molecule.vx *= -1;
            molecule.x = Math.max(0, Math.min(this.canvas.width, molecule.x));
        }
        if (molecule.y < 0 || molecule.y > this.canvas.height) {
            molecule.vy *= -1;
            molecule.y = Math.max(0, Math.min(this.canvas.height, molecule.y));
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.molecules.forEach(molecule => {
            this.updateMolecule(molecule);
            this.drawMolecule(molecule);
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Standard particle system
    if (document.getElementById('particle-canvas')) {
        new AdvancedParticleSystem('particle-canvas', {
            particleCount: 80,
            particleColor: '#00FFFF',
            connectionColor: '#EC4899',
            maxDistance: 150,
            glow: true
        });
    }
    
    // Neurotransmitter system
    if (document.getElementById('neurotransmitter-canvas')) {
        new NeurotransmitterSystem('neurotransmitter-canvas');
    }
    
    // Trail effect system
    if (document.getElementById('trail-canvas')) {
        new AdvancedParticleSystem('trail-canvas', {
            particleCount: 50,
            particleColor: '#00FFFF',
            connectionColor: '#6D28D9',
            trails: true,
            speed: 1
        });
    }
});
