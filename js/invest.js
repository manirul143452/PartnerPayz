/**
 * PartnerPay Investment Scripts
 * Handles investment charts, returns calculator, and goal/account creation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize investment performance chart
    initPerformanceChart();
    
    // Initialize returns calculator
    initReturnsCalculator();
    
    // Handle time filter buttons
    const timeOptions = document.querySelectorAll('.time-option');
    timeOptions.forEach(option => {
        option.addEventListener('click', function() {
            timeOptions.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updatePerformanceChart(this.getAttribute('data-time'));
        });
    });
    
    // Handle account creation
    const createAccountBtn = document.getElementById('createAccountBtn');
    const accountForm = document.getElementById('accountForm');
    const cancelAccountBtn = document.getElementById('cancelAccountBtn');
    
    if (createAccountBtn && accountForm) {
        createAccountBtn.addEventListener('click', function() {
            accountForm.style.display = 'block';
            this.style.display = 'none';
        });
        
        cancelAccountBtn.addEventListener('click', function() {
            accountForm.style.display = 'none';
            createAccountBtn.style.display = 'block';
        });
    }
    
    // Handle contribution split slider
    const splitSlider = document.getElementById('splitSlider');
    const yourSplit = document.getElementById('yourSplit');
    const partnerSplit = document.getElementById('partnerSplit');
    
    if (splitSlider) {
        splitSlider.addEventListener('input', function() {
            const value = this.value;
            yourSplit.textContent = value;
            partnerSplit.textContent = 100 - value;
            
            // Update slider gradient
            updateSliderGradient(this, value);
        });
        
        // Initialize slider gradient
        updateSliderGradient(splitSlider, splitSlider.value);
    }
    
    // Handle goal creation modal
    const addGoalBtn = document.getElementById('addGoalBtn');
    const goalModal = document.getElementById('create-goal');
    const closeGoalModal = document.getElementById('closeGoalModal');
    const cancelGoalBtn = document.getElementById('cancelGoalBtn');
    
    if (addGoalBtn && goalModal) {
        addGoalBtn.addEventListener('click', function() {
            goalModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeGoalModal.addEventListener('click', closeGoalModalFunction);
        cancelGoalBtn.addEventListener('click', closeGoalModalFunction);
        
        goalModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeGoalModalFunction();
            }
        });
    }
    
    // Handle goal split slider
    const goalSplitSlider = document.getElementById('goalSplitSlider');
    const yourGoalSplit = document.getElementById('yourGoalSplit');
    const partnerGoalSplit = document.getElementById('partnerGoalSplit');
    
    if (goalSplitSlider) {
        goalSplitSlider.addEventListener('input', function() {
            const value = this.value;
            yourGoalSplit.textContent = value;
            partnerGoalSplit.textContent = 100 - value;
            
            // Update slider gradient
            updateSliderGradient(this, value);
        });
        
        // Initialize slider gradient
        updateSliderGradient(goalSplitSlider, goalSplitSlider.value);
    }
    
    // Calculate recommended monthly contribution
    const targetAmount = document.getElementById('targetAmount');
    const targetDate = document.getElementById('targetDate');
    const initialContribution = document.getElementById('initialContribution');
    const recommendedAmount = document.getElementById('recommendedAmount');
    
    if (targetAmount && targetDate && recommendedAmount) {
        [targetAmount, targetDate, initialContribution].forEach(input => {
            input.addEventListener('input', calculateRecommendedContribution);
        });
    }
    
    // Handle account form submission
    const accountFormEl = document.querySelector('.account-form');
    if (accountFormEl) {
        accountFormEl.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            showToast('Joint account created successfully!', 'success');
            
            // Hide the form
            accountForm.style.display = 'none';
            createAccountBtn.style.display = 'block';
        });
    }
    
    // Handle goal form submission
    const goalForm = document.querySelector('.goal-form');
    if (goalForm) {
        goalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            showToast('Financial goal created successfully!', 'success');
            
            // Close the modal
            closeGoalModalFunction();
        });
    }
    
    /**
     * Initialize Performance Chart
     */
    function initPerformanceChart() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        
        // Sample data
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const data = [65000, 66200, 67800, 68500, 69700, 70200, 69800, 70500, 71300, 71800, 72500, 72800];
        
        const investedData = [65000, 66000, 67000, 68000, 69000, 70000, 71000, 72000, 73000, 74000, 75000, 76000];
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
        
        window.performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Portfolio Value',
                        data: data,
                        borderColor: '#3B82F6',
                        backgroundColor: gradient,
                        tension: 0.4,
                        borderWidth: 3,
                        fill: true,
                        pointBackgroundColor: '#3B82F6',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    },
                    {
                        label: 'Total Invested',
                        data: investedData,
                        borderColor: '#D1D5DB',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.4,
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            boxWidth: 12,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1F2937',
                        titleColor: '#F9FAFB',
                        bodyColor: '#F3F4F6',
                        bodySpacing: 6,
                        padding: 12,
                        boxWidth: 10,
                        boxHeight: 10,
                        boxPadding: 3,
                        usePointStyle: true,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ₹' + context.raw.toLocaleString('en-IN');
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#9CA3AF'
                        }
                    },
                    y: {
                        grid: {
                            borderDash: [2, 2]
                        },
                        ticks: {
                            color: '#9CA3AF',
                            callback: function(value) {
                                return '₹' + value.toLocaleString('en-IN');
                            }
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Update Performance Chart based on time filter
     */
    function updatePerformanceChart(timeRange) {
        // In a real app, you would fetch data from API based on timeRange
        let labels, data, investedData;
        
        switch (timeRange) {
            case '1m':
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                data = [71800, 72100, 72500, 72800];
                investedData = [72000, 73000, 74000, 75000];
                break;
            case '3m':
                labels = ['Oct', 'Nov', 'Dec'];
                data = [71300, 72000, 72800];
                investedData = [72000, 74000, 76000];
                break;
            case '6m':
                labels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                data = [69800, 70500, 71300, 71800, 72500, 72800];
                investedData = [71000, 72000, 73000, 74000, 75000, 76000];
                break;
            case '1y':
            default:
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                data = [65000, 66200, 67800, 68500, 69700, 70200, 69800, 70500, 71300, 71800, 72500, 72800];
                investedData = [65000, 66000, 67000, 68000, 69000, 70000, 71000, 72000, 73000, 74000, 75000, 76000];
                break;
        }
        
        window.performanceChart.data.labels = labels;
        window.performanceChart.data.datasets[0].data = data;
        window.performanceChart.data.datasets[1].data = investedData;
        window.performanceChart.update();
    }
    
    /**
     * Initialize Returns Calculator
     */
    function initReturnsCalculator() {
        const ctx = document.getElementById('returnsChart').getContext('2d');
        
        // Sample data for initial calculation
        const years = Array.from({length: 5}, (_, i) => i + 1);
        const principalData = Array.from({length: 5}, (_, i) => 10000 + 5000 * 12 * (i + 1));
        const returnsData = calculateReturns(10000, 5000, 12, 12, 5);
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
        
        window.returnsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years.map(year => `Year ${year}`),
                datasets: [
                    {
                        label: 'Total Investment',
                        data: principalData,
                        backgroundColor: '#D1D5DB',
                        borderRadius: 4
                    },
                    {
                        label: 'Expected Returns',
                        data: returnsData.map((total, i) => total - principalData[i]),
                        backgroundColor: '#3B82F6',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            boxWidth: 12,
                            usePointStyle: true,
                            pointStyle: 'rect'
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1F2937',
                        titleColor: '#F9FAFB',
                        bodyColor: '#F3F4F6',
                        bodySpacing: 6,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ₹' + context.raw.toLocaleString('en-IN');
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#9CA3AF'
                        }
                    },
                    y: {
                        stacked: true,
                        grid: {
                            borderDash: [2, 2]
                        },
                        ticks: {
                            color: '#9CA3AF',
                            callback: function(value) {
                                return '₹' + value.toLocaleString('en-IN');
                            }
                        }
                    }
                }
            }
        });
        
        // Handle calculate button click
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', updateReturnsCalculation);
        }
        
        // Update initial calculation display
        updateCalculationResults(principalData[4], returnsData[4] - principalData[4], returnsData[4]);
    }
    
    /**
     * Update Returns Calculation based on user inputs
     */
    function updateReturnsCalculation() {
        const initialInvestment = parseFloat(document.getElementById('initialInvestment').value) || 0;
        const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
        const expectedReturn = parseFloat(document.getElementById('expectedReturn').value) || 0;
        const investmentPeriod = parseInt(document.getElementById('investmentPeriod').value) || 0;
        const compoundingFrequency = parseInt(document.getElementById('compoundingFrequency').value) || 12;
        
        if (investmentPeriod <= 0) {
            showToast('Please enter a valid investment period', 'error');
            return;
        }
        
        // Calculate returns
        const years = Array.from({length: investmentPeriod}, (_, i) => i + 1);
        const principalData = years.map(year => initialInvestment + monthlyContribution * 12 * year);
        const returnsData = calculateReturns(initialInvestment, monthlyContribution, expectedReturn, compoundingFrequency, investmentPeriod);
        
        // Update chart
        window.returnsChart.data.labels = years.map(year => `Year ${year}`);
        window.returnsChart.data.datasets[0].data = principalData;
        window.returnsChart.data.datasets[1].data = returnsData.map((total, i) => total - principalData[i]);
        window.returnsChart.update();
        
        // Update result display
        const finalPrincipal = principalData[investmentPeriod - 1];
        const finalReturns = returnsData[investmentPeriod - 1] - finalPrincipal;
        const finalValue = returnsData[investmentPeriod - 1];
        
        updateCalculationResults(finalPrincipal, finalReturns, finalValue);
    }
    
    /**
     * Calculate Investment Returns
     * @param {number} initialInvestment - Initial investment amount
     * @param {number} monthlyContribution - Monthly contribution amount
     * @param {number} annualRate - Annual interest rate (%)
     * @param {number} compoundingFrequency - Compounding frequency per year
     * @param {number} years - Investment period in years
     * @returns {Array} - Array of total values at the end of each year
     */
    function calculateReturns(initialInvestment, monthlyContribution, annualRate, compoundingFrequency, years) {
        const rate = annualRate / 100 / compoundingFrequency;
        const totalCompounds = compoundingFrequency * years;
        const monthlyRate = annualRate / 100 / 12;
        
        let balance = initialInvestment;
        const yearlyBalances = [];
        
        for (let year = 1; year <= years; year++) {
            for (let month = 1; month <= 12; month++) {
                // Add monthly contribution
                balance += monthlyContribution;
                
                // Apply monthly interest
                balance *= (1 + monthlyRate);
            }
            
            // Store balance at end of year
            yearlyBalances.push(Math.round(balance));
        }
        
        return yearlyBalances;
    }
    
    /**
     * Update Calculation Results Display
     */
    function updateCalculationResults(totalInvestment, estimatedReturns, futureValue) {
        document.getElementById('totalInvestment').textContent = '₹' + Math.round(totalInvestment).toLocaleString('en-IN');
        document.getElementById('estimatedReturns').textContent = '₹' + Math.round(estimatedReturns).toLocaleString('en-IN');
        document.getElementById('futureValue').textContent = '₹' + Math.round(futureValue).toLocaleString('en-IN');
    }
    
    /**
     * Calculate Recommended Monthly Contribution
     */
    function calculateRecommendedContribution() {
        const targetAmt = parseFloat(document.getElementById('targetAmount').value) || 0;
        const targetDt = document.getElementById('targetDate').value;
        const initialContrib = parseFloat(document.getElementById('initialContribution').value) || 0;
        
        if (targetAmt <= 0 || !targetDt) {
            return;
        }
        
        // Calculate time difference in months
        const today = new Date();
        const targetDate = new Date(targetDt);
        const monthsDiff = (targetDate.getFullYear() - today.getFullYear()) * 12 + (targetDate.getMonth() - today.getMonth());
        
        if (monthsDiff <= 0) {
            recommendedAmount.textContent = 'Invalid date';
            return;
        }
        
        // Calculate required monthly contribution for target amount
        // Assuming 10% annual return, compounded monthly
        const monthlyRate = 0.10 / 12;
        const remainingAmount = targetAmt - initialContrib;
        
        // Formula: PMT = (FV * r) / ((1 + r)^n - 1)
        // Where PMT = monthly payment, FV = future value, r = monthly rate, n = number of months
        const monthlyContribution = (remainingAmount * monthlyRate) / (Math.pow(1 + monthlyRate, monthsDiff) - 1);
        
        recommendedAmount.textContent = '₹' + Math.round(monthlyContribution).toLocaleString('en-IN');
    }
    
    /**
     * Update Slider Gradient
     */
    function updateSliderGradient(slider, value) {
        const percentage = value + '%';
        slider.style.background = `linear-gradient(to right, #1E3A8A 0%, #1E3A8A ${percentage}, #E5E7EB ${percentage}, #E5E7EB 100%)`;
    }
    
    /**
     * Close Goal Modal Function
     */
    function closeGoalModalFunction() {
        goalModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    /**
     * Show Toast Message
     */
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        
        toast.innerHTML = `
            <div class="toast-icon"><i class="fas fa-${icon}"></i></div>
            <div class="toast-content">${message}</div>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(toast);
        
        // Add show class after a brief delay to trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            closeToast(toast);
        }, 5000);
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', function() {
            closeToast(toast);
        });
    }
    
    /**
     * Close Toast Message
     */
    function closeToast(toast) {
        toast.classList.remove('show');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
}); 