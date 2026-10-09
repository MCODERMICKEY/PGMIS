// Advert slideshow — adverts are managed in the admin dashboard.
(async () => {
  let ads; try { ads = await (await fetch('/api/showcase')).json(); } catch { return; }
  if (!Array.isArray(ads) || !ads.length) return;
  document.head.insertAdjacentHTML('beforeend', `<style>
  .sl-show{padding:40px 0;background:#fff}.sl-box{position:relative;display:block;width:100%;max-width:1100px;margin:0 auto;border-radius:22px;overflow:hidden;box-shadow:0 18px 50px rgba(31,78,140,.25);aspect-ratio:16/7;background:#1f4e8c;cursor:pointer;-webkit-tap-highlight-color:transparent}
  .sl-slide{position:absolute;inset:0;opacity:0;transition:opacity .8s}.sl-slide.on{opacity:1}.sl-slide img{width:100%;height:100%;object-fit:cover;display:block}
  .sl-cap{position:absolute;left:0;right:0;bottom:0;padding:40px 24px 18px;color:#fff;font:600 1.2rem Fredoka,sans-serif;background:linear-gradient(transparent,rgba(0,0,0,.65))}
  .sl-btn,.sl-dots,.sl-hint{transition:opacity .6s}.sl-box.idle .sl-btn,.sl-box.idle .sl-dots,.sl-box.idle .sl-hint{opacity:0;pointer-events:none}
  .sl-btn{position:absolute;top:50%;transform:translateY(-50%);border:0;width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.9);font-size:22px;cursor:pointer;color:#cf3a3f}.sl-prev{left:14px}.sl-next{right:14px}
  .sl-hint{position:absolute;top:14px;left:14px;background:rgba(0,0,0,.55);color:#fff;font:500 12px Inter,sans-serif;padding:6px 12px;border-radius:99px}
  .sl-dots{position:absolute;bottom:10px;right:18px;display:flex;gap:7px}.sl-dots i{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.5);cursor:pointer}.sl-dots i.on{background:#cf3a3f;transform:scale(1.25)}
  .sl-lb{position:fixed;inset:0;background:rgba(5,12,28,.92);z-index:9999;display:none;flex-direction:column;align-items:center;justify-content:center;padding:20px}.sl-lb.open{display:flex}
  .sl-lb img{max-width:100%;max-height:82vh;border-radius:12px;object-fit:contain;box-shadow:0 20px 60px rgba(0,0,0,.5)}.sl-lb p{color:#fff;font:600 1.1rem Fredoka,sans-serif;margin:14px 0 0;text-align:center}
  .sl-x{position:absolute;top:14px;right:18px;width:44px;height:44px;border:0;border-radius:50%;background:#cf3a3f;color:#fff;font-size:28px;line-height:1;cursor:pointer}
  @media(max-width:600px){.sl-box{aspect-ratio:4/3;border-radius:14px}.sl-cap{font-size:1rem}}</style>`);
  const sec = document.createElement('section'); sec.className = 'sl-show';
  sec.innerHTML = `<div class="container"><div class="sl-box idle">${ads.map((a, i) => `<div class="sl-slide${i ? '' : ' on'}"><img alt="School advert"><div class="sl-cap"></div></div>`).join('')}
  <span class="sl-hint">Tap an advert to view it</span><button class="sl-btn sl-prev" aria-label="Previous">‹</button><button class="sl-btn sl-next" aria-label="Next">›</button><div class="sl-dots">${ads.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div></div></div>`;
  const box = sec.querySelector('.sl-box'), s = sec.querySelectorAll('.sl-slide'), d = sec.querySelectorAll('.sl-dots i');
  ads.forEach((a, i) => { s[i].querySelector('img').src = a.image; const c = s[i].querySelector('.sl-cap'); a.title ? c.textContent = a.title : c.remove(); });
  (document.querySelector('.hero') || document.querySelector('section')).after(sec);
  // lightbox
  const lb = document.createElement('div'); lb.className = 'sl-lb'; lb.innerHTML = '<button class="sl-x" aria-label="Close">&times;</button><img alt=""><p></p>'; document.body.append(lb);
  const openLb = () => { lb.querySelector('img').src = ads[n].image; lb.querySelector('p').textContent = ads[n].title || ''; lb.classList.add('open'); document.body.style.overflow = 'hidden'; clearInterval(t); };
  const closeLb = () => { lb.classList.remove('open'); document.body.style.overflow = ''; play(); };
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('sl-x')) closeLb(); });
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
  box.addEventListener('click', e => { if (e.target.closest('.sl-btn,.sl-dots')) return; if (swiped) { swiped = false; return; } openLb(); });
  sec.querySelector('.sl-prev').onclick = () => { go(n - 1); play(); wake(); }; sec.querySelector('.sl-next').onclick = () => { go(n + 1); play(); wake(); };
  d.forEach((x, i) => x.onclick = () => { go(i); play(); wake(); });
  play(); wake();
})();
