// ===================================================================
// Peculia Gift Montessori School — Enquiry form
// Every enquiry is saved to the school's database and appears on the
// admin dashboard (Enquiries page), where it can be printed.
// OPTIONAL: if you also want a copy emailed, fill in the three EmailJS
// values below (https://www.emailjs.com). Leave them as they are to skip.
// ===================================================================
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';

document.addEventListener('DOMContentLoaded', () => {
  const emailOn = window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';
  if (emailOn) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  const form = document.getElementById('enquiryForm');
  if (!form) return;
  const msgBox = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');
  const showMessage = (text, type) => { msgBox.textContent = text; msgBox.className = `form-msg show ${type}`; msgBox.scrollIntoView({ behavior: 'smooth', block: 'center' }); };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.website && form.website.value) return; // honeypot
    if (!form.checkValidity()) { form.reportValidity(); return; }

    submitBtn.disabled = true; submitBtn.textContent = 'Sending…';
    const params = {
      parent_name: form.parent_name.value.trim(), child_name: form.child_name.value.trim(),
      email: form.email.value.trim(), phone: form.phone.value.trim(),
      enquiry_type: form.enquiry_type.value, message: form.message.value.trim()
    };
    try {
      const r = await fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...params, website: form.website ? form.website.value : '' }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Could not send');
      if (emailOn) emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params).catch(err => console.warn('EmailJS copy failed', err));
      showMessage("Thank you! Your enquiry has been sent — we'll get back to you shortly.", 'ok');
      form.reset();
    } catch (err) {
      console.error(err);
      showMessage('Sorry, something went wrong sending your enquiry. Please try again, or call/WhatsApp us directly.', 'err');
    }
    submitBtn.disabled = false; submitBtn.textContent = 'Send Enquiry';
  });
});
