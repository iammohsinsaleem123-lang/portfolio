/* ==========================================================================
   INTERACTIVE APPLICATION LOGIC — 3D Glassmorphism Edition
   Muhammad Mohsin Saleem — Pharmacy Technician Portfolio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile Menu Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // 2. Clinical Theme Toggle (Light / Dark)
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('clinical-theme') || 'light';
  
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('clinical-theme', newTheme);
    });
  }

  // 3. Scroll Spy for Active Navigation Links
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll);

  // 4. Competency Filter Tabs & Search
  const tabBtns = document.querySelectorAll('#skillTabs .tab-btn');
  const categoryCards = document.querySelectorAll('#competenciesGrid .category-card');
  const searchInput = document.getElementById('skillSearchInput');

  function filterSkills() {
    const activeTab = document.querySelector('#skillTabs .tab-btn.active');
    const category = activeTab ? activeTab.getAttribute('data-category') : 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    categoryCards.forEach(card => {
      const cardCategory = card.getAttribute('data-cat');
      const cardText = card.textContent.toLowerCase();

      const matchesCategory = (category === 'all' || cardCategory === category);
      const matchesSearch = query === '' || cardText.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          if (!matchesCategory || !matchesSearch) {
            card.style.display = 'none';
          }
        }, 300);
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterSkills();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterSkills);
  }

  // 5. Contact Form Submission & Direct Email Integration
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('userName').value.trim();
      const email = document.getElementById('userEmail').value.trim();
      const message = document.getElementById('userMessage').value.trim();

      if (!name || !email || !message) {
        alert('Please fill out all required fields (Name, Email, and Message) before submitting.');
        return;
      }

      // Show sending state
      if (submitBtnText) submitBtnText.textContent = 'Sending Message...';
      if (submitBtn) submitBtn.disabled = true;

      try {
        const response = await fetch('https://formsubmit.co/ajax/iammohsinsaleem123@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            _subject: `New Portfolio Inquiry from ${name}`,
            message: message,
            _template: 'table'
          })
        });

        const data = await response.json();

        if (response.ok || data.success === 'true') {
          if (formSuccess) {
            formSuccess.style.display = 'block';
          }
          contactForm.reset();
        } else {
          // Standard form submit fallback if AJAX is blocked
          contactForm.submit();
        }
      } catch (err) {
        console.warn('FormSubmit AJAX fallback triggered:', err);
        contactForm.submit();
      } finally {
        if (submitBtnText) submitBtnText.textContent = 'Send Message';
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // 6. Print Resume Handler
  const printBtn = document.getElementById('printResumeBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // 7. CV Download Notification Toast
  const downloadLinks = document.querySelectorAll('a[download]');
  downloadLinks.forEach(link => {
    link.addEventListener('click', () => {
      showDownloadToast('Downloading Muhammad Mohsin Saleem\'s CV...');
    });
  });

  function showDownloadToast(message) {
    let toast = document.getElementById('downloadToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'downloadToast';
      toast.className = 'download-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      <span>${message}</span>
    `;
    toast.classList.add('show');
    clearTimeout(toast.hideTimeout);
    toast.hideTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // ==========================================================================
  // 8. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // only animate once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ==========================================================================
  // 9. SCROLL PROGRESS BAR
  // ==========================================================================
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // ==========================================================================
  // 10. CURSOR GLOW EFFECT (Desktop only)
  // ==========================================================================
  const cursorGlow = document.getElementById('cursorGlow');

  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let glowX = 0, glowY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
      glowX = e.clientX;
      glowY = e.clientY;
      cursorGlow.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('active');
    });

    function animateGlow() {
      currentX += (glowX - currentX) * 0.08;
      currentY += (glowY - currentY) * 0.08;
      cursorGlow.style.left = currentX + 'px';
      cursorGlow.style.top = currentY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // ==========================================================================
  // 11. 3D TILT EFFECT ON GLASS CARDS (Desktop only)
  // ==========================================================================
  if (window.matchMedia('(pointer: fine)').matches) {
    const tiltCards = document.querySelectorAll('.category-card, .showcase-card, .timeline-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // ==========================================================================
  // 12. SMOOTH HEADER BACKDROP ON SCROLL
  // ==========================================================================
  const header = document.querySelector('.header');
  
  function updateHeaderOnScroll() {
    if (!header) return;
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 4px 40px rgba(5, 150, 105, 0.08)';
    } else {
      header.style.boxShadow = '0 4px 30px rgba(5, 150, 105, 0.04)';
    }
  }

  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });

  // ==========================================================================
  // 13. COUNTER ANIMATION FOR CREDENTIAL VALUES
  // ==========================================================================
  const credentialVals = document.querySelectorAll('.credential-val');

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent.trim();
          const numMatch = text.match(/^(\d+)/);

          if (numMatch) {
            const target = parseInt(numMatch[1]);
            const suffix = text.replace(/^\d+/, '');
            let current = 0;
            const duration = 1500;
            const step = target / (duration / 16);

            function animate() {
              current += step;
              if (current >= target) {
                el.textContent = target + suffix;
              } else {
                el.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(animate);
              }
            }
            animate();
          }
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    credentialVals.forEach(el => counterObserver.observe(el));
  }
});
