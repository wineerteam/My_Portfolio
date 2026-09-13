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
      ctx.fillStyle =
        'hsla(' +
        this.hue +
        ', 80%, 70%, ' +
        this.opacity +
        ')';
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

            ctx.strokeStyle =
              'rgba(108, 99, 255, ' + alpha + ')';

            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      particles.forEach(function (p) {
        p.update();
        p.draw();
      });

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

  var mouseX = 0;
  var mouseY = 0;

  var ringX = 0;
  var ringY = 0;

  if (
    dot &&
    ring &&
    window.matchMedia('(pointer: fine)').matches
  ) {
    var lastX = 0;
    var lastY = 0;

    var scale = 1;
    var angle = 0;

    document.addEventListener(
      'mousemove',
      function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
      },
      { passive: true }
    );

    function animateCursor() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      var dx = mouseX - lastX;
      var dy = mouseY - lastY;

      lastX = mouseX;
      lastY = mouseY;

      var vel = Math.sqrt(dx * dx + dy * dy);

      var targetScale =
        1 + Math.min(vel / 100, 0.4);

      scale +=
        (targetScale - scale) * 0.2;

      var targetAngle =
        Math.atan2(dy, dx) * 180 / Math.PI;

      if (vel > 2) {
        angle = targetAngle;
      }

      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';

      ring.style.transform =
        'translate(-50%, -50%) rotate(' +
        angle +
        'deg) scale(' +
        scale +
        ', ' +
        (1 / scale) +
        ')';

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    document
      .querySelectorAll(
        'a, button, .project-card, .skill-card, .bento-card, .expertise-item'
      )
      .forEach(function (el) {
        el.addEventListener(
          'mouseenter',
          function () {
            ring.classList.add('hover');
            dot.style.opacity = '0';
          }
        );

        el.addEventListener(
          'mouseleave',
          function () {
            ring.classList.remove('hover');
            dot.style.opacity = '1';
          }
        );
      });
  }


  /* ============================================================
     HERO PARALLAX & ACTIVITY GRID
     ============================================================ */
  function initActivityGrid() {
    var grid =
      document.getElementById('activityGrid');

    if (!grid) return;

    for (var i = 0; i < 28; i++) {
      var cell =
        document.createElement('div');

      cell.className = 'activity-cell';

      var rand = Math.random();

      if (rand > 0.9) {
        cell.classList.add('l4');
      } else if (rand > 0.75) {
        cell.classList.add('l3');
      } else if (rand > 0.55) {
        cell.classList.add('l2');
      } else if (rand > 0.35) {
        cell.classList.add('l1');
      }

      grid.appendChild(cell);
    }
  }


  function initHeroParallax() {
    var hero =
      document.getElementById('hero');

    var pieces =
      document.querySelectorAll('.code-float');

    if (
      !hero ||
      pieces.length === 0
    ) {
      return;
    }

    hero.addEventListener(
      'mousemove',
      function (e) {
        var x =
          (window.innerWidth / 2 -
            e.pageX) / 40;

        var y =
          (window.innerHeight / 2 -
            e.pageY) / 40;

        pieces.forEach(
          function (el, i) {
            var speed =
              (i + 1) * 0.5;

            el.style.transform =
              'translate3d(' +
              x * speed +
              'px, ' +
              y * speed +
              'px, 0)';
          }
        );
      },
      { passive: true }
    );
  }


  /* ============================================================
     MAGNETIC BUTTONS
     ============================================================ */
  function initMagneticButtons() {
    var btns =
      document.querySelectorAll(
        '.btn-hero-cyan, .btn-hero-outline'
      );

    btns.forEach(function (btn) {
      btn.addEventListener(
        'mousemove',
        function (e) {
          var rect =
            btn.getBoundingClientRect();

          var x =
            e.clientX -
            rect.left -
            rect.width / 2;

          var y =
            e.clientY -
            rect.top -
            rect.height / 2;

          btn.style.transform =
            'translate(' +
            x * 0.3 +
            'px, ' +
            y * 0.3 +
            'px)';
        }
      );

      btn.addEventListener(
        'mouseleave',
        function () {
          btn.style.transform = '';
        }
      );
    });
  }


  /* ============================================================
     NAVBAR
     ============================================================ */
  var navbar =
    document.getElementById('navbar');

  var navToggle =
    document.getElementById('navToggle');

  var navLinks =
    document.getElementById('navLinks');


  window.addEventListener(
    'scroll',
    function () {
      if (navbar) {
        navbar.classList.toggle(
          'scrolled',
          window.scrollY > 40
        );
      }
    },
    { passive: true }
  );


  if (navToggle && navLinks) {
    navToggle.addEventListener(
      'click',
      function () {
        var open =
          navLinks.classList.toggle('open');

        navToggle.classList.toggle(
          'open',
          open
        );
      }
    );

    navLinks
      .querySelectorAll('a')
      .forEach(function (a) {
        a.addEventListener(
          'click',
          function () {
            navLinks.classList.remove('open');

            navToggle.classList.remove(
              'open'
            );
          }
        );
      });
  }


  /* ============================================================
     SCROLL REVEAL
     ============================================================ */
  function initReveal() {
    var els =
      document.querySelectorAll(
        '[data-reveal]'
      );

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) {
        el.classList.add('revealed');
      });

      return;
    }

    var observer =
      new IntersectionObserver(
        function (entries) {
          entries.forEach(
            function (entry) {
              if (entry.isIntersecting) {
                var target =
                  entry.target;

                var delay =
                  parseFloat(
                    target.dataset.revealDelay
                  ) || 0;

                setTimeout(
                  function () {
                    target.classList.add(
                      'revealed'
                    );
                  },
                  delay * 1000
                );

                observer.unobserve(target);
              }
            }
          );
        },
        {
          threshold: 0.12
        }
      );

    els.forEach(function (el) {
      var parent =
        el.parentElement;

      if (
        parent &&
        (
          parent.classList.contains(
            'projects-grid'
          ) ||
          parent.classList.contains(
            'skills-grid'
          )
        )
      ) {
        el.dataset.revealDelay =
          (
            Array.from(
              parent.children
            ).indexOf(el) * 0.1
          ).toString();
      }

      observer.observe(el);
    });
  }


  /* ============================================================
     EXISTING 3D CARD TILT
     ============================================================ */
  function initTilt() {
    var cards =
      document.querySelectorAll(
        '.project-card, .bento-card'
      );

    cards.forEach(function (card) {
      card.addEventListener(
        'mousemove',
        function (e) {
          var rect =
            card.getBoundingClientRect();

          var x =
            e.clientX - rect.left;

          var y =
            e.clientY - rect.top;

          var cx =
            rect.width / 2;

          var cy =
            rect.height / 2;

          if (!cx || !cy) return;

          var rotX =
            ((y - cy) / cy) * -8;

          var rotY =
            ((x - cx) / cx) * 8;

          card.style.transform =
            'perspective(800px) ' +
            'rotateX(' +
            rotX +
            'deg) rotateY(' +
            rotY +
            'deg) translateY(-5px) scale(1.02)';
        }
      );

      card.addEventListener(
        'mouseleave',
        function () {
          card.style.transform = '';
        }
      );
    });
  }


  /* ============================================================
     CONTACT FORM — EMAILJS
     ============================================================ */
  function initContactForm() {

    if (
      typeof emailjs !== 'undefined'
    ) {
      emailjs.init(
        'i0kKO1mvR8hFHJJic'
      );
    }

    var form =
      document.getElementById(
        'contact-form'
      );

    var status =
      document.getElementById(
        'form-status'
      );

    var btn =
      document.getElementById(
        'form-submit'
      );

    var btnText =
      document.getElementById(
        'btn-text'
      );

    if (
      !form ||
      !status ||
      !btn ||
      !btnText
    ) {
      return;
    }


    form.addEventListener(
      'submit',
      function (e) {
        e.preventDefault();

        btn.disabled = true;

        btnText.innerText =
          'Sending... ⏳';

        status.innerText = '';


        var serviceID =
          'service_syxpp6i';

        var templateID =
          'template_58zso9f';


        if (
          typeof emailjs ===
          'undefined'
        ) {
          btn.disabled = false;

          btnText.innerText =
            'Send Message 🚀';

          status.innerText =
            'Email service is unavailable. Please try again later.';

          status.style.color =
            '#f87171';

          return;
        }


        emailjs
          .sendForm(
            serviceID,
            templateID,
            form
          )
          .then(
            function () {
              btn.disabled = false;

              btnText.innerText =
                'Sent! ✅';

              status.innerText =
                'Thank you! Your message has been sent successfully.';

              status.style.color =
                '#34d399';

              form.reset();


              setTimeout(
                function () {
                  window.location.href =
                    'thankyou.html';
                },
                2000
              );
            },
            function (error) {
              btn.disabled = false;

              btnText.innerText =
                'Send Message 🚀';

              status.innerText =
                'Oops! Failed to send message. Please try again.';

              status.style.color =
                '#f87171';

              console.error(
                'EmailJS Error:',
                error
              );
            }
          );
      }
    );
  }


  /* ============================================================
     EXTRA ENHANCEMENTS
     ============================================================ */

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

  var finePointer =
    window.matchMedia &&
    window.matchMedia(
      '(pointer: fine)'
    ).matches;


  /* ============================================================
     SCROLL PROGRESS
     ============================================================ */
  function initScrollProgress() {

    if (
      document.getElementById(
        'js-scroll-progress'
      )
    ) {
      return;
    }

    var bar =
      document.createElement('div');

    bar.id =
      'js-scroll-progress';

    bar.style.position =
      'fixed';

    bar.style.top = '0';
    bar.style.left = '0';

    bar.style.width = '0%';
    bar.style.height = '3px';

    bar.style.zIndex = '99999';

    bar.style.pointerEvents =
      'none';

    bar.style.background =
      'linear-gradient(90deg,#22d3ee,#6c63ff,#a78bfa)';

    bar.style.boxShadow =
      '0 0 12px rgba(34,211,238,.55)';

    bar.style.transition =
      'width .08s linear';

    document.body.appendChild(bar);


    function updateProgress() {

      var doc =
        document.documentElement;

      var max =
        doc.scrollHeight -
        window.innerHeight;

      var progress =
        max > 0
          ? (window.scrollY / max) * 100
          : 0;

      bar.style.width =
        Math.min(
          100,
          Math.max(0, progress)
        ) + '%';
    }


    window.addEventListener(
      'scroll',
      updateProgress,
      { passive: true }
    );

    window.addEventListener(
      'resize',
      updateProgress
    );

    updateProgress();
  }


  /* ============================================================
     CURSOR GLOW
     ============================================================ */
  function initCursorGlow() {

    if (
      !finePointer ||
      reduceMotion ||
      document.getElementById(
        'js-cursor-glow'
      )
    ) {
      return;
    }

    var glow =
      document.createElement('div');

    glow.id =
      'js-cursor-glow';

    glow.style.position =
      'fixed';

    glow.style.width =
      '260px';

    glow.style.height =
      '260px';

    glow.style.left = '0';
    glow.style.top = '0';

    glow.style.pointerEvents =
      'none';

    glow.style.zIndex = '0';

    glow.style.borderRadius =
      '50%';

    glow.style.background =
      'radial-gradient(circle,rgba(34,211,238,.10) 0%,rgba(108,99,255,.06) 35%,transparent 70%)';

    glow.style.transform =
      'translate(-50%,-50%)';

    glow.style.opacity = '0';

    glow.style.willChange =
      'transform,opacity';

    document.body.appendChild(glow);


    var x = -500;
    var y = -500;

    var targetX = -500;
    var targetY = -500;


    document.addEventListener(
      'mousemove',
      function (e) {
        targetX = e.clientX;
        targetY = e.clientY;

        glow.style.opacity = '1';
      },
      { passive: true }
    );


    function animateGlow() {

      x +=
        (targetX - x) * 0.12;

      y +=
        (targetY - y) * 0.12;

      glow.style.transform =
        'translate(' +
        x +
        'px,' +
        y +
        'px) translate(-50%,-50%)';

      requestAnimationFrame(
        animateGlow
      );
    }

    animateGlow();
  }


  /* ============================================================
     ADVANCED 3D TILT
     ============================================================ */
  function initAdvancedTilt() {

    if (
      !finePointer ||
      reduceMotion
    ) {
      return;
    }

    var cards =
      document.querySelectorAll(
        '.skill-card, .expertise-item, .contact-info, .contact-form, .about-image-wrap'
      );


    cards.forEach(function (card) {

      var active = false;

      card.style.transformStyle =
        'preserve-3d';

      card.style.willChange =
        'transform';

      card.style.transition =
        'transform .18s ease-out, box-shadow .18s ease-out';


      card.addEventListener(
        'mouseenter',
        function () {
          active = true;
        }
      );


      card.addEventListener(
        'mousemove',
        function (e) {

          if (!active) return;

          var rect =
            card.getBoundingClientRect();

          if (
            !rect.width ||
            !rect.height
          ) {
            return;
          }


          var px =
            (e.clientX -
              rect.left) /
            rect.width;

          var py =
            (e.clientY -
              rect.top) /
            rect.height;


          var rotateX =
            (0.5 - py) * 5;

          var rotateY =
            (px - 0.5) * 5;


          card.style.transform =
            'perspective(900px) ' +
            'rotateX(' +
            rotateX +
            'deg) rotateY(' +
            rotateY +
            'deg) translateY(-3px) scale(1.015)';
        }
      );


      card.addEventListener(
        'mouseleave',
        function () {
          active = false;

          card.style.transform = '';
        }
      );
    });
  }


  /* ============================================================
     HERO DEPTH
     ============================================================ */
  function initHeroDepth() {

    if (
      !finePointer ||
      reduceMotion
    ) {
      return;
    }


    var hero =
      document.getElementById(
        'hero'
      );

    var content =
      document.querySelector(
        '.hero-content'
      );

    var bento =
      document.querySelector(
        '.hero-bento'
      );


    if (
      !hero ||
      (!content && !bento)
    ) {
      return;
    }


    var targetX = 0;
    var targetY = 0;

    var currentX = 0;
    var currentY = 0;


    hero.addEventListener(
      'mousemove',
      function (e) {

        var rect =
          hero.getBoundingClientRect();

        if (
          !rect.width ||
          !rect.height
        ) {
          return;
        }


        var x =
          (e.clientX -
            rect.left) /
            rect.width -
          0.5;

        var y =
          (e.clientY -
            rect.top) /
            rect.height -
          0.5;


        targetX = x;
        targetY = y;
      },
      { passive: true }
    );


    hero.addEventListener(
      'mouseleave',
      function () {
        targetX = 0;
        targetY = 0;
      }
    );


    function animateHeroDepth() {

      currentX +=
        (targetX - currentX) *
        0.05;

      currentY +=
        (targetY - currentY) *
        0.05;


      if (content) {

        content.style.transform =
          'translate3d(' +
          (currentX * -8).toFixed(2) +
          'px,' +
          (currentY * -5).toFixed(2) +
          'px,0)';
      }


      if (bento) {

        bento.style.transform =
          'translate3d(' +
          (currentX * 8).toFixed(2) +
          'px,' +
          (currentY * 5).toFixed(2) +
          'px,0)';
      }


      requestAnimationFrame(
        animateHeroDepth
      );
    }


    animateHeroDepth();
  }


  /* ============================================================
     ACTIVE NAVIGATION
     ============================================================ */
  function initActiveNavigation() {

    var sections =
      document.querySelectorAll(
        'main section[id]'
      );

    var links =
      document.querySelectorAll(
        '#navLinks a[href^="#"]'
      );


    if (
      !sections.length ||
      !links.length ||
      !(
        'IntersectionObserver'
        in window
      )
    ) {
      return;
    }


    var linkMap = {};


    links.forEach(
      function (link) {

        var id =
          link.getAttribute(
            'href'
          );

        if (id) {
          linkMap[id] = link;
        }
      }
    );


    var observer =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(
            function (entry) {

              if (
                !entry.isIntersecting
              ) {
                return;
              }


              links.forEach(
                function (link) {
                  link.style.opacity =
                    '0.65';

                  link.style.textShadow =
                    '';
                }
              );


              var active =
                linkMap[
                  '#' +
                  entry.target.id
                ];


              if (active) {

                active.style.opacity =
                  '1';

                active.style.textShadow =
                  '0 0 10px rgba(34,211,238,.55)';
              }
            }
          );
        },
        {
          rootMargin:
            '-35% 0px -55% 0px',

          threshold: 0
        }
      );


    sections.forEach(
      function (section) {
        observer.observe(section);
      }
    );
  }


  /* ============================================================
     BUTTON FEEDBACK
     ============================================================ */
  function initButtonFeedback() {

    if (
      !finePointer ||
      reduceMotion
    ) {
      return;
    }


    var buttons =
      document.querySelectorAll(
        '.btn-hero-cyan, .btn-hero-outline, .btn-submit'
      );


    buttons.forEach(
      function (button) {

        button.addEventListener(
          'click',
          function () {

            button.style.filter =
              'brightness(1.12)';

            setTimeout(
              function () {
                button.style.filter =
                  '';
              },
              160
            );
          }
        );
      }
    );
  }


  /* ============================================================
     IMAGE GUARD
     ============================================================ */
  function initImageGuard() {

    document
      .querySelectorAll('img')
      .forEach(function (img) {

        img.addEventListener(
          'error',
          function () {
            img.style.opacity =
              '0.85';
          },
          { once: true }
        );
      });
  }


  /* ============================================================
     EXTRA HOVER DEPTH
     ============================================================ */
  function initHoverDepth() {

    if (
      !finePointer ||
      reduceMotion
    ) {
      return;
    }


    var elements =
      document.querySelectorAll(
        '.stat-card, .achievement-card, .cert-card'
      );


    elements.forEach(
      function (el) {

        el.addEventListener(
          'mouseenter',
          function () {
            el.style.transform =
              'translateY(-4px) scale(1.01)';
          }
        );


        el.addEventListener(
          'mouseleave',
          function () {
            el.style.transform =
              '';
          }
        );
      }
    );
  }


  /* ============================================================
     SMOOTH ANCHOR FEEDBACK
     ============================================================ */
  function initAnchorFeedback() {

    document
      .querySelectorAll(
        'a[href^="#"]'
      )
      .forEach(function (link) {

        link.addEventListener(
          'click',
          function () {

            var targetId =
              link.getAttribute(
                'href'
              );

            if (
              !targetId ||
              targetId === '#'
            ) {
              return;
            }


            var target =
              document.querySelector(
                targetId
              );

            if (!target) {
              return;
            }


            target.style.transition =
              'filter .3s ease';

            target.style.filter =
              'brightness(1.08)';

            setTimeout(
              function () {
                target.style.filter =
                  '';
              },
              350
            );
          }
        );
      });
  }


  /* ============================================================
     SAFE ENHANCEMENT INIT
     ============================================================ */
  function runEnhancements() {

    initScrollProgress();

    initCursorGlow();

    initAdvancedTilt();

    initHeroDepth();

    initActiveNavigation();

    initButtonFeedback();

    initImageGuard();

    initHoverDepth();

    initAnchorFeedback();
  }


  /* ============================================================
     MAIN INIT
     ============================================================ */
  function initAll() {

    initActivityGrid();

    initHeroParallax();

    initMagneticButtons();

    initContactForm();

    initReveal();

    initTilt();


    var yearEl =
      document.getElementById(
        'year'
      );

    if (yearEl) {
      yearEl.textContent =
        new Date().getFullYear();
    }
  }


  /* ============================================================
     START
     ============================================================ */
  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      function () {

        initAll();

        runEnhancements();
      }
    );

  } else {

    initAll();

    runEnhancements();
  }

})();