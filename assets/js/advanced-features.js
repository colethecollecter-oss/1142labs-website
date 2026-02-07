/**
 * 1142 LABS - Advanced Features System
 * Adds cutting-edge interactive features to the website
 */

// ============================================
// 1. SITE-WIDE SEARCH FUNCTIONALITY
// ============================================

class SiteSearch {
    constructor() {
        this.searchIndex = [];
        this.init();
    }

    init() {
        this.createSearchUI();
        this.buildSearchIndex();
        this.attachEventListeners();
    }

    createSearchUI() {
        const searchHTML = `
            <div id="search-overlay" class="search-overlay">
                <div class="search-container">
                    <div class="search-header">
                        <input type="text" id="search-input" placeholder="Search 1142 LABS..." autocomplete="off">
                        <button id="search-close" class="search-close">✕</button>
                    </div>
                    <div id="search-results" class="search-results"></div>
                    <div class="search-footer">
                        <kbd>ESC</kbd> to close • <kbd>↑↓</kbd> to navigate • <kbd>ENTER</kbd> to open
                    </div>
                </div>
            </div>
            <button id="search-trigger" class="search-trigger" title="Search (Ctrl+K)">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        `;
        document.body.insertAdjacentHTML('beforeend', searchHTML);
    }

    buildSearchIndex() {
        // Index all pages
        this.searchIndex = [
            { title: 'Home', url: 'index.html', keywords: 'home main landing 1142 labs neuroscience', category: 'Navigation' },
            { title: 'About', url: 'about.html', keywords: 'about mission vision values team', category: 'Navigation' },
            { title: 'Research', url: 'research.html', keywords: 'research studies papers publications', category: 'Navigation' },
            { title: 'Breakthroughs', url: 'breakthroughs.html', keywords: 'breakthroughs discoveries findings methylphenidate LSD psychedelics', category: 'Research' },
            { title: 'Chemical Database', url: 'chemicals.html', keywords: 'chemicals substances drugs pharmacology methylphenidate LSD MDMA', category: 'Database' },
            { title: 'History', url: 'history.html', keywords: 'history timeline 2019 2020 2021 2022 2023 2024 2025 2026 founding', category: 'About' },
            { title: 'Gallery', url: 'gallery.html', keywords: 'gallery videos visuals cyberpunk art media', category: 'Media' },
            { title: 'Memorial', url: 'memorial.html', keywords: 'memorial katrina tribute opioid crisis harm reduction', category: 'About' },
            { title: 'Withdrawal Support', url: 'withdrawal-support.html', keywords: 'withdrawal support harm reduction taper protocol addiction', category: 'Resources' },
            { title: 'Calculator', url: 'calculator.html', keywords: 'calculator dose dosage computation tool', category: 'Tools' },
            { title: 'Posters', url: 'posters.html', keywords: 'posters graphics designs visual art', category: 'Media' },
            { title: 'Creators', url: 'creators.html', keywords: 'creators team cole everdark', category: 'About' },
            { title: 'Resources', url: 'resources.html', keywords: 'resources links tools help support', category: 'Resources' },
            // Research topics
            { title: 'Methylphenidate Research', url: 'breakthroughs.html#methylphenidate', keywords: 'methylphenidate ritalin adhd stimulant research', category: 'Research' },
            { title: 'LSD Studies', url: 'breakthroughs.html#lsd', keywords: 'LSD psychedelic consciousness memory archive', category: 'Research' },
            { title: 'ADHD', url: 'adhd.html', keywords: 'adhd attention deficit hyperactivity disorder', category: 'Disorders' },
            { title: 'Autism', url: 'autism.html', keywords: 'autism spectrum asd neurodiversity', category: 'Disorders' },
            { title: 'Depression', url: 'depression.html', keywords: 'depression mental health mood disorder', category: 'Disorders' },
            { title: 'PTSD', url: 'ptsd.html', keywords: 'ptsd trauma stress disorder', category: 'Disorders' }
        ];
    }

    attachEventListeners() {
        const trigger = document.getElementById('search-trigger');
        const overlay = document.getElementById('search-overlay');
        const input = document.getElementById('search-input');
        const close = document.getElementById('search-close');

        // Open search
        trigger.addEventListener('click', () => this.openSearch());
        
        // Keyboard shortcut (Ctrl+K or Cmd+K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                this.closeSearch();
            }
        });

        // Close search
        close.addEventListener('click', () => this.closeSearch());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeSearch();
        });

        // Search input
        input.addEventListener('input', (e) => this.performSearch(e.target.value));
    }

    openSearch() {
        const overlay = document.getElementById('search-overlay');
        const input = document.getElementById('search-input');
        overlay.classList.add('active');
        input.focus();
    }

    closeSearch() {
        const overlay = document.getElementById('search-overlay');
        overlay.classList.remove('active');
    }

    performSearch(query) {
        const resultsContainer = document.getElementById('search-results');
        
        if (!query.trim()) {
            resultsContainer.innerHTML = '<div class="search-empty">Start typing to search...</div>';
            return;
        }

        const results = this.searchIndex.filter(item => {
            const searchText = `${item.title} ${item.keywords}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        });

        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="search-empty">No results found</div>';
            return;
        }

        const resultsHTML = results.map(result => `
            <a href="${result.url}" class="search-result-item">
                <div class="search-result-category">${result.category}</div>
                <div class="search-result-title">${result.title}</div>
            </a>
        `).join('');

        resultsContainer.innerHTML = resultsHTML;
    }
}

// ============================================
// 2. READING PROGRESS BAR
// ============================================

class ReadingProgress {
    constructor() {
        this.init();
    }

    init() {
        const progressBar = document.createElement('div');
        progressBar.id = 'reading-progress';
        progressBar.className = 'reading-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => this.updateProgress());
    }

    updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;

        const progressBar = document.getElementById('reading-progress');
        if (progressBar) {
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
    }
}

// ============================================
// 3. SCROLL TO TOP BUTTON
// ============================================

class ScrollToTop {
    constructor() {
        this.init();
    }

    init() {
        const button = document.createElement('button');
        button.id = 'scroll-to-top';
        button.className = 'scroll-to-top';
        button.innerHTML = '↑';
        button.title = 'Scroll to top';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        });
    }
}

// ============================================
// 4. COPY CODE BUTTON
// ============================================

class CodeCopy {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('pre code').forEach(codeBlock => {
            const button = document.createElement('button');
            button.className = 'copy-code-btn';
            button.textContent = 'Copy';
            
            button.addEventListener('click', () => {
                navigator.clipboard.writeText(codeBlock.textContent);
                button.textContent = 'Copied!';
                setTimeout(() => button.textContent = 'Copy', 2000);
            });

            const pre = codeBlock.parentElement;
            pre.style.position = 'relative';
            pre.appendChild(button);
        });
    }
}

// ============================================
// 5. TABLE OF CONTENTS GENERATOR
// ============================================

class TableOfContents {
    constructor() {
        this.init();
    }

    init() {
        const headings = document.querySelectorAll('h2, h3');
        if (headings.length < 3) return; // Don't show TOC for short pages

        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<h4>On This Page</h4><ul id="toc-list"></ul>';

        const tocList = toc.querySelector('#toc-list');
        
        headings.forEach((heading, index) => {
            // Add ID to heading if it doesn't have one
            if (!heading.id) {
                heading.id = `heading-${index}`;
            }

            const li = document.createElement('li');
            li.className = heading.tagName.toLowerCase();
            
            const a = document.createElement('a');
            a.href = `#${heading.id}`;
            a.textContent = heading.textContent;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                heading.scrollIntoView({ behavior: 'smooth' });
            });

            li.appendChild(a);
            tocList.appendChild(li);
        });

        // Insert TOC after first paragraph
        const firstParagraph = document.querySelector('main p, .content-container p');
        if (firstParagraph) {
            firstParagraph.after(toc);
        }
    }
}

// ============================================
// 6. SHARE FUNCTIONALITY
// ============================================

class ShareButtons {
    constructor() {
        this.init();
    }

    init() {
        const shareContainer = document.createElement('div');
        shareContainer.className = 'share-buttons';
        shareContainer.innerHTML = `
            <button class="share-btn" data-platform="twitter" title="Share on Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
            </button>
            <button class="share-btn" data-platform="facebook" title="Share on Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
            </button>
            <button class="share-btn" data-platform="copy" title="Copy link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                </svg>
            </button>
        `;

        // Add to page
        const main = document.querySelector('main, .content-container');
        if (main) {
            main.insertBefore(shareContainer, main.firstChild);
        }

        // Attach event listeners
        shareContainer.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', () => this.share(btn.dataset.platform));
        });
    }

    share(platform) {
        const url = window.location.href;
        const title = document.title;

        switch(platform) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
                break;
        }
    }
}

// ============================================
// 7. EASTER EGG: KONAMI CODE
// ============================================

class KonamiCode {
    constructor() {
        this.sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        this.current = 0;
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            if (e.key === this.sequence[this.current]) {
                this.current++;
                if (this.current === this.sequence.length) {
                    this.activate();
                    this.current = 0;
                }
            } else {
                this.current = 0;
            }
        });
    }

    activate() {
        // Extreme glitch mode
        document.body.classList.add('konami-active');
        
        // Show message
        const message = document.createElement('div');
        message.className = 'konami-message';
        message.textContent = '🎮 KONAMI CODE ACTIVATED - EXTREME GLITCH MODE 🎮';
        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
            document.body.classList.remove('konami-active');
        }, 10000);
    }
}

// ============================================
// 8. PERFORMANCE MONITOR
// ============================================

class PerformanceMonitor {
    constructor() {
        if (window.location.search.includes('debug=true')) {
            this.init();
        }
    }

    init() {
        const monitor = document.createElement('div');
        monitor.id = 'perf-monitor';
        monitor.className = 'perf-monitor';
        document.body.appendChild(monitor);

        setInterval(() => this.update(), 1000);
    }

    update() {
        const monitor = document.getElementById('perf-monitor');
        if (!monitor) return;

        const memory = performance.memory ? (performance.memory.usedJSHeapSize / 1048576).toFixed(2) : 'N/A';
        const fps = this.calculateFPS();

        monitor.innerHTML = `
            <div>FPS: ${fps}</div>
            <div>Memory: ${memory} MB</div>
        `;
    }

    calculateFPS() {
        // Simplified FPS calculation
        return Math.round(1000 / 16.67); // Assuming 60fps
    }
}

// ============================================
// INITIALIZE ALL FEATURES
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    new SiteSearch();
    new ReadingProgress();
    new ScrollToTop();
    new CodeCopy();
    new TableOfContents();
    new ShareButtons();
    new KonamiCode();
    new PerformanceMonitor();

    console.log('%c1142 LABS', 'font-size: 40px; font-weight: bold; background: linear-gradient(135deg, #00FFFF, #FF00FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
    console.log('%cAdvanced Features Loaded ✓', 'color: #00FFFF; font-size: 14px;');
    console.log('%cTry pressing Ctrl+K to search!', 'color: #94A3B8; font-size: 12px;');
});
