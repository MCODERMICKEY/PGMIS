# Peculia Gift Montessori School — Website

A 4-page website: **Home**, **About**, **Gallery**, and **Contact** (enquiry form).
Colors: white, red (#cf3a3f) and blue (#1f4e8c) — the same red/blue used in the
classic Montessori "number rods," which the design borrows as a recurring motif.

## Files

```
index.html         Home page
about.html          About / mission / programs / team
gallery.html        Photo & video gallery
contact.html        Enquiry form (EmailJS)
css/style.css        All styling
js/main.js            Shared nav / footer behaviour
js/gallery.js          Gallery rendering, filters, lightbox
js/gallery-data.js     <-- the editable list of gallery photos & videos
js/contact.js           EmailJS enquiry form logic
images/logo/            Put logo.png and favicon.svg here
images/gallery/         Put real gallery photos here
```

## 1. Add the school logo

Drop a file named **logo.png** into `images/logo/`. It will automatically
appear in the header and footer of every page. Until then, a simple
placeholder icon is shown.

## 2. Set up the enquiry form (EmailJS)

The Contact page is wired up to send messages using **EmailJS** — a
service that lets a plain HTML page email a form's contents without
needing your own server. To activate it:

1. Create a free account at https://www.emailjs.com
2. Add an **Email Service** (e.g. connect a Gmail address) → copy the **Service ID**
3. Create an **Email Template** containing these variables:
   `{{parent_name}}`, `{{child_name}}`, `{{email}}`, `{{phone}}`, `{{enquiry_type}}`, `{{message}}`
   → copy the **Template ID**
4. Go to **Account → General** → copy your **Public Key**
5. Open `js/contact.js` and paste the three values into these lines near the top:
   ```js
   const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
   const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
   const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
   ```

Until these are filled in, the form will show a friendly message explaining
that it isn't connected yet, instead of failing silently.

## 3. Add gallery photos & videos

This is a simple static website with no database, so photos and videos
are added by hand rather than "uploaded" live by visitors:

1. Save the photo or video file into `images/gallery/`
2. Open `gallery.html` — the **"Add Photos & Videos"** box near the top
   shows the exact code format to copy for a photo, a local video file,
   or an embedded video (e.g. YouTube)
3. Paste the line into `js/gallery-data.js`

## 4. Update placeholder content

Search the site for text in *italics* or marked "placeholder" — mission and
vision statements, staff bios, phone number, email address, opening hours,
and the testimonial quote on the home page. All copy is easy to find and
edit directly inside the `.html` files.

## 5. Confirm the map pin

The map on the Home and Contact pages currently searches for "Housing
Estate, Tarkwa, Ghana." For a pin-accurate location, replace the query in
the map `src` in both files with the school's exact address or Google Maps
share link.

## 6. Publish the site

Any standard web host works (e.g. Netlify, Vercel, GitHub Pages, or a
regular hosting provider) — just upload the whole folder, keeping
`index.html` at the root and the folder structure intact.
