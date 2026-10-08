// ===================================================================
// Peculia Gift Montessori School — Gallery page logic
// This site has no server/database, so photos and videos are added
// straight in the code (js/gallery-data.js) rather than uploaded from
// a phone or browser. This file just:
//   1. Renders every item in galleryData as a photo or video tile,
//      with category filters.
//   2. Opens a click-to-enlarge lightbox — a full photo, a playable
//      local video, or an embedded video (e.g. YouTube).
// It is written defensively: a mistake in one item of gallery-data.js
// (a missing field, a bad category, a plain YouTube link instead of an
// embed link) should never take down the whole gallery.
// ===================================================================

const CATEGORY_LABELS = {
  classroom: 'Classroom',
  outdoor: 'Outdoor Play',
  events: 'School Events',
  materials: 'Montessori Materials',
  graduation: 'Graduation'
};

// People typing categories by hand naturally write variations like
// "outdoor play", "event", or "Materials " with a capital letter or a
// stray space. This maps those common variations back to the exact
// category key the filter buttons use, so a small wording difference
// doesn't make an item silently vanish from its category.
const CATEGORY_ALIASES = {
  classroom: 'classroom',
  outdoor: 'outdoor',
  'outdoor play': 'outdoor',
  outdoors: 'outdoor',
  events: 'events',
  event: 'events',
  'school events': 'events',
  materials: 'materials',
  material: 'materials',
  'montessori materials': 'materials',
  graduation: 'graduation',
  graduations: 'graduation'
};

function normalizeCategory(category) {
  const key = String(category || '').trim().toLowerCase();
  return CATEGORY_ALIASES[key] || key;
}

const playIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7Z"/></svg>`;

// Pulls an 11-character YouTube video ID out of pretty much any link
// someone might paste: a normal watch link, a youtu.be short link, a
// Shorts link, a proper embed link, or even a mixed-up link like
// ".../embed/watch?v=ID". Looking for "v=ID" or "/ID" anywhere in the
// URL (rather than requiring one exact format) means small mistakes
// in the pasted link still resolve to a working video.
function extractYouTubeId(url) {
  if (!url) return null;
  let m = String(url).match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];
  m = String(url).match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];
  m = String(url).match(/youtube\.com\/(?:embed|shorts|v)\/([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];
  return null;
}

// Accepts a YouTube "watch", "youtu.be", "shorts", "embed" link — even
// a mixed-up one — and always returns a proper embeddable URL. Falls
// back to the original link untouched if it isn't a YouTube link at
// all (e.g. it's already a correct embed URL from another provider).
function toEmbedUrl(url) {
  const id = extractYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : url;
}

// Checks that an item from gallery-data.js has enough to safely render.
// Returns a short reason string if it should be skipped, or null if it's fine.
function invalidItemReason(item) {
  if (!item || typeof item !== 'object') return 'not a valid entry';
  const type = item.type === 'video' ? 'video' : 'photo';
  if (type === 'photo' && !item.src) return 'a photo needs a "src"';
  if (type === 'video' && !item.src && !item.embed) return 'a video needs a "src" or an "embed" link';
  return null;
}

function renderGallery(activeFilter = 'all') {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (typeof galleryData === 'undefined' || !Array.isArray(galleryData)) {
    showGalleryError('js/gallery-data.js could not be read. Check it for a missing comma, quote, or curly brace around the item you last added — one small typo there stops every photo and video from showing.');
    return;
  }

  const items = galleryData.filter(g => activeFilter === 'all' || normalizeCategory(g.category) === activeFilter);

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="howto-card" style="grid-column:1/-1;margin-bottom:0;">
        <p style="margin-bottom:4px;font-weight:600;">Nothing here yet</p>
        <p style="color:var(--muted);margin:0;">Once photos or videos are added to <code>js/gallery-data.js</code>, they'll appear in this category automatically.</p>
      </div>`;
    return;
  }

  let skipped = 0;

  items.forEach((item, i) => {
    try {
      const reason = invalidItemReason(item);
      if (reason) {
        console.warn(`Gallery item #${i + 1} skipped — ${reason}.`, item);
        skipped++;
        return;
      }

      const type = item.type === 'video' ? 'video' : 'photo';
      const fig = document.createElement('div');
      fig.className = type === 'video' ? 'gallery-item is-video' : 'gallery-item';
      const label = CATEGORY_LABELS[normalizeCategory(item.category)] || item.category || '';
      const caption = (item.caption || 'Peculia Gift Montessori School').replace(/"/g, '&quot;');

      if (type === 'photo') {
        fig.innerHTML = `
          <img src="${item.src}" alt="${caption}" loading="lazy"
               onerror="this.closest('.gallery-item').classList.add('img-missing'); this.style.display='none';">
          <div class="tag">${label}</div>
        `;
      } else if (item.src) {
        // Local video file — show a muted preview with a play badge
        fig.innerHTML = `
          <video src="${item.src}" muted playsinline preload="metadata"
                 onerror="this.closest('.gallery-item').classList.add('img-missing'); this.style.display='none';"></video>
          <div class="play-badge">${playIcon}</div>
          <div class="tag">${label}</div>
        `;
      } else {
        // Embedded video (e.g. YouTube) — no reliable local thumbnail, so
        // show a simple placeholder tile with a play badge instead.
        fig.innerHTML = `
          <div class="video-fallback"></div>
          <div class="play-badge">${playIcon}</div>
          <div class="tag">${label}</div>
        `;
      }

      fig.addEventListener('click', () => openLightbox(item));
      grid.appendChild(fig);
    } catch (err) {
      // A single bad item should never stop the rest of the gallery from rendering.
      console.warn(`Gallery item #${i + 1} failed to render and was skipped.`, item, err);
      skipped++;
    }
  });

  if (skipped > 0 && grid.children.length === 0) {
    showGalleryError('None of the items in js/gallery-data.js could be shown. Open the browser console (F12) for details on which entry to fix.');
  }
}

function showGalleryError(message) {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = `
    <div class="howto-card" style="grid-column:1/-1;margin-bottom:0;border-color:var(--red);">
      <p style="margin-bottom:4px;font-weight:600;color:var(--red-dark);">Gallery couldn't load</p>
      <p style="color:var(--muted);margin:0;">${message}</p>
    </div>`;
}

function openLightbox(item) {
  const lb = document.getElementById('lightbox');
  const media = document.getElementById('lightboxMedia');
  if (!lb || !media) return;

  const type = item.type === 'video' ? 'video' : 'photo';
  const caption = (item.caption || '').replace(/"/g, '&quot;');

  if (type === 'photo') {
    media.innerHTML = `<img src="${item.src}" alt="${caption}">`;
  } else if (item.src) {
    media.innerHTML = `<video src="${item.src}" controls autoplay playsinline></video>`;
  } else if (item.embed) {
    const embedUrl = toEmbedUrl(item.embed);
    const sep = embedUrl.includes('?') ? '&' : '?';
    media.innerHTML = `<iframe src="${embedUrl}${sep}autoplay=1&rel=0" title="${caption}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  }

  lb.classList.add('open');
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  const media = document.getElementById('lightboxMedia');
  if (lb) lb.classList.remove('open');
  // Clear the media so playing video/audio stops once the lightbox closes
  if (media) media.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    renderGallery('all');
  } catch (err) {
    console.error('Gallery failed to render', err);
    showGalleryError('Something in js/gallery-data.js has a typo (often a missing comma between items). Open the browser console (F12) for the exact error.');
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      try {
        renderGallery(btn.dataset.filter);
      } catch (err) {
        console.error('Gallery failed to render', err);
        showGalleryError('Something in js/gallery-data.js has a typo (often a missing comma between items). Open the browser console (F12) for the exact error.');
      }
    });
  });

  const lbClose = document.getElementById('lightboxClose');
  const lbEl = document.getElementById('lightbox');
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbEl) lbEl.addEventListener('click', e => { if (e.target === lbEl) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
});
