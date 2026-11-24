(function () {
  'use strict';

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Header shadow on scroll
  var header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hero video: respect reduced motion + pause/play button
  var video = document.querySelector('.hero-video');
  var vbtn = document.getElementById('video-toggle');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (video && vbtn) {
    function setLabel() {
      var playing = !video.paused;
      vbtn.textContent = playing ? 'Pause' : 'Play';
      vbtn.setAttribute('aria-label', playing ? 'Pause background video' : 'Play background video');
    }
    if (reduce) { video.pause(); }
    vbtn.addEventListener('click', function () {
      if (video.paused) { video.play(); } else { video.pause(); }
      setLabel();
    });
    setLabel();
  }

  // Placeholder YouTube hero (desktop only; phones just get the cover image).
  // Starts a few seconds in and loops back to that point, skipping the video's opening
  // and YouTube's start-up overlay. Change START to pick a different start point.
  var ytWrap = document.querySelector('.hero-yt');
  var desktop = window.matchMedia('(min-width: 861px)').matches;
  if (ytWrap && desktop && !reduce) {
    var START = 3; // seconds
    var ytId = ytWrap.getAttribute('data-yt-id');
    var player;

    window.onYouTubeIframeAPIReady = function () {
      player = new YT.Player('hero-yt-player', {
        videoId: ytId,
        host: 'https://www.youtube-nocookie.com',
        playerVars: { autoplay: 1, mute: 1, start: START, controls: 0, rel: 0, playsinline: 1, modestbranding: 1, iv_load_policy: 3, disablekb: 1, fs: 0 },
        events: {
          onReady: function (e) {
            e.target.mute();
            // autoplay=1 starts it; calling playVideo() here makes YouTube flash its
            // centre play/pause icon, so only nudge it if autoplay didn't kick in.
            setTimeout(function () {
              if (e.target.getPlayerState() !== YT.PlayerState.PLAYING) { e.target.playVideo(); }
            }, 1200);
            var f = e.target.getIframe();
            f.setAttribute('tabindex', '-1');
            f.setAttribute('title', 'Background video');
          },
          onStateChange: function (e) {
            var S = YT.PlayerState;
            if (e.data === S.PLAYING) {
              ytWrap.classList.add('is-playing');
            } else if (e.data === S.PAUSED || e.data === S.UNSTARTED || e.data === S.CUED) {
              // Paused/not started: YouTube draws a play button, so show the image instead
              ytWrap.classList.remove('is-playing');
            }
            // Fallback loop if the end is ever reached
            if (e.data === S.ENDED) { player.seekTo(START); player.playVideo(); }
          }
        }
      });
      // Seamless loop: jump back just before the end so YouTube's end screen never shows
      setInterval(function () {
        if (!player || !player.getDuration) return;
        var d = player.getDuration();
        if (d && player.getCurrentTime() > d - 0.5) { player.seekTo(START); }
      }, 200);
    };

    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }

  // Stats strip: count numbers up when they scroll into view
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduce) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        co.unobserve(en.target);
        var el = en.target, end = +el.getAttribute('data-count'), t0 = null, dur = 1400;
        function step(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / dur, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        }
        el.textContent = '0';
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  }

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Field card signup (front-end only: wire to your email provider)
  var form = document.getElementById('field-form');
  var msg = document.getElementById('form-msg');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.elements.email.value.trim();
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      msg.className = 'form-msg ' + (valid ? 'ok' : 'err');
      msg.textContent = valid
        ? 'Thanks! Your Field Card is on its way.'
        : 'Please enter a valid email address.';
      if (valid) { form.reset(); }
    });
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) { year.textContent = new Date().getFullYear(); }
})();
