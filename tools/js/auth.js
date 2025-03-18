/**
 * PartnerPay Authentication Scripts
 * Handles login, registration, form validation and OTP verification
 */

document.addEventListener('DOMContentLoaded', function() {
    // Common elements
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    
    // Login form specific elements
    const otpContainer = document.getElementById('otpContainer');
    const otpInputs = document.querySelectorAll('.otp-input');
    const resendOtpLink = document.querySelector('.resend-otp a');
    
    // Registration form specific elements
    const progressSteps = document.querySelectorAll('.progress-step');
    const formSteps = document.querySelectorAll('.form-step');
    const nextStepBtns = document.querySelectorAll('.next-step');
    const prevStepBtns = document.querySelectorAll('.prev-step');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text span');
    const requirements = document.querySelectorAll('.requirement');
    const uploadAreas = document.querySelectorAll('.upload-area');
    const fileInputs = document.querySelectorAll('.file-input');
    const uploadPreviews = document.querySelectorAll('.upload-preview');
    const removeUploads = document.querySelectorAll('.remove-upload');
    const profileInput = document.querySelector('.profile-upload .file-input');
    const profilePreview = document.querySelector('.profile-preview img');
    const uploadProfileBtn = document.querySelector('.upload-profile-btn');
    const removeProfileBtn = document.querySelector('.remove-profile-btn');
    const ageRange = {
        min: document.getElementById('minAge'),
        max: document.getElementById('maxAge'),
        minValue: document.getElementById('minAgeValue'),
        maxValue: document.getElementById('maxAgeValue')
    };
    const distanceRange = document.getElementById('maxDistance');
    const distanceValue = document.getElementById('distanceValue');
    
    // Initialize password toggle functionality
    if (togglePasswordBtns.length) {
        togglePasswordBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.previousElementSibling;
                
                // Toggle password visibility
                if (input.type === 'password') {
                    input.type = 'text';
                    this.classList.remove('fa-eye');
                    this.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    this.classList.remove('fa-eye-slash');
                    this.classList.add('fa-eye');
                }
            });
        });
    }
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember')?.checked;
            
            // Validate form
            if (!email) {
                showToast('Please enter your email or phone number', 'error');
                return;
            }
            
            if (!password) {
                showToast('Please enter your password', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // In a real application, this would be an API call to authenticate the user
                
                // Show success message
                showToast('Login successful! Redirecting...', 'success');
                
                // Show OTP verification (simulate 2FA)
                setTimeout(() => {
                    if (otpContainer) {
                        otpContainer.classList.remove('hidden');
                        otpInputs[0]?.focus();
                        
                        submitBtn.innerHTML = 'Verify OTP';
                        submitBtn.disabled = false;
                    } else {
                        // Redirect to dashboard
                        window.location.href = 'dashboard.html';
                    }
                }, 1000);
            }, 1500);
        });
    }
    
    // Handle OTP inputs
    if (otpInputs.length) {
        otpInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                // Only allow numbers
                this.value = this.value.replace(/[^0-9]/g, '');
                
                // Auto-focus next input when filled
                const index = parseInt(this.getAttribute('data-index'));
                if (this.value && index < otpInputs.length) {
                    otpInputs[index]?.focus();
                }
                
                // Check if all OTP inputs are filled
                const allFilled = Array.from(otpInputs).every(input => input.value);
                if (allFilled) {
                    // Simulate OTP verification
                    setTimeout(() => {
                        showToast('OTP verified successfully!', 'success');
                        
                        // Redirect to dashboard
                        setTimeout(() => {
                            window.location.href = 'dashboard.html';
                        }, 1000);
                    }, 500);
                }
            });
            
            input.addEventListener('keydown', function(e) {
                // Allow backspace to go to previous input
                if (e.key === 'Backspace' && !this.value) {
                    const index = parseInt(this.getAttribute('data-index'));
                    if (index > 1) {
                        otpInputs[index - 2]?.focus();
                    }
                }
            });
        });
    }
    
    // Handle resend OTP
    if (resendOtpLink) {
        resendOtpLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show loading state
            const originalText = this.textContent;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            this.style.pointerEvents = 'none';
            
            // Simulate resending OTP
            setTimeout(() => {
                this.textContent = originalText;
                this.style.pointerEvents = '';
                
                // Show success message
                showToast('OTP sent successfully!', 'success');
                
                // Focus first OTP input
                otpInputs[0]?.focus();
            }, 1500);
        });
    }
    
    // Handle registration form multi-step
    if (registrationForm) {
        // Next step buttons
        nextStepBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const currentStep = parseInt(this.closest('.form-step').getAttribute('data-step'));
                const nextStep = parseInt(this.getAttribute('data-next'));
                
                // Validate current step before proceeding
                if (!validateStep(currentStep)) {
                    return;
                }
                
                // Update progress steps
                updateProgressSteps(nextStep);
                
                // Hide current step and show next step
                document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
                document.querySelector(`.form-step[data-step="${nextStep}"]`).classList.add('active');
                
                // Scroll to top of form
                registrationForm.scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        // Previous step buttons
        prevStepBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const currentStep = parseInt(this.closest('.form-step').getAttribute('data-step'));
                const prevStep = parseInt(this.getAttribute('data-prev'));
                
                // Update progress steps
                updateProgressSteps(prevStep);
                
                // Hide current step and show previous step
                document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
                document.querySelector(`.form-step[data-step="${prevStep}"]`).classList.add('active');
                
                // Scroll to top of form
                registrationForm.scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        // Registration form submission
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate final step
            if (!validateStep(4)) {
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // In a real application, this would be an API call to register the user
                
                // Show success message
                showToast('Account created successfully! Redirecting...', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            }, 2000);
        });
    }
    
    // Password strength functionality
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = checkPasswordStrength(password);
            
            // Update strength bar
            strengthBar.style.width = `${strength.score * 25}%`;
            strengthBar.style.backgroundColor = strength.color;
            
            // Update strength text
            strengthText.textContent = strength.text;
            
            // Update requirements
            updatePasswordRequirements(password);
        });
    }
    
    // Confirm password validation
    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value !== passwordInput.value) {
                this.setCustomValidity('Passwords do not match');
            } else {
                this.setCustomValidity('');
            }
        });
    }
    
    // Handle file uploads
    if (uploadAreas.length) {
        uploadAreas.forEach((area, index) => {
            const fileInput = fileInputs[index];
            const preview = uploadPreviews[index];
            const previewImg = preview.querySelector('img');
            const removeBtn = removeUploads[index];
            
            // Handle drag and drop
            area.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('dragover');
            });
            
            area.addEventListener('dragleave', function() {
                this.classList.remove('dragover');
            });
            
            area.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('dragover');
                
                if (e.dataTransfer.files.length) {
                    fileInput.files = e.dataTransfer.files;
                    handleFileSelection(fileInput, preview, previewImg);
                }
            });
            
            // Handle click to upload
            area.addEventListener('click', function() {
                fileInput.click();
            });
            
            // Handle file selection
            fileInput.addEventListener('change', function() {
                handleFileSelection(this, preview, previewImg);
            });
            
            // Handle remove upload
            if (removeBtn) {
                removeBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    // Clear file input
                    fileInput.value = '';
                    
                    // Hide preview and show upload area
                    preview.classList.add('hidden');
                    area.classList.remove('hidden');
                });
            }
        });
    }
    
    // Handle profile picture upload
    if (profileInput) {
        uploadProfileBtn.addEventListener('click', function() {
            profileInput.click();
        });
        
        profileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    profilePreview.src = e.target.result;
                    removeProfileBtn.classList.remove('hidden');
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
        
        removeProfileBtn.addEventListener('click', function() {
            profilePreview.src = 'images/default-avatar.jpg';
            profileInput.value = '';
            this.classList.add('hidden');
        });
    }
    
    // Handle age range sliders
    if (ageRange.min && ageRange.max) {
        ageRange.min.addEventListener('input', function() {
            // Ensure min value doesn't exceed max value
            if (parseInt(this.value) > parseInt(ageRange.max.value)) {
                this.value = ageRange.max.value;
            }
            
            // Update display value
            ageRange.minValue.textContent = this.value;
        });
        
        ageRange.max.addEventListener('input', function() {
            // Ensure max value doesn't go below min value
            if (parseInt(this.value) < parseInt(ageRange.min.value)) {
                this.value = ageRange.min.value;
            }
            
            // Update display value
            ageRange.maxValue.textContent = this.value;
        });
    }
    
    // Handle distance range slider
    if (distanceRange && distanceValue) {
        distanceRange.addEventListener('input', function() {
            distanceValue.textContent = this.value;
        });
    }
    
    /**
     * Update progress steps visualization
     */
    function updateProgressSteps(currentStep) {
        progressSteps.forEach(step => {
            const stepNumber = parseInt(step.getAttribute('data-step'));
            
            if (stepNumber < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNumber === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }
    
    /**
     * Validate current step of registration form
     */
    function validateStep(step) {
        const currentStep = document.querySelector(`.form-step[data-step="${step}"]`);
        
        switch (step) {
            case 1:
                // Basic info validation
                const fullName = document.getElementById('fullName').value.trim();
                const email = document.getElementById('email').value.trim();
                const phone = document.getElementById('phone').value.trim();
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                if (!fullName) {
                    showToast('Please enter your full name', 'error');
                    return false;
                }
                
                if (!email || !isValidEmail(email)) {
                    showToast('Please enter a valid email address', 'error');
                    return false;
                }
                
                if (!phone || phone.length < 10) {
                    showToast('Please enter a valid phone number', 'error');
                    return false;
                }
                
                if (!password || checkPasswordStrength(password).score < 2) {
                    showToast('Please create a stronger password', 'error');
                    return false;
                }
                
                if (password !== confirmPassword) {
                    showToast('Passwords do not match', 'error');
                    return false;
                }
                
                break;
                
            case 2:
                // Verification validation
                const documentType = document.getElementById('documentType').value;
                const frontDocument = document.querySelector('input[name="frontDocument"]').value;
                const backDocument = document.querySelector('input[name="backDocument"]').value;
                
                if (!documentType) {
                    showToast('Please select a document type', 'error');
                    return false;
                }
                
                if (!frontDocument) {
                    showToast('Please upload the front side of your document', 'error');
                    return false;
                }
                
                if (!backDocument) {
                    showToast('Please upload the back side of your document', 'error');
                    return false;
                }
                
                break;
                
            case 3:
                // Profile validation
                const dateOfBirth = document.getElementById('dateOfBirth').value;
                const gender = currentStep.querySelector('input[name="gender"]:checked');
                const location = document.getElementById('location').value.trim();
                
                if (!dateOfBirth) {
                    showToast('Please enter your date of birth', 'error');
                    return false;
                }
                
                if (!gender) {
                    showToast('Please select your gender', 'error');
                    return false;
                }
                
                if (!location) {
                    showToast('Please enter your location', 'error');
                    return false;
                }
                
                break;
                
            case 4:
                // Preferences validation
                const termsConsent = document.querySelector('input[name="termsConsent"]').checked;
                
                if (!termsConsent) {
                    showToast('Please agree to our Terms of Service and Privacy Policy', 'error');
                    return false;
                }
                
                break;
        }
        
        return true;
    }
    
    /**
     * Check password strength and return score, color, and text
     */
    function checkPasswordStrength(password) {
        // Default values
        let score = 0;
        let color = '#EF4444';
        let text = 'Weak';
        
        // No password or very short
        if (!password || password.length < 6) {
            return { score, color, text };
        }
        
        // Check for various criteria
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLongEnough = password.length >= 8;
        
        // Calculate score
        if (hasLowercase) score++;
        if (hasUppercase) score++;
        if (hasNumbers) score++;
        if (hasSpecial) score++;
        if (isLongEnough) score++;
        
        // Set color and text based on score
        if (score <= 2) {
            color = '#EF4444';
            text = 'Weak';
        } else if (score <= 3) {
            color = '#F59E0B';
            text = 'Moderate';
        } else if (score <= 4) {
            color = '#10B981';
            text = 'Strong';
        } else {
            color = '#059669';
            text = 'Very Strong';
        }
        
        return { score: Math.min(score, 4), color, text };
    }
    
    /**
     * Update password requirements indicators
     */
    function updatePasswordRequirements(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        for (const [key, value] of Object.entries(requirements)) {
            const element = document.querySelector(`.requirement[data-requirement="${key}"]`);
            if (element) {
                if (value) {
                    element.classList.add('valid');
                } else {
                    element.classList.remove('valid');
                }
            }
        }
    }
    
    /**
     * Handle file selection for uploads
     */
    function handleFileSelection(input, preview, previewImg) {
        if (input.files && input.files[0]) {
            // Validate file size (max 5MB)
            if (input.files[0].size > 5 * 1024 * 1024) {
                showToast('File size should not exceed 5MB', 'error');
                input.value = '';
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                preview.classList.remove('hidden');
                input.closest('.upload-area').classList.add('hidden');
            };
            
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    /**
     * Validate email format
     */
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
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