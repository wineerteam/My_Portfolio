(function () {
  'use strict';

  var typingEl = document.querySelector('.typing-text');
  var title = 'Competitive Programmer | Full-Stack Developer | GSoC 2026 Contributor';
  var i = 0;
  var speed = 80;

  function type() {
    if (i < title.length) {
      typingEl.textContent += title[i];
      i++;
      setTimeout(type, speed);
    } else {
      setTimeout(erase, 2000);
    }
  }

  function erase() {
    if (i > 0) {
      typingEl.textContent = title.slice(0, i - 1);
      i--;
      setTimeout(erase, 40);
    } else {
      setTimeout(type, 600);
    }
  }

  if (typingEl) setTimeout(type, 500);

  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var form = document.querySelector('.contact-form');
  if (form) {
    var nextInput = document.getElementById('form-next') || form.querySelector('input[name="_next"]');
    if (nextInput) {
      var path = window.location.pathname.replace(/\/?index\.html?$/i, '') || '';
      if (path === '/') path = '';
      path = path.replace(/\/$/, '');
      nextInput.value = window.location.origin + path + '/thankyou.html';
    }
  }

  function reveal() {
    var reveals = document.querySelectorAll('.section-title, .about-grid, .resume-grid, .cp-grid, .projects-grid, .skills-grid, .timeline, .contact-form, .hero-content, .hero-image-wrap');
    reveals.forEach(function (el) {
      el.classList.add('reveal');
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', reveal);
  } else {
    reveal();
  }
})();
