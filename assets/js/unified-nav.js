// 1142 LABS - Unified Navigation Component
// Ensures consistent navigation across all pages

(function() {
    'use strict';

    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Navigation structure
    const navLinks = [
        { href: 'index.html', label: 'HOME', pages: ['index.html', ''] },
        { href: 'about.html', label: 'ABOUT', pages: ['about.html'] },
        { href: 'research.html', label: 'RESEARCH', pages: ['research.html'] },
        { href: 'breakthroughs.html', label: 'BREAKTHROUGHS', pages: ['breakthroughs.html'] },
        { href: 'vision.html', label: 'VISION', pages: ['vision.html'] },
        { href: 'graphics.html', label: 'GRAPHICS', pages: ['graphics.html'] }
    ];

    // Find all nav containers
    const navContainers = document.querySelectorAll('nav > div, nav');
    
    navContainers.forEach(container => {
        // Check if this is a navigation container with links
        const existingLinks = container.querySelectorAll('a[href*=".html"]');
        
        if (existingLinks.length >= 3) {
            // This looks like a main navigation - update it
            const navLinksContainer = existingLinks[0].parentElement;
            
            // Clear existing nav links (but keep logo)
            const logo = container.querySelector('a[href="index.html"]');
            if (logo && logo.textContent.includes('1142')) {
                // Keep the logo, update the rest
                const linksWrapper = logo.nextElementSibling || logo.parentElement.querySelector('div');
                if (linksWrapper) {
                    linksWrapper.innerHTML = navLinks.map(link => {
                        const isActive = link.pages.includes(currentPage);
                        const activeStyle = isActive ? 'color: #00FFFF; font-weight: 700;' : 'color: #CBD5E1; font-weight: 600;';
                        return `<a href="${link.href}" style="${activeStyle} text-decoration: none; transition: all 0.3s;">${link.label}</a>`;
                    }).join('');
                }
            }
        }
    });

    // Add hover effects
    document.querySelectorAll('nav a').forEach(link => {
        if (!link.textContent.includes('1142')) {
            link.addEventListener('mouseenter', function() {
                this.style.color = '#EC4899';
                this.style.textShadow = '0 0 10px rgba(236, 72, 153, 0.5)';
            });
            link.addEventListener('mouseleave', function() {
                const isActive = this.href.includes(currentPage);
                this.style.color = isActive ? '#00FFFF' : '#CBD5E1';
                this.style.textShadow = '';
            });
        }
    });
})();
