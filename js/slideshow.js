// Advert slideshow — adverts are managed in the admin dashboard.
(async () => {
  let ads; try { ads = await (await fetch('/api/adverts')).json(); } catch { return; }
  if (!Array.isArray(ads) || !ads.length) return;
  document.head.insertAdjacentHTML('beforeend', `<style>
  .ad-show{padding:40px 0;background:#fff}.ad-box{position:relative;max-width:1100px;margin:0 auto;border-radius:22px;overflow:hidden;box-shadow:0 18px 50px rgba(31,78,140,.25);aspect-ratio:16/7;background:#1f4e8c;cursor:pointer;-webkit-tap-highlight-color:transparent}
  .ad-slide{position:absolute;inset:0;opacity:0;transition:opacity .8s}.ad-slide.on{opacity:1}.ad-slide img{width:100%;height:100%;object-fit:cover;display:block}
  .ad-cap{position:absolute;left:0;right:0;bottom:0;padding:40px 24px 18px;color:#fff;font:600 1.2rem Fredoka,sans-serif;background:linear-gradient(transparent,rgba(0,0,0,.65))}
  .ad-btn,.ad-dots,.ad-hint{transition:opacity .6s}.ad-box.idle .ad-btn,.ad-box.idle .ad-dots,.ad-box.idle .ad-hint{opacity:0;pointer-events:none}
  .ad-btn{position:absolute;top:50%;transform:translateY(-50%);border:0;width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.9);font-size:22px;cursor:pointer;color:#cf3a3f}.ad-prev{left:14px}.ad-next{right:14px}
  .ad-hint{position:absolute;top:14px;left:14px;background:rgba(0,0,0,.55);color:#fff;font:500 12px Inter,sans-serif;padding:6px 12px;border-radius:99px}
  .ad-dots{position:absolute;bottom:10px;right:18px;display:flex;gap:7px}.ad-dots i{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.5);cursor:pointer}.ad-dots i.on{background:#cf3a3f;transform:scale(1.25)}
  .ad-lb{position:fixed;inset:0;background:rgba(5,12,28,.92);z-index:9999;display:none;flex-direction:column;align-items:center;justify-content:center;padding:20px}.ad-lb.open{display:flex}
  .ad-lb img{max-width:100%;max-height:82vh;border-radius:12px;object-fit:contain;box-shadow:0 20px 60px rgba(0,0,0,.5)}.ad-lb p{color:#fff;font:600 1.1rem Fredoka,sans-serif;margin:14px 0 0;text-align:center}
  .ad-x{position:absolute;top:14px;right:18px;width:44px;height:44px;border:0;border-radius:50%;background:#cf3a3f;color:#fff;font-size:28px;line-height:1;cursor:pointer}
  @media(max-width:600px){.ad-box{aspect-ratio:4/3;border-radius:14px}.ad-cap{font-size:1rem}}</style>`);
  const sec = document.createElement('section'); sec.className = 'ad-show';
  sec.innerHTML = `<div class="container"><div class="ad-box idle">${ads.map((a, i) => `<div class="ad-slide${i ? '' : ' on'}"><img alt="School advert"><div class="ad-cap"></div></div>`).join('')}
  <span class="ad-hint">Tap an advert to view it</span><button class="ad-btn ad-prev" aria-label="Previous">‹</button><button class="ad-btn ad-next" aria-label="Next">›</button><div class="ad-dots">${ads.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div></div></div>`;
  const box = sec.querySelector('.ad-box'), s = sec.querySelectorAll('.ad-slide'), d = sec.querySelectorAll('.ad-dots i');
  ads.forEach((a, i) => { s[i].querySelector('img').src = a.image; const c = s[i].querySelector('.ad-cap'); a.title ? c.textContent = a.title : c.remove(); });
  (document.querySelector('.hero') || document.querySelector('section')).after(sec);
  // lightbox
  const lb = document.createElement('div'); lb.className = 'ad-lb'; lb.innerHTML = '<button class="ad-x" aria-label="Close">&times;</button><img alt=""><p></p>'; document.body.append(lb);
  const openLb = () => { lb.querySelector('img').src = ads[n].image; lb.querySelector('p').textContent = ads[n].title || ''; lb.classList.add('open'); document.body.style.overflow = 'hidden'; clearInterval(t); };
  const closeLb = () => { lb.classList.remove('open'); document.body.style.overflow = ''; play(); };
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('ad-x')) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
  // slideshow
  let n = 0, t, idle, sx = 0, swiped = false;
  const go = k => { s[n].classList.remove('on'); d[n].classList.remove('on'); n = (k + s.length) % s.length; s[n].classList.add('on'); d[n].classList.add('on'); };
  const play = () => { clearInterval(t); t = setInterval(() => go(n + 1), 5000); };
  const wake = () => { box.classList.remove('idle'); clearTimeout(idle); idle = setTimeout(() => box.classList.add('idle'), 3000); };
  ['mousemove', 'touchstart', 'focusin'].forEach(ev => box.addEventListener(ev, wake, { passive: true }));
  box.addEventListener('mouseleave', () => { clearTimeout(idle); idle = setTimeout(() => box.classList.add('idle'), 800); });
  box.addEventListener('touchstart', e => { sx = e.touches[0].clientX; swiped = false; }, { passive: true });
  box.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) { swiped = true; go(n + (dx < 0 ? 1 : -1)); play(); } }, { passive: true });
  box.addEventListener('click', e => { if (e.target.closest('.ad-btn,.ad-dots')) return; if (swiped) { swiped = false; return; } openLb(); });
  sec.querySelector('.ad-prev').onclick = () => { go(n - 1); play(); wake(); }; sec.querySelector('.ad-next').onclick = () => { go(n + 1); play(); wake(); };
  d.forEach((x, i) => x.onclick = () => { go(i); play(); wake(); });
  play(); wake();
})();
