(function () {
  'use strict';

  /* ============================================================
     PARTICLE BACKGROUND
     ============================================================ */
  var canvas = document.getElementById('particles-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 70;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function Particle() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.5 ? 250 : 200;
    }
    Particle.prototype.update = function () {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    };
    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + this.hue + ', 80%, 70%, ' + this.opacity + ')';
      ctx.fill();
    };

    for (var p = 0; p < PARTICLE_COUNT; p++) {
      particles.push(new Particle());
    }

    function connectParticles() {
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            var alpha = (1 - dist / 120) * 0.08;
            ctx.strokeStyle = 'rgba(108, 99, 255, ' + alpha + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) { p.update(); p.draw(); });
      connectParticles();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ============================================================
     CUSTOM CURSOR
     ============================================================ */
  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  var mouseX = 0, mouseY = 0;
  var ringX = 0, ringY = 0;

  if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
    var lastX = 0, lastY = 0;
    var scale = 1, angle = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateCursor() {
      // Smooth interpolation
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      // Calculate velocity for stretching
      var dx = mouseX - lastX;
      var dy = mouseY - lastY;
      lastX = mouseX;
      lastY = mouseY;

      var vel = Math.sqrt(dx*dx + dy*dy);
      // Limit velocity impact
      var targetScale = 1 + Math.min(vel / 100, 0.4);
      scale += (targetScale - scale) * 0.2;
      
      var targetAngle = Math.atan2(dy, dx) * 180 / Math.PI;
      // Handle angle wrap-around for smoother rotation
      if (vel > 2) angle = targetAngle;

      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      ring.style.transform = 'translate(-50%, -50%) rotate(' + angle + 'deg) scale(' + scale + ', ' + (1 / scale) + ')';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .project-card, .skill-card, .bento-card, .expertise-item').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('hover'); dot.style.opacity = '0'; });
      el.addEventListener('mouseleave', function () { ring.classList.remove('hover'); dot.style.opacity = '1'; });
    });
  }

  /* ============================================================
     HERO PARALLAX & ACTIVITY GRID
     ============================================================ */
  function initActivityGrid() {
    var grid = document.getElementById('activityGrid');
    if (!grid) return;
    for (var i = 0; i < 28; i++) {
      var cell = document.createElement('div');
      cell.className = 'activity-cell';
      var rand = Math.random();
      if (rand > 0.9) cell.classList.add('l4');
      else if (rand > 0.75) cell.classList.add('l3');
      else if (rand > 0.55) cell.classList.add('l2');
      else if (rand > 0.35) cell.classList.add('l1');
      grid.appendChild(cell);
    }
  }

  function initHeroParallax() {
    var hero = document.getElementById('hero');
    var pieces = document.querySelectorAll('.code-float');
    if (!hero || pieces.length === 0) return;
    hero.addEventListener('mousemove', function (e) {
      var x = (window.innerWidth / 2 - e.pageX) / 40;
      var y = (window.innerHeight / 2 - e.pageY) / 40;
      pieces.forEach(function (el, i) {
        var speed = (i + 1) * 0.5;
        el.style.transform = 'translate3d(' + (x * speed) + 'px, ' + (y * speed) + 'px, 0)';
      });
    });
  }

  function initMagneticButtons() {
    var btns = document.querySelectorAll('.btn-hero-cyan, .btn-hero-outline');
    btns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + x * 0.3 + 'px, ' + y * 0.3 + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ============================================================
     NAVBAR
     ============================================================ */
  var navbar = document.getElementById('navbar');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', function () {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
      });
    });
  }

  /* ============================================================
     SCROLL REVEAL & TILT
     ============================================================ */
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          var delay = parseFloat(target.dataset.revealDelay) || 0;
          setTimeout(function () { target.classList.add('revealed'); }, delay * 1000);
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) {
      var parent = el.parentElement;
      if (parent && (parent.classList.contains('projects-grid') || parent.classList.contains('skills-grid'))) {
        el.dataset.revealDelay = (Array.from(parent.children).indexOf(el) * 0.1).toString();
      }
      observer.observe(el);
    });
  }

  function initTilt() {
    var cards = document.querySelectorAll('.project-card, .bento-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var cx = rect.width / 2;
        var cy = rect.height / 2;
        var rotX = ((y - cy) / cy) * -8;
        var rotY = ((x - cx) / cx) * 8;
        card.style.transform = 'perspective(800px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-5px) scale(1.02)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ============================================================
     CONTACT FORM — EMAILJS
     ============================================================ */
  function initContactForm() {
    // 1. Initialize EmailJS with your Public Key
    // You provided: i0kKO1mvR8hFHJJic
    if (typeof emailjs !== 'undefined') {
      emailjs.init("i0kKO1mvR8hFHJJic");
    }

    var form = document.getElementById('contact-form');
    var status = document.getElementById('form-status');
    var btn = document.getElementById('form-submit');
    var btnText = document.getElementById('btn-text');

    if (!form || !status || !btn || !btnText) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Show loading state
      btn.disabled = true;
      btnText.innerText = 'Sending... ⏳';
      status.innerText = '';

      // 2. These IDs come from your EmailJS Dashboard
      var serviceID = 'service_syxpp6i'; 
      var templateID = 'template_58zso9f'; 

      emailjs.sendForm(serviceID, templateID, this)
        .then(function () {
          btn.disabled = false;
          btnText.innerText = 'Sent! ✅';
          status.innerText = 'Thank you! Your message has been sent successfully.';
          status.style.color = '#34d399'; // Emerald cyan
          form.reset();
          
          // Optional: Redirect after 2 seconds
          setTimeout(function() {
            window.location.href = 'thankyou.html';
          }, 2000);
        }, function (error) {
          btn.disabled = false;
          btnText.innerText = 'Send Message 🚀';
          status.innerText = 'Oops! Failed to send message. Please try again.';
          status.style.color = '#f87171'; // Red
          console.error('EmailJS Error:', error);
        });
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  function initAll() {
    initActivityGrid();
    initHeroParallax();
    initMagneticButtons();
    initContactForm();
    initReveal();
    initTilt();
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

})();
