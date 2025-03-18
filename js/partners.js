// Partners page specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Age range slider functionality
    const ageMinSlider = document.getElementById('age-min-slider');
    const ageMaxSlider = document.getElementById('age-max-slider');
    const ageMinDisplay = document.getElementById('age-min');
    const ageMaxDisplay = document.getElementById('age-max');
    
    if (ageMinSlider && ageMaxSlider) {
        // Update min slider
        ageMinSlider.addEventListener('input', function() {
            const minVal = parseInt(ageMinSlider.value);
            const maxVal = parseInt(ageMaxSlider.value);
            
            if (minVal > maxVal) {
                ageMaxSlider.value = minVal;
                ageMaxDisplay.textContent = minVal;
            }
            
            ageMinDisplay.textContent = minVal;
        });
        
        // Update max slider
        ageMaxSlider.addEventListener('input', function() {
            const minVal = parseInt(ageMinSlider.value);
            const maxVal = parseInt(ageMaxSlider.value);
            
            if (maxVal < minVal) {
                ageMinSlider.value = maxVal;
                ageMinDisplay.textContent = maxVal;
            }
            
            ageMaxDisplay.textContent = maxVal;
        });
    }
    
    // View toggle (grid/list)
    const viewButtons = document.querySelectorAll('.view-btn');
    const partnerResults = document.querySelector('.partners-results');
    
    if (viewButtons.length && partnerResults) {
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                viewButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Change view based on data attribute
                const viewType = this.getAttribute('data-view');
                
                if (viewType === 'list') {
                    partnerResults.classList.add('list-view');
                    partnerResults.classList.remove('grid-view');
                } else {
                    partnerResults.classList.add('grid-view');
                    partnerResults.classList.remove('list-view');
                }
            });
        });
    }
    
    // Filter form submission
    const filterForm = document.getElementById('partner-filter-form');
    
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            partnerResults.classList.add('loading');
            
            // Collect filter values
            const filters = {
                ageMin: ageMinSlider.value,
                ageMax: ageMaxSlider.value,
                location: document.getElementById('location').value,
                financialGoals: Array.from(document.querySelectorAll('input[name="financial-goals"]:checked')).map(cb => cb.value),
                interests: Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value),
                investmentStyle: document.getElementById('investment-style').value
            };
            
            console.log('Applied filters:', filters);
            
            // Simulate API call delay
            setTimeout(() => {
                // Remove loading state
                partnerResults.classList.remove('loading');
                
                // Show filter applied message
                showNotification('Filters applied successfully!');
            }, 1000);
        });
        
        // Reset filters
        filterForm.addEventListener('reset', function() {
            // Reset age displays
            setTimeout(() => {
                ageMinDisplay.textContent = ageMinSlider.value;
                ageMaxDisplay.textContent = ageMaxSlider.value;
            }, 0);
        });
    }
    
    // Search functionality
    const searchBar = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBar && searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchBar.value.trim();
            
            if (searchTerm) {
                // Show loading state
                partnerResults.classList.add('loading');
                
                console.log('Searching for:', searchTerm);
                
                // Simulate API call delay
                setTimeout(() => {
                    // Remove loading state
                    partnerResults.classList.remove('loading');
                    
                    // Show search results message
                    showNotification(`Search results for "${searchTerm}"`);
                }, 800);
            }
        });
        
        // Search on Enter key
        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
    
    // Partner card actions
    const likeButtons = document.querySelectorAll('.partner-actions .btn-icon[data-tooltip="Like"]');
    const messageButtons = document.querySelectorAll('.partner-actions .btn-icon[data-tooltip="Message"]');
    const connectButtons = document.querySelectorAll('.partner-footer .btn');
    
    // Like button functionality
    likeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const partnerCard = this.closest('.partner-card');
            const partnerName = partnerCard.querySelector('.partner-info h3').textContent.split(',')[0];
            
            this.classList.toggle('liked');
            
            if (this.classList.contains('liked')) {
                this.style.backgroundColor = 'rgba(240, 160, 160, 0.2)';
                this.style.color = 'var(--primary-pink)';
                showNotification(`You liked ${partnerName}'s profile!`);
            } else {
                this.style.backgroundColor = '';
                this.style.color = '';
                showNotification(`You unliked ${partnerName}'s profile`);
            }
        });
    });
    
    // Message button functionality
    messageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const partnerCard = this.closest('.partner-card');
            const partnerName = partnerCard.querySelector('.partner-info h3').textContent.split(',')[0];
            
            showNotification(`Opening chat with ${partnerName}...`);
            
            // Here you would typically open a chat modal or redirect to a chat page
            console.log(`Chat with ${partnerName}`);
        });
    });
    
    // Connect button functionality
    connectButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const partnerCard = this.closest('.partner-card');
            const partnerName = partnerCard.querySelector('.partner-info h3').textContent.split(',')[0];
            
            this.textContent = 'Connection Sent';
            this.disabled = true;
            this.style.backgroundColor = 'var(--dark-blue)';
            
            showNotification(`Connection request sent to ${partnerName}!`);
        });
    });
    
    // Tooltip functionality for action buttons
    const btnIcons = document.querySelectorAll('.btn-icon');
    
    btnIcons.forEach(btn => {
        const tooltipText = btn.getAttribute('data-tooltip');
        
        if (tooltipText) {
            const tooltip = document.createElement('span');
            tooltip.classList.add('tooltip');
            tooltip.textContent = tooltipText;
            btn.appendChild(tooltip);
        }
    });
    
    // Helper function to show notifications
    function showNotification(message) {
        createNotification(message, 'fas fa-info-circle');
    }
    
    // Add loading animation styles
    const style = document.createElement('style');
    style.textContent = `
        .partners-results.loading {
            position: relative;
            min-height: 300px;
        }
        
        .partners-results.loading::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
        }
        
        .partners-results.loading::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            border: 3px solid var(--light-blue);
            border-top: 3px solid var(--primary-blue);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            z-index: 11;
        }
        
        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .partners-results.list-view {
            grid-template-columns: 1fr;
        }
        
        .partners-results.list-view .partner-card {
            display: flex;
            flex-wrap: wrap;
        }
        
        .partners-results.list-view .partner-header {
            width: 30%;
            border-bottom: none;
            border-right: 1px solid var(--medium-gray);
        }
        
        .partners-results.list-view .partner-body {
            width: 70%;
            display: flex;
            flex-wrap: wrap;
        }
        
        .partners-results.list-view .partner-section {
            width: 50%;
            padding-right: 1rem;
        }
        
        .partners-results.list-view .partner-bio {
            width: 100%;
        }
        
        .partners-results.list-view .partner-footer {
            width: 100%;
        }
        
        @media (max-width: 768px) {
            .partners-results.list-view .partner-card {
                flex-direction: column;
            }
            
            .partners-results.list-view .partner-header,
            .partners-results.list-view .partner-body {
                width: 100%;
            }
            
            .partners-results.list-view .partner-header {
                border-right: none;
                border-bottom: 1px solid var(--medium-gray);
            }
            
            .partners-results.list-view .partner-section {
                width: 100%;
            }
        }
    `;
    
    document.head.appendChild(style);
}); 