/* ==========================================================================
   INTERACTIVE APPLICATION LOGIC — 3D Holographic WebGL Edition
   Muhammad Mohsin Saleem — Pharmacy Technician Portfolio
   ========================================================================== */

import { initThreeScene } from './threeScene.js';

document.addEventListener('DOMContentLoaded', () => {

  // Initialize Interactive 3D Three.js WebGL Scene
  initThreeScene();

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

  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterSkills();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterSkills);
  }

  // 5. Interactive Operations Protocol Accordion
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
        const icon = i.querySelector('.accordion-icon');
        if (icon) icon.textContent = '+';
      });

      if (!isOpen) {
        item.classList.add('active');
        const icon = header.querySelector('.accordion-icon');
        if (icon) icon.textContent = '−';
      }
    });
  });

  // 6. Interactive Dispensing Dosage Verification Tool
  const calcBtn = document.getElementById('calculateDosageBtn');
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const weight = parseFloat(document.getElementById('calcWeight')?.value || 0);
      const dosePerKg = parseFloat(document.getElementById('calcDosePerKg')?.value || 0);
      const concentration = parseFloat(document.getElementById('calcConcentration')?.value || 0);
      const resultBox = document.getElementById('calcResult');

      if (weight > 0 && dosePerKg > 0 && concentration > 0) {
        const totalDoseMg = weight * dosePerKg;
        const volumeMl = totalDoseMg / concentration;

        if (resultBox) {
          resultBox.innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid var(--accent); padding: 1.25rem; border-radius: 12px; margin-top: 1rem; backdrop-filter: blur(12px);">
              <div style="font-weight: 700; color: var(--accent); margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.5rem;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Dispensing Calculation Verified
              </div>
              <div style="font-size: 0.95rem; color: var(--text-primary); margin-bottom: 0.25rem;">
                Target Dose: <strong>${totalDoseMg.toFixed(2)} mg</strong>
              </div>
              <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary);">
                Volume to Dispense: ${volumeMl.toFixed(2)} mL
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">
                * Standard protocol requires double-check verification by Supervising Pharmacist before patient release.
              </div>
            </div>
          `;
        }
      } else {
        if (resultBox) {
          resultBox.innerHTML = `
            <div style="background: rgba(239, 68, 68, 0.12); border: 1px solid var(--danger); padding: 1rem; border-radius: 12px; margin-top: 1rem; color: var(--danger); font-size: 0.9rem; backdrop-filter: blur(12px);">
              ⚠️ Please input valid numerical values for patient weight, prescribed mg/kg, and medication concentration.
            </div>
          `;
        }
      }
    });
  }

  // 7. Interactive Cold-Chain Temperature Logger Simulation
  const logTempBtn = document.getElementById('logTempBtn');
  if (logTempBtn) {
    logTempBtn.addEventListener('click', () => {
      const tempInput = document.getElementById('tempReading');
      const temp = parseFloat(tempInput?.value || 0);
      const tempStatus = document.getElementById('tempStatus');

      if (!tempStatus) return;

      if (temp >= 2 && temp <= 8) {
        tempStatus.innerHTML = `
          <div style="padding: 1rem; background: rgba(16, 185, 129, 0.15); border: 1px solid var(--accent); border-radius: 10px; color: var(--accent); font-weight: 600; display: flex; align-items: center; gap: 0.5rem; backdrop-filter: blur(12px);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            ${temp.toFixed(1)}°C — Optimal Range (2°C – 8°C). Biologicals & Vaccines Compliant.
          </div>
        `;
      } else {
        tempStatus.innerHTML = `
          <div style="padding: 1rem; background: rgba(239, 68, 68, 0.15); border: 1px solid var(--danger); border-radius: 10px; color: var(--danger); font-weight: 600; display: flex; align-items: center; gap: 0.5rem; backdrop-filter: blur(12px);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            ${temp.toFixed(1)}°C — CRITICAL EXCURSION! Quarantine stock & notify In-Charge Pharmacist immediately.
          </div>
        `;
      }
    });
  }

  // 8. Print Resume Trigger
  const printBtn = document.getElementById('printResumeBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // 9. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  // 10. REAL-TIME SCROLL PROGRESS BAR
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }, { passive: true });
  }

  // 11. DYNAMIC CURSOR GLOW EFFECT (Desktop pointer: fine)
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let glowX = 0, glowY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
      glowX = e.clientX;
      glowY = e.clientY;
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
  // 12. ADVANCED 3D HOLOGRAPHIC TILT & SPECULAR GLARE SYSTEM
  // ==========================================================================
  if (window.matchMedia('(pointer: fine)').matches) {
    const tiltCards = document.querySelectorAll(
      '.category-card, .showcase-card, .timeline-card, .profile-card, .hero-holo-card, .credential-item'
    );

    tiltCards.forEach(card => {
      // Create dynamic holographic glare layer if not present
      if (!card.querySelector('.card-glare')) {
        const glare = document.createElement('div');
        glare.className = 'card-glare';
        card.appendChild(glare);
      }

      const glareEl = card.querySelector('.card-glare');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Enhanced tilt amplitude with smooth perspective
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;

        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025) translateY(-8px)`;
        
        // Dynamic holographic glare reflection
        if (glareEl) {
          glareEl.style.opacity = '1';
          glareEl.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(0, 242, 254, 0.28) 0%, rgba(16, 185, 129, 0.15) 35%, rgba(255, 255, 255, 0) 70%)`;
        }

        // Dynamic 3D lighting shadow
        const shadowX = -rotateY * 1.5;
        const shadowY = rotateX * 1.5 + 15;
        card.style.boxShadow = `${shadowX}px ${shadowY}px 35px rgba(0, 242, 254, 0.14), 0 20px 40px rgba(0, 0, 0, 0.25)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0)';
        card.style.boxShadow = '';
        if (glareEl) {
          glareEl.style.opacity = '0';
        }
      });
    });
  }

  // 13. 3D Model Mode Switcher Buttons
  const modeBtns = document.querySelectorAll('.model-mode-btn');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-mode');
      if (window.switchThreeMode) {
        window.switchThreeMode(mode);
      }
    });
  });

  // 14. HEADER BACKDROP & CREDENTIAL COUNTER ANIMATIONS
  const header = document.querySelector('.header');
  function updateHeaderOnScroll() {
    if (!header) return;
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 8px 32px rgba(0, 242, 254, 0.12)';
    } else {
      header.style.boxShadow = '0 4px 30px rgba(5, 150, 105, 0.04)';
    }
  }
  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });

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
