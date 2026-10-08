// ===================================================================
// Peculia Gift Montessori School — shared site behaviour
// Loaded on every page.
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile nav toggle ---
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    // Close menu when a link is tapped (mobile)
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // --- Highlight the current page in the nav ---
  const here = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (href === here || (here === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // --- Footer year ---
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // --- Content photo placeholders ---
  // Every <img class="content-photo" src="..."> sits on top of a
  // .photo-placeholder in the same box. If src="" is still empty, hide
  // the <img> so the placeholder shows through. Once someone edits the
  // src="" in the HTML to point at a real file, the photo appears
  // automatically. If a src is set but the file can't be found, fall
  // back to the placeholder again instead of showing a broken-image icon.
  document.querySelectorAll('img.content-photo').forEach(img => {
    const src = (img.getAttribute('src') || '').trim();
    if (!src) {
      img.style.display = 'none';
    } else {
      img.addEventListener('error', () => { img.style.display = 'none'; });
    }
  });

});
