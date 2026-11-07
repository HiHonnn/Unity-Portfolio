'use strict';
document.body.classList.add('js-ready');
document.getElementById('year').textContent = new Date().getFullYear();

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });

const projects = [...document.querySelectorAll('.project')];
const filterButtons = [...document.querySelectorAll('[data-filter]')];
function filterProjects(filter) {
  filterButtons.forEach(button => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  projects.forEach(project => { project.hidden = filter !== 'all' && project.dataset.category !== filter; });
  document.getElementById('filter-status').textContent = `${projects.filter(p => !p.hidden).length} projects shown.`;
}
filterButtons.forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
// A direct project link should also work after a visitor has used the filters.
function revealLinkedProject() {
  if (projects.some(project => `#${project.id}` === location.hash && project.hidden)) filterProjects('all');
}
window.addEventListener('hashchange', revealLinkedProject);
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
  if (projects.some(project => `#${project.id}` === link.hash && project.hidden)) filterProjects('all');
}));
revealLinkedProject();

const dialog = document.querySelector('.video-dialog');
const videoContainer = dialog.querySelector('.video-container');
let previousOverflow = '';
document.querySelectorAll('[data-video]').forEach(link => {
  link.addEventListener('click', event => {
    if (!dialog.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const title = `${link.dataset.title} — Gameplay`;
    document.getElementById('video-title').textContent = title;
    document.getElementById('youtube-fallback').href = link.href;
    const iframe = document.createElement('iframe');
    iframe.title = title;
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(link.dataset.video)}?autoplay=1&rel=0`;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    videoContainer.replaceChildren(iframe);
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  });
});
dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const box = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  videoContainer.replaceChildren();
  document.body.style.overflow = previousOverflow;
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach(link => {
          const current = link.hash === `#${entry.target.id}`;
          link.classList.toggle('current', current);
          if (current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
        });
      }
    });
  }, {rootMargin: '-15% 0px -55% 0px'});
  document.querySelectorAll('#home, #projects, #about, #contact').forEach(section => observer.observe(section));
}
