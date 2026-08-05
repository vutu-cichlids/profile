(function(){
  "use strict";

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle (light/dark, matches carmabella.dev/en) ---------- */
  var THEME_KEY = 'theme';
  var html = document.documentElement;
  var themeToggles = document.querySelectorAll('.theme-toggle');

  function applyTheme(theme){
    html.setAttribute('data-theme', theme);
    themeToggles.forEach(function(btn){
      btn.setAttribute('aria-label', theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
    });
    try{ localStorage.setItem(THEME_KEY, theme); }catch(e){}
  }
  themeToggles.forEach(function(btn){
    btn.addEventListener('click', function(){
      var current = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  });

  /* ---------- Language toggle ---------- */
  var LANG_KEY = 'mm_lang';

  function applyLang(lang){
    html.setAttribute('lang', lang === 'en' ? 'en' : 'vi');
    html.setAttribute('data-lang', lang);
    document.querySelectorAll('[data-vi]').forEach(function(el){
      var val = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-vi');
      if(val !== null) el.innerHTML = val;
    });
    document.querySelectorAll('.lang-switch button').forEach(function(btn){
      var isCurrent = btn.getAttribute('data-lang-btn') === lang;
      if(isCurrent) btn.setAttribute('aria-current', 'true'); else btn.removeAttribute('aria-current');
    });
    try{ localStorage.setItem(LANG_KEY, lang); }catch(e){}
  }

  var savedLang = 'vi';
  try{ savedLang = localStorage.getItem(LANG_KEY) || 'vi'; }catch(e){}
  applyLang(savedLang);

  document.querySelectorAll('.lang-switch button').forEach(function(btn){
    btn.addEventListener('click', function(){
      applyLang(btn.getAttribute('data-lang-btn'));
    });
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var mobileNav = document.getElementById('mobileNav');
  if(menuBtn && mobileNav){
    menuBtn.addEventListener('click', function(){
      var expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      mobileNav.classList.toggle('open', !expanded);
    });
    mobileNav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
      });
    });
  }

  /* ---------- Active nav highlighting (per page) ---------- */
  var currentPage = location.pathname.split('/').pop();
  if(!currentPage) currentPage = 'index.html';
  document.querySelectorAll('.desktop-nav a, .mobile-nav a').forEach(function(a){
    var href = (a.getAttribute('href') || '').split('/').pop();
    if(href === currentPage) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  });

  /* ---------- Konami-code easter egg (original content, own homage) ---------- */
  var KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var buffer = [];
  var eggOverlay = document.getElementById('eggOverlay');
  document.addEventListener('keydown', function(e){
    buffer.push(e.key);
    if(buffer.length > KONAMI.length) buffer.shift();
    if(buffer.length === KONAMI.length && buffer.every(function(k,i){ return k === KONAMI[i]; })){
      if(eggOverlay) eggOverlay.classList.add('open');
      buffer = [];
    }
  });
  if(eggOverlay){
    eggOverlay.addEventListener('click', function(e){
      if(e.target === eggOverlay) eggOverlay.classList.remove('open');
    });
    var eggClose = eggOverlay.querySelector('[data-egg-close]');
    if(eggClose) eggClose.addEventListener('click', function(){ eggOverlay.classList.remove('open'); });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') eggOverlay.classList.remove('open');
    });
  }

  /* ---------- Print button (Resume page) ---------- */
  var printBtn = document.getElementById('printResume');
  if(printBtn) printBtn.addEventListener('click', function(){ window.print(); });

  /* ---------- Reveal animations ---------- */
  document.body.classList.add('reveal-ready');

  if(window.gsap){
    gsap.registerPlugin(ScrollTrigger);
    if(reduceMotion){
      gsap.set('[data-reveal]', { opacity: 1, y: 0 });
    } else {
      if(document.querySelector('.hero')){
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .to('.hero [data-reveal]', { opacity: 1, y: 0, duration: .7, stagger: .08 });
      } else if(document.querySelector('.page-head')){
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .to('.page-head [data-reveal], .resume-head [data-reveal]', { opacity: 1, y: 0, duration: .7, stagger: .08 });
      } else if(document.querySelector('.case-head')){
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .to('.case-head [data-reveal]', { opacity: 1, y: 0, duration: .7, stagger: .08 });
      }

      document.querySelectorAll('[data-reveal]').forEach(function(el){
        if(el.closest('.hero') || el.closest('.page-head') || el.closest('.case-head')) return;
        gsap.to(el, {
          opacity: 1, y: 0, duration: .6, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' }
        });
      });

      ['.work-grid .work-card', '.arrow-list li', '.also-shipped .also-item'].forEach(function(sel){
        var items = document.querySelectorAll(sel);
        if(items.length){
          gsap.to(items, {
            opacity: 1, y: 0, duration: .5, ease: 'power3.out', stagger: .06,
            scrollTrigger: { trigger: items[0], start: 'top 92%' }
          });
        }
      });
    }
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function(el){
      el.style.opacity = 1; el.style.transform = 'none';
    });
  }
})();
