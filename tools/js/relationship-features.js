document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize all features
        initThemeSwitcher();
        initTabs();
        initCalendar();
        initBudgetFilter();
        initGoalCards();
        initDateIdeas();
        initCheckIns();
        initConflictResolution();
        initPremiumCTA();
        initContactForm();
        initPaymentModalListeners();
        initDashboard();
        initCommunity();
        checkPremiumStatus();
        
        console.log("All features initialized successfully");
    } catch (error) {
        console.error("Error initializing features:", error);
        showToast("An error occurred while loading the page. Please refresh and try again.", "error");
    }
});

// Theme Switcher Functionality
function initThemeSwitcher() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const savedTheme = localStorage.getItem('theme') || 'light';

    // Apply saved theme
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeButtonStates(savedTheme);

    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            updateThemeButtonStates(theme);
        });
    });
}

function updateThemeButtonStates(activeTheme) {
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(button => {
        const theme = button.getAttribute('data-theme');
        if (theme === activeTheme) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Tab Functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tool-tab');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));

            // Add active class to clicked button and corresponding tab
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
}

// Calendar Functionality
function initCalendar() {
    const calendar = document.querySelector('.calendar-days');
    const prevBtn = document.querySelector('.calendar-nav.prev');
    const nextBtn = document.querySelector('.calendar-nav.next');
    let currentDate = new Date();
    let plannedDates = {};

    function updateCalendar() {
        if (!calendar) return;

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        let calendarHTML = '';
        const prevMonthDays = new Date(year, month, 0).getDate();
        
        // Previous month days
        for (let i = startingDay - 1; i >= 0; i--) {
            calendarHTML += `<span class="prev-month">${prevMonthDays - i}</span>`;
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === new Date().toDateString();
            const isPlanned = date.getTime() in plannedDates;
            
            calendarHTML += `
                <span class="${isToday ? 'today' : ''} ${isPlanned ? 'date-planned' : ''}" 
                      data-date="${date.toISOString()}">${day}</span>
            `;
        }

        // Next month days
        const remainingDays = 42 - (startingDay + daysInMonth);
        for (let i = 1; i <= remainingDays; i++) {
            calendarHTML += `<span class="next-month">${i}</span>`;
        }

        calendar.innerHTML = calendarHTML;
        const header = document.querySelector('.calendar-header h3');
        if (header) {
            header.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        }
    }

    calendar.addEventListener('click', (e) => {
        const dateSpan = e.target.closest('span');
        if (!dateSpan || dateSpan.classList.contains('prev-month') || 
            dateSpan.classList.contains('next-month')) return;

        const date = new Date(dateSpan.dataset.date);
        const isPlanned = date.getTime() in plannedDates;

        showModal(
            isPlanned ? 'Cancel Date' : 'Plan Date',
            isPlanned ? 
                'Are you sure you want to cancel this date?' :
                'Would you like to plan a date for this day?',
            [
                {
                    text: isPlanned ? 'Cancel Date' : 'Plan Date',
                    class: isPlanned ? 'btn-danger' : 'btn-primary',
                    action: () => {
                        if (isPlanned) {
                            delete plannedDates[date.getTime()];
                            showToast('Date cancelled successfully', 'success');
                        } else {
                            showDatePlanningForm(date);
                        }
                        updateCalendar();
                    }
                },
                {
                    text: 'Close',
                    class: 'btn-secondary',
                    action: () => {}
                }
            ]
        );
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateCalendar();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateCalendar();
        });
    }

    // Initialize calendar
    updateCalendar();
}

// Budget Filter Functionality
function initBudgetFilter() {
    const budgetSelect = document.querySelector('.budget-filter select');
    const dateIdeaCards = document.querySelectorAll('.date-idea-card');

    if (budgetSelect) {
        budgetSelect.addEventListener('change', () => {
            const selectedBudget = budgetSelect.value;
            
            dateIdeaCards.forEach(card => {
                const costElement = card.querySelector('.date-cost');
                if (costElement) {
                    const cost = parseFloat(costElement.textContent.replace(/[^0-9.-]+/g, ''));
                    const shouldShow = selectedBudget === 'all' || cost <= parseFloat(selectedBudget);
                    card.style.display = shouldShow ? 'block' : 'none';
                }
            });
        });
    }
}

// Goal Cards Functionality
function initGoalCards() {
    const goalCards = document.querySelectorAll('.goal-card');
    const addGoalCard = document.querySelector('.add-goal-card');

    goalCards.forEach(card => {
        const addFundsBtn = card.querySelector('.btn-primary');
        const editBtn = card.querySelector('.btn-secondary');
        const progressBar = card.querySelector('.progress');
        const progressText = card.querySelector('.progress-text');

        if (addFundsBtn) {
            addFundsBtn.addEventListener('click', () => {
                showModal(
                    'Add Funds',
                    'Enter the amount to add to this goal:',
                    [
                        {
                            text: 'Add Funds',
                            class: 'btn-primary',
                            action: () => {
                                const amount = parseFloat(document.querySelector('#fundAmount').value);
                                if (isNaN(amount) || amount <= 0) {
                                    showToast('Please enter a valid amount', 'error');
                                    return;
                                }
                                const currentProgress = parseFloat(progressBar.style.width) || 0;
                                const newProgress = Math.min(currentProgress + amount, 100);
                                progressBar.style.width = `${newProgress}%`;
                                progressText.textContent = `${newProgress}%`;
                                showToast('Funds added successfully', 'success');
                            }
                        },
                        {
                            text: 'Cancel',
                            class: 'btn-secondary',
                            action: () => {}
                        }
                    ],
                    `
                    <div class="form-group">
                        <label for="fundAmount">Amount ($)</label>
                        <input type="number" id="fundAmount" min="0" step="0.01" required>
                    </div>
                    `
                );
            });
        }

        if (editBtn) {
            editBtn.addEventListener('click', () => {
                showModal(
                    'Edit Goal',
                    'Update the goal details:',
                    [
                        {
                            text: 'Save Changes',
                            class: 'btn-primary',
                            action: () => {
                                const title = document.querySelector('#goalTitle').value;
                                const target = parseFloat(document.querySelector('#goalTarget').value);
                                if (!title || isNaN(target) || target <= 0) {
                                    showToast('Please enter valid goal details', 'error');
                                    return;
                                }
                                card.querySelector('h3').textContent = title;
                                card.querySelector('.goal-description').textContent = 
                                    `Target: $${target.toFixed(2)}`;
                                showToast('Goal updated successfully', 'success');
                            }
                        },
                        {
                            text: 'Cancel',
                            class: 'btn-secondary',
                            action: () => {}
                        }
                    ],
                    `
                    <div class="form-group">
                        <label for="goalTitle">Goal Title</label>
                        <input type="text" id="goalTitle" value="${card.querySelector('h3').textContent}" required>
                    </div>
                    <div class="form-group">
                        <label for="goalTarget">Target Amount ($)</label>
                        <input type="number" id="goalTarget" min="0" step="0.01" value="${card.querySelector('.goal-description').textContent.match(/\$(\d+\.?\d*)/)[1]}" required>
                    </div>
                    `
                );
            });
        }
    });

    if (addGoalCard) {
        addGoalCard.addEventListener('click', () => {
            showModal(
                'New Goal',
                'Create a new relationship goal:',
                [
                    {
                        text: 'Create Goal',
                        class: 'btn-primary',
                        action: () => {
                            const title = document.querySelector('#newGoalTitle').value;
                            const target = parseFloat(document.querySelector('#newGoalTarget').value);
                            if (!title || isNaN(target) || target <= 0) {
                                showToast('Please enter valid goal details', 'error');
                                return;
                            }
                            // Add new goal card to the grid
                            const newCard = createGoalCard(title, target);
                            document.querySelector('.goal-cards').insertBefore(
                                newCard,
                                addGoalCard
                            );
                            showToast('Goal created successfully', 'success');
                        }
                    },
                    {
                        text: 'Cancel',
                        class: 'btn-secondary',
                        action: () => {}
                    }
                ],
                `
                <div class="form-group">
                    <label for="newGoalTitle">Goal Title</label>
                    <input type="text" id="newGoalTitle" required>
                </div>
                <div class="form-group">
                    <label for="newGoalTarget">Target Amount ($)</label>
                    <input type="number" id="newGoalTarget" min="0" step="0.01" required>
                </div>
                `
            );
        });
    }
}

// Date Ideas Functionality
function initDateIdeas() {
    const dateIdeaCards = document.querySelectorAll('.date-idea-card');

    dateIdeaCards.forEach(card => {
        const planBtn = card.querySelector('.btn-primary');
        if (planBtn) {
            planBtn.addEventListener('click', () => {
                showModal(
                    'Plan Date',
                    'Fill in the date details:',
                    [
                        {
                            text: 'Schedule Date',
                            class: 'btn-primary',
                            action: () => {
                                const activity = document.querySelector('#dateActivity').value;
                                const cost = parseFloat(document.querySelector('#dateCost').value);
                                const date = document.querySelector('#dateDate').value;
                                const time = document.querySelector('#dateTime').value;
                                const notes = document.querySelector('#dateNotes').value;

                                if (!activity || isNaN(cost) || cost <= 0 || !date || !time) {
                                    showToast('Please fill in all required fields', 'error');
                                    return;
                                }

                                // Add to calendar
                                const selectedDate = new Date(date);
                                plannedDates[selectedDate.getTime()] = {
                                    activity,
                                    cost,
                                    time,
                                    notes
                                };

                                showToast('Date scheduled successfully', 'success');
                                updateCalendar();
                            }
                        },
                        {
                            text: 'Cancel',
                            class: 'btn-secondary',
                            action: () => {}
                        }
                    ],
                    `
                    <div class="form-group">
                        <label for="dateActivity">Activity</label>
                        <input type="text" id="dateActivity" value="${card.querySelector('h4').textContent}" required>
                    </div>
                    <div class="form-group">
                        <label for="dateCost">Estimated Cost ($)</label>
                        <input type="number" id="dateCost" min="0" step="0.01" value="${card.querySelector('.date-cost').textContent.replace(/[^0-9.-]+/g, '')}" required>
                    </div>
                    <div class="form-group">
                        <label for="dateDate">Date</label>
                        <input type="date" id="dateDate" required>
                    </div>
                    <div class="form-group">
                        <label for="dateTime">Time</label>
                        <input type="time" id="dateTime" required>
                    </div>
                    <div class="form-group">
                        <label for="dateNotes">Notes (Optional)</label>
                        <textarea id="dateNotes" rows="3"></textarea>
                    </div>
                    `
                );
            });
        }
    });
}

// Financial Check-ins Functionality
function initCheckIns() {
    const checkInForm = document.querySelector('.check-in-form');
    const upcomingCheckIns = document.querySelector('.upcoming-check-ins');

    if (checkInForm) {
        checkInForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const type = document.querySelector('#checkInType').value;
            const date = document.querySelector('#checkInDate').value;
            const time = document.querySelector('#checkInTime').value;
            const notes = document.querySelector('#checkInNotes').value;

            if (!type || !date || !time) {
                showToast('Please fill in all required fields', 'error');
                return;
            }

            // Add to upcoming check-ins
            const checkInItem = document.createElement('div');
            checkInItem.className = 'check-in-item';
            checkInItem.innerHTML = `
                <div class="check-in-info">
                    <div class="check-in-type">${type}</div>
                    <div class="check-in-datetime">${new Date(date + 'T' + time).toLocaleString()}</div>
                </div>
                <div class="check-in-actions">
                    <button class="btn-icon edit-check-in">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-check-in">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            upcomingCheckIns.appendChild(checkInItem);
            checkInForm.reset();
            showToast('Check-in scheduled successfully', 'success');

            // Add event listeners to new buttons
            const editBtn = checkInItem.querySelector('.edit-check-in');
            const deleteBtn = checkInItem.querySelector('.delete-check-in');

            editBtn.addEventListener('click', () => {
                showModal(
                    'Edit Check-in',
                    'Update the check-in details:',
                    [
                        {
                            text: 'Save Changes',
                            class: 'btn-primary',
                            action: () => {
                                const newType = document.querySelector('#editCheckInType').value;
                                const newDate = document.querySelector('#editCheckInDate').value;
                                const newTime = document.querySelector('#editCheckInTime').value;
                                const newNotes = document.querySelector('#editCheckInNotes').value;

                                if (!newType || !newDate || !newTime) {
                                    showToast('Please fill in all required fields', 'error');
                                    return;
                                }

                                checkInItem.querySelector('.check-in-type').textContent = newType;
                                checkInItem.querySelector('.check-in-datetime').textContent = 
                                    new Date(newDate + 'T' + newTime).toLocaleString();
                                showToast('Check-in updated successfully', 'success');
                            }
                        },
                        {
                            text: 'Cancel',
                            class: 'btn-secondary',
                            action: () => {}
                        }
                    ],
                    `
                    <div class="form-group">
                        <label for="editCheckInType">Type</label>
                        <select id="editCheckInType" required>
                            <option value="Weekly Budget Review">Weekly Budget Review</option>
                            <option value="Monthly Financial Planning">Monthly Financial Planning</option>
                            <option value="Quarterly Goal Assessment">Quarterly Goal Assessment</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editCheckInDate">Date</label>
                        <input type="date" id="editCheckInDate" value="${date}" required>
                    </div>
                    <div class="form-group">
                        <label for="editCheckInTime">Time</label>
                        <input type="time" id="editCheckInTime" value="${time}" required>
                    </div>
                    <div class="form-group">
                        <label for="editCheckInNotes">Notes (Optional)</label>
                        <textarea id="editCheckInNotes" rows="3">${notes}</textarea>
                    </div>
                    `
                );
            });

            deleteBtn.addEventListener('click', () => {
                showModal(
                    'Delete Check-in',
                    'Are you sure you want to delete this check-in?',
                    [
                        {
                            text: 'Delete',
                            class: 'btn-danger',
                            action: () => {
                                checkInItem.remove();
                                showToast('Check-in deleted successfully', 'success');
                            }
                        },
                        {
                            text: 'Cancel',
                            class: 'btn-secondary',
                            action: () => {}
                        }
                    ]
                );
            });
        });
    }
}

// Conflict Resolution Functionality
function initConflictResolution() {
    const dearMethod = document.querySelector('.dear-method');

    if (dearMethod) {
        dearMethod.addEventListener('click', () => {
            showModal(
                'DEAR Method Template',
                'Fill in the details for your conflict resolution:',
                [
                    {
                        text: 'Save Template',
                        class: 'btn-primary',
                        action: () => {
                            const describe = document.querySelector('#describe').value;
                            const express = document.querySelector('#express').value;
                            const assert = document.querySelector('#assert').value;
                            const reinforce = document.querySelector('#reinforce').value;

                            if (!describe || !express || !assert || !reinforce) {
                                showToast('Please fill in all fields', 'error');
                                return;
                            }

                            // Save template
                            localStorage.setItem('dearTemplate', JSON.stringify({
                                describe,
                                express,
                                assert,
                                reinforce
                            }));

                            showToast('Template saved successfully', 'success');
                        }
                    },
                    {
                        text: 'Cancel',
                        class: 'btn-secondary',
                        action: () => {}
                    }
                ],
                `
                <div class="form-group">
                    <label for="describe">Describe the situation</label>
                    <textarea id="describe" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label for="express">Express your feelings</label>
                    <textarea id="express" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label for="assert">Assert your needs</label>
                    <textarea id="assert" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label for="reinforce">Reinforce the positive outcome</label>
                    <textarea id="reinforce" rows="3" required></textarea>
                </div>
                `
            );
        });
    }
}

// Premium CTA Functionality
function initPremiumCTA() {
    const upgradeBtn = document.querySelector('.premium-cta .btn-primary');
    
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', () => {
            showModal(
                'Upgrade to Premium',
                'Choose your premium plan:',
                [
                    {
                        text: 'Select Plan',
                        class: 'btn-primary',
                        action: () => {
                            const selectedPlan = document.querySelector('input[name="premiumPlan"]:checked');
                            if (!selectedPlan) {
                                showToast('Please select a plan', 'error');
                                return;
                            }
                            showToast('Thank you for choosing premium! Redirecting to payment...', 'success');
                            // Add payment processing logic here
                        }
                    },
                    {
                        text: 'Cancel',
                        class: 'btn-secondary',
                        action: () => {}
                    }
                ],
                `
                <div class="premium-plans">
                    <div class="premium-plan">
                        <input type="radio" name="premiumPlan" id="monthly" value="monthly">
                        <label for="monthly">
                            <h4>Monthly Plan</h4>
                            <p class="price">$9.99/month</p>
                            <ul>
                                <li>Advanced date planning</li>
                                <li>Priority support</li>
                                <li>Exclusive resources</li>
                            </ul>
                        </label>
                    </div>
                    <div class="premium-plan">
                        <input type="radio" name="premiumPlan" id="yearly" value="yearly">
                        <label for="yearly">
                            <h4>Yearly Plan</h4>
                            <p class="price">$99.99/year</p>
                            <p class="savings">Save 17%</p>
                            <ul>
                                <li>All monthly features</li>
                                <li>Annual financial report</li>
                                <li>VIP relationship coaching</li>
                            </ul>
                        </label>
                    </div>
                </div>
                `
            );
        });
    }
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        try {
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate API call (replace with actual API endpoint)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();
        } catch (error) {
            showToast('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

// Helper Functions
function showModal(title, message, buttons, content = '') {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${message}</p>
                ${content}
            </div>
            <div class="modal-footer">
                ${buttons.map(btn => `
                    <button class="btn ${btn.class}">${btn.text}</button>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const modalButtons = modal.querySelectorAll('.modal-footer .btn');

    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    modalButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            buttons[index].action();
            modal.remove();
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createGoalCard(title, target) {
    const card = document.createElement('div');
    card.className = 'goal-card';
    card.innerHTML = `
        <div class="goal-icon">
            <i class="fas fa-bullseye"></i>
        </div>
        <div class="goal-content">
            <h3>${title}</h3>
            <div class="goal-description">Target: $${target.toFixed(2)}</div>
            <div class="goal-progress">
                <div class="progress-bar">
                    <div class="progress" style="width: 0%"></div>
                </div>
                <div class="progress-text">0%</div>
            </div>
            <div class="goal-buttons">
                <button class="btn btn-primary">Add Funds</button>
                <button class="btn btn-secondary">Edit</button>
            </div>
        </div>
    `;

    // Add event listeners to new buttons
    const addFundsBtn = card.querySelector('.btn-primary');
    const editBtn = card.querySelector('.btn-secondary');
    const progressBar = card.querySelector('.progress');
    const progressText = card.querySelector('.progress-text');

    addFundsBtn.addEventListener('click', () => {
        showModal(
            'Add Funds',
            'Enter the amount to add to this goal:',
            [
                {
                    text: 'Add Funds',
                    class: 'btn-primary',
                    action: () => {
                        const amount = parseFloat(document.querySelector('#fundAmount').value);
                        if (isNaN(amount) || amount <= 0) {
                            showToast('Please enter a valid amount', 'error');
                            return;
                        }
                        const currentProgress = parseFloat(progressBar.style.width) || 0;
                        const newProgress = Math.min(currentProgress + amount, 100);
                        progressBar.style.width = `${newProgress}%`;
                        progressText.textContent = `${newProgress}%`;
                        showToast('Funds added successfully', 'success');
                    }
                },
                {
                    text: 'Cancel',
                    class: 'btn-secondary',
                    action: () => {}
                }
            ],
            `
            <div class="form-group">
                <label for="fundAmount">Amount ($)</label>
                <input type="number" id="fundAmount" min="0" step="0.01" required>
            </div>
            `
        );
    });

    editBtn.addEventListener('click', () => {
        showModal(
            'Edit Goal',
            'Update the goal details:',
            [
                {
                    text: 'Save Changes',
                    class: 'btn-primary',
                    action: () => {
                        const newTitle = document.querySelector('#goalTitle').value;
                        const newTarget = parseFloat(document.querySelector('#goalTarget').value);
                        if (!newTitle || isNaN(newTarget) || newTarget <= 0) {
                            showToast('Please enter valid goal details', 'error');
                            return;
                        }
                        card.querySelector('h3').textContent = newTitle;
                        card.querySelector('.goal-description').textContent = 
                            `Target: $${newTarget.toFixed(2)}`;
                        showToast('Goal updated successfully', 'success');
                    }
                },
                {
                    text: 'Cancel',
                    class: 'btn-secondary',
                    action: () => {}
                }
            ],
            `
            <div class="form-group">
                <label for="goalTitle">Goal Title</label>
                <input type="text" id="goalTitle" value="${title}" required>
            </div>
            <div class="form-group">
                <label for="goalTarget">Target Amount ($)</label>
                <input type="number" id="goalTarget" min="0" step="0.01" value="${target}" required>
            </div>
            `
        );
    });

    return card;
}

// Payment System Functions
function showPaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (!modal) return;
    
    modal.style.display = 'flex';
    
    // Reset payment form state
    const upiDetails = document.getElementById('upiDetails');
    const cardDetails = document.getElementById('cardDetails');
    const netbankingDetails = document.getElementById('netbankingDetails');
    const paymentStatus = document.getElementById('paymentStatus');
    const options = document.querySelectorAll('.payment-option');
    const upiAmount = document.getElementById('upiAmount');
    
    if (upiDetails) upiDetails.style.display = 'none';
    if (cardDetails) cardDetails.style.display = 'none';
    if (netbankingDetails) netbankingDetails.style.display = 'none';
    if (paymentStatus) paymentStatus.style.display = 'none';
    if (options) options.forEach(option => option.classList.remove('selected'));
    if (upiAmount) upiAmount.value = '';
    
    // Reset card form if it exists
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCvv = document.getElementById('cardCvv');
    const cardName = document.getElementById('cardName');
    
    if (cardNumber) cardNumber.value = '';
    if (cardExpiry) cardExpiry.value = '';
    if (cardCvv) cardCvv.value = '';
    if (cardName) cardName.value = '';
    
    // Add animation class
    setTimeout(() => {
        const modalContent = modal.querySelector('.payment-modal');
        if (modalContent) modalContent.classList.add('animate');
    }, 10);
}

function selectPaymentMethod(method) {
    if (!event || !event.currentTarget) return;
    
    const options = document.querySelectorAll('.payment-option');
    if (!options) return;
    
    options.forEach(option => option.classList.remove('selected'));
    
    const selectedOption = event.currentTarget;
    selectedOption.classList.add('selected');
    
    const upiDetails = document.getElementById('upiDetails');
    const cardDetails = document.getElementById('cardDetails');
    const netbankingDetails = document.getElementById('netbankingDetails');
    const paymentStatus = document.getElementById('paymentStatus');
    
    // Hide all payment details sections
    if (upiDetails) upiDetails.style.display = 'none';
    if (cardDetails) cardDetails.style.display = 'none';
    if (netbankingDetails) netbankingDetails.style.display = 'none';
    if (paymentStatus) paymentStatus.style.display = 'none';
    
    // Show the selected payment method details
    if (method === 'upi' && upiDetails) {
        upiDetails.style.display = 'block';
    } else if (method === 'card' && cardDetails) {
        cardDetails.style.display = 'block';
        initCardInput();
    } else if (method === 'netbanking' && netbankingDetails) {
        netbankingDetails.style.display = 'block';
    }
}

function initCardInput() {
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            // Format card number with spaces every 4 digits
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
            }
            e.target.value = value;
            
            // Update card type icons
            updateCardTypeIcons(value.replace(/\s/g, ''));
        });
    }
    
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function(e) {
            // Format expiry date as MM/YY
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
}

function updateCardTypeIcons(cardNumber) {
    const visa = document.querySelector('.card-type-icon.visa');
    const mastercard = document.querySelector('.card-type-icon.mastercard');
    const amex = document.querySelector('.card-type-icon.amex');
    const discover = document.querySelector('.card-type-icon.discover');
    
    // Reset all icons
    [visa, mastercard, amex, discover].forEach(icon => {
        if (icon) icon.classList.remove('active');
    });
    
    // Identify card type based on first few digits
    if (/^4/.test(cardNumber)) {
        if (visa) visa.classList.add('active');
    } else if (/^5[1-5]/.test(cardNumber)) {
        if (mastercard) mastercard.classList.add('active');
    } else if (/^3[47]/.test(cardNumber)) {
        if (amex) amex.classList.add('active');
    } else if (/^6011|^65/.test(cardNumber)) {
        if (discover) discover.classList.add('active');
    }
}

function processCardPayment() {
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCvv = document.getElementById('cardCvv');
    const cardName = document.getElementById('cardName');
    
    // Validate card details
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) return;
    
    const cardNumberValue = cardNumber.value.replace(/\s/g, '');
    const cardExpiryValue = cardExpiry.value;
    const cardCvvValue = cardCvv.value;
    const cardNameValue = cardName.value;
    
    if (!cardNumberValue || cardNumberValue.length < 13) {
        showToast('Please enter a valid card number', 'error');
        cardNumber.focus();
        return;
    }
    
    if (!cardExpiryValue || !cardExpiryValue.includes('/')) {
        showToast('Please enter a valid expiry date (MM/YY)', 'error');
        cardExpiry.focus();
        return;
    }
    
    if (!cardCvvValue || cardCvvValue.length < 3) {
        showToast('Please enter a valid CVV code', 'error');
        cardCvv.focus();
        return;
    }
    
    if (!cardNameValue) {
        showToast('Please enter the cardholder name', 'error');
        cardName.focus();
        return;
    }
    
    // Show loading state
    const payButton = event.currentTarget;
    if (!payButton) return;
    
    const originalText = payButton.textContent;
    payButton.textContent = 'Processing...';
    payButton.disabled = true;
    
    // Add a small spinner icon
    const spinner = document.createElement('i');
    spinner.className = 'fas fa-spinner fa-spin';
    spinner.style.marginLeft = '10px';
    payButton.appendChild(spinner);
    
    // Simulate card payment processing
    setTimeout(() => {
        const paymentStatus = document.getElementById('paymentStatus');
        if (!paymentStatus) {
            payButton.textContent = originalText;
            payButton.disabled = false;
            return;
        }
        
        paymentStatus.style.display = 'block';
        
        // Random success (80% chance) or failure (20% chance) for demo
        const isSuccessful = Math.random() > 0.2;
        
        if (isSuccessful) {
            // Successful payment
            paymentStatus.className = 'payment-status success';
            paymentStatus.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>Payment successful! Amount: ₹499</p>
                <p>Transaction ID: CARD${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                <p>Thank you for upgrading to premium!</p>
            `;
            
            // Activate premium features
            activatePremiumFeatures();
            
            // Close modal after 3 seconds
            setTimeout(() => {
                const modal = document.getElementById('paymentModal');
                if (modal) modal.style.display = 'none';
                showToast('Premium features activated successfully!', 'success');
            }, 3000);
        } else {
            // Failed payment
            paymentStatus.className = 'payment-status error';
            paymentStatus.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <p>Payment failed! Please check your card details and try again.</p>
                <p>Error: Card transaction could not be completed.</p>
                <button class="btn btn-primary retry-payment">Try Again</button>
            `;
            
            // Add retry button functionality
            const retryBtn = paymentStatus.querySelector('.retry-payment');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    paymentStatus.style.display = 'none';
                    payButton.textContent = originalText;
                    payButton.disabled = false;
                });
            }
        }
        
        // Reset button state regardless
        if (!isSuccessful) {
            setTimeout(() => {
                payButton.textContent = originalText;
                payButton.disabled = false;
            }, 1000);
        }
    }, 2000);
}

function processNetBankingPayment() {
    const selectedBank = document.querySelector('input[name="bank"]:checked');
    
    if (!selectedBank) {
        showToast('Please select a bank', 'error');
        return;
    }
    
    // Show loading state
    const payButton = event.currentTarget;
    if (!payButton) return;
    
    const originalText = payButton.textContent;
    payButton.textContent = 'Redirecting...';
    payButton.disabled = true;
    
    // Simulate redirect to bank page
    setTimeout(() => {
        const paymentStatus = document.getElementById('paymentStatus');
        if (!paymentStatus) {
            payButton.textContent = originalText;
            payButton.disabled = false;
            return;
        }
        
        paymentStatus.className = 'payment-status info';
        paymentStatus.style.display = 'block';
        paymentStatus.innerHTML = `
            <i class="fas fa-university"></i>
            <p>Redirecting to ${selectedBank.value.toUpperCase()} Bank...</p>
            <p>Please do not close this window.</p>
            <div class="redirect-progress">
                <div class="redirect-progress-bar"></div>
            </div>
        `;
        
        // Simulate progress bar
        const progressBar = paymentStatus.querySelector('.redirect-progress-bar');
        if (progressBar) {
            progressBar.style.transition = 'width 2s ease-in-out';
            setTimeout(() => {
                progressBar.style.width = '100%';
            }, 100);
        }
        
        // Simulate successful payment after redirect
        setTimeout(() => {
            paymentStatus.className = 'payment-status success';
            paymentStatus.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>Payment successful! Amount: ₹499</p>
                <p>Transaction ID: NET${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                <p>Thank you for upgrading to premium!</p>
            `;
            
            // Activate premium features
            activatePremiumFeatures();
            
            // Close modal after 3 seconds
            setTimeout(() => {
                const modal = document.getElementById('paymentModal');
                if (modal) modal.style.display = 'none';
                showToast('Premium features activated successfully!', 'success');
            }, 3000);
        }, 3000);
    }, 1000);
}

function activatePremiumFeatures() {
    // Store premium status in localStorage
    localStorage.setItem('isPremium', 'true');
    localStorage.setItem('premiumActivationDate', new Date().toISOString());
    
    // Update UI to reflect premium status
    const premiumCTASection = document.querySelector('.premium-cta-section');
    if (premiumCTASection) {
        premiumCTASection.innerHTML = `
            <div class="premium-cta active">
                <div class="cta-content">
                    <h2>Premium Activated! <i class="fas fa-crown"></i></h2>
                    <p>You now have access to all premium features</p>
                    <div class="premium-features-list">
                        <div class="premium-feature">
                            <i class="fas fa-check-circle"></i>
                            <span>Advanced Financial Analytics</span>
                        </div>
                        <div class="premium-feature">
                            <i class="fas fa-check-circle"></i>
                            <span>Unlimited Relationship Goals</span>
                        </div>
                        <div class="premium-feature">
                            <i class="fas fa-check-circle"></i>
                            <span>Priority Customer Support</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Check for premium status on page load
function checkPremiumStatus() {
    const isPremium = localStorage.getItem('isPremium') === 'true';
    
    if (isPremium) {
        // Check if premium has expired (for demo purposes, 7 days)
        const activationDate = new Date(localStorage.getItem('premiumActivationDate') || '');
        const today = new Date();
        const diffDays = Math.floor((today - activationDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 30) {
            // Premium is still active
            activatePremiumFeatures();
            showToast('Welcome back, Premium member!', 'success');
        } else {
            // Premium has expired
            localStorage.removeItem('isPremium');
            localStorage.removeItem('premiumActivationDate');
            showToast('Your premium subscription has expired', 'info');
        }
    }
}

// Close modal when clicking outside or on close button
function initPaymentModalListeners() {
    const modal = document.getElementById('paymentModal');
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .premium-badge {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-left: 1rem;
        animation: slideIn 0.3s ease forwards;
    }

    .premium-badge i {
        color: #FFD700;
    }

    .premium-feature.active {
        opacity: 1;
        transform: translateX(0);
    }
`;
document.head.appendChild(style);

// Dashboard Initialization
function initDashboard() {
    // Initialize dashboard charts and progress bars
    const progressBars = document.querySelectorAll('.dashboard-progress-bar-fill');
    progressBars.forEach(bar => {
        setTimeout(() => {
            const width = bar.getAttribute('style').match(/width:\s*(\d+)%/)[1];
            bar.style.width = width + '%';
        }, 500);
    });

    // Add event listeners for dashboard cards
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
    });

    // Setup mock charts
    const chartElements = document.querySelectorAll('.dashboard-chart');
    if (chartElements.length > 0) {
        setupMockCharts(chartElements);
    }
}

function setupMockCharts(chartElements) {
    // This is a simple visual representation for demo purposes
    // In a real app, you would use a charting library like Chart.js
    chartElements.forEach(chart => {
        const mockData = generateMockData();
        chart.innerHTML = '';
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 100 50');
        svg.style.overflow = 'visible';
        
        // Create path for line chart
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let d = `M 0 ${50 - mockData[0]}`;
        
        for (let i = 1; i < mockData.length; i++) {
            const x = i * (100 / (mockData.length - 1));
            const y = 50 - mockData[i];
            d += ` L ${x} ${y}`;
        }
        
        path.setAttribute('d', d);
        path.setAttribute('stroke', 'url(#chartGradient)');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        
        // Add gradient definition
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'chartGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '0%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', 'var(--primary-color)');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', 'var(--secondary-color)');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        
        svg.appendChild(defs);
        svg.appendChild(path);
        chart.appendChild(svg);
        
        // Animate path
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        
        setTimeout(() => {
            path.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
            path.style.strokeDashoffset = 0;
        }, 100);
    });
}

function generateMockData() {
    // Generate random data points for the chart
    const data = [];
    for (let i = 0; i < 12; i++) {
        data.push(Math.floor(Math.random() * 30) + 10);
    }
    return data;
}

// Community Hub Initialization
function initCommunity() {
    const communityTabs = document.querySelectorAll('.community-tab');
    
    communityTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            communityTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // In a real app, you would load the appropriate content here
            // For demo purposes, we'll just show a success message
            showToast(`Loaded ${tab.textContent} content`, 'success');
        });
    });
    
    // Add event listeners for community post actions
    const postActions = document.querySelectorAll('.community-post-action');
    postActions.forEach(action => {
        action.addEventListener('click', () => {
            // Get the action type
            const actionType = action.querySelector('i').classList.contains('fa-heart') ? 'like' :
                               action.querySelector('i').classList.contains('fa-comment') ? 'comment' :
                               action.querySelector('i').classList.contains('fa-share') ? 'share' :
                               action.querySelector('i').classList.contains('fa-download') ? 'download' : 'unknown';
            
            // Handle the action
            switch (actionType) {
                case 'like':
                    const countSpan = action.querySelector('span');
                    const currentCount = parseInt(countSpan.textContent);
                    countSpan.textContent = currentCount + 1;
                    showToast('Post liked!', 'success');
                    break;
                case 'comment':
                    showModal('Add Comment', 'Share your thoughts:', [
                        {
                            text: 'Post Comment',
                            class: 'btn-primary',
                            action: () => {
                                const comment = document.querySelector('#commentText').value;
                                if (!comment) {
                                    showToast('Please enter a comment', 'error');
                                    return;
                                }
                                showToast('Comment posted!', 'success');
                            }
                        },
                        {
                            text: 'Cancel',
                            class: 'btn-secondary',
                            action: () => {}
                        }
                    ], `
                    <div class="form-group">
                        <textarea id="commentText" rows="3" placeholder="Type your comment here..."></textarea>
                    </div>
                    `);
                    break;
                case 'share':
                    showToast('Post shared!', 'success');
                    break;
                case 'download':
                    showToast('File downloaded!', 'success');
                    break;
            }
        });
    });
}

function processUPIPayment() {
    const upiAmount = document.getElementById('upiAmount');
    if (!upiAmount) return;
    
    const amount = upiAmount.value;
    if (!amount || amount <= 0 || isNaN(parseFloat(amount))) {
        showToast('Please enter a valid amount', 'error');
        return;
    }

    // Show loading state
    const payButton = event.currentTarget;
    if (!payButton) return;
    
    const originalText = payButton.textContent;
    payButton.textContent = 'Processing...';
    payButton.disabled = true;
    
    // Add a small spinner icon
    const spinner = document.createElement('i');
    spinner.className = 'fas fa-spinner fa-spin';
    spinner.style.marginLeft = '10px';
    payButton.appendChild(spinner);

    // Simulate UPI payment processing
    setTimeout(() => {
        const paymentStatus = document.getElementById('paymentStatus');
        if (!paymentStatus) {
            payButton.textContent = originalText;
            payButton.disabled = false;
            return;
        }
        
        paymentStatus.style.display = 'block';
        
        // Random success (80% chance) or failure (20% chance) for demo
        const isSuccessful = Math.random() > 0.2;
        
        if (isSuccessful) {
            // Successful payment
            paymentStatus.className = 'payment-status success';
            paymentStatus.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>Payment successful! Amount: ₹${parseFloat(amount).toFixed(2)}</p>
                <p>Transaction ID: UPI${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                <p>Thank you for upgrading to premium!</p>
            `;
            
            // Activate premium features
            activatePremiumFeatures();
            
            // Close modal after 3 seconds
            setTimeout(() => {
                const modal = document.getElementById('paymentModal');
                if (modal) modal.style.display = 'none';
                showToast('Premium features activated successfully!', 'success');
            }, 3000);
        } else {
            // Failed payment
            paymentStatus.className = 'payment-status error';
            paymentStatus.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <p>Payment failed! Please try again.</p>
                <p>Error: UPI transaction could not be completed.</p>
                <button class="btn btn-primary retry-payment">Try Again</button>
            `;
            
            // Add retry button functionality
            const retryBtn = paymentStatus.querySelector('.retry-payment');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    paymentStatus.style.display = 'none';
                    payButton.textContent = originalText;
                    payButton.disabled = false;
                });
            }
        }
        
        // Reset button state regardless
        if (!isSuccessful) {
            setTimeout(() => {
                payButton.textContent = originalText;
                payButton.disabled = false;
            }, 1000);
        }
    }, 2000);
}

// Enhanced error handling for all functions
function safelyExecute(fn, errorMessage) {
    try {
        return fn();
    } catch (error) {
        console.error(errorMessage, error);
        showToast(errorMessage, "error");
        return null;
    }
}

// Add this function to check if images are loaded properly
function preloadImages() {
    const imagePaths = [
        'images/date-ideas/restaurant.svg',
        'images/date-ideas/movie.svg',
        'images/date-ideas/outdoor.svg',
        'images/avatars/user1.svg',
        'images/avatars/user2.svg',
        'images/avatars/user3.svg',
        'images/logo.svg'
    ];
    
    let loadedCount = 0;
    const totalImages = imagePaths.length;
    
    imagePaths.forEach(path => {
        const img = new Image();
        img.onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                console.log("All images loaded successfully");
            }
        };
        img.onerror = () => {
            console.warn(`Failed to load image: ${path}`);
            // Use a placeholder image instead
            img.src = 'images/placeholder.svg';
        };
        img.src = path;
    });
}

// Call preloadImages on page load
window.addEventListener('load', preloadImages);

// Add a function to verify all required DOM elements exist
function verifyRequiredElements() {
    const requiredElements = [
        { id: 'paymentModal', name: 'Payment Modal' },
        { id: 'upiDetails', name: 'UPI Details' },
        { id: 'cardDetails', name: 'Card Details' },
        { id: 'netbankingDetails', name: 'Net Banking Details' },
        { id: 'paymentStatus', name: 'Payment Status' },
        { selector: '.theme-switcher', name: 'Theme Switcher' },
        { selector: '.dashboard-container', name: 'Dashboard Container' },
        { selector: '.community-container', name: 'Community Container' }
    ];
    
    let missingElements = [];
    
    requiredElements.forEach(element => {
        if (element.id && !document.getElementById(element.id)) {
            missingElements.push(element.name);
        } else if (element.selector && !document.querySelector(element.selector)) {
            missingElements.push(element.name);
        }
    });
    
    if (missingElements.length > 0) {
        console.warn("Missing required elements:", missingElements.join(', '));
        return false;
    }
    
    return true;
}

// Call verifyRequiredElements after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(verifyRequiredElements, 500); // Slight delay to ensure all elements are rendered
}); 