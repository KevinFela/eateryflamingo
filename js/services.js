// Services page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Services Tabs
    const servicesTabBtns = document.querySelectorAll('.services-tab-btn');
    const servicesTabContents = document.querySelectorAll('.services-tab-content');
    
    servicesTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            servicesTabBtns.forEach(b => b.classList.remove('active'));
            servicesTabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Scroll to top of services section
            document.querySelector('.services-section').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Car Wash Package Booking
    const packageButtons = document.querySelectorAll('.service-package .btn');
    packageButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const packageName = this.closest('.service-package').querySelector('h3').textContent;
            const packagePrice = this.closest('.service-package').querySelector('.price').textContent;
            
            const message = `Hi Eatery at Flamingo, I'm interested in booking the ${packageName} package (${packagePrice}). Please provide more details.`;
            const whatsappUrl = `https://wa.me/27621369848?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        });
    });

    // Event Booking
    const eventButtons = document.querySelectorAll('.event-card .btn');
    eventButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const eventTitle = this.closest('.event-card').querySelector('.event-title').textContent;
            const eventDate = this.closest('.event-card').querySelector('.event-date').textContent;
            
            const message = `Hi Eatery at Flamingo, I'm interested in attending your event: ${eventTitle} on ${eventDate}. Please provide more information.`;
            const whatsappUrl = `https://wa.me/27621369848?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        });
    });

    // Hubbly Booking
    const hubblyButtons = document.querySelectorAll('.hubbly-flavor .btn');
    hubblyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const flavorName = this.closest('.hubbly-flavor').querySelector('h4').textContent;
            const flavorPrice = this.closest('.hubbly-flavor').querySelector('.price').textContent;
            
            const message = `Hi Eatery at Flamingo, I'd like to order the ${flavorName} hubbly (${flavorPrice}).`;
            const whatsappUrl = `https://wa.me/27621369848?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        });
    });

    // Conference/Function Inquiry
    const conferenceButtons = document.querySelectorAll('.conference-feature .btn');
    conferenceButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const message = `Hi Eatery at Flamingo, I'm interested in hosting a conference or private function at your venue. Please provide more information about your facilities and packages.`;
            const whatsappUrl = `https://wa.me/27621369848?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        });
    });

    // Catering Inquiry
    const cateringButtons = document.querySelectorAll('.catering-package .btn');
    cateringButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const packageName = this.closest('.catering-package').querySelector('h4').textContent;
            const packagePrice = this.closest('.catering-package').querySelector('.price').textContent;
            
            const message = `Hi Eatery at Flamingo, I'm interested in your ${packageName} catering package (${packagePrice}). Please provide more details and a sample menu.`;
            const whatsappUrl = `https://wa.me/27621369848?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        });
    });

    // Animation for service items
    const serviceItems = document.querySelectorAll('.service-package, .event-card, .conference-feature, .catering-package');
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    serviceItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        serviceObserver.observe(item);
    });

    // Countdown for upcoming events
    function updateEventCountdowns() {
        const eventDates = document.querySelectorAll('.event-date');
        eventDates.forEach(dateElement => {
            const dateText = dateElement.textContent;
            const eventDate = new Date(dateText);
            const now = new Date();
            
            if (eventDate > now) {
                const diffTime = eventDate - now;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays <= 7) {
                    dateElement.innerHTML += ` <span style="color: var(--accent-pink); font-weight: bold;">(${diffDays} days left)</span>`;
                }
            } else {
                dateElement.innerHTML += ` <span style="color: var(--text-muted);">(Past event)</span>`;
            }
        });
    }

    updateEventCountdowns();
});