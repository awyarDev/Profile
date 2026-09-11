(function(){
  var isTouch = window.matchMedia('(pointer: coarse)').matches;

  // PRELOADER
  var preloader = document.getElementById('preloader');
  var preloaderBar = document.getElementById('preloaderBar');
  var preloaderPct = document.getElementById('preloaderPct');
  var progress = 0;
  var preloaderInterval;
  var preloaderDone = false;

  function tickPreloader(){
    var step = Math.random() * 7 + 3;
    progress = Math.min(100, progress + step);
    preloaderBar.style.width = progress + '%';
    preloaderPct.textContent = Math.floor(progress) + '%';
    if(progress >= 100) finishPreloader();
  }

  function finishPreloader(){
    if(preloaderDone) return;
    preloaderDone = true;
    clearInterval(preloaderInterval);
    preloaderBar.style.width = '100%';
    preloaderPct.textContent = '100%';
    setTimeout(function(){
      preloader.classList.add('is-hidden');
      document.body.style.overflow = '';
      setTimeout(function(){
        var reveals = document.querySelectorAll('.reveal');
        reveals.forEach(function(el){
          var rect = el.getBoundingClientRect();
          if(rect.top < window.innerHeight * 0.9){
            el.classList.add('in-view');
          }
        });
      }, 100);
    }, 400);
  }

  document.body.style.overflow = 'hidden';
  preloaderInterval = setInterval(tickPreloader, 100);
  setTimeout(finishPreloader, 3000);

// TIME-AWARE GREETING
var greeting = document.getElementById('greeting');
if(greeting){
  var h = new Date().getHours();
  var text = 'Good evening';
  if(h >= 5 && h < 12) text = 'Good morning';
  else if(h >= 12 && h < 17) text = 'Good afternoon';
  else if(h >= 17 && h < 22) text = 'Good evening';
  else text = 'Good night';
  greeting.textContent = text;
}

  // CUSTOM CURSOR
  var cursorDot = document.getElementById('cursorDot');
  var cursorRing = document.getElementById('cursorRing');

  if(!isTouch && cursorDot && cursorRing){
    document.body.classList.add('custom-cursor-on');
    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var dotX = mouseX, dotY = mouseY;
    var ringX = mouseX, ringY = mouseY;
    var rafActive = false;

    function onMouseMove(e){
      mouseX = e.clientX;
      mouseY = e.clientY;
      if(!rafActive){
        rafActive = true;
        requestAnimationFrame(animateCursor);
      }
    }

    function animateCursor(){
      dotX += (mouseX - dotX) * 0.9;
      dotY += (mouseY - dotY) * 0.9;
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      cursorDot.style.transform = 'translate3d(' + (dotX - 2.5) + 'px,' + (dotY - 2.5) + 'px,0)';
      cursorRing.style.transform = 'translate3d(' + (ringX - 16) + 'px,' + (ringY - 16) + 'px,0)';

      if(Math.abs(mouseX - ringX) > 0.3 || Math.abs(mouseY - ringY) > 0.3){
        requestAnimationFrame(animateCursor);
      } else {
        rafActive = false;
      }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', function(){
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
    document.addEventListener('mouseleave', function(){
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });

    var hoverTargets = document.querySelectorAll('a, button, .project-card, .social-item, .expertise-card, .gallery-item, .stat-card, .exp-card');
    hoverTargets.forEach(function(el){
      el.addEventListener('mouseenter', function(){ cursorRing.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function(){ cursorRing.classList.remove('is-hover'); });
    });

    document.addEventListener('mousedown', function(){ cursorRing.classList.add('is-click'); });
    document.addEventListener('mouseup', function(){ cursorRing.classList.remove('is-click'); });

    cursorDot.style.transform = 'translate3d(' + (mouseX - 2.5) + 'px,' + (mouseY - 2.5) + 'px,0)';
    cursorRing.style.transform = 'translate3d(' + (mouseX - 16) + 'px,' + (mouseY - 16) + 'px,0)';
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
  }

  // MAGNETIC BUTTONS
  if(!isTouch){
    document.querySelectorAll('.magnetic').forEach(function(el){
      var strength = 0.28;
      el.addEventListener('mousemove', function(e){
        var rect = el.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) * strength;
        var dy = (e.clientY - cy) * strength;
        el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      el.addEventListener('mouseleave', function(){
        el.style.transform = '';
      });
    });
  }

  // TILT ON PROJECT CARDS
  if(!isTouch){
    document.querySelectorAll('.tilt').forEach(function(card){
      var maxTilt = 5;
      card.addEventListener('mousemove', function(e){
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var rx = (py - 0.5) * -maxTilt;
        var ry = (px - 0.5) * maxTilt;
        card.style.transform = 'perspective(1000px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-5px)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = '';
      });
    });
  }

  // MOBILE NAV
  var navToggle = document.getElementById('navToggle');
  var navPills = document.getElementById('navPills');
  var scrollY = 0;

  function openNav(){
    scrollY = window.scrollY || window.pageYOffset;
    navPills.classList.add('is-open');
    navToggle.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    document.body.style.top = -scrollY + 'px';
  }

  function closeNav(){
    if(!navPills.classList.contains('is-open')) return;
    navPills.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
  }

  function toggleNav(){
    if(navPills.classList.contains('is-open')) closeNav();
    else openNav();
  }

  if(navToggle){
    navToggle.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      toggleNav();
    });
  }

  navPills.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', function(){
      if(window.innerWidth <= 920) closeNav();
    });
  });

  var resizeTimer;
  window.addEventListener('resize', function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){
      if(window.innerWidth > 920) closeNav();
    }, 150);
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeNav();
  });

  // SCROLL PROGRESS + BACK TO TOP
  var progressBar = document.getElementById('scrollProgress');
  var backTop = document.getElementById('backTop');
  var backTopProgress = document.getElementById('backTopProgress');
  var backTopCirc = 2 * Math.PI * 21;

  if(backTopProgress){
    backTopProgress.style.strokeDasharray = backTopCirc;
    backTopProgress.style.strokeDashoffset = backTopCirc;
  }

  function updateProgress(){
    var doc = document.documentElement;
    var scrollTop = doc.scrollTop || document.body.scrollTop;
    var height = doc.scrollHeight - doc.clientHeight;
    var pct = height > 0 ? (scrollTop / height) * 100 : 0;
    if(progressBar) progressBar.style.width = pct + '%';

    if(backTop){
      if(scrollTop > 400) backTop.classList.add('is-visible');
      else backTop.classList.remove('is-visible');
    }
    if(backTopProgress){
      var offset = backTopCirc - (pct / 100) * backTopCirc;
      backTopProgress.style.strokeDashoffset = offset;
    }
  }
  document.addEventListener('scroll', updateProgress, { passive:true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  if(backTop){
    backTop.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // REVEAL
  var revealEls = document.querySelectorAll('.reveal');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if('IntersectionObserver' in window && !reduceMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.08, rootMargin:'0px 0px -4% 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  }

  // COUNTERS
  var counters = document.querySelectorAll('.counter');
  if('IntersectionObserver' in window && !reduceMotion){
    var counterIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-target'), 10) || 0;
          var start = performance.now();
          var duration = 1400;
          function step(now){
            var t = Math.min(1, (now - start) / duration);
            var eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.floor(eased * target);
            if(t < 1) requestAnimationFrame(step);
            else el.textContent = target;
          }
          requestAnimationFrame(step);
          counterIO.unobserve(el);
        }
      });
    }, { threshold:0.5 });
    counters.forEach(function(c){ counterIO.observe(c); });
  } else {
    counters.forEach(function(c){
      c.textContent = c.getAttribute('data-target');
    });
  }

  // SCROLLSPY
  var navLinks = document.querySelectorAll('.nav-pills a');
  var trackedSections = document.querySelectorAll('section[id], div[id]');
  if('IntersectionObserver' in window){
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function(link){
            link.classList.toggle('is-active', link.getAttribute('data-target') === id);
          });
        }
      });
    }, { rootMargin:'-45% 0px -50% 0px', threshold:0 });
    trackedSections.forEach(function(sec){ spy.observe(sec); });
  }

  // SMOOTH ANCHOR
  document.querySelectorAll('a[href^="#"]').forEach(function(link){
    link.addEventListener('click', function(e){
      var href = link.getAttribute('href');
      if(href.length < 2) return;
      var target = document.querySelector(href);
      if(!target) return;
      e.preventDefault();
      var topbarH = 62;
      var top = target.getBoundingClientRect().top + window.pageYOffset - topbarH - 14;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // TERMINAL TYPING
  var typingCmd = document.getElementById('typingCmd');
  if(typingCmd){
    var phrases = [
      'figma  ·  design',
      'react  ·  build',
      'tailwind  ·  style',
      'laravel  ·  ship'
    ];
    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;

    var typeDelay = 140;
    var deleteDelay = 70;
    var holdDelay = 2200;
    var betweenDelay = 700;

    function typeLoop(){
      var full = phrases[phraseIndex];
      if(!isDeleting){
        charIndex++;
        typingCmd.textContent = full.substring(0, charIndex);
        if(charIndex === full.length){
          isDeleting = true;
          setTimeout(typeLoop, holdDelay);
          return;
        }
        setTimeout(typeLoop, typeDelay);
      } else {
        charIndex--;
        typingCmd.textContent = full.substring(0, charIndex);
        if(charIndex === 0){
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(typeLoop, betweenDelay);
          return;
        }
        setTimeout(typeLoop, deleteDelay);
      }
    }

    setTimeout(typeLoop, 1400);
  }
})();