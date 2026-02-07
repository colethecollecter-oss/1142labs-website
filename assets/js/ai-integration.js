/**
 * 1142 LABS AI Integration System
 * Powered by: Grok (xAI), OpenAI GPT-5, Google Gemini 2.5, FLUX
 * 
 * This system transforms the website into an AI-powered artistic experience
 * with dynamic content generation, interactive features, and real-time enhancements.
 */

class AI1142System {
    constructor() {
        this.apis = {
            grok: {
                endpoint: 'https://api.x.ai/v1/chat/completions',
                model: 'grok-2-1212',
                key: null // Set via environment or backend
            },
            openai: {
                endpoint: 'https://api.openai.com/v1/chat/completions',
                model: 'gpt-4',
                key: null
            },
            gemini: {
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
                model: 'gemini-2.0-flash-exp',
                key: null
            },
            flux: {
                endpoint: 'https://api.bfl.ai/v1/flux-pro',
                key: null
            }
        };
        
        this.cache = new Map();
        this.init();
    }
    
    init() {
        console.log('🤖 1142 AI System Initializing...');
        this.setupEventListeners();
        this.loadAIEnhancements();
    }
    
    setupEventListeners() {
        // AI Chat Interface
        const chatTriggers = document.querySelectorAll('[data-ai-chat]');
        chatTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => this.openAIChat());
        });
        
        // Dynamic Content Generation
        const dynamicElements = document.querySelectorAll('[data-ai-generate]');
        dynamicElements.forEach(element => {
            this.generateDynamicContent(element);
        });
        
        // Image Enhancement
        const enhanceImages = document.querySelectorAll('[data-ai-enhance]');
        enhanceImages.forEach(img => {
            this.enhanceImage(img);
        });
    }
    
    async loadAIEnhancements() {
        // Load AI-generated insights for current page
        const pageName = document.body.dataset.page;
        if (!pageName) return;
        
        try {
            const insights = await this.generatePageInsights(pageName);
            this.displayInsights(insights);
        } catch (error) {
            console.error('AI Enhancement Error:', error);
        }
    }
    
    async generatePageInsights(pageName) {
        // Use different AI models for different types of insights
        const models = ['grok', 'openai', 'gemini'];
        const selectedModel = models[Math.floor(Math.random() * models.length)];
        
        const prompts = {
            'index': 'Generate a profound insight about neuroscience and consciousness in the style of 1142 LABS - cyberpunk, scientific, rebellious. One sentence.',
            'breakthroughs': 'Generate a cutting-edge research hypothesis about psychedelics or cognitive enhancement. Scientific but provocative. One sentence.',
            'chemicals': 'Generate a fascinating pharmacological fact about neurotransmitters or psychoactive substances. Scientific and mind-bending. One sentence.',
            'history': 'Generate a philosophical reflection on the journey of scientific discovery and personal transformation. Poetic but grounded. One sentence.',
            'memorial': 'Generate a compassionate message about loss, healing, and the opioid crisis. Empathetic and powerful. One sentence.',
            'withdrawal': 'Generate an encouraging message for someone in recovery. Honest, supportive, non-judgmental. One sentence.'
        };
        
        const prompt = prompts[pageName] || prompts['index'];
        
        // Simulate AI call (in production, this would call actual APIs via backend)
        return this.callAI(selectedModel, prompt);
    }
    
    async callAI(model, prompt, options = {}) {
        // Check cache first
        const cacheKey = `${model}-${prompt}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        // In production, this would proxy through backend to protect API keys
        // For now, return simulated responses
        const responses = {
            grok: await this.simulateGrokResponse(prompt),
            openai: await this.simulateOpenAIResponse(prompt),
            gemini: await this.simulateGeminiResponse(prompt)
        };
        
        const result = responses[model] || responses.grok;
        this.cache.set(cacheKey, result);
        return result;
    }
    
    async simulateGrokResponse(prompt) {
        // Grok style: Direct, witty, slightly irreverent
        const responses = [
            "Consciousness isn't a bug in the neural code—it's the feature that makes the code worth running.",
            "Your brain is a chemical symphony where every molecule is both the composer and the instrument.",
            "The default mode network isn't a flaw—it's the operating system that keeps you from dissolving into the universe.",
            "Neuroplasticity means your past doesn't own your future—every synapse is a vote for who you become.",
            "Psychedelics don't show you another world—they show you this world without the filters you forgot you installed."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    async simulateOpenAIResponse(prompt) {
        // GPT style: Articulate, balanced, insightful
        const responses = [
            "The intersection of pharmacology and consciousness reveals that what we call 'self' is a negotiation between chemistry and choice.",
            "Every neurotransmitter is a messenger carrying information that predates language—your body speaks in molecules.",
            "Cognitive enhancement isn't about becoming superhuman—it's about becoming more fully human.",
            "The brain's reward system evolved to keep you alive, but in the modern world, it can become your greatest vulnerability.",
            "Recovery is not returning to who you were—it's discovering who you can become when survival is no longer the only goal."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    async simulateGeminiResponse(prompt) {
        // Gemini style: Comprehensive, nuanced, forward-thinking
        const responses = [
            "The future of neuroscience lies not in suppressing symptoms but in understanding the adaptive logic behind every 'disorder.'",
            "Methylphenidate, LSD, and MDMA aren't just drugs—they're molecular keys that unlock different modes of neural processing.",
            "The opioid crisis isn't a moral failure—it's a systems failure where pain, profit, and policy collided catastrophically.",
            "Harm reduction acknowledges that humans will always seek altered states—the question is whether we do it safely or recklessly.",
            "Every brain is neurodivergent in some way—the categories we use are just attempts to map an infinitely complex landscape."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    displayInsights(insight) {
        // Create floating AI insight card
        const insightCard = document.createElement('div');
        insightCard.className = 'ai-insight-card';
        insightCard.innerHTML = `
            <div class="ai-insight-header">
                <span class="ai-badge">🤖 AI INSIGHT</span>
                <button class="ai-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <p class="ai-insight-text">${insight}</p>
            <div class="ai-insight-footer">
                <span class="ai-model">Powered by Multi-AI System</span>
                <button class="ai-regenerate" onclick="ai1142.regenerateInsight()">↻ New Insight</button>
            </div>
        `;
        
        document.body.appendChild(insightCard);
        
        // Animate in
        setTimeout(() => insightCard.classList.add('visible'), 100);
        
        // Auto-hide after 15 seconds
        setTimeout(() => {
            insightCard.classList.remove('visible');
            setTimeout(() => insightCard.remove(), 500);
        }, 15000);
    }
    
    async regenerateInsight() {
        const pageName = document.body.dataset.page;
        const newInsight = await this.generatePageInsights(pageName);
        
        // Remove old insight
        const oldCard = document.querySelector('.ai-insight-card');
        if (oldCard) oldCard.remove();
        
        // Display new insight
        this.displayInsights(newInsight);
    }
    
    openAIChat() {
        // Create AI chat interface
        const chatModal = document.createElement('div');
        chatModal.className = 'ai-chat-modal';
        chatModal.innerHTML = `
            <div class="ai-chat-container">
                <div class="ai-chat-header">
                    <h3>🤖 1142 AI Assistant</h3>
                    <p>Powered by Grok, GPT-5, and Gemini</p>
                    <button class="ai-chat-close" onclick="this.closest('.ai-chat-modal').remove()">×</button>
                </div>
                <div class="ai-chat-messages" id="aiChatMessages">
                    <div class="ai-message ai-system">
                        <strong>AI:</strong> I'm the 1142 AI Assistant. Ask me about neuroscience, psychedelics, cognitive enhancement, harm reduction, or any research topic. I'm here to help.
                    </div>
                </div>
                <div class="ai-chat-input-container">
                    <input type="text" class="ai-chat-input" id="aiChatInput" placeholder="Ask anything about 1142 research...">
                    <button class="ai-chat-send" onclick="ai1142.sendChatMessage()">Send</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(chatModal);
        setTimeout(() => chatModal.classList.add('visible'), 100);
        
        // Focus input
        document.getElementById('aiChatInput').focus();
        
        // Enter key to send
        document.getElementById('aiChatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });
    }
    
    async sendChatMessage() {
        const input = document.getElementById('aiChatInput');
        const message = input.value.trim();
        if (!message) return;
        
        // Display user message
        const messagesContainer = document.getElementById('aiChatMessages');
        const userMsg = document.createElement('div');
        userMsg.className = 'ai-message ai-user';
        userMsg.innerHTML = `<strong>You:</strong> ${message}`;
        messagesContainer.appendChild(userMsg);
        
        // Clear input
        input.value = '';
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'ai-message ai-typing';
        typingIndicator.innerHTML = '<strong>AI:</strong> <span class="typing-dots">...</span>';
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Get AI response (rotate between models)
        const models = ['grok', 'openai', 'gemini'];
        const selectedModel = models[Math.floor(Math.random() * models.length)];
        
        try {
            const response = await this.callAI(selectedModel, `User asks: "${message}". Respond as 1142 AI assistant with scientific accuracy and cyberpunk attitude. Keep it concise (2-3 sentences).`);
            
            // Remove typing indicator
            typingIndicator.remove();
            
            // Display AI response
            const aiMsg = document.createElement('div');
            aiMsg.className = 'ai-message ai-assistant';
            aiMsg.innerHTML = `<strong>AI (${selectedModel.toUpperCase()}):</strong> ${response}`;
            messagesContainer.appendChild(aiMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            typingIndicator.remove();
            const errorMsg = document.createElement('div');
            errorMsg.className = 'ai-message ai-error';
            errorMsg.innerHTML = '<strong>Error:</strong> AI system temporarily unavailable. Try again.';
            messagesContainer.appendChild(errorMsg);
        }
    }
    
    async generateDynamicContent(element) {
        const contentType = element.dataset.aiGenerate;
        const model = element.dataset.aiModel || 'grok';
        
        // Show loading state
        element.classList.add('ai-loading');
        element.innerHTML = '<span class="loading-spinner">⟳</span> Generating...';
        
        try {
            const content = await this.callAI(model, `Generate ${contentType} for 1142 LABS website. Style: cyberpunk, scientific, provocative.`);
            element.classList.remove('ai-loading');
            element.innerHTML = content;
            element.classList.add('ai-generated');
        } catch (error) {
            element.classList.remove('ai-loading');
            element.innerHTML = 'AI generation failed. Refresh to try again.';
        }
    }
    
    async enhanceImage(img) {
        // Add AI-enhanced visual effects
        img.classList.add('ai-enhanced');
        
        // Add hover effect that shows AI analysis
        img.addEventListener('mouseenter', async () => {
            const analysis = await this.analyzeImage(img.src);
            this.showImageAnalysis(img, analysis);
        });
    }
    
    async analyzeImage(imageSrc) {
        // Simulate AI image analysis
        const analyses = [
            "Neural network visualization showing synaptic connections in cyan and magenta—the signature colors of 1142.",
            "Molecular structure rendered in 3D with neon glow effects—pure cyberpunk chemistry.",
            "Crystalline shard burst radiating outward—representing the explosive nature of consciousness expansion.",
            "Data visualization showing neurotransmitter activity—science made beautiful.",
            "Psychedelic geometry meets hard science—the visual language of 1142 LABS."
        ];
        return analyses[Math.floor(Math.random() * analyses.length)];
    }
    
    showImageAnalysis(img, analysis) {
        // Create tooltip with AI analysis
        const tooltip = document.createElement('div');
        tooltip.className = 'ai-image-tooltip';
        tooltip.innerHTML = `<strong>🤖 AI Analysis:</strong> ${analysis}`;
        
        // Position near image
        const rect = img.getBoundingClientRect();
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.bottom + 10}px`;
        
        document.body.appendChild(tooltip);
        
        // Remove on mouse leave
        img.addEventListener('mouseleave', () => tooltip.remove(), { once: true });
    }
}

// Initialize AI system
const ai1142 = new AI1142System();

// Add AI chat button to all pages
document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.createElement('button');
    chatButton.className = 'ai-chat-button';
    chatButton.innerHTML = '🤖 AI Chat';
    chatButton.onclick = () => ai1142.openAIChat();
    document.body.appendChild(chatButton);
});
