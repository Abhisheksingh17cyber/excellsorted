// PowerPoint Pro - Enhanced JavaScript
class PowerPointPro {
    constructor() {
        // Core properties
        this.currentSlide = 0;
        this.slides = [];
        this.currentTopic = '';
        this.currentTemplate = 'business';
        this.currentColorScheme = 'blue';
        this.presentationSettings = {
            slideCount: 10,
            includeImages: true,
            includeCharts: true,
            speakerNotes: true,
            autoAdvance: false,
            advanceInterval: 10
        };
        
        // Animation and UI state
        this.isGenerating = false;
        this.isFullscreen = false;
        this.isPlaying = false;
        this.playInterval = null;
        
        // Image database for smart imagery
        this.imageDatabase = {
            'climate change': ['🌍', '🌡️', '🌿', '♻️', '🌊', '⚡'],
            'digital marketing': ['📱', '💻', '📊', '🎯', '📈', '🔍'],
            'machine learning': ['🤖', '🧠', '⚙️', '📊', '🔬', '💡'],
            'business': ['💼', '📈', '💰', '🎯', '👥', '🏢'],
            'education': ['📚', '🎓', '🏫', '✏️', '💡', '👨‍🎓'],
            'healthcare': ['🏥', '⚕️', '💊', '🩺', '❤️', '🧬'],
            'technology': ['💻', '📱', '⚙️', '🔧', '💡', '🚀'],
            'finance': ['💰', '📊', '💳', '🏦', '📈', '💹'],
            'default': ['📊', '💡', '🎯', '📈', '✨', '🔍']
        };
        
        // Content templates
        this.contentTemplates = {
            introduction: {
                title: 'Introduction to {topic}',
                bullets: [
                    'Understanding {topic} is an important and evolving field',
                    'Understanding the fundamentals is essential',
                    'Current trends are shaping the future',
                    'Best practices lead to successful outcomes'
                ]
            },
            keyComponents: {
                title: 'Key Components',
                bullets: [
                    '{topic} consists of multiple important elements',
                    'Understanding the fundamentals is essential',
                    'Current trends are shaping the future',
                    'Best practices lead to successful outcomes'
                ]
            },
            benefits: {
                title: 'Benefits and Advantages',
                bullets: [
                    'How {topic} provides significant value',
                    'Improved efficiency and effectiveness',
                    'Cost reduction and optimization',
                    'Enhanced user experience and satisfaction'
                ]
            },
            challenges: {
                title: 'Challenges and Solutions',
                bullets: [
                    'Addressing common obstacles in {topic}',
                    'Strategic approaches to overcome difficulties',
                    'Industry best practices and methodologies',
                    'Future-proofing strategies and techniques'
                ]
            },
            applications: {
                title: 'Real-world Applications',
                bullets: [
                    '{topic} implementation in various industries',
                    'Case studies and success stories',
                    'Practical examples and use cases',
                    'Measurable outcomes and results'
                ]
            },
            future: {
                title: 'Future Outlook',
                bullets: [
                    'The evolution of {topic} in coming years',
                    'Emerging trends and technologies',
                    'Opportunities for growth and innovation',
                    'Strategic recommendations for success'
                ]
            }
        };
        
        this.init();
    }

    // Initialize the application
    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupSmoothScrolling();
        this.loadTheme();
        this.initializeNavigation();
        
        // Initial animations
        this.animateOnLoad();
        
        console.log('PowerPoint Pro initialized successfully!');
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Navigation
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Topic input
        const topicInput = document.getElementById('topicInput');
        if (topicInput) {
            topicInput.addEventListener('input', (e) => this.handleTopicInput(e));
            topicInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.generatePresentation();
                }
            });
        }

        // Template selection
        document.querySelectorAll('.template-option').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectTemplate(e));
        });

        // Color scheme selection
        document.querySelectorAll('.color-option').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectColorScheme(e));
        });

        // Advanced settings
        const slideCount = document.getElementById('slideCount');
        if (slideCount) {
            slideCount.addEventListener('change', (e) => {
                this.presentationSettings.slideCount = parseInt(e.target.value);
            });
        }

        document.getElementById('includeImages')?.addEventListener('change', (e) => {
            this.presentationSettings.includeImages = e.target.checked;
        });

        document.getElementById('includeCharts')?.addEventListener('change', (e) => {
            this.presentationSettings.includeCharts = e.target.checked;
        });

        document.getElementById('speakerNotes')?.addEventListener('change', (e) => {
            this.presentationSettings.speakerNotes = e.target.checked;
        });

        // Generate button
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generatePresentation());
        }

        // Presentation viewer controls
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const playBtn = document.getElementById('playBtn');
        const settingsBtn = document.getElementById('settingsBtn');

        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        if (playBtn) {
            playBtn.addEventListener('click', () => this.toggleSlideshow());
        }

        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }

        // Slide navigation
        const prevSlide = document.getElementById('prevSlide');
        const nextSlide = document.getElementById('nextSlide');

        if (prevSlide) {
            prevSlide.addEventListener('click', () => this.previousSlide());
        }

        if (nextSlide) {
            nextSlide.addEventListener('click', () => this.nextSlide());
        }

        // Speaker notes toggle
        const toggleNotes = document.getElementById('toggleNotes');
        if (toggleNotes) {
            toggleNotes.addEventListener('click', () => this.toggleSpeakerNotes());
        }

        // Download buttons
        document.getElementById('downloadPPT')?.addEventListener('click', () => this.downloadPresentation('ppt'));
        document.getElementById('downloadPDF')?.addEventListener('click', () => this.downloadPresentation('pdf'));
        document.getElementById('downloadImages')?.addEventListener('click', () => this.downloadPresentation('images'));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Contact form
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }

        // Modal handling
        this.setupModalHandlers();

        // Settings modal
        this.setupSettingsModal();
    }

    // Navigation functionality
    initializeNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href');
                this.scrollToSection(target);
                this.setActiveNavLink(e.target);
            });
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', () => this.updateActiveNavLink());
    }

    // Smooth scrolling to sections
    scrollToSection(target) {
        const element = document.querySelector(target);
        if (element) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const elementPosition = element.offsetTop - navHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    // Set active navigation link
    setActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    // Update active nav link based on scroll position
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const scrollPos = window.scrollY + navHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                const activeLink = document.querySelector(`[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Theme Management
    toggleTheme() {
        const currentTheme = document.body.dataset.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);
        
        // Update theme toggle icon
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        this.showNotification(`${newTheme === 'dark' ? 'Dark' : 'Light'} theme activated`, 'success');
    }

    // Load saved theme
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.dataset.theme = savedTheme;
        
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Handle topic input
    handleTopicInput(e) {
        const value = e.target.value;
        const charCounter = document.querySelector('.char-counter');
        
        if (charCounter) {
            charCounter.textContent = `${value.length}/100`;
        }
        
        // Enable/disable generate button
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.disabled = value.trim().length < 3;
        }
    }

    // Template selection
    selectTemplate(e) {
        const button = e.currentTarget;
        const template = button.dataset.template;
        
        // Update active state
        document.querySelectorAll('.template-option').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        this.currentTemplate = template;
        
        this.showNotification(`${template.charAt(0).toUpperCase() + template.slice(1)} template selected`, 'info');
    }

    // Color scheme selection
    selectColorScheme(e) {
        const button = e.currentTarget;
        const color = button.dataset.color;
        
        // Update active state
        document.querySelectorAll('.color-option').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        this.currentColorScheme = color;
        
        this.showNotification(`${color.charAt(0).toUpperCase() + color.slice(1)} color scheme selected`, 'info');
    }

    // Main presentation generation
    async generatePresentation() {
        const topicInput = document.getElementById('topicInput');
        const topic = topicInput?.value.trim();
        
        if (!topic || topic.length < 3) {
            this.showNotification('Please enter a valid topic (at least 3 characters)', 'error');
            return;
        }
        
        this.currentTopic = topic;
        this.isGenerating = true;
        
        // Show loading state
        this.showLoadingState();
        this.showProgressPanel();
        
        // Simulate AI generation process
        await this.simulateAIGeneration();
        
        // Generate slides
        this.generateSlideContent();
        
        // Show presentation viewer
        this.showPresentationViewer();
        
        this.isGenerating = false;
        
        // Track analytics
        console.log('Presentation generated:', {
            topic: this.currentTopic,
            template: this.currentTemplate,
            colorScheme: this.currentColorScheme,
            slideCount: this.presentationSettings.slideCount
        });
    }

    // Show loading state
    showLoadingState() {
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.classList.add('loading');
            generateBtn.disabled = true;
        }
    }

    // Hide loading state
    hideLoadingState() {
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.classList.remove('loading');
            generateBtn.disabled = false;
        }
    }

    // Show progress panel
    showProgressPanel() {
        const progressPanel = document.getElementById('progressPanel');
        if (progressPanel) {
            progressPanel.style.display = 'block';
            progressPanel.classList.add('fade-in');
        }
    }

    // Hide progress panel
    hideProgressPanel() {
        const progressPanel = document.getElementById('progressPanel');
        if (progressPanel) {
            progressPanel.style.display = 'none';
        }
    }

    // Simulate AI generation process
    async simulateAIGeneration() {
        const steps = [
            { step: 1, text: 'Analyzing your topic...', duration: 2000 },
            { step: 2, text: 'Creating slide structure...', duration: 2500 },
            { step: 3, text: 'Adding smart images...', duration: 2000 },
            { step: 4, text: 'Finalizing presentation...', duration: 1500 }
        ];
        
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            
            // Update progress step
            this.updateProgressStep(step.step);
            
            // Update progress text
            if (progressText) {
                progressText.textContent = step.text;
            }
            
            // Update progress bar
            if (progressFill) {
                progressFill.style.width = `${(step.step / steps.length) * 100}%`;
            }
            
            // Wait for step duration
            await new Promise(resolve => setTimeout(resolve, step.duration));
        }
    }

    // Update progress step visual state
    updateProgressStep(stepNumber) {
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNum < stepNumber) {
                step.classList.add('completed');
            } else if (stepNum === stepNumber) {
                step.classList.add('active');
            }
        });
    }

    // Generate slide content
    generateSlideContent() {
        this.slides = [];
        const slideCount = this.presentationSettings.slideCount;
        
        // Title slide
        this.slides.push({
            id: 0,
            type: 'title',
            title: this.currentTopic,
            subtitle: `A comprehensive overview of ${this.currentTopic}`,
            speakerNotes: `Welcome to this presentation on ${this.currentTopic}. Today we'll explore the key aspects, benefits, and future implications of this important topic.`
        });
        
        // Content slides
        const templates = Object.keys(this.contentTemplates);
        for (let i = 1; i < slideCount; i++) {
            const templateKey = templates[(i - 1) % templates.length];
            const template = this.contentTemplates[templateKey];
            
            this.slides.push({
                id: i,
                type: 'content',
                title: template.title.replace('{topic}', this.currentTopic),
                bullets: template.bullets.map(bullet => 
                    bullet.replace('{topic}', this.currentTopic)
                ),
                image: this.getSmartImage(this.currentTopic),
                speakerNotes: this.generateSpeakerNotes(templateKey, this.currentTopic)
            });
        }
        
        console.log('Generated slides:', this.slides);
    }

    // Get smart image for topic
    getSmartImage(topic) {
        const topicLower = topic.toLowerCase();
        
        for (const [key, emojis] of Object.entries(this.imageDatabase)) {
            if (topicLower.includes(key)) {
                return emojis[Math.floor(Math.random() * emojis.length)];
            }
        }
        
        return this.imageDatabase.default[Math.floor(Math.random() * this.imageDatabase.default.length)];
    }

    // Generate speaker notes
    generateSpeakerNotes(templateKey, topic) {
        const notes = {
            introduction: `Introduce the concept of ${topic} and its relevance. Explain why this topic is important in today's context.`,
            keyComponents: `Discuss the main elements that make up ${topic}. Break down complex concepts into understandable parts.`,
            benefits: `Highlight the advantages and positive outcomes of implementing ${topic}. Use specific examples where possible.`,
            challenges: `Address common obstacles and provide practical solutions. Share best practices from industry experience.`,
            applications: `Provide real-world examples of ${topic} in action. Discuss different use cases and scenarios.`,
            future: `Look ahead at emerging trends and future developments in ${topic}. Discuss potential opportunities and challenges.`
        };
        
        return notes[templateKey] || `Discuss the key points related to ${topic} and engage with your audience.`;
    }

    // Show presentation viewer
    showPresentationViewer() {
        // Hide progress panel and loading
        this.hideProgressPanel();
        this.hideLoadingState();
        
        // Show viewer section
        const viewer = document.getElementById('presentationViewer');
        if (viewer) {
            viewer.style.display = 'block';
            viewer.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Set presentation title
        const titleElement = document.getElementById('presentationTitle');
        if (titleElement) {
            titleElement.textContent = this.currentTopic;
        }
        
        // Generate thumbnails
        this.generateThumbnails();
        
        // Generate progress dots
        this.generateProgressDots();
        
        // Show first slide
        this.currentSlide = 0;
        this.showSlide(0);
        
        this.showNotification('Presentation generated successfully!', 'success');
    }

    // Generate slide thumbnails
    generateThumbnails() {
        const container = document.getElementById('slideThumbnails');
        if (!container) return;
        
        container.innerHTML = this.slides.map((slide, index) => `
            <div class="slide-thumbnail ${index === 0 ? 'active' : ''}" 
                 data-slide="${index}" 
                 onclick="powerPointPro.goToSlide(${index})">
                <div class="thumbnail-content">
                    <h4>${slide.title}</h4>
                    <span>Slide ${index + 1}</span>
                </div>
            </div>
        `).join('');
    }

    // Generate progress dots
    generateProgressDots() {
        const container = document.getElementById('progressDots');
        if (!container) return;
        
        container.innerHTML = this.slides.map((_, index) => `
            <div class="progress-dot ${index === 0 ? 'active' : ''}" 
                 data-slide="${index}" 
                 onclick="powerPointPro.goToSlide(${index})">
            </div>
        `).join('');
    }

    // Show specific slide
    showSlide(index) {
        if (index < 0 || index >= this.slides.length) return;
        
        const slide = this.slides[index];
        const container = document.getElementById('slideContainer');
        
        if (!container) return;
        
        // Update slide content
        container.innerHTML = this.renderSlideContent(slide);
        
        // Update thumbnails
        document.querySelectorAll('.slide-thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
        
        // Update progress dots
        document.querySelectorAll('.progress-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Update counter
        const counter = document.getElementById('slideCounter');
        if (counter) {
            counter.textContent = `${index + 1} / ${this.slides.length}`;
        }
        
        // Update navigation buttons
        this.updateNavigationButtons(index);
        
        // Update speaker notes
        this.updateSpeakerNotes(slide);
        
        this.currentSlide = index;
    }

    // Render slide content
    renderSlideContent(slide) {
        if (slide.type === 'title') {
            return `
                <div class="slide title-slide">
                    <h1>${slide.title}</h1>
                    <p class="subtitle">${slide.subtitle}</p>
                </div>
            `;
        } else {
            return `
                <div class="slide content-slide">
                    <div class="slide-content">
                        <h2>${slide.title}</h2>
                        <ul>
                            ${slide.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                        </ul>
                    </div>
                    ${this.presentationSettings.includeImages ? `
                        <div class="slide-visual">
                            <div class="visual-content">${slide.image}</div>
                            <span>Visual Content</span>
                        </div>
                    ` : ''}
                </div>
            `;
        }
    }

    // Update navigation buttons
    updateNavigationButtons(index) {
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');
        
        if (prevBtn) {
            prevBtn.disabled = index === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = index === this.slides.length - 1;
        }
    }

    // Update speaker notes
    updateSpeakerNotes(slide) {
        const notesContainer = document.getElementById('speakerNotesContent');
        if (notesContainer && this.presentationSettings.speakerNotes) {
            notesContainer.textContent = slide.speakerNotes || 'No speaker notes available for this slide.';
        }
    }

    // Navigation methods
    goToSlide(index) {
        this.showSlide(index);
    }

    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.showSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.showSlide(this.currentSlide - 1);
        }
    }

    // Fullscreen toggle
    toggleFullscreen() {
        const viewer = document.getElementById('presentationViewer');
        if (!viewer) return;
        
        if (!this.isFullscreen) {
            if (viewer.requestFullscreen) {
                viewer.requestFullscreen();
            } else if (viewer.webkitRequestFullscreen) {
                viewer.webkitRequestFullscreen();
            } else if (viewer.msRequestFullscreen) {
                viewer.msRequestFullscreen();
            }
            
            viewer.classList.add('fullscreen');
            this.isFullscreen = true;
            
            // Update fullscreen button
            const fullscreenBtn = document.getElementById('fullscreenBtn');
            if (fullscreenBtn) {
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                fullscreenBtn.title = 'Exit Fullscreen';
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            
            viewer.classList.remove('fullscreen');
            this.isFullscreen = false;
            
            // Update fullscreen button
            const fullscreenBtn = document.getElementById('fullscreenBtn');
            if (fullscreenBtn) {
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                fullscreenBtn.title = 'Fullscreen';
            }
        }
    }

    // Slideshow toggle
    toggleSlideshow() {
        if (!this.isPlaying) {
            this.startSlideshow();
        } else {
            this.stopSlideshow();
        }
    }

    // Start slideshow
    startSlideshow() {
        this.isPlaying = true;
        const playBtn = document.getElementById('playBtn');
        
        if (playBtn) {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playBtn.title = 'Pause Slideshow';
        }
        
        this.playInterval = setInterval(() => {
            if (this.currentSlide < this.slides.length - 1) {
                this.nextSlide();
            } else {
                this.stopSlideshow(); // Stop at end
            }
        }, this.presentationSettings.advanceInterval * 1000);
        
        this.showNotification('Slideshow started', 'info');
    }

    // Stop slideshow
    stopSlideshow() {
        this.isPlaying = false;
        const playBtn = document.getElementById('playBtn');
        
        if (playBtn) {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            playBtn.title = 'Play Slideshow';
        }
        
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
        
        this.showNotification('Slideshow stopped', 'info');
    }

    // Toggle speaker notes
    toggleSpeakerNotes() {
        const notesPanel = document.getElementById('speakerNotesPanel');
        const toggleBtn = document.getElementById('toggleNotes');
        
        if (notesPanel && toggleBtn) {
            const isVisible = notesPanel.style.display !== 'none';
            
            notesPanel.style.display = isVisible ? 'none' : 'block';
            toggleBtn.innerHTML = isVisible ? 
                '<i class="fas fa-eye"></i>' : 
                '<i class="fas fa-eye-slash"></i>';
        }
    }

    // Download presentation
    downloadPresentation(format) {
        const filename = `${this.currentTopic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_presentation.${format}`;
        
        // Simulate download
        const link = document.createElement('a');
        link.href = `data:text/plain;charset=utf-8,PowerPoint Pro - ${this.currentTopic} - ${format.toUpperCase()} format`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification(`${format.toUpperCase()} downloaded successfully!`, 'success');
        
        // Track download
        console.log('Download:', { format, topic: this.currentTopic, slideCount: this.slides.length });
    }

    // Settings modal
    openSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    // Setup settings modal
    setupSettingsModal() {
        const modal = document.getElementById('settingsModal');
        const closeBtn = modal?.querySelector('.close-modal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }
        
        // Auto-advance setting
        const autoAdvance = document.getElementById('autoAdvance');
        if (autoAdvance) {
            autoAdvance.addEventListener('change', (e) => {
                this.presentationSettings.autoAdvance = e.target.checked;
            });
        }
        
        // Advance interval
        const intervalSlider = document.getElementById('advanceInterval');
        const intervalDisplay = document.getElementById('intervalDisplay');
        
        if (intervalSlider && intervalDisplay) {
            intervalSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                this.presentationSettings.advanceInterval = value;
                intervalDisplay.textContent = `${value}s`;
            });
        }
        
        // Show notes setting
        const showNotes = document.getElementById('showNotes');
        if (showNotes) {
            showNotes.addEventListener('change', (e) => {
                const notesPanel = document.getElementById('speakerNotesPanel');
                if (notesPanel) {
                    notesPanel.style.display = e.target.checked ? 'block' : 'none';
                }
            });
        }
    }

    // Modal handlers
    setupModalHandlers() {
        // Close modals on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
        
        // Close modals on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });
    }

    // Keyboard shortcuts
    handleKeyboardShortcuts(e) {
        if (document.getElementById('presentationViewer').style.display === 'block') {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'f':
                case 'F':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleFullscreen();
                    }
                    break;
                case 'p':
                case 'P':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleSlideshow();
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.slides.length - 1);
                    break;
            }
        }
    }

    // Contact form handling
    handleContactForm(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        this.showNotification('Thank you! Your message has been sent successfully.', 'success');
        
        // Reset form
        e.target.reset();
        
        console.log('Contact form submitted:', data);
    }

    // Intersection Observer for animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.feature-card, .template-showcase, .stat-item').forEach(element => {
            observer.observe(element);
        });
    }

    // Smooth scrolling setup
    setupSmoothScrolling() {
        // Add smooth scrolling to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Initial page animations
    animateOnLoad() {
        // Animate hero elements
        setTimeout(() => {
            document.querySelector('.hero-title')?.classList.add('fade-in');
        }, 300);
        
        setTimeout(() => {
            document.querySelector('.hero-subtitle')?.classList.add('fade-in');
        }, 600);
        
        setTimeout(() => {
            document.querySelector('.hero-features')?.classList.add('fade-in');
        }, 900);
        
        setTimeout(() => {
            document.querySelector('.cta-button')?.classList.add('fade-in');
        }, 1200);
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: this.getNotificationColor(type),
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '500',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease-out',
            fontSize: '0.9rem'
        });
        
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Get notification icon
    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // Get notification color
    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    // Analytics and tracking
    trackEvent(event, data = {}) {
        console.log('Track event:', event, data);
        
        // In a real application, you would send this to your analytics service
        if (typeof gtag !== 'undefined') {
            gtag('event', event, data);
        }
    }

    // Utility methods
    debounce(func, wait) {
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

    // Error handling
    handleError(error, context = '') {
        console.error(`PowerPoint Pro Error ${context}:`, error);
        this.showNotification('An error occurred. Please try again.', 'error');
    }

    // Cleanup methods
    destroy() {
        // Clean up event listeners and intervals
        if (this.playInterval) {
            clearInterval(this.playInterval);
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyboardShortcuts);
        
        console.log('PowerPoint Pro destroyed');
    }
}

// CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;
document.head.appendChild(notificationStyles);

// Initialize the application
const powerPointPro = new PowerPointPro();

// Make it globally accessible for onclick handlers
window.powerPointPro = powerPointPro;

// Global initialization function for HTML
window.initializePowerPointPro = function() {
    console.log('PowerPoint Pro initialized successfully!');
    // Additional initialization code if needed
    powerPointPro.init();
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PowerPointPro;
}

// Handle page unload
window.addEventListener('beforeunload', () => {
    powerPointPro.destroy();
});
