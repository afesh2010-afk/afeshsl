/**
 * AFESH S L — Personal Portfolio Interaction & Animation Engine
 * Fluid, dependency-free, 60fps micro-interactions & motion design
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ================= 1. Theme Toggle (Dark / Light) with Micro-Interaction =================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon(true);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      
      // Add quick rotate animation
      themeToggleBtn.style.transform = 'rotate(180deg) scale(0.9)';
      setTimeout(() => {
        themeToggleBtn.style.transform = '';
      }, 300);

      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('portfolio-theme', 'light');
        updateThemeIcon(false);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('portfolio-theme', 'dark');
        updateThemeIcon(true);
      }
    });
  }

  function updateThemeIcon(isDark) {
    if (!themeToggleBtn) return;
    themeToggleBtn.innerHTML = isDark ? '☀️' : '🌙';
    themeToggleBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  // ================= 2. Sticky Header Scroll Reaction =================
  const header = document.querySelector('.header');
  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // ================= 3. Scroll Reveal & Tab Pane Animation Engine =================
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  // Intersection Observer for scroll triggers
  let revealObserver = null;
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Immediate fallback for reduced motion or legacy browsers
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  function triggerPaneAnimations(pane) {
    if (!pane) return;
    const paneReveals = pane.querySelectorAll('[data-reveal]');
    if (prefersReducedMotion) {
      paneReveals.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    paneReveals.forEach((el, index) => {
      // Stagger child elements smoothly
      setTimeout(() => {
        el.classList.add('is-revealed');
      }, 40 * index);
    });
  }

  // ================= 4. Multi-Tab Navigation & View Switcher =================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  const tabPanes = document.querySelectorAll('.tab-pane');

  function switchTab(targetId) {
    if (!targetId) targetId = 'home';
    const cleanId = targetId.replace(/^#/, '').trim();
    const targetPane = document.getElementById(cleanId);

    if (!targetPane || !targetPane.classList.contains('tab-pane')) {
      return false;
    }

    // Hide all tab panes
    tabPanes.forEach(pane => {
      pane.classList.remove('active');
    });

    // Show target tab pane
    targetPane.classList.add('active');

    // Trigger sequential reveal animation for target pane
    triggerPaneAnimations(targetPane);

    // Update active state on all nav-link and mobile-tab-btn elements
    document.querySelectorAll('.nav-link, .mobile-tab-btn').forEach(link => {
      const linkHref = (link.getAttribute('href') || link.getAttribute('data-tab-target') || '').replace(/^#/, '').trim();
      if (linkHref === cleanId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile menu if open
    if (navLinks && navLinks.classList.contains('show')) {
      navLinks.classList.remove('show');
      if (mobileMenuBtn) mobileMenuBtn.innerHTML = '☰';
    }

    // Smooth scroll to top of view
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update hash in address bar without scrolling jump
    if (window.location.hash !== `#${cleanId}`) {
      if (history.pushState) {
        history.pushState(null, null, `#${cleanId}`);
      } else {
        window.location.hash = `#${cleanId}`;
      }
    }

    return true;
  }

  // Toggle mobile three-bar menu
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      mobileMenuBtn.innerHTML = navLinks.classList.contains('show') ? '✕' : '☰';
    });
  }

  // Intercept all links targeting tab panes across header, cards, hero, and footer
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"], button[data-tab-target]');
    if (!link) return;

    const href = link.getAttribute('href') || link.getAttribute('data-tab-target');
    if (!href || href === '#' || href === '#!') return;

    const targetId = href.replace(/^#/, '').trim();
    const targetElement = document.getElementById(targetId);

    if (targetElement && targetElement.classList.contains('tab-pane')) {
      e.preventDefault();
      switchTab(targetId);
    }
  });

  // Handle browser Back / Forward buttons
  window.addEventListener('popstate', () => {
    const hash = window.location.hash || '#home';
    switchTab(hash);
  });

  // Initialize active tab from URL hash on first page load
  const initialHash = window.location.hash || '#home';
  if (!switchTab(initialHash)) {
    switchTab('home');
  }

  // ================= 5. Hero Dynamic Ambient Glow Pointer Interaction =================
  const heroSection = document.getElementById('home');
  if (heroSection && !prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let ticking = false;
    heroSection.addEventListener('mousemove', (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = heroSection.getBoundingClientRect();
          const x = Math.round(e.clientX - rect.left);
          const y = Math.round(e.clientY - rect.top);
          heroSection.style.setProperty('--mouse-x', `${x}px`);
          heroSection.style.setProperty('--mouse-y', `${y}px`);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ================= 6. Desktop Ambient Cursor Follower =================
  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.className = 'ambient-cursor';
    document.body.appendChild(cursor);

    let cursorX = -100;
    let cursorY = -100;
    let targetX = -100;
    let targetY = -100;
    let cursorActive = false;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!cursorActive) {
        cursorX = targetX;
        cursorY = targetY;
        cursor.classList.add('active');
        cursorActive = true;
      }
    });

    window.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      cursorActive = false;
    });

    function renderCursor() {
      if (cursorActive) {
        cursorX += (targetX - cursorX) * 0.22;
        cursorY += (targetY - cursorY) * 0.22;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Magnify cursor over interactive elements
    const interactiveSelector = 'a, button, .home-tab-card, .service-card, .skill-card, .project-card, .sec-card, .lab-card, .faq-question, input, textarea, select';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelector)) {
        cursor.classList.add('hovering');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelector)) {
        cursor.classList.remove('hovering');
      }
    });
  }

  // ================= 7. Interactive Tabs: Skills Filter =================
  const skillTabs = document.querySelectorAll('[data-skill-tab]');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-skill-tab');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ================= 8. Interactive Tabs: Projects Filter =================
  const projectTabs = document.querySelectorAll('[data-project-tab]');
  const projectCards = document.querySelectorAll('.project-card, .lab-card, .upcoming-project-card');

  projectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      projectTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-project-tab');

      projectCards.forEach(card => {
        const cardType = card.getAttribute('data-project-type');
        if (filter === 'all' || cardType === filter) {
          card.style.display = card.classList.contains('project-card') ? 'grid' : 'block';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ================= 9. Interactive FAQ Accordion with Smooth Ease =================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ================= 10. WhatsApp Direct Project Inquiry =================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sender-name').value.trim();
      const email = document.getElementById('sender-email').value.trim();
      const service = document.getElementById('sender-service') ? document.getElementById('sender-service').value : 'Project Inquiry';
      const message = document.getElementById('sender-message').value.trim();

      if (!name || !email || !message) {
        alert('Please fill out all required fields.');
        return;
      }

      // Display friendly status message with animation
      if (formStatus) {
        formStatus.textContent = `Connecting you directly to AFESH's WhatsApp (+91 9744333783)...`;
        formStatus.className = 'form-status-msg success is-revealed';
        formStatus.style.display = 'block';
      }

      // Format WhatsApp Message
      const waNumber = '919744333783';
      const formattedText = `*New Project Inquiry (via afeshsl.in)*%0A%0A` +
        `*Name:* ${encodeURIComponent(name)}%0A` +
        `*Email:* ${encodeURIComponent(email)}%0A` +
        `*Service:* ${encodeURIComponent(service)}%0A%0A` +
        `*Project Details:*%0A${encodeURIComponent(message)}`;

      const waUrl = `https://wa.me/${waNumber}?text=${formattedText}`;

      // Open WhatsApp in a new tab or app window
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 500);

      contactForm.reset();
    });
  }
});
