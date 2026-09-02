/* ==========================================================================
   INTERACTIVE APPLICATION LOGIC
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
      } else {
        card.style.display = 'none';
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
});
