// Rodillian Runners — nav toggle for mobile
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const list = document.getElementById('primary-menu');
  if (!toggle || !list) return;
  toggle.addEventListener('click', function () {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    list.classList.toggle('open');
  });
})();
