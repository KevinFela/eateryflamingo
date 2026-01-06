document.addEventListener('DOMContentLoaded', function() {
    // Gallery Filtering
    const galleryFilters = document.querySelectorAll('.gallery-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const loadingElement = document.querySelector('.gallery-loading');
    const noResultsElement = document.querySelector('.gallery-no-results');

    galleryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active filter
            galleryFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Show loading
            if (loadingElement) {
                loadingElement.classList.add('active');
            }
            
            // Simulate loading delay for better UX
            setTimeout(() => {
                filterGalleryItems(filterValue);
                if (loadingElement) {
                    loadingElement.classList.remove('active');
                }
            }, 300);
        });
    });

    function filterGalleryItems(filter) {
        let visibleItems = 0;

        galleryItems.forEach(item => {
            const itemCategories = item.getAttribute('data-category') || 'all';
            const categoriesArray = itemCategories.split(' ');
            
            if (filter === 'all' || categoriesArray.includes(filter)) {
                item.style.display = 'block';
                item.style.opacity = '1';
                visibleItems++;
            } else {
                item.style.display = 'none';
                item.style.opacity = '0';
            }
        });

        // Show no results message if no items visible
        if (noResultsElement) {
            if (visibleItems === 0) {
                noResultsElement.classList.add('active');
            } else {
                noResultsElement.classList.remove('active');
            }
        }
    }

    // Lazy loading for images
    const lazyImages = document.querySelectorAll('.gallery-item img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });

    // Gallery item animation
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
            }
        });
    }, {
        threshold: 0.1
    });

    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        galleryObserver.observe(item);
    });

    // Image Viewer functionality
    const imageViewer = document.getElementById('imageViewer');
    const viewerImage = document.getElementById('viewerImage');
    const closeViewer = document.getElementById('closeViewer');
    const prevImage = document.getElementById('prevImage');
    const nextImage = document.getElementById('nextImage');
    const imageCounter = document.getElementById('imageCounter');

    let currentImageIndex = 0;
    const allVisibleImages = Array.from(galleryItems);

    // Open image viewer when clicking on gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const imgAlt = this.querySelector('img').alt;
            
            viewerImage.src = imgSrc;
            viewerImage.alt = imgAlt;
            imageViewer.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            currentImageIndex = index;
            updateImageCounter();
        });
    });

    // Close viewer
    closeViewer.addEventListener('click', function() {
        imageViewer.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Previous image
    prevImage.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex - 1 + allVisibleImages.length) % allVisibleImages.length;
        const imgSrc = allVisibleImages[currentImageIndex].querySelector('img').src;
        const imgAlt = allVisibleImages[currentImageIndex].querySelector('img').alt;
        
        viewerImage.src = imgSrc;
        viewerImage.alt = imgAlt;
        updateImageCounter();
    });

    // Next image
    nextImage.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex + 1) % allVisibleImages.length;
        const imgSrc = allVisibleImages[currentImageIndex].querySelector('img').src;
        const imgAlt = allVisibleImages[currentImageIndex].querySelector('img').alt;
        
        viewerImage.src = imgSrc;
        viewerImage.alt = imgAlt;
        updateImageCounter();
    });

    function updateImageCounter() {
        imageCounter.textContent = `${currentImageIndex + 1} / ${allVisibleImages.length}`;
    }

    // Close viewer with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageViewer.classList.contains('active')) {
            imageViewer.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        if (imageViewer.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                prevImage.click();
            } else if (e.key === 'ArrowRight') {
                nextImage.click();
            }
        }
    });

    // Search functionality
    const searchInput = document.getElementById('gallerySearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            galleryItems.forEach(item => {
                const altText = item.querySelector('img').alt.toLowerCase();
                const caption = item.getAttribute('data-caption') || '';
                
                if (altText.includes(searchTerm) || caption.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

});
