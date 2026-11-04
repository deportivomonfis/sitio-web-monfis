const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  menuButton.textContent = isOpen ? '×' : '☰';
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Abrir menú');
  if (menuButton) menuButton.textContent = '☰';
}));

// Botones rápidos de WhatsApp
document.querySelectorAll('[data-message]').forEach(button => {
  button.addEventListener('click', () => {
    const message = encodeURIComponent(`Hola Monfis, ${button.dataset.message}`);
    window.open(`https://wa.me/593988308798?text=${message}`, '_blank', 'noopener,noreferrer');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

// Video de portada: se detiene si el usuario prefiere menos movimiento
const heroVideo = document.querySelector('.hero-video');
if (heroVideo && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroVideo.removeAttribute('autoplay');
  heroVideo.pause();
}

// Galería ampliada
const lightbox = document.querySelector('.lightbox');
const lbImg = lightbox?.querySelector('img');
const allItems = [...document.querySelectorAll('.gallery-item')];
let items = allItems;
let current = 0;
function show(i) {
  current = (i + items.length) % items.length;
  const thumb = items[current].querySelector('img');
  lbImg.src = items[current].dataset.full;
  lbImg.alt = thumb.alt;
}
allItems.forEach(item => item.addEventListener('click', () => {
  show(items.indexOf(item));
  lightbox.showModal();
}));
lightbox?.querySelector('.lb-close').addEventListener('click', () => lightbox.close());
lightbox?.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
lightbox?.querySelector('.lb-next').addEventListener('click', () => show(current + 1));
lightbox?.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });
document.addEventListener('keydown', e => {
  if (!lightbox?.open) return;
  if (e.key === 'ArrowLeft') show(current - 1);
  if (e.key === 'ArrowRight') show(current + 1);
});

// Filtros de la galería
document.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
  const f = btn.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
  allItems.forEach(item => { item.hidden = f !== 'todo' && item.dataset.cat !== f; });
  items = allItems.filter(item => !item.hidden);
}));
