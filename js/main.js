/* ============================================================
   JARISMA BEAUTY ACADEMY – MAIN JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- STICKY HEADER ON SCROLL ---- */
  const header = document.querySelector('.site-header');
  const heroSlider = document.querySelector('.hero-slider');
  
  function handleScroll() {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load

  /* ---- MOBILE MENU (Hamburger) ---- */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');
  const drawerClose = document.querySelector('.mobile-drawer-close');

  function openMobileMenu() {
    mobileDrawer.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileDrawer.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', openMobileMenu);
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeMobileMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu when a link is clicked
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu a');
  mobileNavLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ---- HERO SLIDER ---- */
  const slides = document.querySelectorAll('.hero-slide');
  const sliderDots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach(function (slide) {
      slide.classList.remove('active');
    });
    sliderDots.forEach(function (dot) {
      dot.classList.remove('active');
    });

    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    currentSlide = index;
    slides[currentSlide].classList.add('active');
    if (sliderDots[currentSlide]) {
      sliderDots[currentSlide].classList.add('active');
    }
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function startSlideShow() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopSlideShow() {
    clearInterval(slideInterval);
  }

  if (slides.length > 0) {
    showSlide(0);
    startSlideShow();

    sliderDots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        stopSlideShow();
        showSlide(index);
        startSlideShow();
      });
    });
  }

  /* ---- GALLERY FILTER ---- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Update active button
      filterButtons.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(function (item) {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hidden');
          item.style.display = '';
        } else {
          item.classList.add('hidden');
          item.style.display = 'none';
        }
      });
    });
  });

  /* ---- LIGHTBOX ---- */
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-content img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  let lightboxImages = [];
  let lightboxIndex = 0;

  function openLightbox(index) {
    const visibleItems = document.querySelectorAll('.gallery-item:not(.hidden)');
    lightboxImages = [];
    visibleItems.forEach(function (item) {
      const img = item.querySelector('img');
      if (img) {
        lightboxImages.push(img.src);
      }
    });

    lightboxIndex = index;
    if (lightboxImg && lightbox) {
      lightboxImg.src = lightboxImages[lightboxIndex];
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function navigateLightbox(direction) {
    lightboxIndex += direction;
    if (lightboxIndex >= lightboxImages.length) lightboxIndex = 0;
    if (lightboxIndex < 0) lightboxIndex = lightboxImages.length - 1;
    if (lightboxImg) {
      lightboxImg.src = lightboxImages[lightboxIndex];
    }
  }

  // Attach click to gallery items
  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function () {
      // Get index among visible items
      const visibleItems = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
      const visibleIndex = visibleItems.indexOf(item);
      openLightbox(visibleIndex >= 0 ? visibleIndex : 0);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function () {
      navigateLightbox(-1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', function () {
      navigateLightbox(1);
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', function (e) {
    if (lightbox && lightbox.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    }
  });

  /* ---- TESTIMONIAL SLIDER ---- */
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  let currentTestimonial = 0;
  let testimonialInterval;

  function showTestimonial(index) {
    testimonialSlides.forEach(function (slide) {
      slide.classList.remove('active');
    });
    testimonialDots.forEach(function (dot) {
      dot.classList.remove('active');
    });

    if (index >= testimonialSlides.length) index = 0;
    if (index < 0) index = testimonialSlides.length - 1;

    currentTestimonial = index;
    if (testimonialSlides[currentTestimonial]) {
      testimonialSlides[currentTestimonial].classList.add('active');
    }
    if (testimonialDots[currentTestimonial]) {
      testimonialDots[currentTestimonial].classList.add('active');
    }
  }

  function nextTestimonial() {
    showTestimonial(currentTestimonial + 1);
  }

  if (testimonialSlides.length > 0) {
    showTestimonial(0);
    testimonialInterval = setInterval(nextTestimonial, 7000);

    testimonialDots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        clearInterval(testimonialInterval);
        showTestimonial(index);
        testimonialInterval = setInterval(nextTestimonial, 7000);
      });
    });
  }

  /* ---- COURSE CAROUSEL ---- */
  const carouselTrack = document.querySelector('.course-carousel-track');
  const carouselCards = document.querySelectorAll('.course-carousel-card');
  const carouselDots = document.querySelectorAll('.carousel-dot');
  let carouselIndex = 0;

  function getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function updateCarousel() {
    if (!carouselTrack || carouselCards.length === 0) return;

    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, carouselCards.length - cardsPerView);
    if (carouselIndex > maxIndex) carouselIndex = maxIndex;

    const offset = -(carouselIndex * (100 / cardsPerView));
    carouselTrack.style.transform = 'translateX(' + offset + '%)';

    carouselDots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === carouselIndex);
    });
  }

  if (carouselDots.length > 0) {
    carouselDots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        carouselIndex = index;
        updateCarousel();
      });
    });
  }

  if (carouselTrack) {
    updateCarousel();
    window.addEventListener('resize', updateCarousel);
  }

  /* ---- ANIMATED STAT COUNTERS ---- */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function animateCounters() {
    statNumbers.forEach(function (el) {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2000;
      const startTime = Date.now();

      function updateCount() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        el.textContent = current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }

      requestAnimationFrame(updateCount);
    });
    statsAnimated = true;
  }

  /* ---- SCROLL REVEAL ---- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  function checkReveal() {
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * 0.85;

    revealElements.forEach(function (el) {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < triggerPoint) {
        el.classList.add('revealed');
      }
    });

    // Animate stats when in view
    if (!statsAnimated && statNumbers.length > 0) {
      const statsSection = document.querySelector('.stats-section');
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < triggerPoint) {
          animateCounters();
        }
      }
    }
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  checkReveal(); // Run on load

  /* ---- BACK TO TOP BUTTON ---- */
  const backToTop = document.querySelector('.back-to-top');

  function toggleBackToTop() {
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- CONTACT FORM VALIDATION ---- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;
      const fields = contactForm.querySelectorAll('[required]');

      // Clear previous errors
      contactForm.querySelectorAll('.form-group').forEach(function (group) {
        group.classList.remove('error');
      });

      fields.forEach(function (field) {
        const group = field.closest('.form-group');
        const value = field.value.trim();

        if (!value) {
          isValid = false;
          if (group) group.classList.add('error');
        }

        // Email validation
        if (field.type === 'email' && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
            if (group) group.classList.add('error');
          }
        }

        // Phone validation
        if (field.name === 'phone' && value) {
          const phoneRegex = /^[\d\s\+\-\(\)]{7,15}$/;
          if (!phoneRegex.test(value)) {
            isValid = false;
            if (group) group.classList.add('error');
          }
        }
      });

      if (isValid) {
        // Show success message
        const successMsg = contactForm.querySelector('.form-success');
        if (successMsg) {
          successMsg.classList.add('show');
          contactForm.reset();
          setTimeout(function () {
            successMsg.classList.remove('show');
          }, 5000);
        }
      }
    });
  }

  /* ---- SMOOTH SCROLL FOR ANCHOR LINKS ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  /* ---- LAZY LOAD IMAGES ---- */
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    lazyImages.forEach(function (img) {
      imageObserver.observe(img);
    });
  }

});
