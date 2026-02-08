// 1142 LABS Performance Optimizer
// Implements lazy loading, intersection observers, and performance best practices

(function() {
    'use strict';

    // ===== LAZY LOADING FOR IMAGES =====
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Load data-src if present
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        
                        // Add loaded class for fade-in effect
                        img.classList.add('lazy-loaded');
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px', // Start loading 50px before entering viewport
                threshold: 0.01
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
        }
    }

    // ===== LAZY LOADING FOR VIDEOS =====
    function initVideoLazyLoading() {
        const lazyVideos = document.querySelectorAll('video[data-src]');
        
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        const sources = video.querySelectorAll('source[data-src]');
                        
                        sources.forEach(source => {
                            source.src = source.dataset.src;
                            source.removeAttribute('data-src');
                        });
                        
                        if (video.dataset.src) {
                            video.src = video.dataset.src;
                            video.removeAttribute('data-src');
                        }
                        
                        video.load();
                        video.classList.add('lazy-loaded');
                        
                        observer.unobserve(video);
                    }
                });
            }, {
                rootMargin: '100px 0px',
                threshold: 0.01
            });

            lazyVideos.forEach(video => videoObserver.observe(video));
        } else {
            // Fallback
            lazyVideos.forEach(video => {
                const sources = video.querySelectorAll('source[data-src]');
                sources.forEach(source => {
                    source.src = source.dataset.src;
                    source.removeAttribute('data-src');
                });
                if (video.dataset.src) {
                    video.src = video.dataset.src;
                    video.removeAttribute('data-src');
                }
                video.load();
            });
        }
    }

    // ===== DEFER NON-CRITICAL CSS =====
    function deferNonCriticalCSS() {
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"][data-defer]');
        stylesheets.forEach(link => {
            link.media = 'print';
            link.onload = function() {
                this.media = 'all';
            };
        });
    }

    // ===== PRELOAD CRITICAL RESOURCES =====
    function preloadCriticalResources() {
        const criticalImages = [
            '/assets/logo-spikey-original.png',
            '/assets/3d-glitch-logo-1142.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // ===== REDUCE LAYOUT SHIFTS =====
    function preventLayoutShifts() {
        // Add aspect ratio boxes to images without dimensions
        const images = document.querySelectorAll('img:not([width]):not([height])');
        images.forEach(img => {
            if (img.naturalWidth && img.naturalHeight) {
                const aspectRatio = (img.naturalHeight / img.naturalWidth) * 100;
                img.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
            }
        });
    }

    // ===== DEBOUNCE SCROLL EVENTS =====
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ===== OPTIMIZE ANIMATIONS =====
    function optimizeAnimations() {
        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            const animations = document.getAnimations();
            if (document.hidden) {
                animations.forEach(anim => anim.pause());
            } else {
                animations.forEach(anim => anim.play());
            }
        });
    }

    // ===== REDUCE MOTION FOR ACCESSIBILITY =====
    function respectReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduce-motion');
            
            // Disable heavy animations
            const style = document.createElement('style');
            style.textContent = `
                .reduce-motion * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ===== PERFORMANCE MONITORING =====
    function monitorPerformance() {
        if ('PerformanceObserver' in window) {
            // Monitor Largest Contentful Paint
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('[1142 Performance] LCP:', lastEntry.renderTime || lastEntry.loadTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                // LCP not supported
            }

            // Monitor First Input Delay
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        console.log('[1142 Performance] FID:', entry.processingStart - entry.startTime);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                // FID not supported
            }
        }
    }

    // ===== INITIALIZE ALL OPTIMIZATIONS =====
    function init() {
        // Run immediately
        preloadCriticalResources();
        respectReducedMotion();
        
        // Run on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initLazyLoading();
                initVideoLazyLoading();
                deferNonCriticalCSS();
                preventLayoutShifts();
                optimizeAnimations();
                monitorPerformance();
            });
        } else {
            initLazyLoading();
            initVideoLazyLoading();
            deferNonCriticalCSS();
            preventLayoutShifts();
            optimizeAnimations();
            monitorPerformance();
        }

        console.log('[1142 Performance] Optimizer loaded');
    }

    // Start optimization
    init();

})();
