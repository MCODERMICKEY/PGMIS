# Deploying on Vercel (with Neon Postgres)

1. Push this folder to GitHub and import it into Vercel.
2. Vercel project -> **Storage -> Create -> Neon (Postgres)**. This adds `DATABASE_URL` automatically.
3. Project -> **Settings -> Environment Variables**, add:
   - `AUTH_SECRET`  = a long random string (e.g. `openssl rand -hex 32`)
   - `ADMIN_USERNAME` = admin (or your choice)
   - `ADMIN_INITIAL_PASSWORD` = a temporary password
4. Redeploy. Tables are created automatically on first request.
5. Open `/admin/`, sign in, **change the password** and **set 3 security questions** (Settings).

Pages: `/admission.html` (public form) • `/admin/` (dashboard).
To match the real paper form, edit only `js/admission-fields.js`.
Local testing: `npm i -g vercel && npm i && vercel dev`.
