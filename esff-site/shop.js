/* Shop preview: renders shop.html and product.html from window.ESFF_PRODUCTS (products.js).
   Load order on those pages: products.js, shop.js, then script.js (which runs the scroll reveal). */
(function () {
  'use strict';

  var PRODUCTS = window.ESFF_PRODUCTS || [];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function sized(url, w) { return url + (url.indexOf('?') > -1 ? '&' : '?') + 'width=' + w; }
  function money(p) { return (p.from ? 'From ' : '') + '$' + p.price.toFixed(2); }
  function url(p) { return 'product.html?p=' + encodeURIComponent(p.id); }

  function card(p) {
    var tag = p.soldOut ? '<span class="tag tl sold">Sold out</span>'
            : p.badge ? '<span class="tag tl">' + esc(p.badge) + '</span>' : '';
    var alt = p.images[1] ? '<img class="alt" src="' + esc(sized(p.images[1], 700)) + '" alt="" loading="lazy">' : '';
    return '<a class="product reveal" href="' + url(p) + '">' +
      '<div class="thumb sq"><img src="' + esc(sized(p.images[0], 700)) + '" alt="' + esc(p.title) + '" loading="lazy">' + alt + tag + '</div>' +
      '<h3>' + esc(p.title) + '</h3><p>' + esc(p.kind) + '</p><p class="price">' + money(p) + '</p></a>';
  }

  // ---------- cart count (front-end preview only; real checkout stays on Shopify) ----------
  var CART_KEY = 'esff-cart-count';
  function getCart() { try { return +localStorage.getItem(CART_KEY) || 0; } catch (e) { return 0; } }
  function setCart(n) {
    try { localStorage.setItem(CART_KEY, String(n)); } catch (e) { /* storage blocked: count just won't persist */ }
    var el = document.getElementById('cart-count');
    if (el) el.textContent = n;
  }
  setCart(getCart());

  // ---------- collection page ----------
  var grid = document.getElementById('coll-grid');
  if (grid) {
    var filter = 'all', sort = 'featured';
    var countEl = document.getElementById('coll-count');
    function render() {
      var list = PRODUCTS.filter(function (p) { return filter === 'all' || p.kind === filter; });
      if (sort === 'low') list = list.slice().sort(function (a, b) { return a.price - b.price; });
      if (sort === 'high') list = list.slice().sort(function (a, b) { return b.price - a.price; });
      grid.innerHTML = list.map(card).join('');
      grid.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      countEl.textContent = list.length + (list.length === 1 ? ' product' : ' products');
    }
    document.querySelectorAll('[data-filter]').forEach(function (b) {
      b.addEventListener('click', function () {
        filter = b.getAttribute('data-filter');
        document.querySelectorAll('[data-filter]').forEach(function (x) {
          x.classList.toggle('is-on', x === b);
          x.setAttribute('aria-pressed', String(x === b));
        });
        render();
      });
    });
    document.getElementById('sort').addEventListener('change', function (e) { sort = e.target.value; render(); });
    render();
  }

  // ---------- product page ----------
  var pdp = document.getElementById('pdp');
  if (pdp) {
    var id = new URLSearchParams(location.search).get('p');
    var p = PRODUCTS.filter(function (x) { return x.id === id; })[0] || PRODUCTS[0];
    document.title = p.title + ' — Eat Sleep Fly Fish';

    var badge = p.soldOut ? '<span class="tag tl sold">Sold out</span>'
              : p.badge ? '<span class="tag tl">' + esc(p.badge) + '</span>' : '';
    var thumbs = p.images.map(function (src, i) {
      return '<button type="button" class="pdp-thumb' + (i === 0 ? ' is-on' : '') + '" data-src="' + esc(sized(src, 1400)) + '" aria-label="Show photo ' + (i + 1) + '"' + (i === 0 ? ' aria-current="true"' : '') + '><img src="' + esc(sized(src, 200)) + '" alt=""></button>';
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
      : '<div class="buy-row"><div class="qty"><button type="button" data-qty="-1" aria-label="Decrease quantity">−</button>' +
        '<input id="qty" type="number" value="1" min="1" max="10" inputmode="numeric" aria-label="Quantity">' +
        '<button type="button" data-qty="1" aria-label="Increase quantity">+</button></div>' +
        '<button class="btn add-to-cart" type="button" id="add-btn">Add to cart</button></div>' +
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

    document.getElementById('crumb-current').textContent = p.title;
    pdp.innerHTML =
      '<div class="pdp-gallery"><div class="pdp-main">' + badge + '<img id="pdp-img" src="' + esc(sized(p.images[0], 1400)) + '" alt="' + esc(p.title) + '"></div>' +
      (p.images.length > 1 ? '<div class="pdp-thumbs">' + thumbs + '</div>' : '') + '</div>' +
      '<div class="pdp-info">' +
        '<p class="eyebrow">' + esc(p.line) + '</p><h1 class="h">' + esc(p.title) + '</h1>' +
        '<p class="pdp-price">' + money(p) + '</p><p class="pdp-short">' + esc(p.short) + '</p>' +
        '<div class="pdp-form">' + opts + buy + '</div>' +
        '<ul class="assure">' + assure + '</ul>' +
        '<div class="acc-group">' +
          '<details class="acc" open><summary>Description</summary><div class="acc-body">' + desc + '</div></details>' +
          '<details class="acc"><summary>Specifications</summary><div class="acc-body"><table class="specs">' + specs + '</table></div></details>' +
          '<details class="acc"><summary>Shipping &amp; guarantee</summary><div class="acc-body"><p>Free shipping on orders over [$AMOUNT]. Every order is covered by our 30-day guarantee: no questions asked, money back.</p></div></details>' +
          '<details class="acc"><summary>Questions?</summary><div class="acc-body"><p>Call (888) 4HOOKSET or email <a class="link" href="mailto:info@eatsleepflyfish.com">info@eatsleepflyfish.com</a> and Roger will help you pick the right setup.</p></div></details>' +
        '</div>' +
      '</div>';

    document.getElementById('related-grid').innerHTML =
      PRODUCTS.filter(function (x) { return x !== p; }).slice(0, 3).map(card).join('');

    // gallery thumbs
    var main = document.getElementById('pdp-img');
    pdp.querySelectorAll('.pdp-thumb').forEach(function (t) {
      t.addEventListener('click', function () {
        main.src = t.getAttribute('data-src');
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
    if (qty) {
      pdp.querySelectorAll('[data-qty]').forEach(function (b) {
        b.addEventListener('click', function () {
          qty.value = Math.min(10, Math.max(1, (+qty.value || 1) + +b.getAttribute('data-qty')));
        });
      });
      var msgTimer;
      document.getElementById('add-btn').addEventListener('click', function () {
        var n = Math.min(10, Math.max(1, +qty.value || 1));
        setCart(getCart() + n);
        var m = document.getElementById('added-msg');
        m.textContent = 'Added ' + n + ' to your cart.';
        clearTimeout(msgTimer);
        msgTimer = setTimeout(function () { m.textContent = ''; }, 3000);
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
