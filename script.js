// Initialize AOS with error handling
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            disable: window.innerWidth < 768 // Disable on mobile for performance
        });
    }
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing website');
    
    // Initialize AOS
    initializeAOS();
    
    // Preloader
    const preloader = document.querySelector('.preloader');
    
    // Hide preloader after page loads
    window.addEventListener('load', function() {
        console.log('Window loaded - hiding preloader');
        setTimeout(function() {
            if (preloader) {
                preloader.style.opacity = '0';
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 500);
            }
        }, 1000);
    });
    
    // Force hide preloader after 3 seconds (fallback)
    setTimeout(function() {
        if (preloader && preloader.style.display !== 'none') {
            preloader.style.opacity = '0';
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 3000);
    
    // Theme Toggle with Local Storage
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    function initializeTheme() {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.body.classList.add('dark-mode');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        } else {
            document.body.classList.remove('dark-mode');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
    }
    
    if (themeToggle && themeIcon) {
        initializeTheme();
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // Mobile Menu Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    function setupMobileMenu() {
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                if (navMenu.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = 'auto';
                }
            });
            
            // Close mobile menu when clicking on a link
            const navLinks = document.querySelectorAll('.nav-link');
            
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = 'auto';
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                if (navMenu.classList.contains('active') && 
                    !navToggle.contains(event.target) && 
                    !navMenu.contains(event.target)) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    }
    
    setupMobileMenu();
    
    // Scroll to Top Button
    const scrollTopBtn = document.getElementById('scrollTop');
    
    function setupScrollTop() {
        if (scrollTopBtn) {
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    scrollTopBtn.classList.add('active');
                } else {
                    scrollTopBtn.classList.remove('active');
                }
            });
            
            scrollTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    setupScrollTop();
    
    // Animate Skill Bars
    const skillBars = document.querySelectorAll('.skill-progress');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            // Reset width first for animation
            bar.style.width = '0%';
            // Animate to target width
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 100);
        });
    }
    
    // Initialize animations with Intersection Observer (modern approach)
    function initializeAnimations() {
        // Animate skill bars when they come into view
        const aboutSection = document.querySelector('.about');
        
        if (aboutSection && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateSkillBars();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(aboutSection);
        } else {
            // Fallback for older browsers
            animateSkillBars();
        }
        
        // Initialize GSAP if available
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            try {
                gsap.registerPlugin(ScrollTrigger);
                
                // Simple hero animations
                gsap.from('.hero-title', {
                    duration: 1,
                    y: 30,
                    opacity: 0,
                    ease: 'power3.out'
                });
                
                gsap.from('.hero-subtitle', {
                    duration: 1,
                    y: 20,
                    opacity: 0,
                    delay: 0.3,
                    ease: 'power3.out'
                });
                
                gsap.from('.hero-buttons', {
                    duration: 1,
                    y: 20,
                    opacity: 0,
                    delay: 0.6,
                    ease: 'power3.out'
                });
                
                // Navbar scroll effect
                gsap.to('.navbar', {
                    backgroundColor: 'var(--bg-color)',
                    padding: '10px 0',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    scrollTrigger: {
                        trigger: '.hero',
                        start: 'bottom top',
                        toggleActions: 'play reverse play reverse',
                        scrub: true
                    }
                });
                
            } catch (error) {
                console.log('GSAP initialization error:', error);
            }
        }
    }
    
    initializeAnimations();
    
    // Testimonial Carousel
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialDots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    let currentSlide = 0;
    let autoSlideInterval;
    
    function initializeCarousel() {
        if (testimonialSlides.length === 0) return;
        
        function showSlide(n) {
            testimonialSlides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            testimonialDots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            currentSlide = (n + testimonialSlides.length) % testimonialSlides.length;
            
            testimonialSlides[currentSlide].classList.add('active');
            if (testimonialDots[currentSlide]) {
                testimonialDots[currentSlide].classList.add('active');
            }
        }
        
        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(function() {
                showSlide(currentSlide + 1);
            }, 5000);
        }
        
        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
            }
        }
        
        // Initialize carousel
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', function() {
                stopAutoSlide();
                showSlide(currentSlide - 1);
                startAutoSlide();
            });
            
            nextBtn.addEventListener('click', function() {
                stopAutoSlide();
                showSlide(currentSlide + 1);
                startAutoSlide();
            });
        }
        
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                stopAutoSlide();
                showSlide(index);
                startAutoSlide();
            });
        });
        
        // Start auto rotation
        startAutoSlide();
        
        // Pause on hover
        const carousel = document.querySelector('.testimonial-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoSlide);
            carousel.addEventListener('mouseleave', startAutoSlide);
            
            // Pause on focus for accessibility
            carousel.addEventListener('focusin', stopAutoSlide);
            carousel.addEventListener('focusout', startAutoSlide);
        }
        
        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                stopAutoSlide();
            } else {
                startAutoSlide();
            }
        });
    }
    
    initializeCarousel();
    
    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    
    function initializeContactForm() {
        if (!contactForm) return;
        
        // Form validation
        function validateForm() {
            const name = contactForm.querySelector('#name');
            const email = contactForm.querySelector('#email');
            const service = contactForm.querySelector('#service');
            const message = contactForm.querySelector('#message');
            
            let isValid = true;
            
            // Reset previous errors
            contactForm.querySelectorAll('.error').forEach(error => error.remove());
            
            // Name validation
            if (!name.value.trim()) {
                showFieldError(name, 'Name is required');
                isValid = false;
            }
            
            // Email validation
            if (!email.value.trim()) {
                showFieldError(email, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showFieldError(email, 'Please enter a valid email');
                isValid = false;
            }
            
            // Service validation
            if (!service.value) {
                showFieldError(service, 'Please select a service');
                isValid = false;
            }
            
            // Message validation
            if (!message.value.trim()) {
                showFieldError(message, 'Message is required');
                isValid = false;
            }
            
            return isValid;
        }
        
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        function showFieldError(field, message) {
            const error = document.createElement('div');
            error.className = 'error';
            error.style.color = 'var(--accent-color)';
            error.style.fontSize = '0.8rem';
            error.style.marginTop = '5px';
            error.textContent = message;
            field.parentNode.appendChild(error);
            
            field.style.borderBottomColor = 'var(--accent-color)';
        }
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(this);
                
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showAlert('✅ Message sent successfully! I will get back to you soon.', 'success');
                    contactForm.reset();
                    resetFormLabels();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showAlert('❌ Failed to send message. Please try again or contact me directly.', 'error');
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
        
        // Real-time validation
        contactForm.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                // Clear error when user starts typing
                const error = this.parentNode.querySelector('.error');
                if (error && this.value.trim()) {
                    error.remove();
                    this.style.borderBottomColor = '';
                }
            });
        });
        
        function validateField(field) {
            const error = field.parentNode.querySelector('.error');
            if (error) error.remove();
            
            field.style.borderBottomColor = '';
            
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                return false;
            }
            
            if (field.type === 'email' && !isValidEmail(field.value)) {
                showFieldError(field, 'Please enter a valid email');
                return false;
            }
            
            return true;
        }
    }
    
    initializeContactForm();
    
    // Alert system
    function showAlert(message, type) {
        // Remove existing alerts
        const existingAlert = document.querySelector('.form-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create new alert
        const alert = document.createElement('div');
        alert.className = `form-alert alert-${type}`;
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            background: ${type === 'success' ? '#D1FAE5' : '#FEE2E2'};
            color: ${type === 'success' ? '#065F46' : '#991B1B'};
            border: 1px solid ${type === 'success' ? '#A7F3D0' : '#FECACA'};
        `;
        
        alert.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(alert);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (alert.parentNode) {
                        alert.remove();
                    }
                }, 300);
            }
        }, 5000);
        
        // Add CSS for animations if not already added
        if (!document.querySelector('#alert-animations')) {
            const style = document.createElement('style');
            style.id = 'alert-animations';
            style.textContent = `
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
                @media (max-width: 768px) {
                    .form-alert {
                        top: 10px;
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Reset form labels after form reset
    function resetFormLabels() {
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea, select');
            const label = group.querySelector('label');
            
            if (input && label) {
                label.style.top = '12px';
                label.style.fontSize = '1rem';
                label.style.color = '#6B7280';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    function initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    initializeSmoothScroll();
    
    // Add active class to navigation links based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        const headerHeight = document.querySelector('header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Handle resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Reinitialize AOS on resize
            initializeAOS();
        }, 250);
    });
    
    // Performance optimization: Lazy load images
    function initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    initializeLazyLoading();
    
    console.log('Website initialization complete');
});

// Error boundary for any uncaught errors
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});