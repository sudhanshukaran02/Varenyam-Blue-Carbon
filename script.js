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
 * Smooth scroll to an element by its ID (accounts for sticky navbar)
 */
function smoothScroll(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70;
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementTop - navbarHeight - 16; // small margin
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
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
            // Store account data and login
            storeAccountData();
            // If a redirect was requested (e.g., user clicked Buyer Dashboard), route there
            const redirect = sessionStorage.getItem('redirectTo');
            if (redirect) {
                sessionStorage.removeItem('redirectTo');
                showSection(redirect);
                // Render dashboard if needed
                if (redirect === 'buyer-dashboard') renderBuyerDashboard();
            } else {
                showSection('success-page');
            }
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

    // Store in session storage and mark logged in
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('password', password);
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('loginTime', new Date().toLocaleString());

    // Ensure purchases array exists
    if (!sessionStorage.getItem('purchases')) {
        sessionStorage.setItem('purchases', JSON.stringify([]));
    }
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

// ===================== AUTH & BUYER DASHBOARD =====================
/**
 * Initialize Login form for existing users
 */
function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    // Pre-fill email if present
    const preEmail = sessionStorage.getItem('buyerEmail');
    if (preEmail) {
        const e = document.getElementById('loginEmail');
        if (e) e.value = preEmail;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value.trim();
        const email = (document.getElementById('loginEmail')?.value || '').trim();
        const password = document.getElementById('loginPassword').value;
        const storedUser = sessionStorage.getItem('username');
        const storedPass = sessionStorage.getItem('password');
        const loginError = document.getElementById('loginError');
        const loginEmailError = document.getElementById('loginEmailError');

        // Validate email
        if (!validateEmail(email)) {
            if (loginEmailError) {
                loginEmailError.style.display = 'block';
                loginEmailError.textContent = 'Please enter a valid email address';
            }
            return;
        } else {
            if (loginEmailError) { loginEmailError.style.display = 'none'; loginEmailError.textContent = ''; }
        }

        // Store buyer email for receipts
        sessionStorage.setItem('buyerEmail', email);

        if (username === storedUser && password === storedPass) {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('loginTime', new Date().toLocaleString());
            if (loginError) { loginError.style.display = 'none'; loginError.textContent = ''; }
            const redirect = sessionStorage.getItem('redirectTo');
            if (redirect) {
                sessionStorage.removeItem('redirectTo');
                showSection(redirect);
                if (redirect === 'buyer-dashboard') renderBuyerDashboard();
            } else {
                showSection('buyer-dashboard');
                renderBuyerDashboard();
            }
        } else {
            if (loginError) {
                loginError.style.display = 'block';
                loginError.textContent = 'Invalid username or password. Please try again.';
            } else {
                alert('Invalid username or password');
            }
        }
    });
}

/**
 * Try to open buyer dashboard but redirect to login if not authenticated
 */
function attemptOpenBuyerDashboard() {
    if (isAuthenticated()) {
        showSection('buyer-dashboard');
        renderBuyerDashboard();
    } else {
        sessionStorage.setItem('redirectTo', 'buyer-dashboard');
        showSection('login');
    }
}

/**
 * Check auth state
 */
function isAuthenticated() {
    return sessionStorage.getItem('isLoggedIn') === 'true';
}

/**
 * Logout current user
 */
function logout() {
    sessionStorage.setItem('isLoggedIn', 'false');
    sessionStorage.removeItem('loginTime');
    showSection('home');
    alert('You have been logged out.');
}

/**
 * Products available in marketplace
 */
const PRODUCTS = [
    { id: 'p1', name: 'Mangrove Carbon Credit (Verified)', price: 10, unit: 'ton CO₂e' },
    { id: 'p2', name: 'Seagrass Restoration Credit', price: 8, unit: 'ton CO₂e' },
    { id: 'p3', name: 'Blue Carbon Pool Credit', price: 12, unit: 'ton CO₂e' }
];

/**
 * Render buyer dashboard (products & purchases)
 */
function renderBuyerDashboard() {
    const greetingEl = document.getElementById('dashboardGreeting');
    const productsEl = document.getElementById('productsList');
    const purchasesEl = document.getElementById('purchasesList');

    const company = sessionStorage.getItem('companyName') || sessionStorage.getItem('username') || 'Buyer';
    if (greetingEl) greetingEl.textContent = `Hello, ${company}`;

    // Render products with search & sort
    const search = (document.getElementById('productSearch')?.value || '').toLowerCase();
    const sort = document.getElementById('productSort')?.value || 'popular';
    let list = PRODUCTS.slice();

    if (search) {
        list = list.filter(p => p.name.toLowerCase().includes(search));
    }

    if (sort === 'price-asc') {
        list.sort((a,b) => a.price - b.price);
    } else if (sort === 'price-desc') {
        list.sort((a,b) => b.price - a.price);
    }

    if (productsEl) {
        productsEl.innerHTML = list.map(p => `
            <div class="product-card interactive" id="${p.id}">
                <div class="product-media">
                    <div class="product-image">🌿</div>
                </div>
                <div class="product-body">
                    <h4>${p.name}</h4>
                    <p class="muted small">${p.unit} • ${formatCurrency(p.price)} per ${p.unit}</p>
                    <div class="product-controls">
                        <div class="qty-control">
                            <button class="qty-btn" onclick="changeQtyInput('${p.id}', -1)">−</button>
                            <input type="number" min="1" value="1" id="${p.id}-qty" class="qty-input" />
                            <button class="qty-btn" onclick="changeQtyInput('${p.id}', 1)">+</button>
                        </div>
                        <button class="btn-primary" onclick="addToCart('${p.id}')">Add to Cart</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Render purchases history
    if (purchasesEl) {
        const purchases = JSON.parse(sessionStorage.getItem('purchases') || '[]');
        const sendingId = sessionStorage.getItem('sendingPurchase') || null;
        if (!purchases.length) {
            purchasesEl.innerHTML = '<p class="muted">No purchases yet.</p>';
        } else {
            purchasesEl.innerHTML = purchases.map((pu, i) => {
                const emailInfo = pu.buyerEmail ? (pu.emailSent ? `<div class="muted small">Email sent to ${pu.buyerEmail}${pu.lastEmailSentAt ? ` on ${pu.lastEmailSentAt}` : ''} (attempts: ${pu.emailAttempts || 1})</div>` : `<div class="muted small failed">Email not sent (attempts: ${pu.emailAttempts || 0})</div>`) : `<div class="muted small">No email provided</div>`;
                const isSending = sendingId === pu.id;
                const downloadBtn = pu.certificate ? `<a href="${pu.certificate}" download="certificate-${pu.id}.png" class="btn-secondary small">Download Certificate</a>` : '';
                const resendBtn = (pu.certificate && pu.buyerEmail) ? `<button class="btn-secondary small" onclick="resendCertificate('${pu.id}')" ${isSending ? 'disabled' : ''}>${isSending ? 'Sending...' : 'Resend Certificate'}</button>` : '';

                return `
                    <div class="purchase-item">
                        <div>
                            <strong>${pu.name}</strong> — ${pu.quantity} ${pu.unit} (${formatCurrency(pu.price)} each)
                            ${emailInfo}
                        </div>
                        <div class="purchase-actions">
                            <div class="muted small">${pu.time}</div>
                            ${downloadBtn}
                            ${resendBtn}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // Keep cart UI updated
    renderCart();
}

/** CART & CHECKOUT HELPERS **/
function getCart() {
    return JSON.parse(sessionStorage.getItem('cart') || '{}');
}

function saveCart(cart) {
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

function changeQtyInput(productId, delta) {
    const input = document.getElementById(productId + '-qty');
    if (!input) return;
    let val = parseInt(input.value || '1', 10);
    val = Math.max(1, val + delta);
    input.value = val;
}

function addToCart(productId) {
    const prod = PRODUCTS.find(p => p.id === productId);
    if (!prod) return;
    const qty = parseInt(document.getElementById(productId + '-qty')?.value || '1', 10);

    const cart = getCart();
    cart[productId] = (cart[productId] || 0) + qty;
    saveCart(cart);

    animateAddToCart(productId);
    showToast(`${qty} x ${prod.name} added to cart`);
    renderCart();
}

function animateAddToCart(productId) {
    const el = document.getElementById(productId);
    if (!el) return;
    el.classList.add('pulse');
    setTimeout(() => el.classList.remove('pulse'), 600);
}

function renderCart() {
    const cart = getCart();
    const cartItemsEl = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartBadge = document.getElementById('cartBadge');
    const checkoutBtn = document.getElementById('checkoutBtn');

    const entries = Object.keys(cart);
    let total = 0;
    let totalQty = 0;

    if (!cartItemsEl) return;
    if (entries.length === 0) {
        cartItemsEl.innerHTML = '<p class="muted">Cart is empty.</p>';
        cartTotalEl.textContent = formatCurrency(0);
        cartBadge.textContent = '0';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    cartItemsEl.innerHTML = entries.map(pid => {
        const p = PRODUCTS.find(x => x.id === pid);
        const qty = cart[pid];
        const line = p.price * qty;
        total += line;
        totalQty += qty;
        return `
            <div class="cart-item" data-id="${pid}">
                <div class="cart-item-info">
                    <strong>${p.name}</strong>
                    <div class="muted small">${qty} × ${formatCurrency(p.price)} = ${formatCurrency(line)}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="qty-btn" onclick="updateCartItem('${pid}', ${Math.max(0, qty-1)})">−</button>
                    <span class="cart-qty">${qty}</span>
                    <button class="qty-btn" onclick="updateCartItem('${pid}', ${qty+1})">+</button>
                    <button class="btn-secondary small" onclick="removeFromCart('${pid}')">Remove</button>
                </div>
            </div>
        `;
    }).join('');

    cartTotalEl.textContent = formatCurrency(total);
    cartBadge.textContent = String(totalQty);
    if (checkoutBtn) checkoutBtn.disabled = entries.length === 0;
}

function updateCartItem(productId, qty) {
    const cart = getCart();
    if (qty <= 0) {
        delete cart[productId];
    } else {
        cart[productId] = qty;
    }
    saveCart(cart);
    renderCart();
}

function removeFromCart(productId) {
    const cart = getCart();
    if (cart[productId]) delete cart[productId];
    saveCart(cart);
    showToast('Removed item from cart');
    renderCart();
}

function toggleCartPanel() {
    const panel = document.getElementById('cartPanel');
    if (!panel) return;
    const open = panel.classList.toggle('open');
    panel.setAttribute('aria-hidden', !open);
}

function showCheckoutModal() {
    const cart = getCart();
    const entries = Object.keys(cart);
    if (!entries.length) return;
    const summary = entries.map(pid => {
        const p = PRODUCTS.find(x => x.id === pid);
        return `${cart[pid]} × ${p.name} (${formatCurrency(p.price)} each)`;
    }).join('<br>');
    document.getElementById('checkoutSummary').innerHTML = summary + `<br><strong>Total: ${formatCurrency(Object.keys(cart).reduce((s,k)=> s + (PRODUCTS.find(x=>x.id===k).price * cart[k]), 0))}</strong>`;
    const modal = document.getElementById('checkoutModal');
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) { modal.style.display = 'none'; modal.setAttribute('aria-hidden', 'true'); }
}

async function confirmCheckout() {
    const cart = getCart();
    const purchases = JSON.parse(sessionStorage.getItem('purchases') || '[]');
    const buyerEmail = sessionStorage.getItem('buyerEmail') || null;

    // For each item in cart, create a purchase with a generated certificate and attempt to send
    for (const pid of Object.keys(cart)) {
        const p = PRODUCTS.find(x => x.id === pid);
        const newPurchase = {
            id: 'order_' + Date.now() + '_' + pid,
            productId: pid,
            name: p.name,
            price: p.price,
            quantity: cart[pid],
            unit: p.unit,
            time: new Date().toLocaleString(),
            buyerEmail: buyerEmail,
            emailAttempts: 0,
            emailSent: false
        };

        // Generate certificate image and attach to purchase
        try {
            const certDataUrl = generateCertificate(newPurchase);
            newPurchase.certificate = certDataUrl;
        } catch (err) {
            console.error('Certificate generation failed', err);
        }

        // Attempt to send email (if available) and record result
        if (buyerEmail) {
            // mark sending state
            sessionStorage.setItem('sendingPurchase', newPurchase.id);
            renderBuyerDashboard();
            try {
                await simulateSendEmail(buyerEmail, `Your Carbon Credit Purchase (${newPurchase.id})`, `Thank you for purchasing ${newPurchase.quantity} ${newPurchase.unit} of ${newPurchase.name}. Your certificate is attached.`, [{ filename: `certificate-${newPurchase.id}.png`, dataUrl: newPurchase.certificate }]);
                newPurchase.emailSent = true;
                newPurchase.emailAttempts = (newPurchase.emailAttempts || 0) + 1;
                newPurchase.lastEmailSentAt = new Date().toLocaleString();
            } catch (err) {
                newPurchase.emailSent = false;
                newPurchase.lastEmailError = err.message;
                newPurchase.emailAttempts = (newPurchase.emailAttempts || 0) + 1;
            } finally {
                sessionStorage.removeItem('sendingPurchase');
            }
        }

        purchases.unshift(newPurchase);
        sessionStorage.setItem('purchases', JSON.stringify(purchases));
        renderBuyerDashboard();
    }

    sessionStorage.removeItem('cart');
    closeCheckoutModal();
    renderBuyerDashboard();
    toggleCartPanel();
    showToast('Purchase processed. Email sends recorded — you can Retry if any delivery failed. ✅');
}

/**
 * Simple email validation
 */
function validateEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Generate a simple certificate image as PNG data URL using canvas
 */
function generateCertificate(purchase) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#FDFBF7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#2D8659';
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // Title
    ctx.fillStyle = '#083153';
    ctx.font = '36px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Carbon Credit Purchase', canvas.width / 2, 120);

    // Buyer / Company
    const buyer = sessionStorage.getItem('companyName') || sessionStorage.getItem('username') || 'Buyer';
    ctx.font = '22px serif';
    ctx.fillText(`Issued to: ${buyer}` + (purchase.buyerEmail ? ` (${purchase.buyerEmail})` : ''), canvas.width / 2, 180);

    // Details
    ctx.font = '20px serif';
    ctx.fillText(`${purchase.quantity} ${purchase.unit} of "${purchase.name}"`, canvas.width / 2, 240);
    ctx.fillText(`Certificate ID: ${purchase.id}`, canvas.width / 2, 280);
    ctx.fillText(`Date: ${purchase.time}`, canvas.width / 2, 320);

    // Footer / signature
    ctx.font = '18px serif';
    ctx.fillText('Varenyam Blue Carbon Registry', canvas.width / 2, canvas.height - 120);

    return canvas.toDataURL('image/png');
}

/**
 * Simulate sending an email by storing a record and showing a toast
 */
function simulateSendEmail(to, subject, body, attachments = []) {
    return new Promise((resolve, reject) => {
        console.log('Simulated send', { to, subject, body, attachments });
        // simulate network latency and occasional failure (85% success)
        setTimeout(() => {
            const success = Math.random() < 0.85;
            if (success) {
                const sent = JSON.parse(sessionStorage.getItem('sentEmails') || '[]');
                sent.unshift({ to, subject, body, attachments: attachments.map(a => ({ filename: a.filename })), time: new Date().toLocaleString() });
                sessionStorage.setItem('sentEmails', JSON.stringify(sent));
                showToast(`Email sent to ${to}`);
                resolve();
            } else {
                // failure
                showToast(`Email to ${to} failed. Please retry.`);
                reject(new Error('Simulated delivery failure'));
            }
        }, 900 + Math.random() * 900);
    });
}

async function resendCertificate(purchaseId) {
    const purchases = JSON.parse(sessionStorage.getItem('purchases') || '[]');
    const idx = purchases.findIndex(p => p.id === purchaseId);
    if (idx === -1) return;
    const pu = purchases[idx];
    if (!pu.buyerEmail) { showToast('No buyer email available'); return; }
    if (!pu.certificate) { showToast('No certificate available'); return; }

    // mark as sending
    sessionStorage.setItem('sendingPurchase', purchaseId);
    renderBuyerDashboard();

    try {
        await simulateSendEmail(pu.buyerEmail, `Your Carbon Credit Certificate (${pu.id})`, `Attached is your certificate.`, [{ filename: `certificate-${pu.id}.png`, dataUrl: pu.certificate }]);
        pu.emailSent = true;
        pu.emailAttempts = (pu.emailAttempts || 0) + 1;
        pu.lastEmailSentAt = new Date().toLocaleString();
        delete pu.lastEmailError;
        showToast('Email resent successfully');
    } catch (err) {
        pu.emailSent = false;
        pu.emailAttempts = (pu.emailAttempts || 0) + 1;
        pu.lastEmailError = err.message;
        showToast('Resend failed. Please try again.');
    } finally {
        sessionStorage.removeItem('sendingPurchase');
        purchases[idx] = pu;
        sessionStorage.setItem('purchases', JSON.stringify(purchases));
        renderBuyerDashboard();
    }
}

function showToast(msg, timeout = 2500) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.style.display = 'block';
    t.classList.add('show');
    setTimeout(() => {
        t.classList.remove('show');
        setTimeout(() => t.style.display = 'none', 300);
    }, timeout);
}

// Backwards-compatible buyCredit: add to cart then open cart panel
function buyCredit(productId) {
    const qty = parseInt(document.getElementById(productId + '-qty')?.value || '1', 10);
    addToCart(productId);
    toggleCartPanel();
}

/**
 * Trigger buying flow for a product
 */
function buyCredit(productId) {
    if (!isAuthenticated()) {
        sessionStorage.setItem('redirectTo', 'buyer-dashboard');
        showSection('login');
        return;
    }

    const prod = PRODUCTS.find(p => p.id === productId);
    if (!prod) return;

    const qtyInput = document.getElementById(productId + '-qty');
    const qty = parseInt(qtyInput?.value || '0', 10);
    if (!qty || qty <= 0) {
        alert('Please enter a valid quantity.');
        return;
    }

    // Simple confirmation
    const total = prod.price * qty;
    const confirmed = confirm(`Buy ${qty} ${prod.unit} of "${prod.name}" for ${formatCurrency(total)}?`);
    if (!confirmed) return;

    // Save purchase
    const purchases = JSON.parse(sessionStorage.getItem('purchases') || '[]');
    purchases.unshift({
        id: 'order_' + Date.now(),
        productId: prod.id,
        name: prod.name,
        price: prod.price,
        quantity: qty,
        unit: prod.unit,
        time: new Date().toLocaleString()
    });
    sessionStorage.setItem('purchases', JSON.stringify(purchases));

    alert('Purchase successful! Thank you for supporting blue carbon. ✅');
    renderBuyerDashboard();
}

/**
 * Format number as simple currency
 */
function formatCurrency(value) {
    return '₹' + Number(value).toFixed(2);
}

// ===================== INITIALIZATION =====================
document.addEventListener('DOMContentLoaded', () => {
    // Show home section by default
    showSection('home');

    // Initialize forms
    initGstForm();
    initAccountForm();
    initLoginForm();

    // Attach product search and sort listeners (only once)
    if (!renderBuyerDashboard._listenersAttached) {
        document.getElementById('productSearch')?.addEventListener('input', renderBuyerDashboard);
        document.getElementById('productSort')?.addEventListener('change', renderBuyerDashboard);
        renderBuyerDashboard._listenersAttached = true;
    }

    // If already logged in and user was trying to access dashboard, route them automatically
    if (isAuthenticated() && sessionStorage.getItem('redirectTo') === 'buyer-dashboard') {
        sessionStorage.removeItem('redirectTo');
        showSection('buyer-dashboard');
        renderBuyerDashboard();
    }

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


// ===================== MRV SYSTEM NAVIGATION =====================
/**
 * Show a specific MRV page and hide others
 * Updates active button styling
 */
function showMrvPage(pageId) {
    // Hide all MRV pages
    const pages = document.querySelectorAll('.mrv-page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Update active button styling
    const buttons = document.querySelectorAll('.mrv-nav-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Find and mark the clicked button as active
    const pageMap = {
        'mrv-page1': 0,
        'mrv-page2': 1,
        'mrv-page3': 2,
        'mrv-page4': 3
    };

    if (buttons[pageMap[pageId]]) {
        buttons[pageMap[pageId]].classList.add('active');
    }

    // Scroll to top of MRV section
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
