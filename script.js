(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.primary-nav');
  const setMenu = (open) => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
  document.addEventListener('click', (event) => {
    if (menuButton && nav && !header.contains(event.target)) setMenu(false);
  });
  const updateHeader = () => header?.classList.toggle('has-scrolled', window.scrollY > 16);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.09, rootMargin: '0px 0px -25px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else { revealItems.forEach((item) => item.classList.add('is-visible')); }
  const year = document.getElementById('footer-year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Featured work: show real screenshots of the published portfolio websites.
  // If the first screenshot service fails, try a second provider; never
  // misrepresent an illustrated placeholder as an actual site capture.
  document.querySelectorAll('img[data-website-preview]').forEach((img) => {
    const card = img.closest('.website-screenshot');
    const markReady = () => {
      card?.classList.add('is-loaded');
      card?.classList.remove('is-unavailable');
    };
    const fallback = () => {
      if (img.dataset.triedFallback !== 'yes' && img.dataset.fallbackSrc) {
        img.dataset.triedFallback = 'yes';
        img.src = img.dataset.fallbackSrc;
      } else {
        card?.classList.add('is-unavailable');
        card?.classList.remove('is-loaded');
      }
    };
    img.addEventListener('load', markReady);
    img.addEventListener('error', fallback);
    if (img.complete) {
      if (img.naturalWidth > 0) markReady();
      else fallback();
    }
  });

  // Contact form: POST to the user's Google Apps Script web app when configured.
  // Standard browser form POST avoids cross-origin fetch/CORS issues. The script
  // records a real Google Forms response and shows a confirmation in a new tab.
  const form = document.getElementById('inquiry-form');
  if (form) {
    const note = document.getElementById('form-note');
    const button = form.querySelector('button[type="submit"]');
    const timestamp = form.querySelector('input[name="startedAt"]');
    if (timestamp) timestamp.value = String(Date.now());
    const endpoint = String(window.GOODGROVE_FORM_WEB_APP_URL || '').trim();
    const isValidEndpoint = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint);

    if (isValidEndpoint) {
      form.action = endpoint;
      form.method = 'POST';
      form.target = '_blank'; // A thank-you page confirms server-side acceptance.
      if (button) button.firstChild.textContent = 'Send project inquiry ';
      if (note) note.textContent = 'Your inquiry is submitted securely to our Google-powered form. A confirmation will open in a new tab. Please avoid including passwords or sensitive information.';
      form.addEventListener('submit', (event) => {
        if (!form.reportValidity()) { event.preventDefault(); return; }
        if (timestamp && !timestamp.value) timestamp.value = String(Date.now());
        if (note) note.textContent = 'Opening your submission confirmation in a new tab. Please check that it says your inquiry was received.';
      });
    } else {
      // Until the Google account owner deploys the receiver, enquiries still work
      // using the original email fallback rather than being silently discarded.
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const data = new FormData(form);
        const name = String(data.get('name') || '').trim();
        const email = String(data.get('email') || '').trim();
        const service = String(data.get('service') || '').trim();
        const message = String(data.get('message') || '').trim();
        const subject = `Goodgrove Digital Inquiry — ${service}`;
        const body = `Hi Goodgrove Digital,\n\nMy name: ${name}\nMy email: ${email}\nI'm interested in: ${service}\n\nProject details:\n${message}\n\nThank you!`;
        if (note) note.textContent = 'Your email app should open with a draft. Please press Send there to deliver your inquiry. If it does not open, email va.marcusparedes@gmail.com directly.';
        window.location.href = `mailto:va.marcusparedes@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      });
    }
  }
})();
