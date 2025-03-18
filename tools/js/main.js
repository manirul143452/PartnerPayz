// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            authButtons.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Facebook-style User Avatar Dropdown
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        // Add click functionality (in addition to hover)
        userMenu.addEventListener('click', function(e) {
            // Only toggle if not clicking on a link or the dark mode toggle
            if (!e.target.closest('.dropdown-menu a') && 
                !e.target.closest('.toggle-switch-container')) {
                e.stopPropagation(); // Prevent document click from immediately closing
                this.classList.toggle('active');
            }
        });

        // Add keyboard accessibility
        userMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.classList.toggle('active');
            } else if (e.key === 'Escape') {
                this.classList.remove('active');
            }
        });

        // Make dropdown menu focusable
        userMenu.setAttribute('tabindex', '0');
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (userMenu && !userMenu.contains(e.target)) {
                userMenu.classList.remove('active');
            }
        });

        // Handle dark mode toggle
        const darkModeToggle = userMenu.querySelector('.toggle-switch input');
        if (darkModeToggle) {
            // Check if user has already set a preference
            const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
            
            // Apply saved preference
            if (darkModeEnabled) {
                document.body.classList.add('dark-mode');
                darkModeToggle.checked = true;
            }
            
            // Toggle dark mode when checkbox is clicked
            darkModeToggle.addEventListener('change', function() {
                if (this.checked) {
                    document.body.classList.add('dark-mode');
                    localStorage.setItem('darkMode', 'true');
                } else {
                    document.body.classList.remove('dark-mode');
                    localStorage.setItem('darkMode', 'false');
                }
            });
        }
        
        // Prevent dropdown from closing when clicking dark mode toggle
        const toggleContainer = userMenu.querySelector('.toggle-switch-container');
        if (toggleContainer) {
            toggleContainer.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }

        // Add animation to dropdown items with proper timing
        const dropdownLinks = userMenu.querySelectorAll('.dropdown-menu a');
        dropdownLinks.forEach((link, index) => {
            link.style.animationDelay = `${0.1 + (index * 0.05)}s`;
        });

        // Make dropdown items accessible by keyboard
        dropdownLinks.forEach(link => {
            link.setAttribute('tabindex', '0');
            
            link.addEventListener('keydown', function(e) {
                // Press Enter or Space to activate link
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
        
        // Show online status dot
        const statusDot = userMenu.querySelector('.status');
        if (statusDot) {
            statusDot.style.backgroundColor = '#2ecc71'; // Green for online
        }
    }

    // Function to ensure footer is at the bottom of the page
    function adjustFooter() {
        const footer = document.querySelector('footer');
        const body = document.body;
        const html = document.documentElement;
        
        if (footer) {
            const bodyHeight = Math.max(body.scrollHeight, body.offsetHeight,
                html.clientHeight, html.scrollHeight, html.offsetHeight);
            const windowHeight = window.innerHeight;
            
            if (bodyHeight < windowHeight) {
                footer.style.position = 'fixed';
                footer.style.bottom = '0';
                footer.style.width = '100%';
            } else {
                footer.style.position = 'relative';
            }
        }
    }
    
    // Run on page load
    adjustFooter();
    
    // Run on window resize
    window.addEventListener('resize', adjustFooter);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Tooltips for first-time users
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(tooltip => {
        const tipContent = tooltip.getAttribute('data-tooltip');
        const tipElement = document.createElement('div');
        tipElement.classList.add('tooltip');
        tipElement.textContent = tipContent;
        
        tooltip.appendChild(tipElement);
        
        tooltip.addEventListener('mouseenter', () => {
            tipElement.classList.add('active');
        });
        
        tooltip.addEventListener('mouseleave', () => {
            tipElement.classList.remove('active');
        });
    });

    // Animations on scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkInView() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    }
    
    // Check on initial load
    checkInView();
    
    // Check on scroll
    window.addEventListener('scroll', checkInView);

    // Simple investment calculator
    const calculatorForm = document.getElementById('investment-calculator');
    
    if (calculatorForm) {
        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const initialAmount = parseFloat(document.getElementById('initial-amount').value);
            const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value);
            const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
            const years = parseInt(document.getElementById('years').value);
            
            let futureValue = initialAmount;
            
            for (let i = 0; i < years * 12; i++) {
                futureValue = (futureValue + monthlyContribution) * (1 + interestRate / 12);
            }
            
            const resultElement = document.getElementById('calculator-result');
            resultElement.textContent = `Estimated future value: $${futureValue.toFixed(2)}`;
            resultElement.classList.add('show');
        });
    }

    // Partner finding form filters
    const partnerFilters = document.querySelectorAll('.partner-filter');
    
    if (partnerFilters.length > 0) {
        partnerFilters.forEach(filter => {
            filter.addEventListener('change', function() {
                // This would typically make an AJAX request to filter results
                // For demo purposes, we'll just add a loading indicator
                const resultsContainer = document.querySelector('.partner-results');
                
                if (resultsContainer) {
                    resultsContainer.classList.add('loading');
                    
                    // Simulate loading time
                    setTimeout(() => {
                        resultsContainer.classList.remove('loading');
                    }, 1000);
                }
            });
        });
    }

    // Gamification elements - badges
    const userBadges = document.querySelectorAll('.user-badge');
    
    if (userBadges.length > 0) {
        userBadges.forEach(badge => {
            badge.addEventListener('click', function() {
                const badgeInfo = this.getAttribute('data-badge-info');
                
                if (badgeInfo) {
                    const infoPopup = document.createElement('div');
                    infoPopup.classList.add('badge-popup');
                    infoPopup.textContent = badgeInfo;
                    
                    document.body.appendChild(infoPopup);
                    
                    const badgeRect = this.getBoundingClientRect();
                    infoPopup.style.top = `${badgeRect.bottom + window.scrollY + 10}px`;
                    infoPopup.style.left = `${badgeRect.left + window.scrollX}px`;
                    
                    // Close popup when clicking outside
                    document.addEventListener('click', function closePopup(e) {
                        if (!infoPopup.contains(e.target) && e.target !== badge) {
                            infoPopup.remove();
                            document.removeEventListener('click', closePopup);
                        }
                    });
                }
            });
        });
    }
});

// Global notification function
function createNotification(message, iconClass) {
    const notification = document.createElement('div');
    
    // Set styles
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        padding: '15px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        transform: 'translateY(100px)',
        opacity: '0',
        transition: 'all 0.3s ease',
        zIndex: '1000'
    });
    
    // Add content
    notification.innerHTML = `
        <i class="${iconClass}" style="color: var(--primary-pink); font-size: 20px;"></i>
        <p style="margin: 0; font-weight: 500;">${message}</p>
        <button style="background: none; border: none; cursor: pointer; color: var(--dark-gray); font-size: 14px;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Close button functionality
    const closeBtn = notification.querySelector('button');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}
