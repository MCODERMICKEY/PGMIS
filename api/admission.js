import { sql, init } from './_lib.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    await init();
    const d = req.body || {};
    if (d.website) return res.json({ ok: true });
    const clean = {};
    for (const [k, v] of Object.entries(d)) if (k !== 'website') clean[String(k).slice(0, 40)] = k === 'photo' ? (/^data:image\/jpeg;base64,/.test(v) && v.length < 250000 ? v : '') : String(v).slice(0, 2000);
    if (!clean.full_name || !clean.dob || !clean.preferred_class || !clean.e_phone || !clean.signature) return res.status(400).json({ error: 'Please complete all required fields.' });
    const r = await sql`INSERT INTO applications(data) VALUES(${JSON.stringify(clean)}) RETURNING id`;
    res.json({ ok: true, id: r[0].id });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Could not save your application. Please try again.' }); }
}
