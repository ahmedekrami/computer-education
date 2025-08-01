// Gallery functionality for the Computer Education Department website

document.addEventListener('DOMContentLoaded', function() {
    initGalleryFilters();
    initImageModal();
    initGalleryAnimations();
});

// Gallery filter functionality
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-buttons .btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            filterGalleryItems(filter, galleryItems);
        });
    });
}

// Filter gallery items with animation
function filterGalleryItems(filter, items) {
    items.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            // Show item
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 50);
        } else {
            // Hide item
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Image modal functionality
function initImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const zoomButtons = document.querySelectorAll('[data-bs-target="#imageModal"]');
    
    zoomButtons.forEach(button => {
        button.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            modalImage.src = imageSrc;
        });
    });
    
    // Reset modal image when closed
    modal.addEventListener('hidden.bs.modal', function() {
        modalImage.src = '';
    });
    
    // Add keyboard navigation for modal
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('show')) {
            if (e.key === 'Escape') {
                const bsModal = bootstrap.Modal.getInstance(modal);
                bsModal.hide();
            }
        }
    });
}

// Gallery animations
function initGalleryAnimations() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // Stagger animation
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Setup initial state and observe
    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease-out';
        observer.observe(item);
    });
}

// Masonry layout (optional enhancement)
function initMasonryLayout() {
    const grid = document.querySelector('.gallery-grid');
    
    if (grid && window.innerWidth > 768) {
        // Simulate masonry effect with CSS Grid
        const items = grid.querySelectorAll('.gallery-item');
        
        items.forEach(item => {
            const card = item.querySelector('.gallery-card');
            const image = card.querySelector('.gallery-image');
            
            image.addEventListener('load', function() {
                const aspectRatio = this.naturalHeight / this.naturalWidth;
                
                if (aspectRatio > 1.2) {
                    // Tall image
                    item.style.gridRowEnd = 'span 2';
                } else if (aspectRatio < 0.8) {
                    // Wide image
                    card.style.height = '200px';
                }
            });
        });
    }
}

// Image lazy loading for gallery
function initGalleryLazyLoading() {
    const images = document.querySelectorAll('.gallery-image');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Add loading animation
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                
                img.addEventListener('load', function() {
                    this.style.opacity = '1';
                });
                
                // If image is already cached
                if (img.complete) {
                    img.style.opacity = '1';
                }
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Gallery search functionality (bonus feature)
function initGallerySearch() {
    const searchInput = document.getElementById('gallerySearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const galleryItems = document.querySelectorAll('.gallery-item');
            
            galleryItems.forEach(item => {
                const title = item.querySelector('.gallery-info h5').textContent.toLowerCase();
                const description = item.querySelector('.gallery-info p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

// Fullscreen gallery viewer (bonus feature)
function initFullscreenViewer() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    let currentImageIndex = 0;
    let imagesList = Array.from(galleryImages);
    
    // Create fullscreen viewer elements
    const viewer = document.createElement('div');
    viewer.className = 'fullscreen-viewer';
    viewer.innerHTML = `
        <div class="viewer-container">
            <button class="viewer-close">&times;</button>
            <button class="viewer-prev">‹</button>
            <button class="viewer-next">›</button>
            <img class="viewer-image" src="" alt="">
            <div class="viewer-counter">
                <span class="current">1</span> / <span class="total">${imagesList.length}</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(viewer);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .fullscreen-viewer {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 9999;
            display: none;
            align-items: center;
            justify-content: center;
        }
        
        .viewer-container {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        
        .viewer-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        
        .viewer-close,
        .viewer-prev,
        .viewer-next {
            position: absolute;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            font-size: 2rem;
            padding: 10px 15px;
            cursor: pointer;
            border-radius: 50%;
            transition: background 0.3s ease;
        }
        
        .viewer-close {
            top: -50px;
            right: -50px;
        }
        
        .viewer-prev {
            left: -60px;
            top: 50%;
            transform: translateY(-50%);
        }
        
        .viewer-next {
            right: -60px;
            top: 50%;
            transform: translateY(-50%);
        }
        
        .viewer-close:hover,
        .viewer-prev:hover,
        .viewer-next:hover {
            background: rgba(255, 255, 255, 0.4);
        }
        
        .viewer-counter {
            position: absolute;
            bottom: -40px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 1.1rem;
        }
        
        @media (max-width: 768px) {
            .viewer-close {
                top: 10px;
                right: 10px;
                font-size: 1.5rem;
                padding: 8px 12px;
            }
            
            .viewer-prev,
            .viewer-next {
                font-size: 1.5rem;
                padding: 8px 12px;
            }
            
            .viewer-prev {
                left: 10px;
            }
            
            .viewer-next {
                right: 10px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Event listeners
    const viewerImage = viewer.querySelector('.viewer-image');
    const closeBtn = viewer.querySelector('.viewer-close');
    const prevBtn = viewer.querySelector('.viewer-prev');
    const nextBtn = viewer.querySelector('.viewer-next');
    const currentCounter = viewer.querySelector('.current');
    
    // Double click to open fullscreen
    galleryImages.forEach((img, index) => {
        img.addEventListener('dblclick', function() {
            currentImageIndex = index;
            showFullscreenImage();
        });
    });
    
    closeBtn.addEventListener('click', hideViewer);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (viewer.style.display === 'flex') {
            switch(e.key) {
                case 'Escape':
                    hideViewer();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });
    
    // Click outside to close
    viewer.addEventListener('click', function(e) {
        if (e.target === viewer) {
            hideViewer();
        }
    });
    
    function showFullscreenImage() {
        const img = imagesList[currentImageIndex];
        viewerImage.src = img.src;
        currentCounter.textContent = currentImageIndex + 1;
        viewer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function hideViewer() {
        viewer.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + imagesList.length) % imagesList.length;
        showFullscreenImage();
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % imagesList.length;
        showFullscreenImage();
    }
}

// Initialize all gallery features
function initAllGalleryFeatures() {
    initGalleryFilters();
    initImageModal();
    initGalleryAnimations();
    initGalleryLazyLoading();
    initGallerySearch();
    
    // Enable fullscreen viewer on desktop only
    if (window.innerWidth > 768) {
        initFullscreenViewer();
    }
}

// Auto-initialize when not already called
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllGalleryFeatures);
} else {
    initAllGalleryFeatures();
}