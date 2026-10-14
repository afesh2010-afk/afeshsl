/**
 * AFESH S L — PORTFOLIO INTERACTIVITY
 * High-performance UI/UX behaviors inspired by mrgubot.com
 */

document.addEventListener('DOMContentLoaded', () => {
  // ================= 1. Top Scroll Progress Indicator =================
  const progressBar = document.getElementById('scroll-progress');
  const siteHeader = document.querySelector('.site-header');

  window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    // Scrolled header background blur
    if (siteHeader) {
      if (window.scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // ================= 2. Mobile Drawer Navigation =================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      mobileMenuBtn.innerHTML = mobileDrawer.classList.contains('open') ? '✕' : '☰';
    });

    // Close drawer when clicking any mobile nav link
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.innerHTML = '☰';
      });
    });
  }

  // ================= 3. Scrollspy for Active Nav Items =================
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item, .mobile-nav-link');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(item => {
          const href = (item.getAttribute('href') || '').replace('#', '');
          if (href === id) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, { passive: true });

  // ================= 4. Interactive Solution Configurator (Mr. Gubot Style) =================
  const projectTypeBtns = document.querySelectorAll('.config-select-btn');
  const tierBtns = document.querySelectorAll('.tier-btn');
  const quoteWaBtn = document.getElementById('config-quote-btn');
  const summaryTypeEl = document.getElementById('summary-project-type');
  const summaryTierEl = document.getElementById('summary-tier-name');
  const summaryTimeEl = document.getElementById('summary-timeline');
  const summaryLayersEl = document.getElementById('summary-layers-count');

  let currentProjectType = 'Full-Stack Web App';
  let currentTier = 'AI-Powered Suite';
  let currentTimeline = '2–3 Weeks';
  let currentLayers = '5 Layers';

  // Architectures mapping
  const projectScopeConfig = {
    'portfolio': { name: 'Personal Portfolio', baseDays: '3–5 Days' },
    'business': { name: 'Business / Brand Site', baseDays: '1–2 Weeks' },
    'webapp': { name: 'Full-Stack Web App', baseDays: '2–3 Weeks' },
    'security': { name: 'Security Audit & Hardening', baseDays: '4–7 Days' }
  };

  const tierConfig = {
    'foundation': { name: 'Foundation Tier', suffix: 'Core Stack', timeMod: '1 Week', layers: '3 Architecture Layers' },
    'fullstack': { name: 'Pro Full-Stack', suffix: 'DB & API Engine', timeMod: '1–2 Weeks', layers: '4 Architecture Layers' },
    'ai': { name: 'AI-Powered Suite', suffix: 'Gemini + Automation', timeMod: '2–3 Weeks', layers: '5 Architecture Layers' },
    'enterprise': { name: 'Enterprise Hardened', suffix: 'Zero-Trust Defense', timeMod: '3–4 Weeks', layers: '6 Architecture Layers' }
  };

  function updateConfigurator() {
    if (summaryTypeEl) summaryTypeEl.textContent = currentProjectType;
    if (summaryTierEl) summaryTierEl.textContent = currentTier;
    if (summaryTimeEl) summaryTimeEl.textContent = currentTimeline;
    if (summaryLayersEl) summaryLayersEl.textContent = currentLayers;

    // Update WhatsApp pre-filled button
    if (quoteWaBtn) {
      const waNumber = '919744333783';
      const text = `Hi AFESH — I'd like a quote for a ${currentProjectType} with the ${currentTier} configuration. Estimated delivery window: ${currentTimeline}. Can we discuss milestones and availability?`;
      quoteWaBtn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
      quoteWaBtn.innerHTML = `
        <svg viewBox="0 0 48 48" width="18" height="18" style="fill:#25D366;flex-shrink:0;">
          <circle cx="24" cy="24" r="22" fill="#25D366"/>
          <path fill="#FFFFFF" d="M34.2 13.8C31.5 11.1 27.9 9.6 24.1 9.6 16.3 9.6 10 15.9 10 23.7c0 2.5.6 4.9 1.8 7.1L10 38l7.4-1.9c2.1 1.1 4.4 1.7 6.7 1.7 7.8 0 14.1-6.3 14.1-14.1 0-3.8-1.5-7.4-4-9.9zm-10.1 21.8c-2.1 0-4.1-.6-5.9-1.6l-.4-.2-4.4 1.1 1.2-4.3-.3-.4c-1.2-1.9-1.8-4-1.8-6.2 0-6.5 5.3-11.8 11.8-11.8 3.2 0 6.1 1.2 8.4 3.5 2.2 2.2 3.5 5.2 3.5 8.4 0 6.5-5.3 11.5-12.5 11.5zm6.8-8.6c-.4-.2-2.2-1.1-2.5-1.2-.4-.1-.6-.2-.9.2-.3.4-1 1.2-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.3-2.1-2.7-.2-.4 0-.6.2-.8.2-.2.4-.4.6-.7.2-.2.3-.4.4-.6.1-.2.1-.4 0-.6-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.7c-.3 0-.7.1-1 .5-.4.4-1.4 1.4-1.4 3.3 0 2 1.4 3.8 1.6 4.1.2.3 2.8 4.3 6.8 6 1 .4 1.7.7 2.3.9 1 .3 1.9.3 2.6.2.8-.1 2.4-1 2.7-1.9.4-.9.4-1.7.3-1.9-.2-.2-.4-.3-.8-.5z"/>
        </svg>
        <span>Build on WhatsApp</span>
      `;
    }

    // Animate visual layer blocks
    const layers = document.querySelectorAll('.arch-layer');
    layers.forEach((layer, idx) => {
      layer.style.transform = 'scale(0.98)';
      setTimeout(() => {
        layer.style.transform = 'scale(1)';
      }, 50 * idx);
    });
  }

  // Handle Project Type click
  projectTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const scopeKey = btn.getAttribute('data-scope') || 'webapp';
      if (projectScopeConfig[scopeKey]) {
        currentProjectType = projectScopeConfig[scopeKey].name;
      }
      updateConfigurator();
    });
  });

  // Handle Tier click
  tierBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tierBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tierKey = btn.getAttribute('data-tier') || 'ai';
      if (tierConfig[tierKey]) {
        currentTier = tierConfig[tierKey].name;
        currentTimeline = tierConfig[tierKey].timeMod;
        currentLayers = tierConfig[tierKey].layers;
      }
      updateConfigurator();
    });
  });

  // Initial configurator call
  updateConfigurator();

  // ================= 5. Featured Projects Filter =================
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ================= 6. FAQ Accordion =================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!wasActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ================= 7. Contact Form WhatsApp Pipe =================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const service = document.getElementById('form-service').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        alert('Please fill out all required fields.');
        return;
      }

      if (formStatus) {
        formStatus.textContent = `Connecting you to AFESH on WhatsApp (+91 9744333783)...`;
        formStatus.style.display = 'block';
        formStatus.style.color = '#00E5FF';
      }

      const waNumber = '919744333783';
      const formattedText = `*Project Inquiry (via afeshsl.in)*%0A%0A` +
        `*Name:* ${encodeURIComponent(name)}%0A` +
        `*Email:* ${encodeURIComponent(email)}%0A` +
        `*Focus:* ${encodeURIComponent(service)}%0A%0A` +
        `*Message:*%0A${encodeURIComponent(message)}`;

      const waUrl = `https://wa.me/${waNumber}?text=${formattedText}`;

      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 400);

      contactForm.reset();
    });
  }
});
