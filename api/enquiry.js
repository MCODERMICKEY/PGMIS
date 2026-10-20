import { sql, init } from './_lib.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    await init();
    const d = req.body || {};
    if (d.website) return res.json({ ok: true }); // honeypot
    const c = {};
    for (const k of ['parent_name', 'child_name', 'email', 'phone', 'enquiry_type', 'message']) c[k] = String(d[k] || '').trim().slice(0, k === 'message' ? 3000 : 200);
    if (!c.parent_name || !c.message || (!c.email && !c.phone)) return res.status(400).json({ error: 'Please fill in your name, a phone or email, and your message.' });
    const r = await sql`INSERT INTO enquiries(data) VALUES(${JSON.stringify(c)}) RETURNING id`;
    res.json({ ok: true, id: r[0].id });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Could not save your enquiry. Please try again.' }); }
}
