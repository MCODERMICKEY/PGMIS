document.addEventListener('DOMContentLoaded', async () => {
  const st = await (window.siteStatus || Promise.resolve({ admissions: true }));
  if (!st.admissions) {
    document.querySelector('.form-card').innerHTML = `<div style="text-align:center;padding:30px 10px"><div style="width:70px;height:70px;border-radius:50%;background:#e8eef8;color:#1f4e8c;display:grid;place-items:center;margin:0 auto 16px"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></div><h2 style="margin:0 0 8px">Admissions are currently closed</h2><p style="color:#6b7a90;max-width:460px;margin:0 auto 22px">We are not accepting online applications at the moment. Please check back soon, or contact the school office and we will gladly help.</p><a href="contact.html" class="btn btn-red">Contact the School</a></div>`;
    return;
  }
  const form = document.getElementById('admForm'), msg = document.getElementById('formMsg'), btn = document.getElementById('submitBtn');
  const sec = s => `<fieldset class="adm-sec"><legend>${s.title}</legend><div class="adm-grid">${s.fields.map(admissionFieldHTML).join('')}</div></fieldset>`;
  const [child, ...rest] = ADMISSION_SECTIONS;
  form.insertAdjacentHTML('afterbegin', `
    <div class="adm-head"><img src="images/logo/Peculia Gift Montessori School.png" alt="" onerror="this.remove()">
      <div><h2>PECULIAR GIFT MONTESSORI SCHOOL</h2><p>Housing Estate, Tarkwa Aboso, Western Region, Ghana · 054 279 6075 / 055 065 9438</p></div>
      <small>Admission No.<br>(assigned on enrollment)</small></div>
    <h3 class="adm-title">STUDENT APPLICATION / ADMISSION FORM</h3>
    <p class="adm-sub">Please complete in full and submit online. Attach a passport photo of the child below.</p>
    <div class="adm-child"><label class="photo-box" id="pbox"><input type="file" accept="image/*" hidden id="pfile"><span>Attach<br>Photo</span></label>${sec(child)}</div>
    <input type="hidden" name="photo" id="photo">${rest.map(sec).join('')}`);
  document.getElementById('f_sign_date').valueAsDate = new Date();
  document.getElementById('pfile').onchange = e => {
    const file = e.target.files[0]; if (!file) return;
    const im = new Image(); im.onload = () => {
      const s = Math.min(1, 360 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = im.width * s; c.height = im.height * s;
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); const d = c.toDataURL('image/jpeg', .8);
      document.getElementById('photo').value = d; document.getElementById('pbox').style.backgroundImage = `url(${d})`; document.getElementById('pbox').classList.add('has');
    }; im.src = URL.createObjectURL(file);
  };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity()) return form.reportValidity();
    if (!['m_phone', 'f_phone', 'g_phone'].some(k => form[k].value.trim())) { form.m_phone.focus(); msg.textContent = 'Please give a phone number for the mother, father or guardian.'; msg.className = 'form-msg show err'; return; }
    btn.disabled = true; btn.textContent = 'Submitting…';
    try {
      const r = await fetch('/api/admission', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      const j = await r.json(); if (!r.ok) throw new Error(j.error);
      msg.textContent = `Thank you! Your application (Ref #${j.id}) has been received. We will contact you shortly.`; msg.className = 'form-msg show ok';
      form.reset(); document.getElementById('pbox').style.backgroundImage = ''; document.getElementById('pbox').classList.remove('has'); document.getElementById('photo').value = ''; document.getElementById('f_sign_date').valueAsDate = new Date();
    } catch (err) { msg.textContent = err.message || 'Something went wrong. Please try again or call us.'; msg.className = 'form-msg show err'; }
    btn.disabled = false; btn.textContent = 'Submit Application'; msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
