/**
 * AFESH S L — Personal Portfolio Scripts
 * Modular, clean, lightweight JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // ================= 1. Theme Toggle (Dark / Light) =================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon(true);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
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

  // ================= 2. Mobile Navigation Menu =================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      mobileMenuBtn.innerHTML = navLinks.classList.contains('show') ? '✕' : '☰';
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        mobileMenuBtn.innerHTML = '☰';
      });
    });
  }

  // ================= 3. ScrollSpy for Active Nav Link =================
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  // ================= 4. Interactive Tabs: Skills Filter =================
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

  // ================= 5. Interactive Tabs: Projects Filter =================
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
          setTimeout(() => {
            card.style.opacity = '1';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ================= 6. Interactive FAQ Accordion =================
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

  // ================= 7. Contact Form Submission =================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sender-name').value.trim();
      const email = document.getElementById('sender-email').value.trim();
      const message = document.getElementById('sender-message').value.trim();

      if (!name || !email || !message) {
        alert('Please fill out all required fields.');
        return;
      }

      if (formStatus) {
        formStatus.textContent = `Thank you, ${name}! Opening your email client to send your message to AFESH S L...`;
        formStatus.className = 'form-status-msg success';
        formStatus.style.display = 'block';
      }

      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Hi AFESH,\n\n${message}\n\nFrom: ${name} (${email})`);
      setTimeout(() => {
        window.location.href = `mailto:afesh2010@gmail.com?subject=${subject}&body=${body}`;
      }, 800);

      contactForm.reset();
    });
  }
});
