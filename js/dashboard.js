// Dashboard specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // ===== INITIALIZATION =====
    initInvestmentChart();
    initTipTabs();
    initAnimations();
    initUserMenu();
    initTooltips();
    initProgressBars();
    initPartnerUpdates();
    initNavigation();
    initMessaging();
    initSettings();
    initToastSystem();
    
    // New relationship features initialization
    initAnniversaryReminder();
    initDateAssistant();
    initSpecialDates();
    initLoveTracker();
    initLoveTrackerAnimations();

    // ===== CHART INITIALIZATION =====
    function initInvestmentChart() {
        const ctx = document.getElementById('investmentChart').getContext('2d');
        
        // Chart data
        const investmentData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Total Portfolio Value',
                    data: [8200, 8450, 8600, 9200, 10100, 12450],
                    backgroundColor: 'rgba(107, 155, 220, 0.2)',
                    borderColor: 'rgba(107, 155, 220, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Contributions',
                    data: [8000, 8200, 8400, 8600, 8800, 9000],
                    backgroundColor: 'rgba(240, 160, 160, 0.1)',
                    borderColor: 'rgba(240, 160, 160, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }
            ]
        };
 // Chart options
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 10,
                        padding: 10,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ₹';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(2);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        },
                        font: {
                            size: 10
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                }
            }
        };
        
        // Initialize chart
        const investmentChart = new Chart(ctx, {
            type: 'line',
            data: investmentData,
            options: chartOptions
        });
    }

    // ===== TIP TABS INITIALIZATION =====
    function initTipTabs() {
        const tipTabs = document.querySelectorAll('.tip-tab');
        const tipContents = document.querySelectorAll('.tip-content');
        
        tipTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                tipTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to current tab
                this.classList.add('active');
                
                // Hide all content sections
                tipContents.forEach(content => content.classList.remove('active'));
                
                // Show current content section
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId + '-tip').classList.add('active');
            });
        });
    }

    // ===== ANIMATIONS INITIALIZATION =====
    function initAnimations() {
        const statCards = document.querySelectorAll('.stat-card');
        
        setTimeout(() => {
            statCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate');
                }, index * 100);
            });
        }, 300);
    }

    // ===== USER MENU INITIALIZATION =====
    function initUserMenu() {
        const userMenu = document.querySelector('.user-menu');
        
        if (userMenu) {
            userMenu.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.toggle('active');
            });
            
            document.addEventListener('click', function() {
                userMenu.classList.remove('active');
            });
        }

        // Initialize user badge tooltips
        const userBadges = document.querySelectorAll('.user-badge');
        
        userBadges.forEach(badge => {
            const badgeInfo = badge.getAttribute('data-badge-info');
            
            badge.addEventListener('mouseenter', function(e) {
                const popup = document.createElement('div');
                popup.classList.add('badge-popup');
                popup.textContent = badgeInfo;
                document.body.appendChild(popup);
                
                const rect = badge.getBoundingClientRect();
                popup.style.top = (rect.bottom + 10) + 'px';
                popup.style.left = (rect.left - 10) + 'px';
            });
            
            badge.addEventListener('mouseleave', function() {
                const popup = document.querySelector('.badge-popup');
                if (popup) {
                    popup.remove();
                }
            });
        });
    }

    // ===== TOOLTIPS INITIALIZATION =====
    function initTooltips() {
        const btnIcons = document.querySelectorAll('.btn-icon');
        
        btnIcons.forEach(btn => {
            const tooltipText = btn.getAttribute('data-tooltip');
            
            if (tooltipText) {
                const tooltip = document.createElement('span');
                tooltip.classList.add('tooltip');
                tooltip.textContent = tooltipText;
                btn.appendChild(tooltip);
                
                btn.addEventListener('mouseenter', () => {
                    tooltip.style.opacity = '1';
                });
                
                btn.addEventListener('mouseleave', () => {
                    tooltip.style.opacity = '0';
                });
            }
        });
    }

    // ===== PROGRESS BARS INITIALIZATION =====
    function initProgressBars() {
        const progressBars = document.querySelectorAll('.progress');
        
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.transition = 'width 1s ease';
                bar.style.width = width;
            }, 500);
        });
    }

    // ===== PARTNER UPDATES INITIALIZATION =====
    function initPartnerUpdates() {
        const partnerUpdates = document.querySelector('.partner-updates');
        
        if (partnerUpdates) {
            // Simulate new partner update
            setTimeout(() => {
                const newUpdate = document.createElement('div');
                newUpdate.classList.add('partner-card', 'new-update');
                newUpdate.innerHTML = `
                    <div class="partner-avatar">
                        <img src="images/partner-avatar.jpg" alt="Partner Avatar">
                        <span class="online-status"></span>
                    </div>
                    <div class="partner-info">
                        <h4>Priya Malhotra</h4>
                        <p>Sent you a message: "How about dinner tonight?"</p>
                        <span class="time">Just now</span>
                    </div>
                `;
                
                const firstCard = partnerUpdates.querySelector('.partner-card');
                partnerUpdates.querySelector('.item-header').insertAdjacentElement('afterend', newUpdate);
                
                // Add fade-in animation using JavaScript
                newUpdate.style.opacity = '0';
                newUpdate.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    newUpdate.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    newUpdate.style.opacity = '1';
                    newUpdate.style.transform = 'translateY(0)';
                }, 100);
                
                // Show notification
                showToast('success', 'New Message', 'New message from Priya: "How about dinner tonight?"', 5000);
            }, 10000);
        }
    }

    // ===== NAVIGATION INITIALIZATION =====
    function initNavigation() {
        const navLinks = document.querySelectorAll('.sidebar-menu li a');
        const sections = document.querySelectorAll('.dashboard-section');
        
        // Fix for section mapping - Create a direct mapping for sidebar items to section IDs
        const sectionMapping = {
            'overview': 'overview-section',
            'my partner': 'my-partner-section',
            'investments': 'investments-section',
            'date planner': 'date-planner-section',
            'savings goals': 'savings-goals-section',
            'messages': 'messages-section',
            'anniversary reminder': 'anniversary-reminder-section',
            'date assistant': 'date-assistant-section',
            'special dates': 'special-dates-section',
            'love tracker': 'love-tracker-section',
            'settings': 'settings-section'
        };
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.parentElement.classList.remove('active'));
                
                // Add active class to current link
                this.parentElement.classList.add('active');
                
                // Hide all sections
                sections.forEach(section => section.classList.remove('active'));
                
                // Show corresponding section
                const linkText = this.textContent.trim().toLowerCase();
                const sectionId = sectionMapping[linkText] || 'overview-section';
                const section = document.getElementById(sectionId);
                
                if (section) {
                    section.classList.add('active');
                    console.log('Activated section:', sectionId);
                } else {
                    // Default to overview if section not found
                    console.log('Section not found, defaulting to overview');
                    document.getElementById('overview-section').classList.add('active');
                }
            });
        });
        
        // Also handle the banner buttons for relationship sections
        const bannerButtons = document.querySelectorAll('.banner-btn');
        bannerButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const sectionId = this.getAttribute('data-section');
                if(sectionId) {
                    // Update the sidebar active item
                    navLinks.forEach(l => {
                        const linkText = l.textContent.trim().toLowerCase();
                        if(sectionMapping[linkText] === sectionId) {
                            // Remove active class from all links
                            navLinks.forEach(link => link.parentElement.classList.remove('active'));
                            // Add active to this one
                            l.parentElement.classList.add('active');
                        }
                    });
                    
                    // Hide all sections
                    sections.forEach(section => section.classList.remove('active'));
                    
                    // Show the target section
                    const targetSection = document.getElementById(sectionId);
                    if(targetSection) {
                        targetSection.classList.add('active');
                    }
                }
            });
        });
    }

    // ===== MESSAGING INITIALIZATION =====
    function initMessaging() {
        const messageForm = document.getElementById('messageForm');
        const messageInput = document.getElementById('messageInput');
        const chatMessages = document.getElementById('chatMessages');
        const contactItems = document.querySelectorAll('.contact-item');
        const chatSearch = document.getElementById('chatSearch');
        
        if (messageForm && messageInput && chatMessages) {
            // Handle message form submission
            messageForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const message = messageInput.value.trim();
                
                if (message === '') {
                    showToast('error', 'Error', 'Please enter a message', 3000);
                    return;
                }
                
                // Add message to chat
                addMessage(message, 'sent');
                
                // Clear input
                messageInput.value = '';
                
                // Simulate reply after delay
                setTimeout(() => {
                    const replies = [
                        "That sounds great!",
                        "I'll check my schedule and get back to you.",
                        "Perfect! I was thinking the same thing.",
                        "Can we discuss this later?",
                        "I'm looking forward to it!"
                    ];
                    
                    const randomReply = replies[Math.floor(Math.random() * replies.length)];
                    addMessage(randomReply, 'received');
                    
                    // Show notification
                    showToast('info', 'New Message', 'Priya Malhotra replied to your message', 3000);
                }, 2000);
            });
            
            // Handle contact selection
            contactItems.forEach(item => {
                item.addEventListener('click', function() {
                    // Remove active class from all contacts
                    contactItems.forEach(i => i.classList.remove('active'));
                    
                    // Add active class to current contact
                    this.classList.add('active');
                    
                    // Update chat header
                    const contactName = this.querySelector('.contact-info h4').textContent;
                    const contactAvatar = this.querySelector('.contact-avatar img').src;
                    const isOnline = this.querySelector('.status.online') !== null;
                    
                    document.querySelector('.chat-contact .contact-info h4').textContent = contactName;
                    document.querySelector('.chat-contact .contact-avatar img').src = contactAvatar;
                    
                    if (isOnline) {
                        document.querySelector('.chat-contact .contact-info p').textContent = 'Online';
                        document.querySelector('.chat-contact .status').classList.add('online');
                    } else {
                        document.querySelector('.chat-contact .contact-info p').textContent = 'Offline';
                        document.querySelector('.chat-contact .status').classList.remove('online');
                    }
                    
                    // Clear unread count
                    const unreadBadge = this.querySelector('.unread');
                    if (unreadBadge) {
                        unreadBadge.remove();
                    }
                    
                    // Simulate loading chat history
                    chatMessages.innerHTML = '<div class="message-date">Today</div>';
                    
                    setTimeout(() => {
                        if (contactName === 'Priya Malhotra') {
                            addMessage('Good morning! How are you today?', 'received');
                            addMessage('I\'m doing great. Just checking our investments.', 'sent');
                            addMessage('That\'s awesome! I was thinking about our vacation plans.', 'received');
                            addMessage('Should we book the tickets for Maldives this week?', 'received');
                        } else if (contactName === 'Rahul Mehta') {
                            addMessage('Have you seen the market today?', 'received');
                            addMessage('Yes, it\'s looking good. Our portfolio is up by 2.5%.', 'sent');
                            addMessage('That\'s great news! What stocks are performing well?', 'received');
                        } else if (contactName === 'Financial Advisor') {
                            addMessage('Your portfolio review is ready', 'received');
                            addMessage('Thanks for the update. When can we discuss it?', 'sent');
                            addMessage('I\'m available tomorrow at 2 PM. Does that work for you?', 'received');
                        }
                    }, 500);
                });
            });
            
            // Handle chat search
            if (chatSearch) {
                chatSearch.addEventListener('input', function() {
                    const searchTerm = this.value.toLowerCase().trim();
                    
                    contactItems.forEach(item => {
                        const contactName = item.querySelector('.contact-info h4').textContent.toLowerCase();
                        const contactMessage = item.querySelector('.contact-info p').textContent.toLowerCase();
                        
                        if (contactName.includes(searchTerm) || contactMessage.includes(searchTerm)) {
                            item.style.display = 'flex';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                });
            }
        }
        
        // Function to add message to chat
        function addMessage(text, type) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', type);
            
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
            
            messageElement.innerHTML = `
                <div class="message-content">
                    <p>${text}</p>
                    <span class="message-time">${timeString}</span>
                </div>
            `;
            
            chatMessages.appendChild(messageElement);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // ===== SETTINGS INITIALIZATION =====
    function initSettings() {
        const settingsMenuItems = document.querySelectorAll('.settings-menu-item');
        const settingsPanels = document.querySelectorAll('.settings-panel');
        const settingsForms = document.querySelectorAll('.settings-content form');
        
        // Handle settings menu item click
        settingsMenuItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all menu items
                settingsMenuItems.forEach(i => i.classList.remove('active'));
                
                // Add active class to current menu item
                this.classList.add('active');
                
                // Hide all panels
                settingsPanels.forEach(panel => panel.classList.remove('active'));
                
                // Show corresponding panel
                const panelId = this.getAttribute('data-settings') + '-settings';
                document.getElementById(panelId).classList.add('active');
            });
        });
        
        // Handle settings form submissions
        settingsForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(this);
                const formObject = {};
                
                formData.forEach((value, key) => {
                    formObject[key] = value;
                });
                
                // Validate form data
                let isValid = true;
                let errorMessage = '';
                
                if (this.id === 'profileSettingsForm') {
                    if (!formObject.fullName || formObject.fullName.trim() === '') {
                        isValid = false;
                        errorMessage = 'Full name is required';
                    } else if (!formObject.email || !isValidEmail(formObject.email)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                } else if (this.id === 'securitySettingsForm') {
                    if (formObject.newPassword && formObject.newPassword !== formObject.confirmPassword) {
                        isValid = false;
                        errorMessage = 'Passwords do not match';
                    }
                }
                
                if (!isValid) {
                    showToast('error', 'Error', errorMessage, 3000);
                    return;
                }
                
                // Show loading state
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
                
                // Simulate API call
                setTimeout(() => {
                    // Reset button
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    
                    // Show success message
                    let successMessage = '';
                    
                    if (this.id === 'profileSettingsForm') {
                        successMessage = 'Profile settings updated successfully';
                        // Update user name in header and sidebar
                        document.querySelector('.user-menu .user-name').textContent = formObject.fullName;
                        document.querySelector('.user-profile h3').textContent = formObject.fullName;
                    } else if (this.id === 'notificationSettingsForm') {
                        successMessage = 'Notification settings updated successfully';
                    } else if (this.id === 'securitySettingsForm') {
                        successMessage = 'Security settings updated successfully';
                        // Clear password fields
                        this.reset();
                    } else if (this.id === 'preferencesSettingsForm') {
                        successMessage = 'Preferences updated successfully';
                    }
                    
                    showToast('success', 'Success', successMessage, 3000);
                }, 1500);
            });
        });
        
        // Function to validate email
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    }

    // ===== TOAST NOTIFICATION SYSTEM =====
    function initToastSystem() {
        // Toast container is already in the HTML
    }
    
    // Function to show toast notification
    function showToast(type, title, message, duration = 3000) {
        const toastContainer = document.getElementById('toastContainer');
        
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        
        let iconClass = '';
        
        switch (type) {
            case 'success':
                iconClass = 'fas fa-check-circle';
                break;
            case 'error':
                iconClass = 'fas fa-exclamation-circle';
                break;
            case 'info':
                iconClass = 'fas fa-info-circle';
                break;
            case 'warning':
                iconClass = 'fas fa-exclamation-triangle';
                break;
            default:
                iconClass = 'fas fa-bell';
        }
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
            <div class="toast-progress"></div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Animate progress bar
        const progressBar = toast.querySelector('.toast-progress');
        progressBar.style.width = '100%';
        progressBar.style.transitionDuration = `${duration}ms`;
        
        setTimeout(() => {
            progressBar.style.width = '0%';
        }, 10);
        
        // Close button functionality
        const closeButton = toast.querySelector('.toast-close');
        closeButton.addEventListener('click', () => {
            closeToast(toast);
        });
        
        // Auto close after duration
        setTimeout(() => {
            closeToast(toast);
        }, duration);
        
        function closeToast(toastElement) {
            toastElement.style.animation = 'slideOut 0.3s ease forwards';
            
            setTimeout(() => {
                toastElement.remove();
            }, 300);
        }
    }
    
    // Make showToast function globally available
    window.showToast = showToast;
    
    // ===== ANNIVERSARY REMINDER INITIALIZATION =====
    function initAnniversaryReminder() {
        const anniversaryForm = document.getElementById('anniversaryForm');
        const anniversaryCards = document.getElementById('anniversaryCards');
        const planDateBtn = document.getElementById('planDateBtn');
        
        if (!anniversaryForm || !anniversaryCards) return;
        
        // Handle form submission
        anniversaryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const anniversaryDate = document.getElementById('anniversaryDate').value;
            const anniversaryLabel = document.getElementById('anniversaryLabel').value;
            const reminderDays = document.getElementById('reminderDays').value;
            
            if (!anniversaryDate || !anniversaryLabel) {
                showToast('error', 'Error', 'Please fill in all required fields', 3000);
                return;
            }
            
            // Format the date
            const formattedDate = new Date(anniversaryDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Calculate days left
            const today = new Date();
            const annDate = new Date(anniversaryDate);
            const daysLeft = Math.ceil((annDate - today) / (1000 * 60 * 60 * 24));
            
            // Create new anniversary card
            const cardHTML = `
                <div class="reminder-card new-card">
                    <div class="reminder-icon">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <div class="reminder-details">
                        <h4>${anniversaryLabel}</h4>
                        <p><i class="far fa-calendar"></i> ${formattedDate}</p>
                        <div class="countdown">${daysLeft} days left</div>
                    </div>
                    <div class="reminder-actions">
                        <button class="btn-icon" data-tooltip="Edit"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon" data-tooltip="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
            
            // Add the new card to the list
            anniversaryCards.insertAdjacentHTML('afterbegin', cardHTML);
            
            // Reset form
            anniversaryForm.reset();
            
            // Show success message
            showToast('success', 'Success', 'Anniversary added successfully', 3000);
            
            // Fade in animation for the new card
            setTimeout(() => {
                const newCard = document.querySelector('.reminder-card.new-card');
                if (newCard) {
                    newCard.classList.remove('new-card');
                }
            }, 10);
            
            // Initialize tooltips for new buttons
            initTooltips();
        });
        
        // Delete anniversary handler
        anniversaryCards.addEventListener('click', function(e) {
            if (e.target.closest('.fa-trash')) {
                const reminderCard = e.target.closest('.reminder-card');
                
                // Ask for confirmation
                if (confirm('Are you sure you want to delete this anniversary?')) {
                    // Remove the card with a fade-out effect
                    reminderCard.style.opacity = '0';
                    setTimeout(() => {
                        reminderCard.remove();
                        showToast('info', 'Deleted', 'Anniversary deleted', 3000);
                    }, 300);
                }
            }
        });
        
        // Plan date button
        if (planDateBtn) {
            planDateBtn.addEventListener('click', function() {
                // Switch to date assistant tab
                const dateAssistantLink = document.querySelector('a[data-section="date-assistant-section"]');
                if (dateAssistantLink) {
                    dateAssistantLink.click();
                }
            });
        }
    }

    // ===== DATE PLANNING ASSISTANT INITIALIZATION =====
    function initDateAssistant() {
        const datePlanForm = document.getElementById('datePlanForm');
        const dateSuggestions = document.getElementById('dateSuggestions');
        
        if (!datePlanForm || !dateSuggestions) return;
        
        // Handle form submission
        datePlanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const dateLocation = document.getElementById('dateLocation').value;
            const dateBudget = document.getElementById('dateBudget').value;
            const dateTime = document.getElementById('dateTime').value;
            
            if (!dateLocation || !dateTime) {
                showToast('error', 'Error', 'Please fill in all required fields', 3000);
                return;
            }
            
            // Show loading state
            dateSuggestions.innerHTML = '<div class="loading-spinner"></div>';
            
            // Simulate API call delay
            setTimeout(() => {
                // Generate date suggestions based on inputs
                let suggestionHTML = '';
                
                if (dateBudget === 'luxury' || dateBudget === 'extravagant') {
                    suggestionHTML += `
                        <div class="date-suggestion-card new-card">
                            <div class="date-suggestion-header">
                                <h4>Private Sunset Yacht Cruise</h4>
                                <span class="date-category romantic">Luxury</span>
                            </div>
                            <div class="date-suggestion-details">
                                <p><i class="fas fa-map-marker-alt"></i> Gateway of India, ${dateLocation}</p>
                                <p><i class="fas fa-rupee-sign"></i> ₹25,000 - ₹35,000 for two</p>
                                <p><i class="far fa-clock"></i> 3-4 hours</p>
                                <p class="suggestion-description">Enjoy an exclusive private yacht experience with gourmet dinner, champagne, and stunning sunset views of the city skyline. Personal butler and photographer included.</p>
                            </div>
                            <div class="date-actions">
                                <a href="#" class="btn btn-outline btn-small view-map">View Details</a>
                                <button class="btn btn-primary btn-small save-date">Book Now</button>
                            </div>
                        </div>
                    `;
                }
                
                suggestionHTML += `
                    <div class="date-suggestion-card new-card">
                        <div class="date-suggestion-header">
                            <h4>${dateLocation} Food Tour</h4>
                            <span class="date-category culinary">Culinary</span>
                        </div>
                        <div class="date-suggestion-details">
                            <p><i class="fas fa-map-marker-alt"></i> Various locations in ${dateLocation}</p>
                            <p><i class="fas fa-rupee-sign"></i> ₹5,000 - ₹8,000 for two</p>
                            <p><i class="far fa-clock"></i> 4 hours</p>
                            <p class="suggestion-description">Discover the best local cuisine with this curated food tour. Visit 5-7 establishments, from hidden gems to famous spots, with a knowledgeable guide.</p>
                        </div>
                        <div class="date-actions">
                            <a href="#" class="btn btn-outline btn-small view-map">View Details</a>
                            <button class="btn btn-primary btn-small save-date">Book Now</button>
                        </div>
                    </div>
                    <div class="date-suggestion-card new-card">
                        <div class="date-suggestion-header">
                            <h4>Couples Spa Retreat</h4>
                            <span class="date-category relaxation">Wellness</span>
                        </div>
                        <div class="date-suggestion-details">
                            <p><i class="fas fa-map-marker-alt"></i> Luxury Spa Resort, ${dateLocation}</p>
                            <p><i class="fas fa-rupee-sign"></i> ₹8,000 - ₹12,000 for two</p>
                            <p><i class="far fa-clock"></i> 3 hours</p>
                            <p class="suggestion-description">Indulge in a rejuvenating couples' spa package including aromatherapy massage, facial treatments, private jacuzzi session, and complimentary refreshments.</p>
                        </div>
                        <div class="date-actions">
                            <a href="#" class="btn btn-outline btn-small view-map">View Details</a>
                            <button class="btn btn-primary btn-small save-date">Book Now</button>
                        </div>
                    </div>
                `;
                
                // Update date suggestions
                dateSuggestions.innerHTML = suggestionHTML;
                
                // Fade in animation for the new cards
                setTimeout(() => {
                    const newCards = document.querySelectorAll('.date-suggestion-card.new-card');
                    newCards.forEach(card => {
                        card.classList.remove('new-card');
                    });
                }, 10);
                
                // Show success message
                showToast('success', 'Success', 'Date ideas generated successfully!', 3000);
            }, 1500);
        });
        
        // Save date button handlers
        dateSuggestions.addEventListener('click', function(e) {
            if (e.target.classList.contains('save-date')) {
                const card = e.target.closest('.date-suggestion-card');
                const dateTitle = card.querySelector('h4').textContent;
                
                // Show saving state
                e.target.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
                e.target.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    e.target.innerHTML = '<i class="fas fa-check"></i> Saved';
                    showToast('success', 'Date Saved', `"${dateTitle}" has been saved to your dates`, 3000);
                    
                    // Update dates count in Love Tracker
                    const datesCount = document.getElementById('datesCount');
                    if (datesCount) {
                        const currentCount = parseInt(datesCount.textContent);
                        datesCount.textContent = currentCount + 1;
                    }
                }, 1000);
            }
        });
    }

    // ===== SHARED SPECIAL DATES INITIALIZATION =====
    function initSpecialDates() {
        const specialDateForm = document.getElementById('specialDateForm');
        const relationshipTimeline = document.getElementById('relationshipTimeline');
        const photoInput = document.getElementById('specialPhoto');
        const photoPreview = document.getElementById('photoPreview');
        
        if (!specialDateForm || !relationshipTimeline) return;
        
        // Photo preview functionality
        if (photoInput && photoPreview) {
            photoInput.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                        photoPreview.style.display = 'block';
                    }
                    reader.readAsDataURL(file);
                } else {
                    photoPreview.innerHTML = '';
                    photoPreview.style.display = 'none';
                }
            });
        }
        
        // Handle form submission
        specialDateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const specialDate = document.getElementById('specialDate').value;
            const specialTitle = document.getElementById('specialTitle').value;
            const specialDescription = document.getElementById('specialDescription').value;
            
            if (!specialDate || !specialTitle) {
                showToast('error', 'Error', 'Please fill in all required fields', 3000);
                return;
            }
            
            // Format the date
            const formattedDate = new Date(specialDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Create new timeline item
            let timelineHTML = `
                <div class="timeline-item new-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-date">${formattedDate}</div>
                    <div class="timeline-content">
                        <h4>${specialTitle}</h4>
                        <p>${specialDescription}</p>
            `;
            
            // Add photo if selected
            if (photoPreview.querySelector('img')) {
                timelineHTML += `
                    <div class="timeline-image">
                        <img src="${photoPreview.querySelector('img').src}" alt="${specialTitle}">
                    </div>
                `;
            }
            
            timelineHTML += `
                        <div class="timeline-actions">
                            <button class="btn-icon reminisce-btn" data-tooltip="Reminisce"><i class="fas fa-paper-plane"></i></button>
                            <button class="btn-icon edit-special-date" data-tooltip="Edit"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon delete-special-date" data-tooltip="Delete"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add the new timeline item
            relationshipTimeline.insertAdjacentHTML('afterbegin', timelineHTML);
            
            // Reset form and preview
            specialDateForm.reset();
            photoPreview.innerHTML = '';
            photoPreview.style.display = 'none';
            
            // Show success message
            showToast('success', 'Success', 'Special date added to your timeline!', 3000);
            
            // Fade in animation for the new item
            setTimeout(() => {
                const newItem = document.querySelector('.timeline-item.new-item');
                if (newItem) {
                    newItem.classList.remove('new-item');
                }
            }, 10);
            
            // Initialize tooltips for new buttons
            initTooltips();
            
            // Update memory gallery if applicable
            updateMemoryGallery(specialTitle, photoPreview.querySelector('img')?.src);
        });
        
        // Handle timeline actions
        relationshipTimeline.addEventListener('click', function(e) {
            // Delete action
            if (e.target.closest('.delete-special-date')) {
                const timelineItem = e.target.closest('.timeline-item');
                
                // Ask for confirmation
                if (confirm('Are you sure you want to delete this memory?')) {
                    // Remove with fade-out effect
                    timelineItem.style.opacity = '0';
                    setTimeout(() => {
                        timelineItem.remove();
                        showToast('info', 'Deleted', 'Memory deleted from timeline', 3000);
                    }, 300);
                }
            }
            
            // Reminisce action
            if (e.target.closest('.reminisce-btn')) {
                const title = e.target.closest('.timeline-content').querySelector('h4').textContent;
                showToast('success', 'Reminisce', `Sent "${title}" memory to your partner for reminiscing`, 3000);
            }
        });
        
        // Function to update memory gallery
        function updateMemoryGallery(title, imageSrc) {
            const memoryGallery = document.querySelector('.memory-gallery');
            if (memoryGallery && imageSrc) {
                // Create new memory item
                const memoryItem = document.createElement('div');
                memoryItem.className = 'memory-item new-item';
                memoryItem.innerHTML = `
                    <img src="${imageSrc}" alt="${title}">
                    <div class="memory-caption">${title}</div>
                `;
                
                // Add to gallery (replace oldest one if more than 4)
                if (memoryGallery.children.length >= 4) {
                    memoryGallery.removeChild(memoryGallery.children[3]);
                }
                
                memoryGallery.insertBefore(memoryItem, memoryGallery.firstChild);
                
                // Fade in animation
                setTimeout(() => {
                    memoryItem.classList.remove('new-item');
                }, 10);
            }
        }
    }

    // ===== LOVE TRACKER INITIALIZATION =====
    function initLoveTracker() {
        const daysTogether = document.getElementById('daysTogether');
        const messagesCount = document.getElementById('messagesCount');
        const datesCount = document.getElementById('datesCount');
        const savingsAmount = document.getElementById('savingsAmount');
        const loveMeterFill = document.querySelector('.love-meter-fill');
        const loveMeterValue = document.querySelector('.love-meter-value');
        const celebrateMilestoneBtn = document.getElementById('celebrateMilestoneBtn');
        const createMemoryBookBtn = document.getElementById('createMemoryBookBtn');
        
        if (!daysTogether) return;
        
        // Calculate days together
        function updateDaysTogether() {
            // Start date from the tracker stat label
            const startDateText = document.querySelector('.tracker-stat-label')?.textContent;
            if (!startDateText) return;
            
            // Extract date from "since Month Day, Year"
            const dateMatch = startDateText.match(/since ([A-Za-z]+ \d+, \d+)/);
            if (!dateMatch) return;
            
            const startDate = new Date(dateMatch[1]);
            const today = new Date();
            const diffTime = Math.abs(today - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (daysTogether) {
                // Animate the number counting up
                animateCounter(daysTogether, 0, diffDays, 1500);
            }
        }
        
        // Animate counter function for statistics
        function animateCounter(element, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const value = Math.floor(progress * (end - start) + start);
                element.textContent = value.toLocaleString();
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
        
        // Update love meter based on various factors with enhanced animation
        function updateLoveMeter() {
            if (!loveMeterFill || !loveMeterValue) return;
            
            // Get current values
            const days = parseInt(daysTogether?.textContent.replace(/,/g, '') || '0');
            const messages = parseInt(messagesCount?.textContent.replace(/,/g, '') || '0');
            const dates = parseInt(datesCount?.textContent.replace(/,/g, '') || '0');
            
            // Calculate love meter percentage (enhanced algorithm)
            let lovePercentage = 50; // Base value
            
            // Days factor - max 15%
            lovePercentage += Math.min(15, days / 24.3); // Cap at 15% for ~1 year
            
            // Messages factor - max 15%
            lovePercentage += Math.min(15, messages / 133.33); // Cap at 15% for 2000 messages
            
            // Dates factor - max 15%
            lovePercentage += Math.min(15, dates / 3.33); // Cap at 15% for 50 dates
            
            // Random factor for natural variation - max 3%
            lovePercentage += Math.random() * 3;
            
            // Cap at 100%
            lovePercentage = Math.min(100, Math.round(lovePercentage));
            
            // Add some sparkle animation to the meter
            loveMeterFill.classList.add('animate-sparkle');
            
            // Update display with animation
            let currentWidth = parseInt(loveMeterFill.style.width) || 0;
            const targetWidth = lovePercentage;
            
            // Enhanced easing animation
            let startTimestamp = null;
            const duration = 2000; // 2 seconds for smoother animation
            
            const animateWidth = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                
                // Easing function for smoother movement
                const easedProgress = progress < 0.5 
                    ? 4 * progress * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                    
                const currentValue = Math.round(easedProgress * (targetWidth - currentWidth) + currentWidth);
                loveMeterFill.style.width = `${currentValue}%`;
                loveMeterValue.textContent = `${currentValue}%`;
                
                if (progress < 1) {
                    window.requestAnimationFrame(animateWidth);
                } else {
                    // Animation complete
                    setTimeout(() => loveMeterFill.classList.remove('animate-sparkle'), 1000);
                }
            };
            
            window.requestAnimationFrame(animateWidth);
        }
        
        // Initialize values with animation
        setTimeout(() => {
            updateDaysTogether();
            
            // Animate the other statistics
            if (messagesCount) {
                const targetMessages = parseInt(messagesCount.textContent.replace(/,/g, '') || '0');
                animateCounter(messagesCount, 0, targetMessages, 2000);
            }
            
            if (datesCount) {
                const targetDates = parseInt(datesCount.textContent || '0');
                animateCounter(datesCount, 0, targetDates, 1800);
            }
            
            if (savingsAmount) {
                const targetSavings = parseInt(savingsAmount.textContent.replace(/[^\d]/g, '') || '0');
                let count = 0;
                const duration = 2200;
                let startTimestamp = null;
                
                const animateSavings = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    const current = Math.floor(progress * targetSavings);
                    savingsAmount.textContent = '₹' + current.toLocaleString();
                    if (progress < 1) {
                        window.requestAnimationFrame(animateSavings);
                    }
                };
                
                window.requestAnimationFrame(animateSavings);
            }
            
            // Update love meter after stats have animated
            setTimeout(() => {
                updateLoveMeter();
            }, 2000);
        }, 500);
        
        // Celebrate milestone button with enhanced animation
        if (celebrateMilestoneBtn) {
            celebrateMilestoneBtn.addEventListener('click', function() {
                showToast('success', '🎉 Celebration', 'Milestone celebration sent to your partner!', 3000);
                
                // Add confetti effect
                const confettiCount = 100;
                const colors = ['#e85d75', '#6b9bdc', '#ff9900', '#4bc0c0'];
                
                for (let i = 0; i < confettiCount; i++) {
                    createConfetti(colors[Math.floor(Math.random() * colors.length)]);
                }
            });
        }
        
        // Create confetti element
        function createConfetti(color) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = color;
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.opacity = Math.random() + 0.5;
            confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
        
        // Create memory book button
        if (createMemoryBookBtn) {
            createMemoryBookBtn.addEventListener('click', function() {
                showToast('info', '📘 Processing', 'Creating your memory book...', 3000);
                
                // Add book animation to button
                this.classList.add('book-animation');
                
                // Simulate processing
                setTimeout(() => {
                    this.classList.remove('book-animation');
                    showToast('success', '📕 Ready', 'Your memory book is ready! Check your email for the digital copy.', 5000);
                }, 3000);
            });
        }
        
        // Set up periodic message count updates for simulation with smoother animation
        setInterval(() => {
            if (messagesCount) {
                const current = parseInt(messagesCount.textContent.replace(/,/g, '') || '0');
                const increase = Math.floor(Math.random() * 3); // 0, 1, or 2 new messages
                
                if (increase > 0) {
                    const newValue = current + increase;
                    animateCounter(messagesCount, current, newValue, 800);
                    
                    // Update the trend text occasionally
                    if (Math.random() > 0.7) {
                        const trendText = messagesCount.closest('.tracker-stat-info').querySelector('.tracker-stat-trend');
                        if (trendText) {
                            const weeklyCount = Math.floor(Math.random() * 50) + 130;
                            trendText.innerHTML = `<i class="fas fa-arrow-up"></i> ${weeklyCount} this week`;
                            
                            // Add subtle highlight animation
                            trendText.classList.add('highlight-pulse');
                            setTimeout(() => trendText.classList.remove('highlight-pulse'), 2000);
                        }
                    }
                    
                    // Update love meter
                    updateLoveMeter();
                }
            }
        }, 30000); // Every 30 seconds
    }

    function initLoveTrackerAnimations() {
        // Initialize sparkle effects on love meter
        const loveMeter = document.querySelector('.love-meter-progress');
        if (loveMeter) {
            loveMeter.classList.add('animate-sparkle');
        }
        
        // Apply pulse animation to important stats
        const statValues = document.querySelectorAll('.tracker-stat-value');
        statValues.forEach(value => {
            value.addEventListener('mouseenter', function() {
                this.classList.add('highlight-pulse');
                setTimeout(() => {
                    this.classList.remove('highlight-pulse');
                }, 1000);
            });
        });
        
        // Add celebration function for milestone button
        const celebrateBtn = document.querySelector('#celebrate-milestone');
        if (celebrateBtn) {
            celebrateBtn.addEventListener('click', function() {
                createConfetti();
                showToast('Milestone celebrated! 🎉');
            });
        }
        
        // Add memory book animation
        const memoryBookBtn = document.querySelector('#create-memory-book');
        if (memoryBookBtn) {
            memoryBookBtn.addEventListener('click', function() {
                this.classList.add('book-animation');
                setTimeout(() => {
                    this.classList.remove('book-animation');
                    showToast('Memory book created! 📚');
                }, 2000);
            });
        }
    }

    function createConfetti() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            document.body.appendChild(confetti);
            
            // Remove confetti after animation ends
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }

    // Update initialization function to include new animations
    function initDashboard() {
        initInvestmentChart();
        initTipTabs();
        initProgressBars();
        initTooltips();
        initPartnerUpdates();
        initNavigation();
        initMessaging();
        initNotifications();
        initDatePlanner();
        initAnniversaryReminder();
        initSpecialDates();
        initLoveTracker();
        initLoveTrackerAnimations();
    }

    // Initialize on document ready
    document.addEventListener('DOMContentLoaded', initDashboard);
}); 