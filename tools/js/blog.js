/**
 * PartnerPay Blog & Community Scripts
 * Handles blog filtering, sorting, and search functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const searchInput = document.querySelector('.search-box input');
    const sortSelect = document.getElementById('sortBy');
    const articleCards = document.querySelectorAll('.article-card');
    const categoryLinks = document.querySelectorAll('.category-list li a');
    const topicTags = document.querySelectorAll('.topic-tag');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    // Initialize dynamic relationship images
    updateRelationshipImages();
    
    // Initialize search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            searchArticles(this.value.trim().toLowerCase());
        }, 300));
    }
    
    // Initialize sorting functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortArticles(this.value);
        });
    }
    
    // Handle category filtering
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all category links
            categoryLinks.forEach(cat => {
                cat.parentElement.classList.remove('active');
            });
            
            // Add active class to clicked category
            this.parentElement.classList.add('active');
            
            // Filter articles by category
            const category = this.textContent.trim();
            filterArticlesByCategory(category);
        });
    });
    
    // Handle topic tag filtering
    topicTags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Filter articles by topic
            const topic = this.textContent.trim();
            filterArticlesByTopic(topic);
            
            // Show visual feedback
            this.classList.add('active');
            setTimeout(() => {
                this.classList.remove('active');
            }, 300);
        });
    });
    
    // Handle newsletter subscription
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!validateEmail(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            submitNewsletter(email);
        });
    }
    
    /**
     * Update relationship blog posts with dynamic images
     */
    function updateRelationshipImages() {
        // Array of relationship-themed images
        const relationshipImages = [
            'https://source.unsplash.com/random/600x400/?couple',
            'https://source.unsplash.com/random/600x400/?relationship',
            'https://source.unsplash.com/random/600x400/?love',
            'https://source.unsplash.com/random/600x400/?marriage',
            'https://source.unsplash.com/random/600x400/?family',
            'https://source.unsplash.com/random/600x400/?wedding',
            'https://source.unsplash.com/random/600x400/?date'
        ];
        
        // Find all relationship category posts
        articleCards.forEach(card => {
            const categoryElement = card.querySelector('.article-category');
            if (categoryElement && categoryElement.classList.contains('relationship')) {
                const imageElement = card.querySelector('.article-image img');
                if (imageElement) {
                    // Randomly select a relationship image
                    const randomImage = relationshipImages[Math.floor(Math.random() * relationshipImages.length)];
                    
                    // Create a new image element with fade-in effect
                    const newImage = new Image();
                    newImage.onload = function() {
                        imageElement.src = this.src;
                        imageElement.classList.add('image-fade-in');
                    };
                    newImage.src = randomImage;
                    
                    // Add a post about relationships
                    if (Math.random() > 0.5) {
                        const relationshipPosts = [
                            {
                                title: "5 Communication Exercises That Saved Our Marriage",
                                content: "Discover the daily practices that transformed our relationship during a difficult period and brought us closer than ever before."
                            },
                            {
                                title: "The Financial Love Languages: Understanding Your Partner's Money Mindset",
                                content: "Just like emotional love languages, we all have different approaches to money. Learn how to bridge the gap for financial harmony."
                            },
                            {
                                title: "Building Trust Through Joint Financial Planning",
                                content: "Financial transparency is the foundation of lasting relationships. Here's how to create a system that works for both partners."
                            },
                            {
                                title: "From Roommates to Soulmates: Rekindling Romance After Years Together",
                                content: "Long-term relationships need intentional romance. These proven techniques will help you maintain the spark while building your future."
                            }
                        ];
                        
                        // Randomly select a relationship post
                        const randomPost = relationshipPosts[Math.floor(Math.random() * relationshipPosts.length)];
                        
                        // Update the post title and content if it's a relationship post
                        const titleElement = card.querySelector('h3');
                        const contentElement = card.querySelector('p');
                        
                        if (titleElement && contentElement && Math.random() > 0.7) {
                            titleElement.textContent = randomPost.title;
                            contentElement.textContent = randomPost.content;
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Filter articles by search query
     */
    function searchArticles(query) {
        if (!query) {
            // If search query is empty, show all articles
            articleCards.forEach(card => {
                card.style.display = 'block';
            });
            return;
        }
        
        articleCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.querySelector('p').textContent.toLowerCase();
            const author = card.querySelector('.author span').textContent.toLowerCase();
            
            if (title.includes(query) || content.includes(query) || author.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    /**
     * Sort articles by selected option
     */
    function sortArticles(sortOption) {
        const articlesGrid = document.querySelector('.articles-grid');
        const articlesArray = Array.from(articleCards);
        
        switch (sortOption) {
            case 'latest':
                // Sort by date (newest first)
                articlesArray.sort((a, b) => {
                    const dateA = new Date(a.querySelector('.date span').textContent);
                    const dateB = new Date(b.querySelector('.date span').textContent);
                    return dateB - dateA;
                });
                break;
                
            case 'popular':
                // Sort by likes (most first)
                articlesArray.sort((a, b) => {
                    const likesA = parseInt(a.querySelector('.article-stats span:first-child').textContent.match(/\d+/)[0]);
                    const likesB = parseInt(b.querySelector('.article-stats span:first-child').textContent.match(/\d+/)[0]);
                    return likesB - likesA;
                });
                break;
                
            case 'trending':
                // Sort by comments (most first)
                articlesArray.sort((a, b) => {
                    const commentsA = parseInt(a.querySelector('.article-stats span:last-child').textContent.match(/\d+/)[0]);
                    const commentsB = parseInt(b.querySelector('.article-stats span:last-child').textContent.match(/\d+/)[0]);
                    return commentsB - commentsA;
                });
                break;
        }
        
        // Reorder articles in the DOM
        articlesArray.forEach(article => {
            articlesGrid.appendChild(article);
        });
        
        // Show animation effect
        articlesGrid.classList.add('fade');
        setTimeout(() => {
            articlesGrid.classList.remove('fade');
        }, 300);
    }
    
    /**
     * Filter articles by category
     */
    function filterArticlesByCategory(category) {
        if (category === 'All Categories') {
            // If "All Categories" is selected, show all articles
            articleCards.forEach(card => {
                card.style.display = 'block';
            });
            return;
        }
        
        articleCards.forEach(card => {
            const articleCategory = card.querySelector('.article-category').textContent.trim();
            
            if (category === articleCategory || category.includes(articleCategory)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    /**
     * Filter articles by topic
     */
    function filterArticlesByTopic(topic) {
        articleCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.querySelector('p').textContent.toLowerCase();
            
            if (title.toLowerCase().includes(topic.toLowerCase()) || 
                content.toLowerCase().includes(topic.toLowerCase())) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update search input to match the topic
        if (searchInput) {
            searchInput.value = topic;
        }
    }
    
    /**
     * Submit newsletter subscription
     */
    function submitNewsletter(email) {
        // Show loading indicator
        const submitBtn = newsletterForm.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            showToast('Thank you for subscribing to our newsletter!', 'success');
            
            // Clear the input field
            newsletterForm.querySelector('input[type="email"]').value = '';
        }, 1500);
    }
    
    /**
     * Validate email format
     */
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    /**
     * Debounce function to limit execution rate
     */
    function debounce(func, delay) {
        let timer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }
    
    /**
     * Show toast notification
     */
    function showToast(message, type = 'info') {
        // Check if toast container exists, if not create it
        let toastContainer = document.querySelector('.toast-container');
        
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Set icon based on toast type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        toast.innerHTML = `
            <div class="toast-icon"><i class="fas fa-${icon}"></i></div>
            <div class="toast-content">${message}</div>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add toast to container
        toastContainer.appendChild(toast);
        
        // Add show class after a small delay to trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto-remove toast after 5 seconds
        const autoRemoveTimeout = setTimeout(() => {
            removeToast(toast);
        }, 5000);
        
        // Handle close button click
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemoveTimeout);
            removeToast(toast);
        });
    }
    
    /**
     * Remove toast with animation
     */
    function removeToast(toast) {
        toast.classList.remove('show');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
                
                // Remove container if no more toasts
                const toastContainer = document.querySelector('.toast-container');
                if (toastContainer && toastContainer.children.length === 0) {
                    document.body.removeChild(toastContainer);
                }
            }
        }, 300);
    }
    
    // Add toast container styles dynamically
    addToastStyles();
    
    /**
     * Add toast notification styles
     */
    function addToastStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .toast-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                z-index: 9999;
                max-width: 350px;
            }
            
            .toast {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                padding: 12px 16px;
                display: flex;
                align-items: center;
                gap: 12px;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s ease;
                overflow: hidden;
            }
            
            .toast.show {
                transform: translateX(0);
                opacity: 1;
            }
            
            .toast-icon {
                flex-shrink: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                font-size: 14px;
            }
            
            .toast-info .toast-icon {
                background-color: #EBF2FF;
                color: #1E40AF;
            }
            
            .toast-success .toast-icon {
                background-color: #ECFDF5;
                color: #065F46;
            }
            
            .toast-error .toast-icon {
                background-color: #FEF2F2;
                color: #B91C1C;
            }
            
            .toast-warning .toast-icon {
                background-color: #FFFBEB;
                color: #92400E;
            }
            
            .toast-content {
                flex: 1;
                font-size: 14px;
                color: #4B5563;
            }
            
            .toast-close {
                background: none;
                border: none;
                color: #9CA3AF;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                flex-shrink: 0;
                padding: 0;
                transition: color 0.2s ease;
            }
            
            .toast-close:hover {
                color: #4B5563;
            }
            
            @media (max-width: 480px) {
                .toast-container {
                    bottom: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Handle discussion card interactions
    const discussionCards = document.querySelectorAll('.discussion-card');
    discussionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicked on the join discussion link
            if (e.target.classList.contains('join-discussion') || 
                e.target.closest('.join-discussion')) {
                return;
            }
            
            // Redirect to community page
            window.location.href = 'community.html';
        });
    });
}); 