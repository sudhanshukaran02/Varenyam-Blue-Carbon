// ===================== PAGE NAVIGATION =====================
/**
 * Show a specific section and hide all others
 * Creates a smooth page transition effect
 */
function showSection(sectionId) {
    // Get all sections
    const sections = document.querySelectorAll('.section');

    // Hide all sections and remove active class
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

/**
 * Smooth scroll to an element by its ID
 */
function smoothScroll(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===================== GST VERIFICATION (STEP 1) =====================
/**
 * Initialize GST form validation
 * Listen to input changes and validate in real-time
 */
function initGstForm() {
    const form = document.getElementById('gstForm');
    const inputs = form.querySelectorAll('input');
    const submitBtn = document.getElementById('verifyGstBtn');

    // Add event listeners to all inputs
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateGstForm();
        });
        input.addEventListener('blur', () => {
            validateGstField(input);
        });
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateGstForm()) {
            // Store GST data and move to next step
            storeGstData();
            showSection('login-step2');
        }
    });
}

/**
 * Validate a single GST form field
 */
function validateGstField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Company Name validation
    if (fieldName === 'companyName') {
        if (value.length === 0) {
            isValid = false;
            errorMessage = 'Company name is required';
        } else if (value.length < 3) {
            isValid = false;
            errorMessage = 'Company name must be at least 3 characters';
        }
    }

    // GST Number validation (Indian GST format)
    if (fieldName === 'gstNumber') {
        // GST format: 2 digits (state code) + 10 alphanumeric + 1 digit + 1 check digit = 15 chars
        const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (value.length === 0) {
            isValid = false;
            errorMessage = 'GST number is required';
        } else if (value.length !== 15) {
            isValid = false;
            errorMessage = 'GST number must be 15 characters';
        } else if (!gstPattern.test(value.toUpperCase())) {
            isValid = false;
            errorMessage = 'Invalid GST format (e.g., 27AABCT1234B1Z5)';
        }
    }

    // Employee Name validation
    if (fieldName === 'employeeName') {
        if (value.length === 0) {
            isValid = false;
            errorMessage = 'Employee name is required';
        } else if (value.length < 2) {
            isValid = false;
            errorMessage = 'Employee name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
            isValid = false;
            errorMessage = 'Employee name can only contain letters and spaces';
        }
    }

    // Job Title validation
    if (fieldName === 'jobTitle') {
        if (value.length === 0) {
            isValid = false;
            errorMessage = 'Job title is required';
        } else if (value.length < 2) {
            isValid = false;
            errorMessage = 'Job title must be at least 2 characters';
        }
    }

    // Update UI based on validation result
    updateFieldValidation(field, isValid, errorMessage);
    return isValid;
}

/**
 * Validate entire GST form and enable/disable submit button
 */
function validateGstForm() {
    const form = document.getElementById('gstForm');
    const inputs = form.querySelectorAll('input');
    const submitBtn = document.getElementById('verifyGstBtn');
    let allValid = true;

    inputs.forEach(input => {
        if (!validateGstField(input)) {
            allValid = false;
        }
    });

    // Enable/disable submit button
    submitBtn.disabled = !allValid;
    return allValid;
}

/**
 * Store GST data in session storage for Step 2
 */
function storeGstData() {
    const companyName = document.getElementById('companyName').value;
    const gstNumber = document.getElementById('gstNumber').value;
    const employeeName = document.getElementById('employeeName').value;
    const jobTitle = document.getElementById('jobTitle').value;

    // Store in session storage
    sessionStorage.setItem('companyName', companyName);
    sessionStorage.setItem('gstNumber', gstNumber);
    sessionStorage.setItem('employeeName', employeeName);
    sessionStorage.setItem('jobTitle', jobTitle);
}

// ===================== ACCOUNT CREATION (STEP 2) =====================
/**
 * Initialize account creation form validation
 */
function initAccountForm() {
    const form = document.getElementById('accountForm');
    const inputs = form.querySelectorAll('input');
    const submitBtn = document.getElementById('createAccountBtn');

    // Add event listeners to all inputs
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateAccountForm();
        });
        input.addEventListener('blur', () => {
            validateAccountField(input);
        });
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateAccountForm()) {
            // Store account data and show success page
            storeAccountData();
            showSection('success-page');
        }
    });
}

/**
 * Validate a single account form field
 */
function validateAccountField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Username validation
    if (fieldName === 'username') {
        if (value.length === 0) {
            isValid = false;
            errorMessage = 'Username is required';
        } else if (value.length < 3) {
            isValid = false;
            errorMessage = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
            isValid = false;
            errorMessage = 'Username can only contain letters, numbers, hyphens, and underscores';
        }
    }

    // Confirm Username validation
    if (fieldName === 'confirmUsername') {
        const username = document.getElementById('username').value;
        if (value.length === 0) {
            isValid = false;
            errorMessage = 'Please confirm your username';
        } else if (value !== username) {
            isValid = false;
            errorMessage = 'Usernames do not match';
        }
    }

    // Password validation
    if (fieldName === 'password') {
        const passwordValidation = validatePassword(value);
        isValid = passwordValidation.isValid;
        errorMessage = passwordValidation.message;
    }

    // Confirm Password validation
    if (fieldName === 'confirmPassword') {
        const password = document.getElementById('password').value;
        if (value.length === 0) {
            isValid = false;
            errorMessage = 'Please confirm your password';
        } else if (value !== password) {
            isValid = false;
            errorMessage = 'Passwords do not match';
        }
    }

    // Update UI based on validation result
    updateFieldValidation(field, isValid, errorMessage);
    return isValid;
}

/**
 * Comprehensive password strength validation
 */
function validatePassword(password) {
    let isValid = true;
    let message = '';

    if (password.length === 0) {
        return { isValid: false, message: 'Password is required' };
    }

    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /[0-9]/.test(password),
    };

    if (!checks.length) {
        isValid = false;
        message = 'Password must be at least 8 characters';
    } else if (!checks.uppercase) {
        isValid = false;
        message = 'Password must contain at least one uppercase letter';
    } else if (!checks.lowercase) {
        isValid = false;
        message = 'Password must contain at least one lowercase letter';
    } else if (!checks.numbers) {
        isValid = false;
        message = 'Password must contain at least one number';
    }

    return { isValid, message };
}

/**
 * Validate entire account form and enable/disable submit button
 */
function validateAccountForm() {
    const form = document.getElementById('accountForm');
    const inputs = form.querySelectorAll('input');
    const submitBtn = document.getElementById('createAccountBtn');
    let allValid = true;

    inputs.forEach(input => {
        if (!validateAccountField(input)) {
            allValid = false;
        }
    });

    // Enable/disable submit button
    submitBtn.disabled = !allValid;
    return allValid;
}

/**
 * Store account data in session storage
 */
function storeAccountData() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Store in session storage
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('password', password);
    sessionStorage.setItem('loginTime', new Date().toLocaleString());
}

// ===================== FIELD VALIDATION UI UPDATES =====================
/**
 * Update field UI based on validation result
 * Shows/hides error messages and updates field styling
 */
function updateFieldValidation(field, isValid, errorMessage) {
    const errorElement = document.getElementById(field.name + 'Error');

    if (!isValid) {
        // Mark field as invalid
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }
    } else {
        // Mark field as valid
        field.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }
}

// ===================== INITIALIZATION =====================
/**
 * Initialize all event listeners when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Show home section by default
    showSection('home');

    // Initialize forms
    initGstForm();
    initAccountForm();

    // Optional: Pre-fill account form with GST data for reference
    // You can uncomment this if you want to show the GST data on the account creation page
    // displayGstDataReference();
});

/**
 * Optional: Display GST data on Step 2 for reference (commented out)
 * Uncomment to use this feature
 */
function displayGstDataReference() {
    const companyName = sessionStorage.getItem('companyName');
    const employeeName = sessionStorage.getItem('employeeName');

    if (companyName && employeeName) {
        console.log('Company: ' + companyName);
        console.log('Employee: ' + employeeName);
        // You can add a reference section in the HTML if needed
    }
}

// ===================== UTILITY FUNCTIONS =====================
/**
 * Clear all form data (useful for testing)
 */
function clearAllForms() {
    document.getElementById('gstForm').reset();
    document.getElementById('accountForm').reset();
    sessionStorage.clear();
}

/**
 * Log session data (for debugging)
 */
function logSessionData() {
    console.log('=== Session Data ===');
    console.log('Company:', sessionStorage.getItem('companyName'));
    console.log('GST:', sessionStorage.getItem('gstNumber'));
    console.log('Employee:', sessionStorage.getItem('employeeName'));
    console.log('Job Title:', sessionStorage.getItem('jobTitle'));
    console.log('Username:', sessionStorage.getItem('username'));
    console.log('Login Time:', sessionStorage.getItem('loginTime'));
}
