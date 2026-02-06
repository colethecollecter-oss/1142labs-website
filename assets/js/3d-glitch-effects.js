/**
 * 3D GLASSES GLITCH EFFECTS - INTERACTIVE JAVASCRIPT
 * Adds dynamic 3D anaglyph and glitch effects to elements
 */

class GlitchEffect3D {
  constructor() {
    this.init();
  }

  init() {
    this.setupMouseTracking();
    this.setupRandomGlitches();
    this.setupScrollEffects();
    this.setup3DTextEffects();
  }

  /**
   * Mouse tracking for 3D parallax effect
   */
  setupMouseTracking() {
    const cards = document.querySelectorAll('.card-3d-depth');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * 10; // Max 10deg rotation
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `
          perspective(1000px)
          rotateX(${-rotateX}deg)
          rotateY(${rotateY}deg)
          translateZ(20px)
        `;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      });
    });
  }

  /**
   * Random glitch effects that trigger periodically
   */
  setupRandomGlitches() {
    const glitchElements = document.querySelectorAll('.glitch-rgb-split, .text-3d-glasses');
    
    setInterval(() => {
      const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)];
      if (randomElement) {
        this.triggerGlitch(randomElement);
      }
    }, 3000); // Glitch every 3 seconds
  }

  triggerGlitch(element) {
    element.classList.add('glitch-active');
    
    // Random glitch duration
    const duration = Math.random() * 200 + 100; // 100-300ms
    
    setTimeout(() => {
      element.classList.remove('glitch-active');
    }, duration);
  }

  /**
   * Scroll-triggered 3D effects
   */
  setupScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('glitch-visible');
        }
      });
    }, {
      threshold: 0.1
    });

    const animatedElements = document.querySelectorAll('.text-3d-hero, .image-3d-glasses');
    animatedElements.forEach(el => observer.observe(el));
  }

  /**
   * Dynamic 3D text generation
   */
  setup3DTextEffects() {
    const textElements = document.querySelectorAll('.glitch-rgb-split');
    
    textElements.forEach(el => {
      const text = el.textContent;
      el.setAttribute('data-text', text);
    });
  }
}

/**
 * Chromatic Aberration Effect on Images
 */
class ChromaticAberration {
  constructor(imageSelector) {
    this.images = document.querySelectorAll(imageSelector);
    this.init();
  }

  init() {
    this.images.forEach(img => {
      this.applyEffect(img);
    });
  }

  applyEffect(img) {
    const wrapper = document.createElement('div');
    wrapper.className = 'chromatic-wrapper';
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    
    // Create red and cyan layers
    const redLayer = img.cloneNode(true);
    const cyanLayer = img.cloneNode(true);
    
    redLayer.style.position = 'absolute';
    redLayer.style.top = '0';
    redLayer.style.left = '0';
    redLayer.style.mixBlendMode = 'screen';
    redLayer.style.filter = 'brightness(1.2) contrast(1.1)';
    redLayer.style.opacity = '0.7';
    redLayer.style.transform = 'translateX(-3px)';
    redLayer.style.filter += ' sepia(1) hue-rotate(300deg) saturate(3)';
    
    cyanLayer.style.position = 'absolute';
    cyanLayer.style.top = '0';
    cyanLayer.style.left = '0';
    cyanLayer.style.mixBlendMode = 'screen';
    cyanLayer.style.filter = 'brightness(1.2) contrast(1.1)';
    cyanLayer.style.opacity = '0.7';
    cyanLayer.style.transform = 'translateX(3px)';
    cyanLayer.style.filter += ' sepia(1) hue-rotate(180deg) saturate(3)';
    
    wrapper.appendChild(redLayer);
    wrapper.appendChild(cyanLayer);
    
    // Hover effect
    wrapper.addEventListener('mouseenter', () => {
      redLayer.style.transform = 'translateX(-5px)';
      cyanLayer.style.transform = 'translateX(5px)';
    });
    
    wrapper.addEventListener('mouseleave', () => {
      redLayer.style.transform = 'translateX(-3px)';
      cyanLayer.style.transform = 'translateX(3px)';
    });
  }
}

/**
 * Glitch Text Animation
 */
class GlitchTextAnimation {
  constructor(selector) {
    this.elements = document.querySelectorAll(selector);
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    this.init();
  }

  init() {
    this.elements.forEach(el => {
      el.addEventListener('mouseenter', () => this.scramble(el));
    });
  }

  scramble(element) {
    const originalText = element.textContent;
    let iterations = 0;
    const maxIterations = originalText.length;
    
    const interval = setInterval(() => {
      element.textContent = originalText
        .split('')
        .map((char, index) => {
          if (index < iterations) {
            return originalText[index];
          }
          return this.chars[Math.floor(Math.random() * this.chars.length)];
        })
        .join('');
      
      iterations += 1/3;
      
      if (iterations >= maxIterations) {
        clearInterval(interval);
        element.textContent = originalText;
      }
    }, 30);
  }
}

/**
 * 3D Glasses Cursor Trail
 */
class GlitchCursorTrail {
  constructor() {
    this.trails = [];
    this.maxTrails = 20;
    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.createTrail(e.clientX, e.clientY);
    });
  }

  createTrail(x, y) {
    // Red trail
    const redTrail = document.createElement('div');
    redTrail.className = 'cursor-trail-red';
    redTrail.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #FF0040;
      pointer-events: none;
      z-index: 9999;
      left: ${x - 5}px;
      top: ${y - 5}px;
      opacity: 0.6;
      mix-blend-mode: screen;
    `;
    
    // Cyan trail
    const cyanTrail = document.createElement('div');
    cyanTrail.className = 'cursor-trail-cyan';
    cyanTrail.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #00FFFF;
      pointer-events: none;
      z-index: 9999;
      left: ${x - 5}px;
      top: ${y - 5}px;
      opacity: 0.6;
      mix-blend-mode: screen;
    `;
    
    document.body.appendChild(redTrail);
    document.body.appendChild(cyanTrail);
    
    // Animate trails
    setTimeout(() => {
      redTrail.style.transform = 'translate(-10px, -10px) scale(0)';
      redTrail.style.opacity = '0';
      redTrail.style.transition = 'all 0.5s ease-out';
      
      cyanTrail.style.transform = 'translate(10px, 10px) scale(0)';
      cyanTrail.style.opacity = '0';
      cyanTrail.style.transition = 'all 0.5s ease-out';
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
      redTrail.remove();
      cyanTrail.remove();
    }, 600);
    
    // Limit number of trails
    this.trails.push({ red: redTrail, cyan: cyanTrail });
    if (this.trails.length > this.maxTrails) {
      const old = this.trails.shift();
      old.red.remove();
      old.cyan.remove();
    }
  }
}

/**
 * Glitch Screen Flash
 */
class GlitchScreenFlash {
  constructor() {
    this.init();
  }

  init() {
    setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every interval
        this.flash();
      }
    }, 5000); // Check every 5 seconds
  }

  flash() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        45deg,
        rgba(255, 0, 64, 0.1),
        rgba(0, 255, 255, 0.1)
      );
      pointer-events: none;
      z-index: 99999;
      opacity: 0;
      mix-blend-mode: screen;
    `;
    
    document.body.appendChild(overlay);
    
    // Flash animation
    setTimeout(() => {
      overlay.style.opacity = '1';
      overlay.style.transition = 'opacity 0.05s';
    }, 10);
    
    setTimeout(() => {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.1s';
    }, 60);
    
    setTimeout(() => {
      overlay.remove();
    }, 200);
  }
}

/**
 * Initialize all effects when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize 3D glitch effects
  new GlitchEffect3D();
  
  // Initialize chromatic aberration on images
  new ChromaticAberration('.image-3d-glasses img');
  
  // Initialize glitch text animation
  new GlitchTextAnimation('.chromatic-hover');
  
  // Initialize cursor trail (optional - can be disabled if too intense)
  // new GlitchCursorTrail();
  
  // Initialize screen flash effect
  new GlitchScreenFlash();
  
  console.log('🕶️ 3D Glasses Glitch Effects Loaded');
});

/**
 * Export for use in other modules
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GlitchEffect3D,
    ChromaticAberration,
    GlitchTextAnimation,
    GlitchCursorTrail,
    GlitchScreenFlash
  };
}
