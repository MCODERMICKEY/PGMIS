// Advert slideshow — shows adverts managed in the admin dashboard.
(async () => {
  let ads; try { ads = await (await fetch('/api/adverts')).json(); } catch { return; }
  if (!Array.isArray(ads) || !ads.length) return;
  document.head.insertAdjacentHTML('beforeend', `<style>
  .ad-show{padding:40px 0;background:#fff}.ad-box{position:relative;max-width:1100px;margin:0 auto;border-radius:22px;overflow:hidden;box-shadow:0 18px 50px rgba(31,78,140,.25);aspect-ratio:16/7;background:#1f4e8c}
  .ad-slide{position:absolute;inset:0;opacity:0;transition:opacity .8s}.ad-slide.on{opacity:1}.ad-slide img{width:100%;height:100%;object-fit:cover}
  .ad-cap{position:absolute;left:0;right:0;bottom:0;padding:40px 24px 18px;color:#fff;font:600 1.2rem Fredoka,sans-serif;background:linear-gradient(transparent,rgba(0,0,0,.65))}
  .ad-btn{position:absolute;top:50%;transform:translateY(-50%);border:0;width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.9);font-size:22px;cursor:pointer;color:#cf3a3f}.ad-prev{left:14px}.ad-next{right:14px}
  .ad-dots{position:absolute;bottom:10px;right:18px;display:flex;gap:7px}.ad-dots i{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.5);cursor:pointer}.ad-dots i.on{background:#cf3a3f;transform:scale(1.25)}
  @media(max-width:600px){.ad-box{aspect-ratio:4/3;border-radius:14px}.ad-cap{font-size:1rem}}</style>`);
  const sec = document.createElement('section'); sec.className = 'ad-show';
  sec.innerHTML = `<div class="container"><div class="ad-box">${ads.map((a, i) => `<div class="ad-slide${i ? '' : ' on'}"><img alt="School advert"><div class="ad-cap"></div></div>`).join('')}
  <button class="ad-btn ad-prev" aria-label="Previous">‹</button><button class="ad-btn ad-next" aria-label="Next">›</button><div class="ad-dots">${ads.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div></div></div>`;
  const s = sec.querySelectorAll('.ad-slide'), d = sec.querySelectorAll('.ad-dots i');
  ads.forEach((a, i) => { s[i].querySelector('img').src = a.image; const c = s[i].querySelector('.ad-cap'); a.title ? c.textContent = a.title : c.remove(); });
  (document.querySelector('.hero') || document.querySelector('section')).after(sec);
  let n = 0, t;
  const go = k => { s[n].classList.remove('on'); d[n].classList.remove('on'); n = (k + s.length) % s.length; s[n].classList.add('on'); d[n].classList.add('on'); };
  const play = () => { clearInterval(t); t = setInterval(() => go(n + 1), 5000); };
  sec.querySelector('.ad-prev').onclick = () => { go(n - 1); play(); }; sec.querySelector('.ad-next').onclick = () => { go(n + 1); play(); };
  d.forEach((x, i) => x.onclick = () => { go(i); play(); }); play();
})();
