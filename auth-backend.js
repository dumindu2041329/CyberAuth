// User authentication system using PHP backend

// API endpoints - Use absolute path for production
const API_BASE_URL = window.location.origin + '/api/';

// Get current logged in user from localStorage
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Set current user
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        setTimeout(() => {
            errorElement.classList.remove('show');
        }, 5000);
    }
}

// Show success message
function showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.textContent = message;
        successElement.classList.add('show');
    }
}

// Signup Form Handler
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Client-side validation
        if (!username || !email || !password || !confirmPassword) {
            showError('errorMessage', 'All fields are required');
            return;
        }
        
        if (username.length < 3) {
            showError('errorMessage', 'Username must be at least 3 characters');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('errorMessage', 'Invalid email format');
            return;
        }
        
        if (password.length < 6) {
            showError('errorMessage', 'Password must be at least 6 characters');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('errorMessage', 'Passwords do not match');
            return;
        }
        
        // Send signup request to backend
        try {
            const response = await fetch(API_BASE_URL + 'signup.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Store user info (without password)
                setCurrentUser(data.user);
                
                // Show success and redirect
                showSuccess('successMessage', 'Account created! Redirecting to dashboard...');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showError('errorMessage', data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            showError('errorMessage', 'Network error. Please try again.');
        }
    });
}

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Client-side validation
        if (!email || !password) {
            showError('loginError', 'All fields are required');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('loginError', 'Invalid email format');
            return;
        }
        
        // Send login request to backend
        try {
            const response = await fetch(API_BASE_URL + 'login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Store user info
                setCurrentUser(data.user);
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                showError('loginError', data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('loginError', 'Network error. Please try again.');
        }
    });
}

// Password toggle functionality
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentElement.querySelector('.password-toggle');
    const eyeIcon = toggle.querySelector('.eye-icon');
    const eyePath = eyeIcon.querySelector('.eye-path');
    
    if (input.type === 'password') {
        // Show password - add crossed out eye effect
        input.type = 'text';
        eyeIcon.classList.add('hidden');
        eyePath.style.strokeDasharray = '4 4';
        eyePath.style.opacity = '0.6';
        
        // Add slash line through eye
        if (!eyeIcon.querySelector('.slash-line')) {
            const slashLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            slashLine.setAttribute('class', 'slash-line');
            slashLine.setAttribute('x1', '4');
            slashLine.setAttribute('y1', '20');
            slashLine.setAttribute('x2', '20');
            slashLine.setAttribute('y2', '4');
            slashLine.setAttribute('stroke', 'currentColor');
            slashLine.setAttribute('stroke-width', '2');
            slashLine.setAttribute('stroke-linecap', 'round');
            eyeIcon.appendChild(slashLine);
        }
    } else {
        // Hide password - restore normal eye
        input.type = 'password';
        eyeIcon.classList.remove('hidden');
        eyePath.style.strokeDasharray = 'none';
        eyePath.style.opacity = '1';
        
        // Remove slash line
        const slashLine = eyeIcon.querySelector('.slash-line');
        if (slashLine) {
            slashLine.remove();
        }
    }
}

// Redirect to dashboard if already logged in (for login and signup pages)
if ((window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) && isLoggedIn()) {
    window.location.href = 'dashboard.html';
}