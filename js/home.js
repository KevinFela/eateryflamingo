document.addEventListener('DOMContentLoaded', function() {
    console.log('Home.js loaded - Booking form initialized');
    
 
    initAnimations();
    
    
    const hero = document.getElementById('hero');
    const scrollIndicator = document.getElementById('scrollIndicator');
    const heroContainer = document.querySelector('.hero-container');
    
    const formOverlay = document.createElement('div');
    formOverlay.className = 'form-overlay';
    formOverlay.style.display = 'none';
    document.body.appendChild(formOverlay);
    
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
       
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
    
   
    const timeSelect = document.getElementById('time');
    if (timeSelect) {
        timeSelect.value = '19:00';
    }
    
    
    const guestsSelect = document.getElementById('guests');
    if (guestsSelect) {
        guestsSelect.value = '2';
    }
    
    // Hero image loading
    const heroImage = new Image();
    heroImage.src = 'images/vanue1.jpeg';
    heroImage.onload = function() {
        if (hero) hero.classList.remove('loading');
        console.log('Hero image loaded successfully');
    };
    heroImage.onerror = function() {
        if (hero) {
            hero.classList.add('no-hero-image');
            hero.classList.remove('loading');
        }
        console.log('Hero image failed to load, using fallback');
    };
    
    // Scroll indicator functionality
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const featuresSection = document.getElementById('features');
            if (featuresSection) {
                featuresSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Parallax effect for hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-background');
        if (parallax && window.innerWidth > 768) {
            const rate = scrolled * 0.5;
            parallax.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Booking Form Toggle
    const bookingToggle = document.getElementById('bookingToggle');
    const bookingForm = document.getElementById('bookingForm');
    

    const closeButton = document.createElement('button');
    closeButton.className = 'form-close-btn';
    closeButton.innerHTML = '×';
    closeButton.style.display = 'none';
    if (bookingForm) {
        bookingForm.appendChild(closeButton);
    }
    
    
    let isFormOpen = false;
    
    if (bookingToggle && bookingForm) {
      
        bookingToggle.style.display = 'flex';
        bookingForm.style.display = 'none';
        bookingForm.classList.remove('active');
        
        
        function updateCloseButton() {
            if (window.innerWidth <= 768) {
                closeButton.style.display = 'flex';
            } else {
                closeButton.style.display = 'none';
            }
        }
        
        updateCloseButton();
        window.addEventListener('resize', updateCloseButton);
        
        // Toggle form function
        function toggleForm() {
            if (!isFormOpen) {
                showForm();
            } else {
                hideForm();
            }
        }
        
        bookingToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleForm();
        });
        
        // Close button functionality
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            hideForm();
        });
        
        // Overlay click to close (mobile only)
        formOverlay.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                hideForm();
            }
        });
        
        // Function to show form
        function showForm() {
            isFormOpen = true;
            
            bookingForm.classList.remove('closing');
            
           
            if (window.innerWidth <= 768) {
                formOverlay.style.display = 'block';
                setTimeout(() => {
                    formOverlay.classList.add('active');
                }, 10);
                document.body.classList.add('form-open');
            }
            
            
            bookingForm.style.display = 'block';
            setTimeout(() => {
                bookingForm.classList.add('active');
                bookingToggle.classList.add('active');
                
                if (heroContainer && window.innerWidth > 768) {
                    heroContainer.classList.add('form-active');
                }
                
                // Focus on first input
                const firstInput = bookingForm.querySelector('input, select');
                if (firstInput) firstInput.focus();
            }, 10);
            
            // Scroll to form on desktop
            if (window.innerWidth > 768) {
                setTimeout(() => {
                    bookingForm.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 100);
            }
        }
        
        // Function to hide form
        function hideForm() {
            isFormOpen = false;
            
            // Add closing animation
            bookingForm.classList.add('closing');
            
            // Hide overlay
            formOverlay.classList.remove('active');
            setTimeout(() => {
                formOverlay.style.display = 'none';
            }, 300);
            document.body.classList.remove('form-open');
            
            // Remove active classes after animation
            setTimeout(() => {
                bookingForm.style.display = 'none';
                bookingForm.classList.remove('active');
                bookingForm.classList.remove('closing');
                bookingToggle.classList.remove('active');
                
                if (heroContainer) {
                    heroContainer.classList.remove('form-active');
                }
            }, 300);
        }
        
        // Store functions globally for other event listeners
        window.showBookingForm = showForm;
        window.hideBookingForm = hideForm;
    }
    
    // Close booking form when clicking outside (desktop only)
    document.addEventListener('click', function(e) {
        if (window.innerWidth > 768 && bookingForm && bookingForm.classList.contains('active')) {
            if (!bookingForm.contains(e.target) && !bookingToggle.contains(e.target)) {
                if (typeof hideBookingForm === 'function') {
                    hideBookingForm();
                }
            }
        }
    });

    // Booking Form Submission - WhatsApp Integration
    const bookingFormElement = document.getElementById('bookingFormElement');
    if (bookingFormElement) {
        bookingFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const guests = document.getElementById('guests').value;
            const specialRequests = document.getElementById('special-requests') ? 
                                   document.getElementById('special-requests').value.trim() : '';
            
            // Basic validation
            const errors = [];
            if (!name) errors.push('Name is required');
            if (!phone) errors.push('Phone number is required');
            if (!date) errors.push('Date is required');
            if (!time || time === '') errors.push('Time is required');
            if (!guests || guests === '') errors.push('Number of guests is required');

            if (errors.length > 0) {
                showNotification('Please fill in all required fields: ' + errors.join(', '), 'error');
                return;
            }
            
            // Validate phone number (basic validation)
            const phoneRegex = /^[0-9+\-\s()]{10,}$/;
            const cleanPhone = phone.replace(/\D/g, '');
            
            if (cleanPhone.length < 10) {
                showNotification('Please enter a valid phone number with at least 10 digits', 'error');
                return;
            }
            
            // Format date for display
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Format time for display
            const timeDisplay = formatTimeDisplay(time);
            
            // Create WhatsApp message with emojis
            let message = `🍽️ *NEW TABLE BOOKING REQUEST* 🍽️\n\n`;
            message += `👤 *Customer Name:* ${name}\n`;
            message += `📞 *Phone:* ${phone}\n`;
            message += `📅 *Date:* ${formattedDate}\n`;
            message += `⏰ *Time:* ${timeDisplay}\n`;
            message += `👥 *Number of Guests:* ${guests} ${guests === '1' ? 'person' : 'people'}\n`;
            
            if (specialRequests) {
                message += `📝 *Special Requests:* ${specialRequests}\n`;
            }
            
            message += `\n📍 *Location:* Eatery at Flamingo\n`;
            message += `   Flamingo Avenue, Kagiso 1754\n\n`;
            message += `📱 *Submitted via Website*\n`;
            message += `🕒 ${new Date().toLocaleString('en-GB', { 
                dateStyle: 'medium', 
                timeStyle: 'short' 
            })}`;
            
            // Encode message for URL
            const encodedMessage = encodeURIComponent(message);
            
            // WhatsApp phone number (using the number from your footer)
            const whatsappNumber = '27621369848';
            
            // Create WhatsApp URL
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Show loading state
            const submitBtn = bookingFormElement.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
                submitBtn.disabled = true;
                
                // Show success message
                setTimeout(() => {
                    showNotification('✅ Opening WhatsApp to send your booking request!', 'success');
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Open WhatsApp in new tab
                    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                    
                    // Reset form
                    bookingFormElement.reset();
                    
                    // Reset defaults
                    if (dateInput) {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        dateInput.value = tomorrow.toISOString().split('T')[0];
                    }
                    if (timeSelect) timeSelect.value = '19:00';
                    if (guestsSelect) guestsSelect.value = '2';
                    
                    // Close booking form after delay
                    setTimeout(() => {
                        if (typeof hideBookingForm === 'function') {
                            hideBookingForm();
                        }
                    }, 1500);
                }, 1000);
            }
        });
    }

    // Enhanced scroll animations for features
    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger animation for multiple cards
                const cards = document.querySelectorAll('.feature-card');
                cards.forEach((card, index) => {
                    if (card === entry.target) {
                        card.style.transitionDelay = `${index * 0.1}s`;
                    }
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        featureObserver.observe(card);
    });

    // Add loading class initially
    if (hero) hero.classList.add('loading');
    
    // Listen for escape key to close form
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && bookingForm && bookingForm.classList.contains('active')) {
            if (typeof hideBookingForm === 'function') {
                hideBookingForm();
            }
        }
    });
});

// Initialize all animations
function initAnimations() {
    // Add hover effects to all buttons
    const buttons = document.querySelectorAll('.btn, .booking-toggle');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.03)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add focus animations to form inputs
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Add responsive form validation styles
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('.form-control');
        if (input) {
            input.addEventListener('input', function() {
                if (this.value.trim() !== '') {
                    group.classList.add('has-value');
                } else {
                    group.classList.remove('has-value');
                }
            });
            
            // Check on page load
            if (input.value.trim() !== '') {
                group.classList.add('has-value');
            }
        }
    });

    // Social media link animations
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px) rotate(5deg)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0)';
        });
    });

    // Navigation link animations
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = 'var(--accent-pink)';
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.color = '';
            }
        });
    });

    console.log('Enhanced animations initialized');
}

// Helper function to format time display
function formatTimeDisplay(timeString) {
    if (!timeString) return '';
    
    // Parse time like "14:30" to "2:30 PM"
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const minute = minutes || '00';
    
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    
    return `${displayHour}:${minute} ${period}`;
}

// Helper function for notifications
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 16px;
                border-radius: 6px;
                color: white;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 250px;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                animation: slideInRight 0.3s ease;
            }
            .notification.success {
                background-color: #4CAF50;
                border-left: 4px solid #388E3C;
            }
            .notification.error {
                background-color: #F44336;
                border-left: 4px solid #D32F2F;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                margin-left: 12px;
                line-height: 1;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @media (max-width: 768px) {
                .notification {
                    min-width: auto;
                    width: calc(100% - 40px);
                    max-width: none;
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    padding: 10px 14px;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Add resize listener to handle form layout changes
window.addEventListener('resize', function() {
    const bookingForm = document.getElementById('bookingForm');
    const bookingToggle = document.getElementById('bookingToggle');
    const heroContainer = document.querySelector('.hero-container');
    const formOverlay = document.querySelector('.form-overlay');
    
    // Reset form state on resize
    if (bookingForm && window.innerWidth > 768) {
        bookingForm.style.display = 'none';
        bookingForm.classList.remove('active');
        bookingForm.style.position = 'relative';
        bookingForm.style.top = 'auto';
        bookingForm.style.left = 'auto';
        bookingForm.style.transform = 'none';
        document.body.classList.remove('form-open');
        
        // Hide overlay on desktop
        if (formOverlay) {
            formOverlay.style.display = 'none';
            formOverlay.classList.remove('active');
        }
    }
    
    if (bookingToggle) {
        bookingToggle.classList.remove('active');
    }
    
    if (heroContainer) {
        heroContainer.classList.remove('form-active');
    }

});
