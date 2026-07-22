document.addEventListener('DOMContentLoaded', () => {

  // Navbar scroll effect
  const nav = document.querySelector('.glass-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.background = window.scrollY > 40 ? 'rgba(11, 12, 16, 0.95)' : 'rgba(11, 12, 16, 0.7)';
    });
  }

  // Dual Identity Toggle (index.html)
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const devPanel = document.getElementById('devPanel');
  const marketerPanel = document.getElementById('marketerPanel');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (btn.dataset.mode === 'dev') {
        devPanel.classList.remove('d-none');
        marketerPanel.classList.add('d-none');
      } else {
        marketerPanel.classList.remove('d-none');
        devPanel.classList.add('d-none');
      }
    });
  });

  // Animated stat counters
  const statNumbers = document.querySelectorAll('.stat-number');
  let countedOnce = false;

  const animateCounters = () => {
    statNumbers.forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      let current = 0;
      const increment = Math.max(target / 60, 0.1);
      const update = () => {
        current += increment;
        if (current < target) {
          el.textContent = Math.ceil(current);
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      };
      update();
    });
  };

  const statsSection = document.querySelector('.stats-section');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countedOnce) {
        animateCounters();
        countedOnce = true;
      }
    });
  }, { threshold: 0.4 });
  if (statsSection) statsObserver.observe(statsSection);

  // Auto-close side menu on link click
  const sideMenuEl = document.getElementById('sideMenu');
  if (sideMenuEl) {
    const offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(sideMenuEl);
    document.querySelectorAll('.side-nav-link').forEach(link => {
      link.addEventListener('click', () => offcanvasInstance.hide());
    });
  }

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Project filter tabs (projects.html)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectItems.forEach(item => {
        const categories = item.dataset.category.split(' ');
        item.classList.toggle('hide', !(filter === 'all' || categories.includes(filter)));
      });
    });
  });

  // Contact form submission (contact.html)
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formSuccess.classList.remove('d-none');
      contactForm.reset();
      setTimeout(() => formSuccess.classList.add('d-none'), 5000);
    });
  }

  // Results Slideshow Popup (content-hub.html)
  const galleries = {
    viral: [
      "assets/images/views/5.PNG",
    "assets/images/views/1.png",
     "assets/images/views/2.png",
     "assets/images/views/3.png",
      "assets/images/views/4.png"
    ],
    ads: [
      "assets/images/orders/1.png",
    "assets/images/orders/2.png",
     "assets/images/orders/3.png",
     "assets/images/orders/4.png",
      "assets/images/orders/5.png",
 "assets/images/orders/6.png",
 "assets/images/orders/7.png",
    ]
  };

  let currentGallery = [];
  let currentIndex = 0;

  const slideshowModal = document.getElementById('slideshowModal');
  const slideshowImg = document.getElementById('slideshowImg');
  const slideCounter = document.getElementById('slideCounter');
  const slideDots = document.getElementById('slideDots');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');

  function renderSlide() {
    if (!slideshowImg) return;
    slideshowImg.src = currentGallery[currentIndex];
    slideCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
    slideDots.querySelectorAll('.slide-dot').forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
  }

  function buildDots() {
    slideDots.innerHTML = '';
    currentGallery.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'slide-dot';
      dot.addEventListener('click', () => { currentIndex = i; renderSlide(); });
      slideDots.appendChild(dot);
    });
  }

  document.querySelectorAll('.results-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.gallery;
      currentGallery = galleries[key] || [];
      currentIndex = 0;
      buildDots();
      renderSlide();
      slideshowModal.classList.add('active');
    });
  });

  if (document.getElementById('slidePrev')) {
    document.getElementById('slidePrev').addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
      renderSlide();
    });
    document.getElementById('slideNext').addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % currentGallery.length;
      renderSlide();
    });
    document.getElementById('slideshowClose').addEventListener('click', () => {
      slideshowModal.classList.remove('active');
    });
    slideshowImg.addEventListener('click', () => {
      lightboxImg.src = slideshowImg.src;
      lightboxModal.classList.add('active');
    });
    document.getElementById('lightboxClose').addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) lightboxModal.classList.remove('active');
    });
    slideshowModal.addEventListener('click', (e) => {
      if (e.target === slideshowModal) slideshowModal.classList.remove('active');
    });
    document.addEventListener('keydown', (e) => {
      if (slideshowModal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') document.getElementById('slidePrev').click();
        if (e.key === 'ArrowRight') document.getElementById('slideNext').click();
        if (e.key === 'Escape') {
          slideshowModal.classList.remove('active');
          lightboxModal.classList.remove('active');
        }
      }
    });
  }

  // Content gallery images open in image lightbox (videos handled separately below)
  document.querySelectorAll('.gallery-img').forEach(img => {
    if (img.tagName === 'IMG') {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        if (lightboxImg && lightboxModal) {
          lightboxImg.src = img.src;
          lightboxModal.classList.add('active');
        }
      });
    }
  });

  // Reel video: hover-to-preview (muted) + click opens fullscreen video player
  const videoLightbox = document.getElementById('videoLightboxModal');
  const videoLightboxPlayer = document.getElementById('videoLightboxPlayer');
  const videoLightboxSource = videoLightboxPlayer ? videoLightboxPlayer.querySelector('source') : null;

  document.querySelectorAll('.reel-video').forEach(video => {
    video.addEventListener('mouseenter', () => video.play());
    video.addEventListener('mouseleave', () => video.pause());
    video.addEventListener('click', () => {
      video.pause();
      const fullUrl = video.dataset.fullvideo;
      if (videoLightboxSource && fullUrl) {
        videoLightboxSource.src = fullUrl;
        videoLightboxPlayer.load();
        videoLightboxPlayer.play();
        videoLightbox.classList.add('active');
      }
    });
  });

  if (videoLightbox) {
    document.getElementById('videoLightboxClose').addEventListener('click', () => {
      videoLightboxPlayer.pause();
      videoLightbox.classList.remove('active');
    });
    videoLightbox.addEventListener('click', (e) => {
      if (e.target === videoLightbox) {
        videoLightboxPlayer.pause();
        videoLightbox.classList.remove('active');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoLightbox.classList.contains('active')) {
        videoLightboxPlayer.pause();
        videoLightbox.classList.remove('active');
      }
    });
  }

});
