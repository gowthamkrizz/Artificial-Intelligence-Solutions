/* ==========================================================================
   STACKLY - CYBER AUTHENTICATION VALIDATION ENGINE
   Real-Time Cyber Glitch Errors, Floating Error Badges & Matrix Verifier
   ========================================================================== */

(function () {
  'use strict';

  // Helper: Cyber Toast Notifications
  function showAuthToast(message, type = 'info') {
    let container = document.querySelector('.auth-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'auth-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `auth-toast ${type}`;
    const icon = type === 'success' 
      ? 'fa-solid fa-circle-check' 
      : (type === 'error' ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-info');
    
    toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  window.showAuthToast = showAuthToast;

  /* ──────────────────────────────────────────
     FIELD ERROR & SUCCESS VISUAL MANAGERS
  ────────────────────────────────────────── */
  function setFieldError(input, message) {
    if (!input) return;
    input.classList.add('has-error');
    input.classList.remove('is-valid');

    const wrapper = input.closest('.auth-field-group');
    if (wrapper) {
      // Remove any existing error badge
      const existingErr = wrapper.querySelector('.cyber-field-error');
      if (existingErr) existingErr.remove();

      // Create new cyber error badge
      const errBadge = document.createElement('div');
      errBadge.className = 'cyber-field-error';
      errBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>${message}</span>`;
      
      const insertTarget = wrapper.querySelector('.password-rules-matrix') || wrapper.querySelector('.input-icon-wrapper') || input;
      if (insertTarget && insertTarget.parentNode === wrapper) {
        insertTarget.after(errBadge);
      } else {
        wrapper.appendChild(errBadge);
      }
    }
  }

  function clearFieldError(input) {
    if (!input) return;
    input.classList.remove('has-error');
    if (input.value && input.value.trim().length > 0) {
      input.classList.add('is-valid');
    } else {
      input.classList.remove('is-valid');
    }

    const wrapper = input.closest('.auth-field-group');
    if (wrapper) {
      const existingErr = wrapper.querySelector('.cyber-field-error');
      if (existingErr) existingErr.remove();
    }
  }

  /* ──────────────────────────────────────────
     1. PASSWORD VISIBILITY TOGGLE
  ────────────────────────────────────────── */
  function initPasswordToggles() {
    const toggleBtns = document.querySelectorAll('.pwd-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (!input) return;

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';

        const icon = btn.querySelector('i');
        if (icon) {
          if (isPassword) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
          } else {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
          }
        }
      });
    });
  }

  /* ──────────────────────────────────────────
     2. PASSWORD MATRIX CHECKER
  ────────────────────────────────────────── */
  function checkPasswordRules(pwdVal) {
    const hasLen = pwdVal.length >= 8;
    const hasUpper = /[A-Z]/.test(pwdVal);
    const hasLower = /[a-z]/.test(pwdVal);
    const hasNum = /[0-9]/.test(pwdVal);

    updateRuleChip('rule-len', hasLen);
    updateRuleChip('rule-upper', hasUpper);
    updateRuleChip('rule-lower', hasLower);
    updateRuleChip('rule-num', hasNum);

    return hasLen && hasUpper && hasLower && hasNum;
  }

  function updateRuleChip(ruleId, isValid) {
    const elem = document.getElementById(ruleId);
    if (!elem) return;
    const icon = elem.querySelector('i');
    if (isValid) {
      elem.classList.add('valid');
      elem.classList.remove('invalid');
      if (icon) icon.className = 'fa-solid fa-circle-check';
    } else {
      elem.classList.remove('valid');
      if (icon) icon.className = 'fa-regular fa-circle-check';
    }
  }

  function initPasswordValidator() {
    const pwdInput = document.getElementById('password-field');
    if (!pwdInput) return;

    pwdInput.addEventListener('input', () => {
      const isValid = checkPasswordRules(pwdInput.value);
      if (isValid) {
        clearFieldError(pwdInput);
      }
    });

    pwdInput.addEventListener('blur', () => {
      if (pwdInput.value.length > 0 && !checkPasswordRules(pwdInput.value)) {
        setFieldError(pwdInput, 'Password must satisfy all 4 security rules above.');
      }
    });
  }

  /* ──────────────────────────────────────────
     3. FIELD-LEVEL REAL-TIME VALIDATORS
  ────────────────────────────────────────── */
  function attachLiveFieldValidation() {
    // Username (Login)
    const username = document.getElementById('username-field');
    if (username) {
      username.addEventListener('blur', () => {
        if (!username.value.trim()) {
          setFieldError(username, 'Username is required.');
        } else if (username.value.trim().length < 3) {
          setFieldError(username, 'Username must be at least 3 characters.');
        } else {
          clearFieldError(username);
        }
      });
      username.addEventListener('input', () => {
        if (username.value.trim().length >= 3) clearFieldError(username);
      });
    }

    // First Name & Last Name (Signup)
    const fname = document.getElementById('fname-field');
    if (fname) {
      fname.addEventListener('blur', () => {
        if (!fname.value.trim()) setFieldError(fname, 'First name is required.');
        else clearFieldError(fname);
      });
      fname.addEventListener('input', () => {
        if (fname.value.trim()) clearFieldError(fname);
      });
    }

    const lname = document.getElementById('lname-field');
    if (lname) {
      lname.addEventListener('blur', () => {
        if (!lname.value.trim()) setFieldError(lname, 'Last name is required.');
        else clearFieldError(lname);
      });
      lname.addEventListener('input', () => {
        if (lname.value.trim()) clearFieldError(lname);
      });
    }

    // Portal Select
    const portal = document.getElementById('portal-field');
    if (portal) {
      portal.addEventListener('change', () => {
        if (!portal.value) setFieldError(portal, 'Please select an authorized portal.');
        else clearFieldError(portal);
      });
    }

    // Email
    const email = document.getElementById('email-field');
    if (email) {
      email.addEventListener('blur', () => {
        const val = email.value.trim();
        if (!val) {
          setFieldError(email, 'Email address is required.');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          setFieldError(email, 'Invalid email format (e.g. developer@stackly.ai).');
        } else {
          clearFieldError(email);
        }
      });
      email.addEventListener('input', () => {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
          clearFieldError(email);
        }
      });
    }

    // Phone Number (Signup)
    const phone = document.getElementById('phone-field');
    if (phone) {
      phone.addEventListener('blur', () => {
        const val = phone.value.trim().replace(/\D/g, '');
        if (!val) {
          setFieldError(phone, 'Phone number is required.');
        } else if (val.length < 10) {
          setFieldError(phone, 'Phone number must be at least 10 digits.');
        } else {
          clearFieldError(phone);
        }
      });
      phone.addEventListener('input', () => {
        const val = phone.value.trim().replace(/\D/g, '');
        if (val.length >= 10) clearFieldError(phone);
      });
    }

    // Confirm Password (Signup)
    const cpwd = document.getElementById('confirm-password-field');
    const pwd = document.getElementById('password-field');
    if (cpwd && pwd) {
      cpwd.addEventListener('blur', () => {
        if (!cpwd.value) {
          setFieldError(cpwd, 'Please confirm your password.');
        } else if (cpwd.value !== pwd.value) {
          setFieldError(cpwd, 'Passwords do not match.');
        } else {
          clearFieldError(cpwd);
        }
      });
      cpwd.addEventListener('input', () => {
        if (cpwd.value === pwd.value) clearFieldError(cpwd);
      });
    }

    // Terms Checkbox (Signup)
    const terms = document.getElementById('terms-checkbox');
    if (terms) {
      terms.addEventListener('change', () => {
        if (terms.checked) {
          const wrapper = terms.closest('.auth-field-group');
          if (wrapper) {
            const err = wrapper.querySelector('.cyber-field-error');
            if (err) err.remove();
          }
        }
      });
    }
  }

  /* ──────────────────────────────────────────
     4. FORM SUBMISSION VALIDATION HANDLERS
  ────────────────────────────────────────── */
  function initForms() {
    // Login Form Submission
    const loginForm = document.getElementById('stackly-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let hasErrors = false;

        const username = document.getElementById('username-field');
        const portal = document.getElementById('portal-field');
        const email = document.getElementById('email-field');
        const pwd = document.getElementById('password-field');

        // Check Username
        if (!username.value.trim() || username.value.trim().length < 3) {
          setFieldError(username, 'Please enter a valid username (min. 3 chars).');
          hasErrors = true;
        } else {
          clearFieldError(username);
        }

        // Check Portal
        if (!portal.value) {
          setFieldError(portal, 'Please select an authorized portal.');
          hasErrors = true;
        } else {
          clearFieldError(portal);
        }

        // Check Email
        if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
          setFieldError(email, 'Please enter a valid email address.');
          hasErrors = true;
        } else {
          clearFieldError(email);
        }

        // Check Password
        if (!pwd.value || !checkPasswordRules(pwd.value)) {
          setFieldError(pwd, 'Password must satisfy all 4 criteria.');
          hasErrors = true;
        } else {
          clearFieldError(pwd);
        }

        if (hasErrors) {
          showAuthToast('Authentication failed. Please resolve the highlighted fields.', 'error');
          const firstErr = loginForm.querySelector('.has-error');
          if (firstErr) firstErr.focus();
          return;
        }

        // All Valid -> Execute Login
        try {
          localStorage.setItem('stackly_auth_user', JSON.stringify({
            name: username.value.trim(),
            email: email.value.trim(),
            portal: portal.value
          }));
        } catch (err) {}

        const submitBtn = loginForm.querySelector('.auth-submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>AUTHENTICATING NODE...</span>`;

        setTimeout(() => {
          showAuthToast(`Welcome back, ${username.value}! Redirecting to ${portal.value}...`, 'success');
          setTimeout(() => {
            if (portal.value === 'Admin Portal') {
              window.location.href = 'admin-dashboard.html';
            } else if (portal.value === 'Customer Portal') {
              window.location.href = 'customer-dashboard.html';
            } else {
              window.location.href = 'customer-dashboard.html';
            }
          }, 1200);
        }, 1100);
      });
    }

    // Signup Form Submission
    const signupForm = document.getElementById('stackly-signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let hasErrors = false;

        const fname = document.getElementById('fname-field');
        const lname = document.getElementById('lname-field');
        const email = document.getElementById('email-field');
        const phone = document.getElementById('phone-field');
        const portal = document.getElementById('portal-field');
        const pwd = document.getElementById('password-field');
        const cpwd = document.getElementById('confirm-password-field');
        const terms = document.getElementById('terms-checkbox');

        // Validate First Name
        if (!fname.value.trim()) { 
          setFieldError(fname, 'First name is required.'); 
          hasErrors = true; 
        } else { 
          clearFieldError(fname); 
        }

        // Validate Last Name
        if (!lname.value.trim()) { 
          setFieldError(lname, 'Last name is required.'); 
          hasErrors = true; 
        } else { 
          clearFieldError(lname); 
        }

        // Validate Email
        if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
          setFieldError(email, 'Please provide a valid email address.'); 
          hasErrors = true;
        } else { 
          clearFieldError(email); 
        }

        // Validate Phone
        const cleanPhone = phone.value.trim().replace(/\D/g, '');
        if (!cleanPhone || cleanPhone.length < 10) {
          setFieldError(phone, 'Valid 10-digit phone number is required.'); 
          hasErrors = true;
        } else { 
          clearFieldError(phone); 
        }

        // Validate Portal
        if (!portal.value) { 
          setFieldError(portal, 'Select an enterprise portal.'); 
          hasErrors = true; 
        } else { 
          clearFieldError(portal); 
        }

        // Validate Password Matrix
        if (!pwd.value || !checkPasswordRules(pwd.value)) {
          setFieldError(pwd, 'Password must satisfy all 4 criteria.'); 
          hasErrors = true;
        } else { 
          clearFieldError(pwd); 
        }

        // Validate Confirm Password
        if (!cpwd.value || cpwd.value !== pwd.value) {
          setFieldError(cpwd, 'Passwords do not match.'); 
          hasErrors = true;
        } else { 
          clearFieldError(cpwd); 
        }

        // Validate Terms
        if (!terms.checked) {
          const wrapper = terms.closest('.auth-field-group');
          if (wrapper) {
            let existingErr = wrapper.querySelector('.cyber-field-error');
            if (!existingErr) {
              existingErr = document.createElement('div');
              existingErr.className = 'cyber-field-error';
              existingErr.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>You must agree to the Terms &amp; Privacy Policy.</span>`;
              wrapper.appendChild(existingErr);
            }
          }
          hasErrors = true;
        }

        if (hasErrors) {
          showAuthToast('Account creation halted. Please correct the highlighted errors.', 'error');
          const firstErr = signupForm.querySelector('.has-error');
          if (firstErr) firstErr.focus();
          return;
        }

        // ONLY WHEN ALL DETAILS ARE STRICTLY VALID -> Show Spinner & Redirect to login.html
        try {
          const fullName = `${fname.value.trim()} ${lname.value.trim()}`.trim();
          localStorage.setItem('stackly_auth_user', JSON.stringify({
            name: fullName,
            email: email.value.trim(),
            portal: portal.value
          }));
        } catch (err) {}

        const submitBtn = document.getElementById('signup-submit-btn') || signupForm.querySelector('.auth-submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>PROVISIONING CLUSTER...</span>`;

        setTimeout(() => {
          showAuthToast(`Enterprise account provisioned for ${fname.value}! Redirecting to Sign In...`, 'success');
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 1400);
        }, 1200);
      });
    }
  }

  // Initializer
  function initAll() {
    initPasswordToggles();
    initPasswordValidator();
    attachLiveFieldValidation();
    initForms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
