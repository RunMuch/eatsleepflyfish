/* Shop preview: renders shop.html and product.html from products.js, and keeps the header cart count.
   Load order: products.js (shop/product pages only), shop.js, then script.js (which runs the scroll reveal).
     shop.html?c=<collection>&f=<filter>   e.g. shop.html?c=flies&f=Tier 2 · Speak
     product.html?p=<product id> */
(function () {
  'use strict';

  var PRODUCTS = window.ESFF_PRODUCTS || [];
  var COLLECTIONS = window.ESFF_COLLECTIONS || {};
  var params = new URLSearchParams(location.search);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canAnimate = !reduce && typeof Element.prototype.animate === 'function';
  var EASE = 'cubic-bezier(.2,.8,.2,1)';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function sized(src, w) {
    if (src.indexOf('cdn.shopify.com') < 0) return src;
    return src + (src.indexOf('?') > -1 ? '&' : '?') + 'width=' + w;
  }
  function money(p) {
    if (p.price == null) return '[Price]';
    return (p.from ? 'From ' : '') + '$' + p.price.toFixed(2) + (p.unit || '');
  }
  function productUrl(p) { return 'product.html?p=' + encodeURIComponent(p.id); }
  function shopUrl(c, f) { return 'shop.html?c=' + encodeURIComponent(c) + (f ? '&f=' + encodeURIComponent(f) : ''); }
  function tagFor(p) {
    return p.soldOut ? '<span class="tag tl sold">Sold out</span>'
         : p.badge ? '<span class="tag tl">' + esc(p.badge) + '</span>' : '';
  }
  function tierOf(label) { var m = /^Tier (\d)/.exec(label || ''); return m ? +m[1] : 0; }

  function card(p, reveal) {
    var alt = p.images[1] ? '<img class="alt" src="' + esc(sized(p.images[1], 700)) + '" alt="" loading="lazy">' : '';
    var meta = '<span>' + esc(p.kind) + '</span>';
    return '<a class="product shop-card' + (reveal ? ' reveal' : '') + '" href="' + productUrl(p) + '" data-id="' + esc(p.id) + '">' +
      '<div class="thumb sq ' + (p.tint || '') + '"><img src="' + esc(sized(p.images[0], 700)) + '" alt="' + esc(p.title) + '" loading="lazy">' + alt + tagFor(p) +
      '<span class="peek">View details <b aria-hidden="true">→</b></span></div>' +
      '<h3>' + esc(p.title) + '</h3><p class="card-meta">' + meta + '</p><p class="price">' + money(p) + '</p></a>';
  }

  // ---------- cart count (front-end preview only) ----------
  var CART_KEY = 'esff-cart-count';
  function getCart() { try { return +localStorage.getItem(CART_KEY) || 0; } catch (e) { return 0; } }
  function setCart(n) {
    try { localStorage.setItem(CART_KEY, String(n)); } catch (e) { /* storage blocked: count won't persist */ }
    var el = document.getElementById('cart-count');
    if (el) {
      var changed = el.textContent !== String(n);
      el.textContent = n;
      if (changed && canAnimate && n > 0) {
        el.parentNode.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 360, easing: EASE });
      }
    }
  }
  setCart(getCart());

  // mark the main-nav link for the page we're on (Shop, Flies, Books & Course, Instruction)
  (function () {
    var page = location.pathname.split('/').pop() || 'index.html';
    var key = page === 'shop.html' ? 'shop.html' + (params.get('c') && params.get('c') !== 'all' ? '?c=' + params.get('c') : '')
            : page === 'product.html' ? 'product.html?p=' + params.get('p') : '';
    if (key === 'shop.html?c=rods') key = 'shop.html'; // rods live under Shop
    document.querySelectorAll('#primary-nav a').forEach(function (a) {
      if (key && a.getAttribute('href') === key) a.setAttribute('aria-current', 'page');
    });
  })();

  // keep sticky bars just under the header
  var header = document.querySelector('.site-header');
  function setHeaderH() { if (header) document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px'); }
  setHeaderH();
  window.addEventListener('resize', setHeaderH);

  // ---------- collection page ----------
  var grid = document.getElementById('coll-grid');
  if (grid) {
    var cid = COLLECTIONS[params.get('c')] ? params.get('c') : 'all';
    var col = COLLECTIONS[cid];
    var pool = PRODUCTS.filter(function (p) { return cid === 'all' || p.cat === cid; });
    var filter = col.filters.indexOf(params.get('f')) > -1 ? params.get('f') : 'all';
    var sort = 'featured';

    document.title = col.title + ' — Eat Sleep Fly Fish';
    document.getElementById('coll-eyebrow').textContent = col.eyebrow;
    document.getElementById('coll-title').textContent = col.title;
    document.getElementById('coll-lede').textContent = col.lede;
    document.getElementById('coll-crumb').textContent = col.crumb;
    var heroBg = document.getElementById('coll-hero-bg');
    if (col.hero) {
      heroBg.style.backgroundImage = 'url("' + col.hero + '")';
      requestAnimationFrame(function () { heroBg.classList.add('in'); });
    }

    // category tabs
    document.getElementById('coll-tabs').innerHTML = Object.keys(COLLECTIONS).map(function (k) {
      var n = PRODUCTS.filter(function (p) { return k === 'all' || p.cat === k; }).length;
      return '<a href="' + shopUrl(k) + '"' + (k === cid ? ' aria-current="page"' : '') + '>' + esc(COLLECTIONS[k].crumb) + ' <span>' + n + '</span></a>';
    }).join('');

    // filter buttons, each with a live count, plus a highlight that slides to the active one
    var pills = document.getElementById('pills');
    var bar = document.getElementById('filter-bar');
    var hasFilters = col.filters.length > 0;
    if (hasFilters) {
      pills.innerHTML = '<span class="pill-thumb" aria-hidden="true"></span>' + ['all'].concat(col.filters).map(function (f) {
        var n = f === 'all' ? pool.length : pool.filter(function (p) { return p[col.filterBy] === f; }).length;
        var t = tierOf(f);
        return '<button class="pill' + (t ? ' tier t' + t : '') + '" type="button" data-filter="' + esc(f) + '" aria-pressed="false">' +
          '<span class="pill-label">' + (f === 'all' ? 'All' : esc(f)) + '</span><span class="pill-n">' + n + '</span></button>';
      }).join('');
    } else {
      pills.hidden = true;
    }
    var thumb = pills.querySelector('.pill-thumb');
    function moveThumb(animate) {
      var b = pills.querySelector('.pill.is-on');
      if (!b || !thumb) return;
      thumb.style.transition = animate && !reduce ? '' : 'none';
      thumb.style.width = b.offsetWidth + 'px';
      thumb.style.height = b.offsetHeight + 'px';
      thumb.style.transform = 'translate(' + b.offsetLeft + 'px,' + b.offsetTop + 'px)';
      thumb.className = 'pill-thumb' + (b.classList.contains('tier') ? ' tier t' + tierOf(b.getAttribute('data-filter')) : '');
      // keep the active button visible when the row scrolls sideways on phones
      var left = b.offsetLeft - 16, right = b.offsetLeft + b.offsetWidth + 16;
      if (left < pills.scrollLeft) pills.scrollTo({ left: left, behavior: animate ? 'smooth' : 'auto' });
      else if (right > pills.scrollLeft + pills.clientWidth) pills.scrollTo({ left: right - pills.clientWidth, behavior: animate ? 'smooth' : 'auto' });
    }
    window.addEventListener('resize', function () { moveThumb(false); });

    // sort options (price sorts only when the products have prices)
    var sortSel = document.getElementById('sort');
    var hasPrices = pool.some(function (p) { return p.price != null; });
    sortSel.innerHTML = '<option value="featured">Featured</option><option value="az">Name A–Z</option>' +
      (hasPrices ? '<option value="low">Price: low to high</option><option value="high">Price: high to low</option>' : '');

    // shadow on the filter bar once it sticks
    var sentinel = document.createElement('div');
    bar.parentNode.insertBefore(sentinel, bar);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { bar.classList.toggle('stuck', !en[0].isIntersecting); },
        { rootMargin: '-' + ((header && header.offsetHeight) || 0) + 'px 0px 0px 0px' }).observe(sentinel);
    }

    // build every card once; filtering shows/hides and reorders them
    grid.innerHTML = pool.map(function (p) { return card(p, false); }).join('');
    var byId = {};
    Array.prototype.forEach.call(grid.children, function (c) { byId[c.getAttribute('data-id')] = c; });

    var countEl = document.getElementById('coll-count');
    var noteEl = document.getElementById('tier-note');

    function currentList() {
      var list = pool.filter(function (p) { return filter === 'all' || p[col.filterBy] === filter; });
      var price = function (p) { return p.price == null ? Infinity : p.price; };
      if (sort === 'az') list = list.slice().sort(function (a, b) { return a.title.localeCompare(b.title); });
      if (sort === 'low') list = list.slice().sort(function (a, b) { return price(a) - price(b); });
      if (sort === 'high') list = list.slice().sort(function (a, b) { return (b.price || 0) - (a.price || 0); });
      return list;
    }

    function updateMeta(list, animate) {
      var noun = cid === 'flies' ? (list.length === 1 ? 'fly' : 'flies') : (list.length === 1 ? 'product' : 'products');
      countEl.innerHTML = 'Showing <b>' + list.length + '</b> ' + noun + (filter === 'all' ? '' : ' of ' + pool.length);
      var note = col.notes && col.notes.filter(function (n) { return n[0] === filter; })[0];
      if (note) {
        noteEl.className = 'tier-note t' + tierOf(note[0]);
        noteEl.innerHTML = '<b>' + esc(note[0]) + '</b><span>' + esc(note[1]) + '</span>';
        noteEl.hidden = false;
        if (animate && canAnimate) noteEl.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: EASE });
      } else {
        noteEl.hidden = true;
      }
    }

    var run = 0;
    function apply(animate) {
      var token = ++run;
      var list = currentList();
      var show = {};
      list.forEach(function (p) { show[p.id] = true; });
      var cards = Array.prototype.slice.call(grid.children);
      // a new click interrupts any animation still running from the last one
      if (canAnimate) cards.forEach(function (c) { c.getAnimations().forEach(function (a) { a.cancel(); }); });
      updateMeta(list, animate);

      function place() {
        list.forEach(function (p) { grid.appendChild(byId[p.id]); });
        cards.forEach(function (c) { c.hidden = !show[c.getAttribute('data-id')]; });
      }

      if (!animate || !canAnimate) { place(); if (!animate && canAnimate) enter(list, {}); return; }

      // FLIP: remember where visible cards are, fade out the ones leaving, then glide the rest
      var first = new Map();
      cards.forEach(function (c) { if (!c.hidden) first.set(c, c.getBoundingClientRect()); });
      var leaving = cards.filter(function (c) { return !c.hidden && !show[c.getAttribute('data-id')]; });
      var outs = leaving.map(function (c) {
        return c.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.92)' }], { duration: 170, easing: 'ease-in', fill: 'forwards' }).finished;
      });
      Promise.all(outs).then(function () {
        if (token !== run) return;
        leaving.forEach(function (c) { c.getAnimations().forEach(function (a) { a.cancel(); }); });
        place();
        enter(list, first);
      }).catch(function () { /* cancelled by a newer click */ });
    }

    function enter(list, first) {
      var i = 0;
      list.forEach(function (p) {
        var c = byId[p.id], f = first.get ? first.get(c) : null;
        if (f) {
          var last = c.getBoundingClientRect();
          var dx = f.left - last.left, dy = f.top - last.top;
          if (dx || dy) c.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 420, easing: EASE });
        } else {
          c.animate([{ opacity: 0, transform: 'translateY(22px) scale(.97)' }, { opacity: 1, transform: 'none' }],
            { duration: 460, delay: Math.min(i++, 10) * 45, easing: EASE, fill: 'backwards' });
        }
      });
    }

    function setFilter(f, animate) {
      filter = f;
      pills.querySelectorAll('.pill').forEach(function (x) {
        var on = x.getAttribute('data-filter') === f;
        x.classList.toggle('is-on', on);
        x.setAttribute('aria-pressed', String(on));
      });
      moveThumb(animate);
      if (animate) history.replaceState(null, '', shopUrl(cid, f === 'all' ? '' : f));
      apply(animate);
    }

    pills.addEventListener('click', function (e) {
      var b = e.target.closest('.pill');
      if (!b || b.getAttribute('data-filter') === filter) return;
      setFilter(b.getAttribute('data-filter'), true);
      // bring the grid back into view if the bar is stuck and the user is far down
      var top = grid.getBoundingClientRect().top;
      if (top < 0) window.scrollBy({ top: top - bar.offsetHeight - 24, behavior: reduce ? 'auto' : 'smooth' });
    });
    sortSel.addEventListener('change', function () { sort = sortSel.value; apply(true); });

    if (hasFilters) setFilter(filter, false); else apply(false);
    // fonts can change the button widths after load
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveThumb(false); });

    var promise = document.getElementById('promise');
    if (col.promise) {
      promise.innerHTML = '<div class="grid cols-' + col.promise.length + '">' + col.promise.map(function (r) {
        return '<div class="reveal"><b class="h">' + esc(r[0]) + '</b><p>' + esc(r[1]) + '</p></div>';
      }).join('') + '</div>';
    } else {
      promise.hidden = true;
    }
  }

  // ---------- product page ----------
  var pdp = document.getElementById('pdp');
  if (pdp) {
    var p = PRODUCTS.filter(function (x) { return x.id === params.get('p'); })[0] || PRODUCTS[0];
    var pc = COLLECTIONS[p.cat];
    document.title = p.title + ' — Eat Sleep Fly Fish';

    var crumbCol = document.getElementById('crumb-collection');
    crumbCol.textContent = pc.crumb;
    crumbCol.href = shopUrl(p.cat);
    document.getElementById('crumb-current').textContent = p.title;

    var thumbs = p.images.map(function (src, i) {
      return '<button type="button" class="pdp-thumb ' + (p.tint || '') + (i === 0 ? ' is-on' : '') + '" data-src="' + esc(sized(src, 1400)) + '" aria-label="Show photo ' + (i + 1) + '"' + (i === 0 ? ' aria-current="true"' : '') + '><img src="' + esc(sized(src, 200)) + '" alt=""></button>';
    }).join('');
    var opts = p.options.map(function (o, gi) {
      var chips = o.values.map(function (v, vi) {
        return '<label class="chip"><input type="radio" name="opt' + gi + '" value="' + esc(v) + '"' + (vi === 0 ? ' checked' : '') + '><span>' + esc(v) + '</span></label>';
      }).join('');
      return '<fieldset class="opt"><legend>' + esc(o.name) + ': <b class="opt-val">' + esc(o.values[0]) + '</b></legend><div class="chips">' + chips + '</div></fieldset>';
    }).join('');
    var buy = p.soldOut
      ? '<button class="btn block" type="button" disabled>Sold out</button>' +
        '<div class="notify"><label for="notify-email">Email me when it’s back</label>' +
        '<div class="notify-row"><input id="notify-email" type="email" placeholder="you@email.com" autocomplete="email"><button class="btn dark" type="button" id="notify-btn">Notify me</button></div>' +
        '<p class="form-msg" id="notify-msg" role="status" aria-live="polite"></p></div>'
      : '<div class="buy-row">' +
        (p.cat === 'learn' ? '' :
          '<div class="qty"><button type="button" data-qty="-1" aria-label="Decrease quantity">−</button>' +
          '<input id="qty" type="number" value="1" min="1" max="10" inputmode="numeric" aria-label="Quantity">' +
          '<button type="button" data-qty="1" aria-label="Increase quantity">+</button></div>') +
        '<button class="btn add-to-cart" type="button" id="add-btn">' + esc(p.cta || 'Add to cart') + '</button></div>' +
        '<p class="added" id="added-msg" role="status" aria-live="polite"></p>';
    var icon = {
      truck: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/></svg>',
      shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>',
      star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/></svg>'
    };
    var assure = (p.leadTime ? '<li>' + icon.truck + esc(p.leadTime) + '</li>' : '') +
      '<li>' + icon.shield + '30-day money-back guarantee, no questions asked</li>' +
      (p.kind === 'Fly rod' ? '<li>' + icon.star + 'Fished by 4 of 6 Team USA World Team members</li>' : '');
    var specs = p.specs.map(function (r) { return '<tr><th>' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td></tr>'; }).join('');
    var desc = p.description.map(function (d) { return '<p>' + esc(d) + '</p>'; }).join('');
    var shipping = p.delivery
      ? '<details class="acc"><summary>Delivery &amp; guarantee</summary><div class="acc-body"><p>' + esc(p.delivery) + '</p><p>Every order is covered by our 30-day guarantee: no questions asked, money back.</p></div></details>'
      : '<details class="acc"><summary>Shipping &amp; guarantee</summary><div class="acc-body"><p>Free shipping on orders over [$AMOUNT]. Every order is covered by our 30-day guarantee: no questions asked, money back.</p></div></details>';
    var tierLine = p.tier
      ? '<a class="tier-note t' + p.tier + '" href="' + shopUrl('flies', p.group) + '"><b>' + esc(p.group) + '</b><span>See all →</span></a>'
      : '';

    pdp.innerHTML =
      '<div class="pdp-gallery"><div class="pdp-main ' + (p.tint || '') + '">' + tagFor(p) + '<img id="pdp-img" src="' + esc(sized(p.images[0], 1400)) + '" alt="' + esc(p.title) + '"></div>' +
      (p.images.length > 1 ? '<div class="pdp-thumbs">' + thumbs + '</div>' : '') + '</div>' +
      '<div class="pdp-info">' +
        '<p class="eyebrow">' + esc(p.line) + '</p><h1 class="h">' + esc(p.title) + '</h1>' +
        '<p class="pdp-price">' + money(p) + '</p>' + tierLine + '<p class="pdp-short">' + esc(p.short) + '</p>' +
        '<div class="pdp-form">' + opts + buy + '</div>' +
        '<ul class="assure">' + assure + '</ul>' +
        '<div class="acc-group">' +
          '<details class="acc" open><summary>Description</summary><div class="acc-body">' + desc + '</div></details>' +
          '<details class="acc"><summary>Details</summary><div class="acc-body"><table class="specs">' + specs + '</table></div></details>' +
          shipping +
          '<details class="acc"><summary>Questions?</summary><div class="acc-body"><p>Call (888) 4HOOKSET or email <a class="link" href="mailto:info@eatsleepflyfish.com">info@eatsleepflyfish.com</a> and Roger will help you pick the right setup.</p></div></details>' +
        '</div>' +
      '</div>';

    // related: same group first, then the rest of the collection
    var related = PRODUCTS.filter(function (x) { return x !== p && x.cat === p.cat && x.group === p.group; })
      .concat(PRODUCTS.filter(function (x) { return x !== p && x.cat === p.cat && x.group !== p.group; }))
      .slice(0, 3);
    document.getElementById('related-title').textContent = p.cat === 'flies' ? 'More flies' : p.cat === 'learn' ? 'Keep learning' : 'More from Highland';
    document.getElementById('related-grid').innerHTML = related.map(function (x) { return card(x, true); }).join('');
    document.getElementById('related-all').href = shopUrl(p.cat);

    // gallery thumbs
    var main = document.getElementById('pdp-img');
    pdp.querySelectorAll('.pdp-thumb').forEach(function (t) {
      t.addEventListener('click', function () {
        main.src = t.getAttribute('data-src');
        if (canAnimate) main.animate([{ opacity: .3 }, { opacity: 1 }], { duration: 280 });
        pdp.querySelectorAll('.pdp-thumb').forEach(function (x) {
          x.classList.toggle('is-on', x === t);
          if (x === t) x.setAttribute('aria-current', 'true'); else x.removeAttribute('aria-current');
        });
      });
    });

    // option chips update the label
    pdp.querySelectorAll('.opt').forEach(function (fs) {
      fs.addEventListener('change', function (e) { fs.querySelector('.opt-val').textContent = e.target.value; });
    });

    // quantity + add to cart
    var qty = document.getElementById('qty');
    pdp.querySelectorAll('[data-qty]').forEach(function (b) {
      b.addEventListener('click', function () {
        qty.value = Math.min(10, Math.max(1, (+qty.value || 1) + +b.getAttribute('data-qty')));
      });
    });
    var addBtn = document.getElementById('add-btn');
    if (addBtn) {
      var msgTimer;
      addBtn.addEventListener('click', function () {
        var m = document.getElementById('added-msg');
        if (p.cta) {
          m.textContent = 'Thanks! Roger will be in touch about dates. [Wire this to the application form.]';
        } else {
          var n = qty ? Math.min(10, Math.max(1, +qty.value || 1)) : 1;
          setCart(getCart() + n);
          m.textContent = 'Added ' + n + ' to your cart.';
        }
        clearTimeout(msgTimer);
        msgTimer = setTimeout(function () { m.textContent = ''; }, 4000);
      });
    }

    // back-in-stock form (front-end only)
    var nb = document.getElementById('notify-btn');
    if (nb) {
      nb.addEventListener('click', function () {
        var input = document.getElementById('notify-email');
        var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        var m = document.getElementById('notify-msg');
        m.className = 'form-msg ' + (ok ? 'ok' : 'err');
        m.textContent = ok ? 'Thanks! We’ll email you when it’s back.' : 'Please enter a valid email address.';
        if (ok) input.value = '';
      });
    }
  }
})();
