document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mainNav = document.getElementById('mainNav');
    const navClose = document.getElementById('navClose');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (mobileMenu && mainNav) {
       
        mobileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            mainNav.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            const menuIcon = this.querySelector('i');
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
        });
        
        
        function closeMobileMenu() {
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
           
            const menuIcon = mobileMenu.querySelector('i');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
        
        if (navClose) {
            navClose.addEventListener('click', function(e) {
                e.stopPropagation();
                closeMobileMenu();
            });
        }
        
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.stopPropagation();
                closeMobileMenu();
            });
        });
        
        
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = mainNav.contains(event.target);
            const isClickOnMobileMenu = mobileMenu.contains(event.target);
            const isClickOnNavClose = navClose ? navClose.contains(event.target) : false;
            
            if (mainNav.classList.contains('active') && 
                !isClickInsideMenu && 
                !isClickOnMobileMenu &&
                !isClickOnNavClose) {
                closeMobileMenu();
            }
        });
        
     
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && mainNav.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    if (header) {
        // Initial check
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
        
        // Scroll event
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Lazy loading for images
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
    
    // Add loading state to buttons on form submission
    document.querySelectorAll('form').forEach(form => {
        if (form.id && form.id !== 'bookingFormElement') {
            form.addEventListener('submit', function(e) {
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<div class="loading-spinner" style="width: 18px; height: 18px; margin: 0 auto; border: 2px solid #fff; border-top: 2px solid var(--accent-pink); border-radius: 50%; animation: spin 1s linear infinite;"></div>';
                    submitBtn.disabled = true;
                    
                    // Add spin animation if not already defined
                    if (!document.querySelector('style[data-spin-animation]')) {
                        const style = document.createElement('style');
                        style.setAttribute('data-spin-animation', 'true');
                        style.textContent = `
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                    
                    // Reset button after 2 seconds (simulating API call)
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 2000);
                }
            });
        }
    });
    
    // Fix for hero background image on mobile
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground && window.innerWidth <= 768) {
        heroBackground.style.backgroundAttachment = 'scroll';
    }
    
    // Initialize page-specific features
    initializePageSpecificFeatures();
});

// Utility function to format phone numbers
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
    } else {
        return phone;
    }
}


function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}


function initializePageSpecificFeatures() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'index.html':
            // Home page specific initialization
            initializeHomePage();
            break;
        case 'menu.html':
            // Menu page specific initialization
            initializeMenuPage();
            break;
        case 'services.html':
            // Services page specific initialization
            initializeServicesPage();
            break;
        case 'gallery.html':
            // Gallery page specific initialization
            initializeGalleryPage();
            break;
        case 'contact.html':
            // Contact page specific initialization
            initializeContactPage();
            break;
        default:
            // Default case for any other pages
            console.log('Page-specific features initialized for:', currentPage);
    }
}

// Home page specific functions
function initializeHomePage() {
    console.log('Home page features initialized');
    
    // Initialize scroll indicator if it exists
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const featuresSection = document.getElementById('features');
            if (featuresSection) {
                featuresSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Initialize feature cards animations
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        featureCards.forEach(card => observer.observe(card));
    }
}

// Menu page specific functions
function initializeMenuPage() {
    console.log('Menu page features initialized');
    
    // Menu tab switching
    const menuTabBtns = document.querySelectorAll('.menu-tab-btn');
    const menuTabContents = document.querySelectorAll('.menu-tab-content');
    
    if (menuTabBtns.length > 0 && menuTabContents.length > 0) {
        menuTabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Update active button
                menuTabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Show active tab content
                menuTabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }
}

// Services page specific functions
function initializeServicesPage() {
    console.log('Services page features initialized');
    
    // Services tab switching
    const servicesTabBtns = document.querySelectorAll('.services-tab-btn');
    const servicesTabContents = document.querySelectorAll('.services-tab-content');
    
    if (servicesTabBtns.length > 0 && servicesTabContents.length > 0) {
        servicesTabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Update active button
                servicesTabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Show active tab content
                servicesTabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }
}

// Gallery page specific functions
function initializeGalleryPage() {
    console.log('Gallery page features initialized');
    
    // Gallery filter functionality
    const galleryFilters = document.querySelectorAll('.gallery-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryFilters.length > 0 && galleryItems.length > 0) {
        galleryFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                // Update active filter
                galleryFilters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    const categories = item.getAttribute('data-category');
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
}

// Contact page specific functions
function initializeContactPage() {
    console.log('Contact page features initialized');
    
    // Quick contact buttons
    const quickContactBtns = document.querySelectorAll('.quick-contact');
    
    if (quickContactBtns.length > 0) {
        quickContactBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const contactType = this.getAttribute('data-contact-type');
                const subjectInput = document.getElementById('contact-subject');
                const messageInput = document.getElementById('contact-message');
                
                if (subjectInput && messageInput) {
                    switch(contactType) {
                        case 'reservation':
                            subjectInput.value = 'Table Reservation Inquiry';
                            messageInput.value = 'Hello, I would like to make a reservation. Please let me know about available dates and times.';
                            break;
                        case 'catering':
                            subjectInput.value = 'Catering Services Inquiry';
                            messageInput.value = 'Hello, I am interested in your catering services. Please send me more information about your packages and pricing.';
                            break;
                        case 'events':
                            subjectInput.value = 'Event Booking Inquiry';
                            messageInput.value = 'Hello, I would like to inquire about booking an event at your venue. Please send me available dates and packages.';
                            break;
                        case 'carwash':
                            subjectInput.value = 'Car Wash Service Inquiry';
                            messageInput.value = 'Hello, I am interested in your car wash services. Please send me information about your packages and pricing.';
                            break;
                    }
                    
                    // Scroll to form
                    const contactForm = document.querySelector('.contact-form');
                    if (contactForm) {
                        contactForm.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                    
                    // Focus on message input
                    messageInput.focus();
                }
            });
        });
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const name = this.querySelector('#contact-name');
            const email = this.querySelector('#contact-email');
            const message = this.querySelector('#contact-message');
            
            let isValid = true;
            let errors = [];
            
            if (!name.value.trim()) {
                isValid = false;
                errors.push('Name is required');
            }
            
            if (!email.value.trim()) {
                isValid = false;
                errors.push('Email is required');
            } else if (!validateEmail(email.value)) {
                isValid = false;
                errors.push('Please enter a valid email address');
            }
            
            if (!message.value.trim()) {
                isValid = false;
                errors.push('Message is required');
            }
            
            if (!isValid) {
                showNotification('Please fix the following errors:\n' + errors.join('\n'), 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<div class="loading-spinner" style="width: 18px; height: 18px; margin: 0 auto; border: 2px solid #fff; border-top: 2px solid var(--accent-pink); border-radius: 50%; animation: spin 1s linear infinite;"></div>';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    showNotification('Thank you for your message! We will get back to you soon.', 'success');
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }
}

// Add CSS for better form validation
const formValidationStyles = document.createElement('style');
formValidationStyles.textContent = `
    .form-control:invalid {
        border-color: #f44336;
    }
    
    .form-control:valid {
        border-color: #4CAF50;
    }
    
    .error-message {
        color: #f44336;
        font-size: 12px;
        margin-top: 4px;
        display: none;
    }
    
    .form-control:invalid + .error-message {
        display: block;
    }
`;

document.head.appendChild(formValidationStyles);
