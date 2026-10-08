document.addEventListener('DOMContentLoaded', () => {
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
