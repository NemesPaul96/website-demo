// Portfolio Website JavaScript - Optimized Version

class PortfolioApp {
    constructor() {
        this.currentTheme = this.getInitialTheme();
        this.currentLang = localStorage.getItem('language') || 'en';
        this.isUserInteracting = false;
        this.autoSlideInterval = null;
        this.autoSlideTimeout = null;
        this.ticking = false;
        this.isPageVisible = true;
        this.isSliderPaused = false; // Track global slider pause state
        
        // Cache frequently used DOM elements
        this.elements = {};
        this.init();
    }

    getInitialTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }

        const currentHour = new Date().getHours();
        // Light mode between 7 AM (7) and 8 PM (20)
        if (currentHour >= 7 && currentHour < 20) {
            return 'light';
        } else {
            return 'dark';
        }
    }
    
    init() {
        this.cacheElements();
        this.setTheme(this.currentTheme);
        this.setLanguage(this.currentLang);
        this.bindEvents();
        this.handleScrolling();
        this.updateActiveNavLink();
        
        // Initialize sliders only if elements exist
        if (this.elements.sliderTrack) this.initProjectsSlider();
        if (this.elements.servicesSliderTrack) this.initServicesSlider();
        if (this.elements.beforeAfterSlider) this.initMultiBeforeAfterSlider();
    }
    
    cacheElements() {
        // Cache frequently accessed DOM elements
        this.elements = {
            // Navigation
            themeToggle: document.getElementById('themeToggle'),
            langToggle: document.getElementById('langToggle'),
            langMegaMenu: document.getElementById('langMegaMenu'),
            mobileMenuToggle: document.getElementById('mobileMenuToggle'),
            mobileMenu: document.getElementById('mobileMenu'),
            navbar: document.querySelector('.navbar'),
            
            // Sliders
            sliderTrack: document.getElementById('sliderTrack'),
            sliderArrowLeft: document.getElementById('sliderArrowLeft'),
            sliderArrowRight: document.getElementById('sliderArrowRight'),
            servicesSliderTrack: document.getElementById('servicesSliderTrack'),
            servicesSliderArrowLeft: document.getElementById('servicesSliderArrowLeft'),
            servicesSliderArrowRight: document.getElementById('servicesSliderArrowRight'),
            
            // Before-after slider
            beforeAfterSlider: document.getElementById('beforeAfterSlider'),
			beforeImage: document.getElementById('beforeImage'),
			afterImage: document.getElementById('afterImage'),
			sliderHandle: document.getElementById('sliderHandle'),
			sliderTitle: document.getElementById('sliderTitle'),
			sliderControlBtn: document.getElementById('sliderControlBtn'),
            
            // Hero elements
            heroGreeting: document.querySelector('.hero-greeting'),
            heroName: document.querySelector('.hero-name'),
            heroRole: document.querySelector('.hero-role'),
            heroDescription: document.querySelector('.hero-description'),
            viewWorkBtn: document.querySelector('.btn-primary'),
            getInTouchBtn: document.querySelector('.btn-secondary'),
            
            // Language elements
            langText: document.querySelector('.lang-text'),
            langFlag: document.querySelector('.lang-flag-nav'),
            megaTitle: document.querySelector('.lang-mega-title')
        };
    }
    
    initProjectsSlider() {
        const { sliderTrack, sliderArrowLeft, sliderArrowRight } = this.elements;
        
        let currentSlide = 0;
        const maxSlide = 2;
        
        sliderArrowLeft.disabled = true;
        
        const updateSlider = () => {
            const translateX = -(currentSlide * 102);
            sliderTrack.style.transform = `translateX(${translateX}%)`;
            sliderArrowLeft.disabled = currentSlide === 0;
            sliderArrowRight.disabled = currentSlide >= maxSlide;
        };
        
        sliderArrowLeft.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlider();
            }
        });
        
        sliderArrowRight.addEventListener('click', () => {
            if (currentSlide < maxSlide) {
                currentSlide++;
                updateSlider();
            }
        });
        
        updateSlider();
    }
    
    initServicesSlider() {
        const { servicesSliderTrack, servicesSliderArrowLeft, servicesSliderArrowRight } = this.elements;
        
        let currentSlide = 0;
        const maxSlide = 3;
        
        servicesSliderArrowLeft.disabled = true;
        
        const updateSlider = () => {
            const translateX = -(currentSlide * 102);
            servicesSliderTrack.style.transform = `translateX(${translateX}%)`;
            servicesSliderArrowLeft.disabled = currentSlide === 0;
            servicesSliderArrowRight.disabled = currentSlide >= maxSlide;
        };
        
        servicesSliderArrowLeft.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlider();
            }
        });
        
        servicesSliderArrowRight.addEventListener('click', () => {
            if (currentSlide < maxSlide) {
                currentSlide++;
                updateSlider();
            }
        });
        
        updateSlider();
    }
    
    bindEvents() {
        // Theme toggle
        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Language switcher
        if (this.elements.langToggle && this.elements.langMegaMenu) {
            this.elements.langToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleLanguageMegaMenu();
            });
            
            // Language options
            document.querySelectorAll('.lang-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.setLanguage(item.getAttribute('data-lang'));
                    this.closeLangMegaMenu();
                });
            });
        }
        
        // Mega-menu toggles
        ['blog', 'projects', 'services'].forEach(menuType => {
            const toggle = document.getElementById(`${menuType}Toggle`);
            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleMegaMenu(menuType);
                });
            }
        });
        
        // Mobile menu
        if (this.elements.mobileMenuToggle) {
            this.elements.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Mobile menu links
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Navigation links with smooth scrolling
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
        
        // Global click handler for closing menus
        document.addEventListener('click', (e) => {
            const isNavClick = e.target.closest('.nav-link-dropdown') || e.target.closest('.lang-btn');
            const isMegaMenuClick = e.target.closest('.blog-mega-menu') || 
                                  e.target.closest('.projects-mega-menu') || 
                                  e.target.closest('.services-mega-menu') ||
                                  e.target.closest('.lang-mega-menu');
            const isMobileMenuClick = e.target.closest('.mobile-menu') || e.target.closest('.mobile-menu-toggle');
            
            if (!isNavClick && !isMegaMenuClick) {
                this.closeAllMegaMenus();
            }
            
            if (!isMobileMenuClick) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        
        if (this.elements.themeToggle) {
            this.elements.themeToggle.setAttribute('aria-label', 
                theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
            );
        }
        
        // Update AI image based on theme
        const aiImage = document.querySelector('.ai-image');
        if (aiImage) {
            aiImage.src = theme === 'light' ? 'images/skills/Ai-light.svg' : 'images/skills/Ai-dark.svg';
        }
    }
    
    toggleLanguageMegaMenu() {
        const { langToggle, langMegaMenu } = this.elements;
        const isCurrentlyOpen = langToggle.classList.contains('active');
        
        if (isCurrentlyOpen) {
            langToggle.classList.remove('active');
            langMegaMenu.classList.remove('show');
        } else {
            this.closeAllMegaMenus();
            langToggle.classList.add('active');
            langMegaMenu.classList.add('show');
        }
    }
    
    closeLangMegaMenu() {
        const { langToggle, langMegaMenu } = this.elements;
        langToggle.classList.remove('active');
        langMegaMenu.classList.remove('show');
    }
    
    toggleMegaMenu(menuType) {
        const toggle = document.getElementById(`${menuType}Toggle`);
        const megaMenu = document.getElementById(`${menuType}MegaMenu`);
        
        if (toggle && megaMenu) {
            const isCurrentlyOpen = toggle.classList.contains('active');
            
            if (isCurrentlyOpen) {
                toggle.classList.remove('active');
                megaMenu.classList.remove('show');
            } else {
                this.closeAllMegaMenus();
                toggle.classList.add('active');
                megaMenu.classList.add('show');
            }
        }
    }
    
    closeAllMegaMenus() {
        const { langToggle, langMegaMenu } = this.elements;
        if (langToggle && langMegaMenu) {
            langToggle.classList.remove('active');
            langMegaMenu.classList.remove('show');
        }
        
        ['blog', 'projects', 'services'].forEach(menu => {
            const toggle = document.getElementById(`${menu}Toggle`);
            const megaMenu = document.getElementById(`${menu}MegaMenu`);
            
            if (toggle && megaMenu) {
                toggle.classList.remove('active');
                megaMenu.classList.remove('show');
            }
        });
    }
    
    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        
        // Update active language option - ensure only one is active
        document.querySelectorAll('.lang-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class only to the selected language
        const selectedLangItem = document.querySelector(`.lang-item[data-lang="${lang}"]`);
        if (selectedLangItem) {
            selectedLangItem.classList.add('active');
        }
        
        // Update language button
        const { langText, langFlag } = this.elements;
        if (langText && langFlag) {
            const langConfig = {
                'en': { code: 'EN', flag: 'images/language/us-flag.svg', alt: 'US Flag' },
                'ro': { code: 'RO', flag: 'images/language/ro-flag.svg', alt: 'Romanian Flag' },
                'es': { code: 'ES', flag: 'images/language/es-flag.svg', alt: 'Spanish Flag' },
                'fr': { code: 'FR', flag: 'images/language/fr-flag.svg', alt: 'French Flag' }
            };
            
            const config = langConfig[lang] || langConfig['en'];
            langText.textContent = config.code;
            langFlag.src = config.flag;
            langFlag.alt = config.alt;
        }
        
        this.loadLanguageContent(lang);
    }
    
    loadLanguageContent(lang) {
        const content = {
            en: {
                greeting: "Hello, I'm",
                role: "Frontend Developer",
                description: "I specialize in <strong>re:designing</strong> outdated websites into modern, responsive, and user-friendly experiences. Transforming old web presence into cutting-edge digital solutions.",
                viewWork: "View My Work",
                getInTouch: "Get In Touch",
                nav: {
                    home: "Home",
                    blog: "Blog",
                    projects: "Projects",
                    services: "Services",
                    contact: "Contact"
                }
            },
            ro: {
                greeting: "Salut, sunt",
                role: "Dezvoltator Frontend",
                description: "Mă specializez în <strong>re:proiectarea</strong> site-urilor web învechite în experiențe moderne, responsive și ușor de utilizat. Transform prezența web veche în soluții digitale de ultimă generație.",
                viewWork: "Vezi Munca Mea",
                getInTouch: "Ia Legătura",
                nav: {
                    home: "Acasă",
                    blog: "Blog",
                    projects: "Proiecte",
                    services: "Servicii",
                    contact: "Contact"
                }
            },
            es: {
                greeting: "Hola, soy",
                role: "Desarrollador Frontend",
                description: "Me especializo en <strong>re:diseñar</strong> sitios web obsoletos en experiencias modernas, responsivas y fáciles de usar. Transformando la presencia web antigua en soluciones digitales de vanguardia.",
                viewWork: "Ver Mi Trabajo",
                getInTouch: "Contactar",
                nav: {
                    home: "Inicio",
                    blog: "Blog",
                    projects: "Proyectos",
                    services: "Servicios",
                    contact: "Contacto"
                }
            },
            fr: {
                greeting: "Bonjour, je suis",
                role: "Développeur Frontend",
                description: "Je me spécialise dans la <strong>re:conception</strong> de sites web obsolètes en expériences modernes, responsives et conviviales. Transformer l'ancienne présence web en solutions numériques de pointe.",
                viewWork: "Voir Mon Travail",
                getInTouch: "Me Contacter",
                nav: {
                    home: "Accueil",
                    blog: "Blog",
                    projects: "Projets",
                    services: "Services",
                    contact: "Contact"
                }
            }
        };
        
        const langContent = content[lang] || content.en;
        
        // Update hero section
        const { heroGreeting, heroName, heroRole, heroDescription, viewWorkBtn, getInTouchBtn } = this.elements;
        
        // NEVER touch any hero elements - they contain the typewriter effect and custom content
        // if (heroGreeting) heroGreeting.textContent = langContent.greeting;
        // if (heroRole && !heroRole.querySelector('.txt-type')) {
        //     heroRole.textContent = langContent.role;
        // }
        // if (heroDescription && !heroDescription.querySelector('.tech-icon')) {
        //     heroDescription.innerHTML = langContent.description;
        // }
        if (viewWorkBtn) viewWorkBtn.textContent = langContent.viewWork;
        if (getInTouchBtn) getInTouchBtn.textContent = langContent.getInTouch;
        
        // Update navigation
        const navLinks = document.querySelectorAll('.nav-link');
        const navOrder = ['home', 'blog', 'projects', 'services', 'contact'];
        
        navLinks.forEach((link, index) => {
            const navKey = navOrder[index];
            if (navKey && langContent.nav[navKey]) {
                const textElement = link.querySelector('.nav-text');
                const fallbackElement = link.querySelector('.nav-text-fallback');
                
                if (textElement) textElement.textContent = langContent.nav[navKey];
                if (fallbackElement) fallbackElement.textContent = langContent.nav[navKey];
            }
        });
        
        // Update mega menu title
        const { megaTitle } = this.elements;
        if (megaTitle) {
            const titles = {
                'en': 'Choose Your Language',
                'ro': 'Alege Limba',
                'es': 'Elige Tu Idioma',
                'fr': 'Choisissez Votre Langue'
            };
            megaTitle.textContent = titles[lang] || titles['en'];
        }
    }
    
    toggleMobileMenu() {
        const { mobileMenuToggle, mobileMenu } = this.elements;
        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('show');
        }
    }
    
    closeMobileMenu() {
        const { mobileMenuToggle, mobileMenu } = this.elements;
        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('show');
        }
    }
    
    handleScrolling() {
        const handleScroll = () => {
            if (!this.ticking && this.isPageVisible) {
                requestAnimationFrame(() => {
                    this.updateActiveNavLink();
                    this.updateNavbarBackground();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Optimize performance when page is not visible
        document.addEventListener('visibilitychange', () => {
            this.isPageVisible = !document.hidden;
            if (!this.isPageVisible) {
                // Pause only the slider when page is not visible
                if (this.autoSlideInterval) {
                    clearInterval(this.autoSlideInterval);
                    this.autoSlideInterval = null;
                }
            }
        });
    }
    
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        if (window.scrollY < 100) {
            current = 'home';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    updateNavbarBackground() {
        const { navbar } = this.elements;
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = 'var(--bg-primary)';
                navbar.style.boxShadow = '0 2px 10px var(--shadow-light)';
            } else {
                navbar.style.backgroundColor = 'var(--bg-primary)';
                navbar.style.boxShadow = 'none';
            }
        }
    }
    
    initMultiBeforeAfterSlider() {
        const { beforeAfterSlider, beforeImage, afterImage, sliderHandle, sliderTitle, sliderControlBtn } = this.elements;
        
        if (!beforeAfterSlider || !beforeImage || !afterImage || !sliderHandle) return;
        
        // Check if mobile device
        const isMobile = window.innerWidth <= 768;
        
        const imageSets = isMobile ? [
            {
                before: 'images/projects/ironcraft-mobile-before-full-page.jpg',
                after: 'images/projects/ironcraft-mobile-after-full-page.jpg',
                title: 'Ironcraft Website Redesign'
            }
        ] : [
            {
                before: 'images/projects/ironcraft-before.png',
                after: 'images/projects/ironcraft-after.png',
                title: 'Ironcraft Website Redesign'
            },
            {
                before: 'images/projects/traffic-tamers-before.png',
                after: 'images/projects/traffic-tamers-after.png',
                title: 'Traffic Tamers Website Redesign'
            }
        ];
        
        let currentSetIndex = 0;
        let isDragging = false;
        let startY = 0;
        let startTop = 0;
        let startX = 0;
        let startLeft = 0;
        let slideDirection = 1;
        
         // Mobile-specific variables
         let beforeImageScrollProgress = 0;
         let beforeImageScrollDirection = 1;
         let afterImageScrollProgress = 0;
         let afterImageScrollDirection = 1;
         let isBeforeImageScrolling = true;
         let isAfterImageRevealed = false;
         let isAfterImageScrolling = false;
         let isTransitioning = false; // Prevent conflicts during transitions
        let isSliderPaused = false; // Track if slider is paused by user
        
        // Initialize slider control button
        if (sliderControlBtn) {
            sliderControlBtn.addEventListener('click', () => {
                this.isSliderPaused = !this.isSliderPaused;
                isSliderPaused = this.isSliderPaused; // Update local variable
                
                if (this.isSliderPaused) {
                    // Pause only the slider
                    stopAutoSlide();
                    sliderControlBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                } else {
                    // Resume the slider from beginning
                    resetSlider();
                    startAutoSlide();
                    sliderControlBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                }
            });
        }
        

        
        const updateSlider = (position) => {
            if (isMobile) {
                // Mobile: vertical movement
                position = Math.max(-1, Math.min(101, position));
                sliderHandle.style.top = `${position}%`;
                
                const clampedPosition = Math.max(0, Math.min(100, position));
                afterImage.style.clipPath = `polygon(0 0, 100% 0, 100% ${clampedPosition}%, 0 ${clampedPosition}%)`;
            } else {
                // Desktop: horizontal movement
                position = Math.max(-1, Math.min(101, position));
                sliderHandle.style.left = `${position}%`;
                
                const clampedPosition = Math.max(0, Math.min(100, position));
                afterImage.style.clipPath = `polygon(0 0, ${clampedPosition}% 0, ${clampedPosition}% 100%, 0 100%)`;
            }
        };
        
            const updateImageScroll = (progress) => {
            // Update object-position for smooth scrolling effect
            const scrollPosition = progress * 100; // Convert to percentage
            
            if (isBeforeImageScrolling) {
                beforeImage.style.objectPosition = `center ${scrollPosition}%`;
            }
            // Note: After image scrolling is handled separately in the main loop
        };
        
        const changeBeforeImage = (index) => {
            const set = imageSets[index];
            beforeImage.src = set.before;
            if (sliderTitle) sliderTitle.textContent = set.title;
            
             // Reset mobile scroll state
             if (isMobile) {
                 beforeImageScrollProgress = 0;
                 beforeImageScrollDirection = 1;
                 afterImageScrollProgress = 0;
                 afterImageScrollDirection = 1;
                 isBeforeImageScrolling = true;
                 isAfterImageRevealed = false;
                 isAfterImageScrolling = false;
                 updateImageScroll(0);
                 updateSlider(0);
             }
        };
        
        const changeAfterImage = (index) => {
            const set = imageSets[index];
            afterImage.src = set.after;
        };
        
                         const resetSlider = () => {
            // Reset slider to initial state
            if (isMobile) {
                beforeImageScrollProgress = 0;
                beforeImageScrollDirection = 1;
                afterImageScrollProgress = 0;
                afterImageScrollDirection = 1;
                isBeforeImageScrolling = true;
                isAfterImageRevealed = false;
                isAfterImageScrolling = false;
                updateImageScroll(0);
                updateSlider(0);
            } else {
                currentSetIndex = 0;
                slideDirection = 1;
                changeBeforeImage(0);
                changeAfterImage(0);
                updateSlider(0);
            }
        };
        
        const startAutoSlide = () => {
            if (this.isUserInteracting || this.autoSlideInterval || isSliderPaused) return;
             
             this.autoSlideInterval = setInterval(() => {
                 if (isMobile && !isTransitioning) {
                     // Mobile-specific logic
                                           if (isBeforeImageScrolling) {
                          // Scroll the before image (10832px height)
                          const beforeImageHeight = 10832;
                          const viewportHeight = window.innerHeight;
                          const maxScroll = beforeImageHeight - viewportHeight;
                          
                          // Calculate scroll position in pixels
                          const currentScrollPixels = beforeImageScrollProgress * maxScroll;
                          
                          if (beforeImageScrollDirection === 1) {
                              // Scrolling down
                              beforeImageScrollProgress += 0.015; // Increased speed for faster scrolling
                              
                              if (beforeImageScrollProgress >= 1) {
                                  beforeImageScrollProgress = 1;
                                  // Wait 1 second at bottom
                                  setTimeout(() => {
                                      beforeImageScrollDirection = -1; // Start scrolling back up
                                  }, 1000);
                              }
                          } else {
                              // Scrolling up - much faster to get to after image quicker
                              beforeImageScrollProgress -= 0.035; // 2.3x faster than down speed
                              
                              if (beforeImageScrollProgress <= 0) {
                                  beforeImageScrollProgress = 0;
                                  // Wait 1 second at top, then start after image reveal
                                  setTimeout(() => {
                                      isBeforeImageScrolling = false;
                                      isAfterImageRevealed = true;
                                      // Ensure after image starts from the top
                                      afterImage.style.objectPosition = 'center 0%';
                                  }, 1000);
                              }
                          }
                          
                          updateImageScroll(beforeImageScrollProgress);
                            } else if (isAfterImageRevealed && !isAfterImageScrolling) {
                            // Reveal after image with handle (7737px height, 8 seconds)
                            const currentTop = parseFloat(sliderHandle.style.top) || 0;
                            
                            // Calculate reveal speed: 100px per second
                            // For 8 seconds total, we need to move 100% in 8 seconds
                            // So speed = 100% / 8 seconds = 12.5% per second
                            // With 150ms interval: 12.5% * 0.15 = 1.875% per interval
                            const revealSpeed = 1.875; // Much faster reveal
                            const newTop = currentTop + revealSpeed;
                            
                            if (newTop >= 100) {
                                updateSlider(100);
                                // Continue scrolling smoothly without stopping
                                isAfterImageScrolling = true;
                                afterImageScrollProgress = 0;
                                afterImageScrollDirection = 1;
                            } else {
                                updateSlider(newTop);
                            }
                                                 } else if (isAfterImageScrolling) {
                             // Scroll the after image through its full height (7737px) - same speed as reveal
                             const afterImageHeight = 7737;
                             const viewportHeight = window.innerHeight;
                             
                             if (afterImageScrollDirection === 1) {
                                 // Scrolling down - same speed as reveal (1.875% per interval)
                                 afterImageScrollProgress += 0.01875; // Same speed as reveal
                                 
                                 if (afterImageScrollProgress >= 1) {
                                     afterImageScrollProgress = 1;
                                     // Wait 1 second at bottom of image
                                     setTimeout(() => {
                                         afterImageScrollDirection = -1; // Start scrolling back up
                                     }, 1000);
                                 }
                             } else {
                                 // Scrolling up - same speed
                                 afterImageScrollProgress -= 0.01875; // Same speed as reveal
                                 
                                 if (afterImageScrollProgress <= 0) {
                                     afterImageScrollProgress = 0;
                                     // Wait 1 second at top, then restart cycle
                                     setTimeout(() => {
                                         isAfterImageScrolling = false;
                                         isAfterImageRevealed = false;
                                         isBeforeImageScrolling = true;
                                         beforeImageScrollProgress = 0;
                                         beforeImageScrollDirection = 1;
                                         // Hide after image smoothly
                                         updateSlider(0);
                                     }, 1000);
                                 }
                             }
                             
                             // Calculate the actual scroll position for the full image height
                             const scrollPosition = afterImageScrollProgress * (afterImageHeight - viewportHeight);
                             const percentagePosition = (scrollPosition / (afterImageHeight - viewportHeight)) * 100;
                             afterImage.style.objectPosition = `center ${percentagePosition}%`;
                             
                             // Handle position logic: when scrolling down, keep at 100%
                             // When scrolling up, move handle down smoothly as image scrolls up
                             if (afterImageScrollDirection === 1) {
                                 // Scrolling down - keep handle at 100%
                                 updateSlider(100);
                             } else {
                                 // Scrolling up - move handle down smoothly
                                 // Calculate handle position based on scroll progress
                                 const handlePosition = afterImageScrollProgress * 100;
                                 updateSlider(handlePosition);
                             }
                         }
                } else {
                    // Desktop logic - horizontal movement
                    const currentLeft = parseFloat(sliderHandle.style.left) || 0;
                    let newLeft = currentLeft + (slideDirection * 1.0);
                    
                    if (newLeft >= 101) {
                        newLeft = 101;
                        slideDirection = -1;
                        
                        const nextSetIndex = (currentSetIndex + 1) % imageSets.length;
                        currentSetIndex = nextSetIndex;
                        changeBeforeImage(nextSetIndex);
                        
                    } else if (newLeft <= -1) {
                        newLeft = -1;
                        slideDirection = 1;
                        changeAfterImage(currentSetIndex);
                    }
                    
                    updateSlider(newLeft);
                }
                            }, 80); // Optimized interval for better performance
        };
        
        const stopAutoSlide = () => {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        };
        
        const pauseAutoSlide = () => {
            this.isUserInteracting = true;
            stopAutoSlide();
        };
        
        const resumeAutoSlide = () => {
            this.isUserInteracting = false;
            if (this.autoSlideTimeout) {
                clearTimeout(this.autoSlideTimeout);
            }
            this.autoSlideTimeout = setTimeout(() => {
                if (!this.isUserInteracting && !isSliderPaused) {
                    startAutoSlide();
                }
            }, 3000);
        };
        
        // Mouse events
        const handleMouseDown = (e) => {
            isDragging = true;
            if (isMobile) {
                startY = e.clientY;
                startTop = parseFloat(sliderHandle.style.top) || 0;
            } else {
                startX = e.clientX;
                startLeft = parseFloat(sliderHandle.style.left) || 0;
            }
            pauseAutoSlide();
            sliderHandle.style.cursor = isMobile ? 'grabbing' : 'grabbing';
        };
        
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            if (isMobile) {
                const deltaY = e.clientY - startY;
                const sliderRect = beforeAfterSlider.getBoundingClientRect();
                const deltaPercent = (deltaY / sliderRect.height) * 100;
                const newTop = startTop + deltaPercent;
                updateSlider(newTop);
            } else {
                const deltaX = e.clientX - startX;
                const sliderRect = beforeAfterSlider.getBoundingClientRect();
                const deltaPercent = (deltaX / sliderRect.width) * 100;
                const newLeft = startLeft + deltaPercent;
                updateSlider(newLeft);
            }
        };
        
        const handleMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                sliderHandle.style.cursor = isMobile ? 'ns-resize' : 'ew-resize';
                resumeAutoSlide();
            }
        };
        
        // Touch events
        const handleTouchStart = (e) => {
            isDragging = true;
            if (isMobile) {
                startY = e.touches[0].clientY;
                startTop = parseFloat(sliderHandle.style.top) || 0;
            } else {
                startX = e.touches[0].clientX;
                startLeft = parseFloat(sliderHandle.style.left) || 0;
            }
            pauseAutoSlide();
            sliderHandle.style.cursor = isMobile ? 'grabbing' : 'grabbing';
        };
        
        const handleTouchMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            if (isMobile) {
                const deltaY = e.touches[0].clientY - startY;
                const sliderRect = beforeAfterSlider.getBoundingClientRect();
                const deltaPercent = (deltaY / sliderRect.height) * 100;
                const newTop = startTop + deltaPercent;
                updateSlider(newTop);
            } else {
                const deltaX = e.touches[0].clientX - startX;
                const sliderRect = beforeAfterSlider.getBoundingClientRect();
                const deltaPercent = (deltaX / sliderRect.width) * 100;
                const newLeft = startLeft + deltaPercent;
                updateSlider(newLeft);
            }
        };
        
        const handleTouchEnd = () => {
            if (isDragging) {
                isDragging = false;
                sliderHandle.style.cursor = isMobile ? 'ns-resize' : 'ew-resize';
                resumeAutoSlide();
            }
        };
        
        // Add event listeners
        sliderHandle.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        sliderHandle.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
        
        beforeAfterSlider.addEventListener('mouseenter', pauseAutoSlide);
        beforeAfterSlider.addEventListener('mouseleave', resumeAutoSlide);
        
        // Initialize slider
        updateSlider(0);
        changeBeforeImage(0);
        changeAfterImage(0);
        
        // Set initial handle position
        if (isMobile) {
            sliderHandle.style.top = '0%';
        } else {
            sliderHandle.style.left = '0%';
        }
        
                 // Initialize mobile scroll state
         if (isMobile) {
             beforeImageScrollProgress = 0;
             beforeImageScrollDirection = 1;
             afterImageScrollProgress = 0;
             afterImageScrollDirection = 1;
             isBeforeImageScrolling = true;
             isAfterImageRevealed = false;
             isAfterImageScrolling = false;
             updateImageScroll(0);
         }
        
                         // Start auto slide after 3 seconds delay
        setTimeout(() => {
            if (!this.isUserInteracting) {
                startAutoSlide();
            }
        }, 3000);
        
        // Store cleanup function
        this.cleanupSlider = () => {
            stopAutoSlide();
            if (this.autoSlideTimeout) {
                clearTimeout(this.autoSlideTimeout);
            }
            

            
            sliderHandle.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            sliderHandle.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            beforeAfterSlider.removeEventListener('mouseenter', pauseAutoSlide);
            beforeAfterSlider.removeEventListener('mouseleave', resumeAutoSlide);
        };
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    
    // Force home active state on page load
    setTimeout(() => {
        const homeLink = document.querySelector('.nav-link-home');
        if (homeLink && window.scrollY < 100) {
            homeLink.classList.add('active');
        }
    }, 500);
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (app.cleanupSlider) {
            app.cleanupSlider();
        }
        // Clear any remaining timeouts
        if (app.autoSlideTimeout) {
            clearTimeout(app.autoSlideTimeout);
        }
        if (app.autoSlideInterval) {
            clearInterval(app.autoSlideInterval);
        }

    });
    
    // Optimized hero animations with reduced frequency
    const heroElements = document.querySelectorAll('.hero-greeting, .hero-name, .hero-role, .hero-description');
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 200 + (index * 200));
    });
    
    // Font Awesome fallback check (optimized)
    setTimeout(() => {
        const homeIcon = document.querySelector('.nav-link-home .nav-icon');
        const homeFallback = document.querySelector('.nav-link-home .nav-text-fallback');
        
        if (homeIcon && homeFallback) {
            const rect = homeIcon.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                homeIcon.classList.add('hide-icon');
                homeFallback.classList.add('show-fallback');
            }
        }
    }, 1500);
});

// Optimized Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    if (animateElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    // Unobserve after animation to save resources
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        animateElements.forEach(el => observer.observe(el));
    }
});

// ===== PORTFOLIO SKILLS FUNCTIONALITY =====
 $(document).ready(function() {
        

        // Create moving dots with random speeds and directions
        function createMovingDots() {
            $('.dot-container').each(function() {
                const dot = $('<div class="moving-dot"></div>');
                $(this).append(dot);
                
                // Random direction (forward or backward)
                const direction = Math.random() > 0.5 ? 'forward' : 'backward';
                
                // Random speed between 2s and 5s
                const duration = (Math.random() * 3 + 2) + 's'; 
                
                // Set animation
                const animationName = direction === 'forward' ? 'move-dot-forward' : 'move-dot-backward';
                dot.css({
                    'animation': `${animationName} ${duration} linear infinite`
                });
            });
        }

        // Create circular layout
        function createCircularLayout() {
            // Coding skills
            const codingSkills = [
                {title: "HTML5", content: "html-desc", color: "#E34C26", img: "images/skills/HTML5.svg"},
                {title: "CSS3", content: "css-desc", color: "#0083de", img: "images/skills/CSS3.svg"},
                {title: "JavaScript", content: "js-desc", color: "#f8dc3d", img: "images/skills/javascript6.svg"},
                {title: "PHP", content: "php-desc", color: "#9aa0c6", img: "images/skills/php.svg"},
                {title: "SASS", content: "sass-desc", color: "#cd6799", img: "images/skills/sass.svg"},
                {title: "NODEJS", content: "nodejs-desc", color: "#8cc84b", img: "images/skills/nodejs.svg"},
                {title: "REACT", content: "react-desc", color: "#00d8ff", img: "images/skills/react.svg"},
                {title: "PYTHON", content: "python-desc", color: "#3776AB", img: "images/skills/python.svg"},
                {title: "KOTLIN", content: "kotlin-desc", color: "#007396", img: "images/skills/kotlin.svg"},
                //{title: "C#", content: "csharp-desc", color: "#68217A", img: "images/skills/"},
                //{title: "RUBY", content: "ruby-desc", color: "#CC342D", img: "images/skills/"},
                //{title: "GO", content: "go-desc", color: "#00ADD8", img: "images/skills/"},
                //{title: "SWIFT", content: "swift-desc", color: "#F05138", img: "images/skills/"},
                //{title: "RUST", content: "rust-desc", color: "#DEA584", img: "images/skills/"}
            ];
            
            // Software skills
            const softwareSkills = [
                {title: "ARTIFICIAL INTELIGENCE", content: "ai-desc", color: "#19a9d8", img: "images/skills/Ai-dark.svg"},
                {title: "BOOTSTRAP", content: "bootstrap-desc", color: "#8f4cce", img: "images/skills/bootstrap.svg"},
                {title: "PHOTOSHOP", content: "photoshop-desc", color: "#31a8ff", img: "images/skills/photoshop.svg"},
                {title: "FIGMA", content: "figma-desc", color: "#392372", img: "images/skills/figma.svg", iconClass:"icon-figma"},
                {title: "CANVA", content: "canva-desc", color: "#3293d7", img: "images/skills/canva.svg", iconClass:"icon-canva"},
                {title: "WORDPRESS", content: "wordpress-desc", color: "#21759b", img: "images/skills/wordpress.svg", iconClass:"icon-wordpress"},
                {title: "GITHUB", content: "github-desc", color: "#dc4b36", img: "images/skills/github.svg"},
                {title: "MAIL CHIMP", content: "mail-chimp-desc", color: "#2496ED", img: "images/skills/mailchimp.svg"},
                {title: "AWS", content: "aws-desc", color: "#FF9900", img: "images/skills/aws-white.svg"},
                //{title: "AZURE", content: "azure-desc", color: "#0089D6", img: "images/skills/"},
                {title: "LINUX", content: "linux-desc", color: "#FCC624", img: "images/skills/linux.svg"},
                {title: "XAMPP", content: "xampp-desc", color: "#4479A1", img: "images/skills/xampp.svg"},
                {title: "GODOT", content: "godot-desc", color: "#47A248", img: "images/skills/godot.svg"},
                {title: "ANDROID STUDIO", content: "android-studio-desc", color: "#DC382D", img: "images/skills/android-studio.svg"}
            ];
            
            // Create coding circle
            createCircle("#coding-circle", codingSkills);
            
            // Create software circle
            createCircle("#software-circle", softwareSkills);
        }
        
        function createCircle(containerId, skills) {
            const container = $(containerId);
            const radius = 220; // Increased radius to accommodate spacing
            const centerX = container.width() / 2;
            const centerY = container.height() / 2;
            
            // Clear container
            container.empty();
            
            // Create skills and position them in a circle
            skills.forEach((skill, index) => {
                const angle = (index * (2 * Math.PI / skills.length)) - (Math.PI / 2); // Start from top
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                const iconClass = skill.iconClass || '';// Get the class, or an empty string if it's not defined
                const skillElement = $(`
                    <div class="skill" data-title="${skill.title}" data-content="${skill.content}" data-color="${skill.color}" style="--border-color: ${skill.color}">
                        <div class="skill-img">
                            <img src="${skill.img}" alt="${skill.title}" class="${iconClass}">
                        </div>
                        <div class="dot-container"></div>
                    </div>
                `);
                
                // Set initial position
                skillElement.css({
                    left: x + 'px',
                    top: y + 'px'
                });
                
                container.append(skillElement);
            });
        }
        
        // Position all skills in a circle
        function positionSkillsInCircle(container) {
            const skills = container.find('.skill');
            const radius = 220; // Increased radius to accommodate spacing
            const centerX = container.width() / 2;
            const centerY = container.height() / 2;
            
            skills.each(function(index) {
                const angle = (index * (2 * Math.PI / skills.length)) - (Math.PI / 2);
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                
                $(this).css({
                    left: x + 'px',
                    top: y + 'px'
                });
            });
        }
        
        // Move a skill to center and arrange others in circle
        function moveToCenter(clickedSkill, container) {
            const skills = container.find('.skill');
            const centerX = container.width() / 2;
            const centerY = container.height() / 2;
            const radius = 220; // Increased radius to accommodate spacing
            
            // Remove center class from all skills
            skills.removeClass('center');
            
            // Add center class to clicked skill
            clickedSkill.addClass('center');
            
            // Get index of clicked skill
            const clickedIndex = skills.index(clickedSkill);
            
            // Reposition all skills
            skills.each(function(index) {
                if ($(this).is(clickedSkill)) {
                    // Move to center
                    $(this).css({
                        left: centerX + 'px',
                        top: centerY + 'px'
                    });
                } else {
                    // Calculate new position in circle
                    // Adjust index to account for the clicked skill being removed from the circle
                    let adjustedIndex = index;
                    if (index > clickedIndex) adjustedIndex--;
                    
                    const angle = (adjustedIndex * (2 * Math.PI / (skills.length - 1))) - (Math.PI / 2);
                    const x = centerX + radius * Math.cos(angle);
                    const y = centerY + radius * Math.sin(angle);
                    
                    $(this).css({
                        left: x + 'px',
                        top: y + 'px'
                    });
                }
            });
        }
        
        // Reset to circular layout
        function resetToCircle(container) {
            const skills = container.find('.skill');
            const radius = 220; // Increased radius to accommodate spacing
            const centerX = container.width() / 2;
            const centerY = container.height() / 2;
            
            // Remove center class from all skills
            skills.removeClass('center');
            
            // Reposition all skills in a circle
            skills.each(function(index) {
                const angle = (index * (2 * Math.PI / skills.length)) - (Math.PI / 2);
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                
                $(this).css({
                    left: x + 'px',
                    top: y + 'px'
                });
            });
        }

        // Initial animations
        function circleInitialAnimation() {
            $(".skill").each(function(index) {
                $(this).velocity({
                    translateX: "-50%",
                    translateY: "-50%",
                    scale: 1,
                    opacity: 1
                }, {
                    duration: 600,
                    delay: index * 100,
                    easing: "easeOutBack"
                });
            });
        }

        // Hexagon click handler
        $("body").on("click", ".skill", function() {
            const titleColor = $(this).data("color");
            const titleName = $(this).data("title");
            const descName = $(this).data("content");
            const $section = $(this).closest('section.skills');
            const $skillInfo = $section.find('.skill-info');
            const $container = $(this).closest('.circle-container');
            
            // Target elements within the same section
            const $codeDescription = $section.find('.skill-description');
            const $codeTitle = $section.find('.skill-title');
            const $currentActive = $section.find('.desc-active');
            const $newDesc = $section.find(`.${descName}`);
            
            // Check if we're clicking the active hexagon
            if ($(this).hasClass('skill-active')) {
                // Close active description
                $currentActive.velocity("transition.slideRightBigOut", {
                    duration: 300,
                    complete: function() {
                        $currentActive.removeClass('desc-active');
                    }
                });
                
                // Remove active state and reset to circle
                $(this).removeClass('skill-active');
                resetToCircle($container);
                return;
            }
            
            // Toggle active class on clicked hexagon
            $section.find('.skill').removeClass('skill-active');
            $(this).addClass('skill-active');
            
            // Move to center
            moveToCenter($(this), $container);
            
            // Reset scroll indicator
            $skillInfo.removeClass('can-scroll-down');
            
            // If there's a current active description, animate it out
            if ($currentActive.length > 0) {
                $currentActive.velocity("transition.slideRightBigOut", {
                    duration: 300,
                    complete: function() {
                        $currentActive.removeClass('desc-active');
                        showNewDescription($newDesc, $codeTitle, titleName, titleColor, $codeDescription);
                    }
                });
            } else {
                // No current description - just show the new one
                showNewDescription($newDesc, $codeTitle, titleName, titleColor, $codeDescription);
            }
        });
        
        function showNewDescription($newDesc, $codeTitle, titleName, titleColor, $codeDescription) {
            // Prepare and show new description
            $newDesc
                .addClass('desc-active')
                .css({ display: 'block', opacity: 0 })
                .velocity("transition.slideRightBigIn", {
                    duration: 400,
                    opacity: 1
                });
            
            // Update title
            $codeTitle.text(titleName).css({ color: titleColor });
            
            // Refresh scroll position
            $codeDescription.scrollTop(0);
			
			 // Show scroll indicator immediately
			$codeDescription.closest('.skill-info').find('.scroll-indicator').css('opacity', 1);
		
            handleScroll();
			handleScrollIndicator();
        }

        // Scroll handling for fade effect
        function handleScroll() {
            $('.skill-description').each(function() {
                const $container = $(this);
                const $codeDisplay = $container.closest('.skill-info');
                const scrollBottom = this.scrollHeight - $container.scrollTop() - $container.outerHeight();
                $codeDisplay.toggleClass('can-scroll-down', scrollBottom > 10);
            });
        }

		// Scroll handling for indicator fade
		function handleScrollIndicator() {
			$('.skill-description').each(function() {
				const $container = $(this);
				const $scrollIndicator = $container.closest('.skill-info').find('.scroll-indicator');
				
				if ($container.find('.desc-active').length === 0) return;
				
				const scrollPosition = $container.scrollTop();
				const containerHeight = $container.outerHeight();
				const contentHeight = $container[0].scrollHeight;
				const distanceToBottom = contentHeight - (scrollPosition + containerHeight);
				const threshold = 20; // Pixels from bottom where fade starts
				
				// Fade out when near bottom, fade in when not
				if (distanceToBottom <= threshold) {
					$scrollIndicator.css('opacity', '0');
				} else {
					$scrollIndicator.css('opacity', '1');
				}
			});
		}


        // Initialize scroll handlers
        $('.skill-description')
			.on('scroll', function() {
				handleScroll();
				handleScrollIndicator();
			})
			.trigger('scroll');

        // Initialize animations
        createCircularLayout();
        setTimeout(function() {
            circleInitialAnimation();
        }, 300);
        
        
        
        // Create moving dots
        createMovingDots();
        
        // Handle window resize
        $(window).resize(function() {
            $('.circle-container').each(function() {
                positionSkillsInCircle($(this));
            });
        });
    });


    // ===== PROJECTS SLIDER FUNCTIONALITY =====


    // ===== SHOWCASE SECTION FUNCTIONALITY =====
    function initShowcaseSliders() {
        const sliders = document.querySelectorAll('.before-after-container');
        
        sliders.forEach((slider, index) => {
            let isDragging = false;
            let startX = 0;
            let startLeft = 0;
            
            const handle = slider.querySelector('.slider-handle');
            const afterImage = slider.querySelector('.after-image');
            
            if (!handle || !afterImage) return;
            
            function updateSlider(position) {
                // Ensure position is always within bounds to prevent any bouncing
                const clampedPosition = Math.max(0, Math.min(100, position));
                afterImage.style.clipPath = `polygon(${clampedPosition}% 0, 100% 0, 100% 100%, ${clampedPosition}% 100%)`;
                handle.style.left = `${clampedPosition}%`;
            }
            
            function handleMouseDown(e) {
                isDragging = true;
                startX = e.clientX;
                startLeft = parseFloat(handle.style.left) || 50;
                slider.style.cursor = 'grabbing';
                e.preventDefault();
            }
            
            function handleMouseMove(e) {
                if (!isDragging) return;
                
                const deltaX = e.clientX - startX;
                const sliderRect = slider.getBoundingClientRect();
                const deltaPercent = (deltaX / sliderRect.width) * 100;
                const newLeft = startLeft + deltaPercent;
                
                // Clamp the position to prevent bouncing
                const clampedLeft = Math.max(0, Math.min(100, newLeft));
                updateSlider(clampedLeft);
            }
            
            function handleMouseUp() {
                if (isDragging) {
                    isDragging = false;
                    slider.style.cursor = 'ew-resize';
                }
            }
            
            function handleTouchStart(e) {
                isDragging = true;
                startX = e.touches[0].clientX;
                startLeft = parseFloat(handle.style.left) || 50;
                slider.style.cursor = 'grabbing';
            }
            
            function handleTouchMove(e) {
                if (!isDragging) return;
                e.preventDefault();
                
                const deltaX = e.touches[0].clientX - startX;
                const sliderRect = slider.getBoundingClientRect();
                const deltaPercent = (deltaX / sliderRect.width) * 100;
                const newLeft = startLeft + deltaPercent;
                
                // Clamp the position to prevent bouncing
                const clampedLeft = Math.max(0, Math.min(100, newLeft));
                updateSlider(clampedLeft);
            }
            
            function handleTouchEnd() {
                if (isDragging) {
                    isDragging = false;
                    slider.style.cursor = 'ew-resize';
                }
            }
            
            // Event listeners
            handle.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            
            handle.addEventListener('touchstart', handleTouchStart, { passive: false });
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
            
            // Initialize at 50% (middle position)
            updateSlider(50);
        });
    }
    
    function initLoadMore() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const hiddenItems = document.querySelectorAll('.showcase-item.hidden');
        let loadedCount = 0;
        const itemsToLoad = 2; // Load 2 items at a time
        
        if (!loadMoreBtn || hiddenItems.length === 0) return;
        
        loadMoreBtn.addEventListener('click', async () => {
            // Show loading state
            loadMoreBtn.classList.add('loading');
            
            // Simulate loading delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Load items
            const itemsToShow = Array.from(hiddenItems).slice(loadedCount, loadedCount + itemsToLoad);
            
            itemsToShow.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.remove('hidden');
                    item.classList.add('animate-in');
                    
                    // Initialize slider for the new item
                    const slider = item.querySelector('.before-after-container');
                    if (slider) {
                        initShowcaseSliders();
                    }
                }, index * 200);
            });
            
            loadedCount += itemsToLoad;
            
            // Hide button if no more items
            if (loadedCount >= hiddenItems.length) {
                loadMoreBtn.style.display = 'none';
                const loadMoreText = document.querySelector('.load-more-text');
                loadMoreText.textContent = 'All projects loaded!';
                
                // After 5 seconds, replace text with animated button
                setTimeout(() => {
                    loadMoreText.style.opacity = '0';
                    loadMoreText.style.transform = 'translateY(-20px)';
                    
                    setTimeout(() => {
                        loadMoreText.innerHTML = `
                            <a href="/projects" class="view-all-projects-btn">
                                <span class="btn-content">
                                    <i class="fa-solid fa-arrow-right"></i>
                                    <span class="btn-text">View All Projects</span>
                                </span>
                                <div class="btn-background"></div>
                            </a>
                        `;
                        loadMoreText.style.opacity = '1';
                        loadMoreText.style.transform = 'translateY(0)';
                        
                        // Add animation class after a brief delay
                        setTimeout(() => {
                            const viewAllBtn = loadMoreText.querySelector('.view-all-projects-btn');
                            if (viewAllBtn) {
                                viewAllBtn.classList.add('animate-in');
                            }
                        }, 100);
                    }, 300);
                }, 5000);
            }
            
            // Remove loading state
            loadMoreBtn.classList.remove('loading');
        });
    }
    
    // Initialize showcase functionality when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initShowcaseSliders();
            initLoadMore();
        });
    } else {
        initShowcaseSliders();
        initLoadMore();
    }

	// ===== PROJECTS ANIMATED FUNCTIONALITY =====
 
document.addEventListener('DOMContentLoaded', function() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const projectCards = document.querySelectorAll('.project-card');
            const loadMoreBtn = document.querySelector('.load-more-btn');
            const noProjectsMessage = document.querySelector('.no-projects');
            
            let currentFilter = 'all';
            let visibleCount = 6; // Number of projects to show initially
            const projectsPerLoad = 6; // Number of projects to load each time
            
            // Initialize the page
            filterProjects('all');
            updateLoadMoreButton();
            
            // Filter button event listeners
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const filter = button.getAttribute('data-filter');
                    
                    // Update active button
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    // Reset visible count when changing filters
                    visibleCount = 6;
                    
                    // Apply filter
                    currentFilter = filter;
                    filterProjects(filter);
                    updateLoadMoreButton();
                });
            });
            
            // Load more button event listener
            loadMoreBtn.addEventListener('click', () => {
                visibleCount += projectsPerLoad;
                filterProjects(currentFilter);
                updateLoadMoreButton();
            });
            
            // Filter projects based on selected category
            function filterProjects(filter) {
                let visibleProjects = 0;
                
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        if (visibleProjects < visibleCount) {
                            card.classList.add('visible');
                            visibleProjects++;
                        } else {
                            card.classList.remove('visible');
                        }
                    } else {
                        card.classList.remove('visible');
                    }
                });
                
                // Show/hide no projects message
                if (visibleProjects === 0) {
                    noProjectsMessage.classList.add('visible');
                } else {
                    noProjectsMessage.classList.remove('visible');
                }
            }
            
            // Update load more button visibility
            function updateLoadMoreButton() {
                if (currentFilter !== 'all') {
                    loadMoreBtn.classList.add('hidden');
                    return;
                }
                
                const totalProjects = projectCards.length;
                
                if (visibleCount >= totalProjects) {
                    loadMoreBtn.classList.add('hidden');
                } else {
                    loadMoreBtn.classList.remove('hidden');
                }
            }
        });