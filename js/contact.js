// ===================================================================
// Peculia Gift Montessori School — Enquiry form (EmailJS)
// ===================================================================
// SETUP — do this once:
//   1. Create a free account at https://www.emailjs.com
//   2. Add an Email Service (e.g. Gmail) -> copy its SERVICE ID
//   3. Create an Email Template with these variables in it:
//        {{parent_name}} {{child_name}} {{email}} {{phone}}
//        {{enquiry_type}} {{message}}
//      -> copy the TEMPLATE ID
//   4. Go to Account > General -> copy your PUBLIC KEY
//   5. Paste all three values into the constants below.
// ===================================================================

const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_abc1234'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xyz9876'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // from Account > General

document.addEventListener('DOMContentLoaded', () => {
  if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const form = document.getElementById('enquiryForm');
  if (!form) return;

  const msgBox = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');

  function showMessage(text, type) {
    msgBox.textContent = text;
    msgBox.className = `form-msg show ${type}`;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Honeypot spam trap — real visitors never fill this hidden field
    if (form.website && form.website.value) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      showMessage(
        'The enquiry form is almost ready — the school just needs to connect its EmailJS account (see the setup notes in js/contact.js) before messages can be delivered.',
        'err'
      );
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const params = {
      parent_name: form.parent_name.value.trim(),
      child_name: form.child_name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      enquiry_type: form.enquiry_type.value,
      message: form.message.value.trim()
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
      .then(() => {
        showMessage("Thank you! Your enquiry has been sent — we'll get back to you shortly.", 'ok');
        form.reset();
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        showMessage('Sorry, something went wrong sending your enquiry. Please try again, or call/WhatsApp us directly.', 'err');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Enquiry';
      });
  });
});
