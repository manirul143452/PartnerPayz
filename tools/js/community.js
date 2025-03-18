/**
 * PartnerPay Community Scripts
 * Handles forum interactions, discussion posting, and gamification features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const searchInput = document.querySelector('.search-box input');
    const sortSelect = document.getElementById('sortBy');
    const discussionItems = document.querySelectorAll('.discussion-item');
    const forumCategories = document.querySelectorAll('.forum-categories li a');
    const newDiscussionBtn = document.getElementById('newDiscussionBtn');
    const discussionModal = document.getElementById('newDiscussionModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelDiscussionBtn = document.getElementById('cancelDiscussion');
    const discussionForm = document.getElementById('discussionForm');
    
    // Initialize search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            searchDiscussions(this.value.trim().toLowerCase());
        }, 300));
    }
    
    // Initialize sorting functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortDiscussions(this.value);
        });
    }
    
    // Handle category filtering
    forumCategories.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all category links
            forumCategories.forEach(cat => {
                cat.parentElement.classList.remove('active');
            });
            
            // Add active class to clicked category
            this.parentElement.classList.add('active');
            
            // Filter discussions by category
            const category = this.querySelector('.category-name').textContent.trim();
            filterDiscussionsByCategory(category);
        });
    });
    
    // Make discussion items clickable
    discussionItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Prevent default behavior for buttons and links inside the discussion item
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || 
                e.target.closest('button') || e.target.closest('a')) {
                return;
            }
            
            // In a real application, this would navigate to the discussion detail page
            // For now, let's show a toast notification
            showToast('Viewing discussion details would open in a real application', 'info');
        });
    });
    
    // Handle new discussion button
    if (newDiscussionBtn && discussionModal) {
        newDiscussionBtn.addEventListener('click', function() {
            openModal(discussionModal);
        });
    }
    
    // Handle modal close button
    if (closeModalBtn && discussionModal) {
        closeModalBtn.addEventListener('click', function() {
            closeModal(discussionModal);
        });
    }
    
    // Handle cancel discussion button
    if (cancelDiscussionBtn && discussionModal) {
        cancelDiscussionBtn.addEventListener('click', function() {
            closeModal(discussionModal);
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === discussionModal) {
            closeModal(discussionModal);
        }
    });
    
    // Handle rich text editor toolbar buttons
    const toolbarButtons = document.querySelectorAll('.toolbar-btn');
    const discussionContent = document.getElementById('discussionContent');
    
    if (toolbarButtons.length && discussionContent) {
        toolbarButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                handleTextFormatting(action, discussionContent);
            });
        });
    }
    
    // Handle tag input
    const tagInput = document.getElementById('tagInput');
    const tagSuggestions = document.querySelectorAll('.tag-suggestion');
    const tagsContainer = document.querySelector('.tags');
    
    if (tagInput && tagsContainer) {
        // Add tag when Enter key is pressed
        tagInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const tag = this.value.trim();
                
                if (tag && !tagExists(tag)) {
                    addTag(tag);
                    this.value = '';
                }
            }
        });
        
        // Add tag when clicking on a suggestion
        tagSuggestions.forEach(suggestion => {
            suggestion.addEventListener('click', function() {
                const tag = this.textContent.trim();
                
                if (!tagExists(tag)) {
                    addTag(tag);
                    tagInput.value = '';
                    tagInput.focus();
                }
            });
        });
        
        // Delegate click event for removing tags
        tagsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('fa-times')) {
                const tagElement = e.target.closest('.tag');
                if (tagElement) {
                    tagElement.remove();
                }
            }
        });
    }
    
    // Handle discussion form submission
    if (discussionForm) {
        discussionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const title = document.getElementById('discussionTitle').value.trim();
            const content = document.getElementById('discussionContent').value.trim();
            const category = document.querySelector('input[name="category"]:checked');
            
            if (!title) {
                showToast('Please enter a discussion title', 'error');
                return;
            }
            
            if (!content) {
                showToast('Please enter discussion content', 'error');
                return;
            }
            
            if (!category) {
                showToast('Please select a category', 'error');
                return;
            }
            
            // Submit form (in a real application, this would be an API call)
            submitDiscussion(title, content, category.value);
        });
    }
    
    /**
     * Search discussions based on query
     */
    function searchDiscussions(query) {
        if (!query) {
            // If search query is empty, show all discussions
            discussionItems.forEach(item => {
                item.style.display = 'flex';
            });
            return;
        }
        
        discussionItems.forEach(item => {
            const title = item.querySelector('.discussion-title').textContent.toLowerCase();
            const excerpt = item.querySelector('.discussion-excerpt');
            const content = excerpt ? excerpt.textContent.toLowerCase() : '';
            const author = item.querySelector('.author span').textContent.toLowerCase();
            const category = item.querySelector('.discussion-category span').textContent.toLowerCase();
            
            if (title.includes(query) || content.includes(query) || 
                author.includes(query) || category.includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    /**
     * Sort discussions by selected option
     */
    function sortDiscussions(sortOption) {
        const discussionsContainer = document.querySelector('.forum-discussions');
        const discussionsArray = Array.from(discussionItems);
        
        switch (sortOption) {
            case 'latest':
                // Sort by date (newest first)
                discussionsArray.sort((a, b) => {
                    const dateA = getRelativeDate(a.querySelector('.post-date').textContent);
                    const dateB = getRelativeDate(b.querySelector('.post-date').textContent);
                    return dateA - dateB;
                });
                break;
                
            case 'popular':
                // Sort by views (most first)
                discussionsArray.sort((a, b) => {
                    const viewsA = parseInt(a.querySelector('.fa-eye + span').textContent.replace(/[^\d]/g, ''));
                    const viewsB = parseInt(b.querySelector('.fa-eye + span').textContent.replace(/[^\d]/g, ''));
                    return viewsB - viewsA;
                });
                break;
                
            case 'trending':
                // Sort by comments (most first)
                discussionsArray.sort((a, b) => {
                    const commentsA = parseInt(a.querySelector('.fa-comment + span').textContent.replace(/[^\d]/g, ''));
                    const commentsB = parseInt(b.querySelector('.fa-comment + span').textContent.replace(/[^\d]/g, ''));
                    return commentsB - commentsA;
                });
                break;
        }
        
        // Reorder discussions in the DOM
        discussionsArray.forEach(discussion => {
            discussionsContainer.appendChild(discussion);
        });
        
        // Show animation effect
        discussionsContainer.classList.add('fade');
        setTimeout(() => {
            discussionsContainer.classList.remove('fade');
        }, 300);
    }
    
    /**
     * Filter discussions by category
     */
    function filterDiscussionsByCategory(category) {
        if (category === 'All Discussions') {
            // If "All Discussions" is selected, show all discussions
            discussionItems.forEach(item => {
                item.style.display = 'flex';
            });
            return;
        }
        
        discussionItems.forEach(item => {
            const discussionCategory = item.querySelector('.discussion-category span').textContent.trim();
            
            if (category === discussionCategory) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    /**
     * Submit discussion form
     */
    function submitDiscussion(title, content, category) {
        // Show loading state
        const submitBtn = discussionForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
        submitBtn.disabled = true;
        
        // Get selected tags
        const tags = Array.from(document.querySelectorAll('.tag')).map(tag => {
            return tag.textContent.trim().replace('×', '').trim();
        });
        
        // Get notification preferences
        const notifyReplies = document.querySelector('input[name="notifyReplies"]').checked;
        const notifyLikes = document.querySelector('input[name="notifyLikes"]').checked;
        
        // Simulate API call
        setTimeout(() => {
            // Reset form
            discussionForm.reset();
            document.querySelectorAll('.tag').forEach(tag => tag.remove());
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Close modal
            closeModal(discussionModal);
            
            // Show success message
            showToast('Discussion posted successfully!', 'success');
            
            // In a real application, we would add the new discussion to the list
            // For now, let's just log the data
            console.log({
                title,
                content,
                category,
                tags,
                notifyReplies,
                notifyLikes
            });
        }, 1500);
    }
    
    /**
     * Handle text formatting in rich text editor
     */
    function handleTextFormatting(action, textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        let replacement = '';
        
        switch (action) {
            case 'bold':
                replacement = `**${selectedText}**`;
                break;
                
            case 'italic':
                replacement = `*${selectedText}*`;
                break;
                
            case 'underline':
                replacement = `__${selectedText}__`;
                break;
                
            case 'link':
                replacement = `[${selectedText}](url)`;
                break;
                
            case 'list-ul':
                replacement = selectedText.split('\n').map(line => `- ${line}`).join('\n');
                break;
                
            case 'list-ol':
                replacement = selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
                break;
        }
        
        // Insert the formatted text
        textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
        
        // Set the cursor position
        textarea.focus();
        textarea.selectionStart = start + replacement.length;
        textarea.selectionEnd = start + replacement.length;
    }
    
    /**
     * Add tag to the tags container
     */
    function addTag(tag) {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag';
        tagElement.innerHTML = `
            ${tag}
            <i class="fas fa-times"></i>
        `;
        
        document.querySelector('.tags').appendChild(tagElement);
    }
    
    /**
     * Check if tag already exists
     */
    function tagExists(tag) {
        const tags = Array.from(document.querySelectorAll('.tag')).map(tagEl => {
            return tagEl.textContent.trim().replace('×', '').trim();
        });
        
        return tags.includes(tag);
    }
    
    /**
     * Open modal
     */
    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * Close modal
     */
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    /**
     * Convert relative date string to timestamp
     */
    function getRelativeDate(dateStr) {
        const now = new Date();
        
        if (dateStr.includes('hours ago') || dateStr.includes('hour ago')) {
            const hours = parseInt(dateStr);
            return now.getTime() - (hours * 60 * 60 * 1000);
        } else if (dateStr.includes('days ago') || dateStr.includes('day ago')) {
            const days = parseInt(dateStr);
            return now.getTime() - (days * 24 * 60 * 60 * 1000);
        } else if (dateStr.includes('week ago') || dateStr.includes('weeks ago')) {
            const weeks = parseInt(dateStr);
            return now.getTime() - (weeks * 7 * 24 * 60 * 60 * 1000);
        } else {
            // Assume it's a date in format "MMM DD, YYYY"
            return new Date(dateStr).getTime();
        }
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
}); 