/* ==========================================================================
   STACKLY - Authentication & Form Interaction Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Password Visibility Toggle
  const togglePassBtns = document.querySelectorAll('.toggle-password');
  togglePassBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          btn.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
          input.type = 'password';
          btn.classList.replace('fa-eye-slash', 'fa-eye');
        }
      }
    });
  });

  // Login Form Submission Mock
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value;
      const pass = document.getElementById('login-password')?.value;

      if (!email || !pass) {
        window.showToast('Please provide both your AI node identifier and password.', 'error');
        return;
      }

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating Neural Keys...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = origText;
        submitBtn.disabled = false;
        window.showToast(`Welcome back, Commander (${email})! Redirecting to Stackly AI Console...`, 'success');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1200);
      }, 1000);
    });
  }

  // Signup Form Submission Mock
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name')?.value;
      const email = document.getElementById('signup-email')?.value;
      const pass = document.getElementById('signup-password')?.value;
      const terms = document.getElementById('signup-terms')?.checked;

      if (!name || !email || !pass) {
        window.showToast('Please fill out all registration parameters.', 'error');
        return;
      }

      if (!terms) {
        window.showToast('Please agree to the Stackly AI Governance Terms.', 'error');
        return;
      }

      const submitBtn = signupForm.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Provisioning AI Tenant...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = origText;
        submitBtn.disabled = false;
        window.showToast(`Account provisioned successfully for ${name}! Welcome to Stackly AI.`, 'success');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1300);
      }, 1200);
    });
  }

  // Newsletter Form (Custom JavaScript Inline Validation)
  const newsletterForms = document.querySelectorAll('.newsletter-form, .cta-form, .news-form');
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  newsletterForms.forEach((form) => {
    form.setAttribute('novalidate', 'true');
    form.removeAttribute('onsubmit');

    // Create or find inline error element
    let errEl = form.querySelector('.newsletter-error-msg');
    if (!errEl) {
      errEl = document.createElement('div');
      errEl.className = 'newsletter-error-msg';
      form.appendChild(errEl);
    }

    const input = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');

    if (input) {
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          if (input.value.trim() && emailRegex.test(input.value.trim())) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            errEl.classList.remove('visible');
          }
        }
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!input || !input.value.trim()) {
        input?.classList.remove('is-valid');
        input?.classList.add('is-invalid');
        errEl.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please enter your email address.';
        errEl.classList.add('visible');
        if (typeof window.showToast === 'function') {
          window.showToast('Please enter your email address.', 'error');
        }
        input?.focus();
        return;
      }

      if (!emailRegex.test(input.value.trim())) {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        errEl.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please enter a valid corporate email.';
        errEl.classList.add('visible');
        if (typeof window.showToast === 'function') {
          window.showToast('Please enter a valid email address.', 'error');
        }
        input.focus();
        return;
      }

      // Valid: clear error state
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      errEl.classList.remove('visible');

      const origHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subscribing...';
      }

      setTimeout(() => {
        if (typeof window.showToast === 'function') {
          window.showToast('Subscribed to AI briefing! Redirecting...', 'success');
        }
        setTimeout(() => {
          window.location.href = '404.html';
        }, 500);
      }, 600);
    });
  });
});
