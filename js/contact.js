// contact.js
document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formLoading = document.getElementById('formLoading');
    const submitBtn = contactForm?.querySelector('button[type="submit"]');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                phone: document.getElementById('contact-phone').value,
                subject: document.getElementById('contact-subject').value,
                message: document.getElementById('contact-message').value,
                type: 'contact_form'
            };

            // Basic validation
            const errors = validateContactForm(data);
            if (errors.length > 0) {
                alert('Please fix the following errors:\n' + errors.join('\n'));
                return;
            }

            // Show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<div class="loading-spinner"></div> Sending...';
            }
            if (formLoading) {
                formLoading.classList.add('active');
            }

            // Send to PHP backend
            fetch('php/send_email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    // Show success message
                    if (formSuccess) {
                        formSuccess.classList.add('active');
                    }
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset character counter
                    if (window.updateCounter) {
                        window.updateCounter();
                    }
                    
                    // Scroll to success message
                    formSuccess.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        if (formSuccess) {
                            formSuccess.classList.remove('active');
                        }
                    }, 5000);
                } else {
                    showNotification('There was an error sending your message. Please try again or contact us directly.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('There was an error sending your message. Please try again or contact us directly.', 'error');
            })
            .finally(() => {
                // Reset button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'SEND MESSAGE';
                }
                if (formLoading) {
                    formLoading.classList.remove('active');
                }
            });
        });
    }

    // Contact form validation
    function validateContactForm(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }
        
        if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.phone || data.phone.trim().length < 10) {
            errors.push('Please enter a valid phone number');
        }
        
        if (!data.subject || data.subject.trim().length < 5) {
            errors.push('Subject must be at least 5 characters long');
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
        }
        
        return errors;
    }

    // Quick contact buttons
    const quickContactButtons = document.querySelectorAll('.quick-contact');
    quickContactButtons.forEach(button => {
        button.addEventListener('click', function() {
            const contactType = this.getAttribute('data-contact-type');
            let message = '';
            
            switch(contactType) {
                case 'reservation':
                    message = 'Hi Eatery at Flamingo, I would like to make a reservation. Please provide available time slots.';
                    break;
                case 'catering':
                    message = 'Hi Eatery at Flamingo, I am interested in your catering services. Please send me more information.';
                    break;
                case 'events':
                    message = 'Hi Eatery at Flamingo, I would like to inquire about hosting an event at your venue.';
                    break;
                case 'carwash':
                    message = 'Hi Eatery at Flamingo, I am interested in your car wash services. Please provide more details.';
                    break;
                default:
                    message = 'Hi Eatery at Flamingo, I would like to get more information about your services.';
            }
            
            const whatsappUrl = `https://wa.me/27621369848?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    });

    // Phone number click to call
    const phoneNumbers = document.querySelectorAll('.phone-number');
    phoneNumbers.forEach(phone => {
        phone.style.cursor = 'pointer';
        phone.addEventListener('click', function() {
            const phoneNumber = this.textContent.replace(/\D/g, '');
            window.open(`tel:+${phoneNumber}`, '_self');
        });
    });

    // Email click to send
    const emailAddresses = document.querySelectorAll('.email-address');
    emailAddresses.forEach(email => {
        email.style.cursor = 'pointer';
        email.addEventListener('click', function() {
            const emailAddress = this.textContent;
            window.open(`mailto:${emailAddress}`, '_self');
        });
    });

    // Get Directions button functionality
    const getDirectionsBtn = document.querySelector('.btn-small');
    if (getDirectionsBtn) {
        getDirectionsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const address = 'Eatery at Flamingo, Flamingo Avenue, Kagiso 1754';
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
            window.open(mapsUrl, '_blank');
        });
    }

    // Map click to open in Google Maps
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        const mapIframe = mapContainer.querySelector('iframe');
        const overlay = mapContainer.querySelector('.map-overlay');
        
        // Add click handler to map container (excluding overlay)
        mapContainer.addEventListener('click', function(e) {
            // Don't trigger if clicking on overlay
            if (overlay && overlay.contains(e.target)) {
                return;
            }
            
            const address = 'Eatery at Flamingo, Flamingo Avenue, Kagiso 1754';
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
            window.open(mapsUrl, '_blank');
        });
        
        // Add hover effect
        mapContainer.style.cursor = 'pointer';
        mapIframe.style.cursor = 'pointer';
        
        // Add title for accessibility
        mapContainer.title = 'Click to open in Google Maps';
    }

    // Business hours highlighting for current day
    function highlightCurrentDay() {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = new Date().getDay();
        const currentDay = days[today];
        
        const hoursItems = document.querySelectorAll('.hours-list li');
        hoursItems.forEach(item => {
            if (item.getAttribute('data-day') === currentDay) {
                item.style.backgroundColor = 'var(--accent-pink)';
                item.style.color = 'white';
                item.style.fontWeight = '600';
                item.style.padding = 'var(--space-xs) var(--space-sm)';
                item.style.borderRadius = 'var(--radius-sm)';
            }
        });
    }

    highlightCurrentDay();

    // Form field animations
    const formFields = document.querySelectorAll('.form-control');
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        field.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Character counter for message field
    const messageField = document.getElementById('contact-message');
    if (messageField) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        messageField.parentElement.appendChild(counter);
        
        window.updateCounter = function() {
            const length = messageField.value.length;
            counter.textContent = `${length}/500 characters`;
            
            if (length > 450) {
                counter.style.color = 'var(--accent-pink)';
                counter.style.fontWeight = '600';
            } else {
                counter.style.color = 'var(--text-muted)';
                counter.style.fontWeight = '400';
            }
        };
        
        messageField.addEventListener('input', window.updateCounter);
        window.updateCounter(); // Initial call
    }
    
    // Team member email click handlers
    const teamEmails = document.querySelectorAll('.team-email');
    teamEmails.forEach(email => {
        email.style.cursor = 'pointer';
        email.addEventListener('click', function(e) {
            const emailAddress = this.textContent.trim();
            if (emailAddress) {
                window.open(`mailto:${emailAddress}`, '_self');
            }
            e.preventDefault();
        });
    });
    
    // Team member phone click handlers
    const teamPhones = document.querySelectorAll('.team-social a[href^="tel:"]');
    teamPhones.forEach(phone => {
        phone.addEventListener('click', function(e) {
            const phoneNumber = this.getAttribute('href').replace('tel:', '');
            window.open(`tel:${phoneNumber}`, '_self');
            e.preventDefault();
        });
    });
    
    // Team section hover effects
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        member.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Helper function for notifications (if not already in main.js)
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(notification);
        
        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-width: 300px;
                    max-width: 400px;
                    z-index: 9999;
                    animation: slideIn 0.3s ease;
                    border-left: 4px solid #4CAF50;
                }
                .notification-error {
                    border-left-color: #f44336;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .notification-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #666;
                    font-size: 16px;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
});