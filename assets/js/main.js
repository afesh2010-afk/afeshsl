/**
 * AFESH S L — Elite Portfolio Interactivity
 * High-performance, lightweight Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
  // ================= 1. Theme Toggle (Dark Luxe by default) =================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeIcon(false);
  } else {
    document.documentElement.removeAttribute('data-theme'); // default is dark
    updateThemeIcon(true);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('portfolio-theme', 'dark');
        updateThemeIcon(true);
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('portfolio-theme', 'light');
        updateThemeIcon(false);
      }
    });
  }

  function updateThemeIcon(isDark) {
    if (!themeToggleBtn) return;
    themeToggleBtn.innerHTML = isDark ? '🌙' : '☀️';
    themeToggleBtn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  }

  // ================= 2. Mobile Navigation Menu =================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      mobileMenuBtn.innerHTML = navLinks.classList.contains('show') ? '✕' : '☰';
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        mobileMenuBtn.innerHTML = '☰';
      });
    });
  }

  // ================= 3. ScrollSpy for Sticky Navigation =================
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 160;

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

  // ================= 4. Interactive Tabs: Skills Category Filter =================
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

  // ================= 5. Interactive Tabs: Projects Category Filter =================
  const projectTabs = document.querySelectorAll('[data-project-tab]');
  const projectCards = document.querySelectorAll('[data-project-type]');

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

  // ================= 6. Project Type Pill Selection in Contact Form =================
  let selectedProjectType = 'Full-Stack Web App';
  const typePills = document.querySelectorAll('.type-pill-btn');
  typePills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      typePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedProjectType = pill.getAttribute('data-type') || pill.textContent.trim();
    });
  });

  // ================= 7. Contact Form & WhatsApp Integration =================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const whatsappDirectBtn = document.getElementById('whatsapp-direct-btn');

  if (whatsappDirectBtn) {
    whatsappDirectBtn.addEventListener('click', (e) => {
      const name = document.getElementById('sender-name')?.value.trim() || 'Client';
      const msg = document.getElementById('sender-message')?.value.trim() || 'I would like to discuss a project with you.';
      const text = encodeURIComponent(`Hi AFESH! My name is ${name}. I am looking for [${selectedProjectType}]. Message: ${msg}`);
      // Open WhatsApp chat directly
      window.open(`https://wa.me/?text=${text}`, '_blank');
    });
  }

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
        formStatus.textContent = `Thank you, ${name}! Redirecting to email with your inquiry for [${selectedProjectType}]...`;
        formStatus.className = 'form-status-msg success';
        formStatus.style.display = 'block';
      }

      const subject = encodeURIComponent(`Project Inquiry: ${selectedProjectType} from ${name}`);
      const body = encodeURIComponent(
        `Hi AFESH,\n\nI'm interested in working together on: ${selectedProjectType}\n\nProject Overview:\n${message}\n\nClient Contact Details:\nName: ${name}\nEmail: ${email}`
      );

      setTimeout(() => {
        window.location.href = `mailto:afesh2010@gmail.com?subject=${subject}&body=${body}`;
      }, 700);

      contactForm.reset();
    });
  }
});
