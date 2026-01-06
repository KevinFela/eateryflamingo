document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const menuBook = document.querySelector('.menu-book');
    const menuPages = document.querySelectorAll('.menu-page');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageIndicators = document.querySelectorAll('.page-indicator');
    const openMenuBtn = document.querySelector('.open-menu-btn');
    const fullscreenToggle = document.getElementById('fullscreenToggle');
    const downloadBtn = document.getElementById('downloadMenu');
    const printBtn = document.getElementById('printMenu');
    const bookContainer = document.querySelector('.menu-book-container');
    
    // State
    let currentPage = 0;
    let totalPages = menuPages.length;
    let isTurning = false;
    let isFullscreen = false;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Initialize menu book
    function initMenuBook() {
        setupEventListeners();
        updateNavigation();
        preloadImages();
        updatePageDisplay();
        updateIndicators();
    }
    
    // Preload menu images for smooth transitions
    function preloadImages() {
        const images = document.querySelectorAll('.menu-image');
        images.forEach(img => {
            const src = img.getAttribute('src');
            if (src) {
                new Image().src = src;
            }
        });
    }
    
    // Go to specific page
    function goToPage(pageIndex) {
        if (pageIndex < 0 || pageIndex >= totalPages || pageIndex === currentPage || isTurning) return;
        
        isTurning = true;
        
        // Update current page class
        menuPages[currentPage].classList.remove('active', 'prev', 'next');
        
        // Update new page class based on direction
        if (pageIndex > currentPage) {
            menuPages[pageIndex].classList.add('active', 'next');
        } else {
            menuPages[pageIndex].classList.add('active', 'prev');
        }
        
        currentPage = pageIndex;
        
        // Update everything after a short delay
        setTimeout(() => {
            updatePageDisplay();
            updateNavigation();
            updateIndicators();
            isTurning = false;
        }, 300);
    }
    
    // Next page
    function nextPage() {
        if (currentPage < totalPages - 1) {
            goToPage(currentPage + 1);
        }
    }
    
    // Previous page
    function prevPage() {
        if (currentPage > 0) {
            goToPage(currentPage - 1);
        }
    }
    
    // Update page display
    function updatePageDisplay() {
        menuPages.forEach((page, index) => {
            page.classList.remove('active', 'prev', 'next');
            
            if (index === currentPage) {
                page.classList.add('active');
            } else if (index === currentPage - 1) {
                page.classList.add('prev');
            } else if (index === currentPage + 1) {
                page.classList.add('next');
            }
        });
    }
    
    // Update navigation buttons
    function updateNavigation() {
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === totalPages - 1;
        
        prevBtn.classList.toggle('disabled', currentPage === 0);
        nextBtn.classList.toggle('disabled', currentPage === totalPages - 1);
    }
    
    // Update page indicators
    function updateIndicators() {
        pageIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentPage);
        });
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Navigation buttons
        prevBtn.addEventListener('click', prevPage);
        nextBtn.addEventListener('click', nextPage);
        
        // Page indicators
        pageIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToPage(index));
        });
        
        // Open menu button on cover
        if (openMenuBtn) {
            openMenuBtn.addEventListener('click', () => goToPage(1));
        }
        
        // Fullscreen toggle
        fullscreenToggle.addEventListener('click', toggleFullscreen);
        
        // Download menu button
        downloadBtn.addEventListener('click', downloadMenu);
        
        // Print menu button
        printBtn.addEventListener('click', () => window.print());
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboardNavigation);
        
        // Touch/swipe for mobile
        setupTouchNavigation();
        
        // Click to flip (click on right/left side of book)
        setupClickToFlip();
    }
    
    // Keyboard navigation
    function handleKeyboardNavigation(e) {
        // Handle fullscreen exit with ESC
        if (isFullscreen && e.key === 'Escape') {
            toggleFullscreen();
            return;
        }
        
        // Prevent default for navigation keys
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextPage();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevPage();
        } else if (e.key >= '1' && e.key <= '6') {
            const pageIndex = parseInt(e.key) - 1;
            if (pageIndex < totalPages) {
                goToPage(pageIndex);
            }
        }
    }
    
    // Touch/swipe navigation for mobile
    function setupTouchNavigation() {
        menuBook.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        menuBook.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next page
                nextPage();
            } else {
                // Swipe right - previous page
                prevPage();
            }
        }
    }
    
    // Click to flip (click on right/left side of page)
    function setupClickToFlip() {
        menuBook.addEventListener('click', (e) => {
            if (isTurning) return;
            
            const rect = menuBook.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            
            // If click on right 30% of book and not on last page
            if (x > width * 0.7 && currentPage < totalPages - 1) {
                nextPage();
            }
            // If click on left 30% of book and not on first page
            else if (x < width * 0.3 && currentPage > 0) {
                prevPage();
            }
        });
    }
    
    // Toggle fullscreen mode - FIXED VERSION
    function toggleFullscreen() {
        isFullscreen = !isFullscreen;
        
        if (isFullscreen) {
            // Enter fullscreen
            bookContainer.classList.add('fullscreen');
            
            // Add close button
            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-fullscreen';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            closeBtn.title = 'Exit Fullscreen';
            closeBtn.addEventListener('click', toggleFullscreen);
            bookContainer.appendChild(closeBtn);
            
            // Update fullscreen button text
            fullscreenToggle.innerHTML = '<i class="fas fa-compress"></i> Exit Fullscreen';
            
            // Prevent body scrolling
            document.body.style.overflow = 'hidden';
            
            // Handle ESC key to exit fullscreen
            const handleEscKey = function(e) {
                if (e.key === 'Escape') {
                    toggleFullscreen();
                    document.removeEventListener('keydown', handleEscKey);
                }
            };
            document.addEventListener('keydown', handleEscKey);
            
            // Store reference to cleanup later
            bookContainer._escHandler = handleEscKey;
            
        } else {
            // Exit fullscreen
            bookContainer.classList.remove('fullscreen');
            
            // Remove close button
            const closeBtn = bookContainer.querySelector('.close-fullscreen');
            if (closeBtn) {
                closeBtn.remove();
            }
            
            // Update fullscreen button text
            fullscreenToggle.innerHTML = '<i class="fas fa-expand"></i> Fullscreen';
            
            // Restore body scrolling
            document.body.style.overflow = '';
            
            // Remove ESC key listener
            if (bookContainer._escHandler) {
                document.removeEventListener('keydown', bookContainer._escHandler);
                delete bookContainer._escHandler;
            }
        }
    }
    
    // Download menu as PDF (placeholder function)
    function downloadMenu() {
        // This would typically generate or link to a PDF file
        // For now, we'll create a simple image download of current page
        
        const currentPageElement = menuPages[currentPage];
        const img = currentPageElement.querySelector('img');
        
        if (img && img.src) {
            // Create temporary link for download
            const link = document.createElement('a');
            link.href = img.src;
            link.download = `eatery-menu-page-${currentPage + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show download confirmation
            showNotification('Menu page downloaded successfully!');
        } else if (currentPage === 0) {
            // For cover page, provide a message
            showNotification('Download complete menu PDF from our website!');
        }
    }
    
    // Show notification
    function showNotification(message) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) existingNotification.remove();
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: var(--accent-pink);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 3000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: transform 0.3s ease, opacity 0.3s ease;
            opacity: 0;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
            notification.style.opacity = '1';
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(100px)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Page turn sound effect (optional)
    function playPageTurnSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 400;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            // Audio context not supported, ignore
        }
    }
    
    // Add page turn sound to navigation
    const originalNextPage = nextPage;
    const originalPrevPage = prevPage;
    
    nextPage = function() {
        if (currentPage < totalPages - 1 && !isTurning) {
            playPageTurnSound();
        }
        originalNextPage.call(this);
    };
    
    prevPage = function() {
        if (currentPage > 0 && !isTurning) {
            playPageTurnSound();
        }
        originalPrevPage.call(this);
    };
    
    // Initialize everything
    initMenuBook();
    
    // Handle window resize for fullscreen
    window.addEventListener('resize', function() {
        if (isFullscreen) {
            // Adjust menu book height in fullscreen
            const menuBook = document.querySelector('.menu-book');
            if (menuBook) {
                const container = document.querySelector('.menu-book-container.fullscreen');
                if (container) {
                    const containerHeight = container.clientHeight;
                    const controlsHeight = container.querySelector('.menu-book-controls').offsetHeight;
                    const actionsHeight = container.querySelector('.menu-book-actions').offsetHeight;
                    const instructionsHeight = container.querySelector('.menu-instructions').offsetHeight;
                    const padding = 80; // Total vertical padding
                    
                    const availableHeight = containerHeight - controlsHeight - actionsHeight - instructionsHeight - padding;
                    menuBook.style.height = Math.max(400, availableHeight) + 'px';
                }
            }
        }
    });
    
    // Dispatch a resize event to set initial sizes
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);

});
