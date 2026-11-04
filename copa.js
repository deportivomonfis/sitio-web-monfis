/* COPA MONFIS: filtros de galería, visor de fotos y contadores.
   Funciona solo si existe la sección .cm; no afecta el resto del sitio. */
(function () {
  var root = document.querySelector('.cm');
  if (!root) return;

  /* ----- Filtros de galería ----- */
  var filters = root.querySelectorAll('.cm-filter');
  var items = root.querySelectorAll('.cm-gallery li');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      items.forEach(function (li) {
        var tags = (li.getAttribute('data-tags') || '').split(' ');
        li.hidden = !(f === 'todas' || tags.indexOf(f) !== -1);
      });
    });
  });

  /* ----- Visor de fotos ----- */
  var dlg = root.querySelector('.cm-lightbox');
  var big = root.querySelector('.cm-lightbox__img');
  var cap = root.querySelector('.cm-lightbox__cap');
  var current = 0;
  function visible() {
    return Array.prototype.filter.call(items, function (li) { return !li.hidden; });
  }
  function show(i) {
    var list = visible();
    if (!list.length) return;
    current = (i + list.length) % list.length;
    var img = list[current].querySelector('img');
    big.src = img.src;
    big.alt = img.alt;
    cap.textContent = img.alt;
  }
  function open(li) {
    show(visible().indexOf(li));
    if (dlg && typeof dlg.showModal === 'function') {
      dlg.showModal();
    } else {
      window.open(big.src, '_blank');
    }
  }
  items.forEach(function (li) {
    var b = li.querySelector('.cm-g');
    if (b) b.addEventListener('click', function () { open(li); });
  });
  if (dlg) {
    root.querySelector('.cm-lb-close').addEventListener('click', function () { dlg.close(); });
    root.querySelector('.cm-lb-prev').addEventListener('click', function () { show(current - 1); });
    root.querySelector('.cm-lb-next').addEventListener('click', function () { show(current + 1); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
    var startX = null;
    dlg.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }

  /* ----- Contadores del marcador (un solo momento animado) ----- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nums = root.querySelectorAll('.cm-stats dd[data-count]');
  if (reduce || !('IntersectionObserver' in window) || !nums.length) return;
  function fmt(n) { return n.toLocaleString('es-EC'); }
  function run(el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    var pre = el.getAttribute('data-prefix') || '';
    var t0 = null, dur = 1200;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + fmt(Math.round(end * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var board = root.querySelector('.cm-board');
  var io = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      nums.forEach(run);
      io.disconnect();
    }
  }, { threshold: 0.35 });
  io.observe(board);
})();
