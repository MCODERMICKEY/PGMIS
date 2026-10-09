import { sql, init, isAdmin } from './_lib.js';
export default async function handler(req, res) {
  try {
    await init();
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
      return res.json(await sql`SELECT id,title,image FROM adverts ORDER BY id DESC`);
    }
    if (!isAdmin(req)) return res.status(401).json({ error: 'Not authorised' });
    if (req.method === 'POST') {
      const { title = '', image = '' } = req.body || {};
      if (!/^data:image\/(jpeg|png|webp);base64,/.test(image) || image.length > 3.5e6) return res.status(400).json({ error: 'Invalid or too large image' });
      await sql`INSERT INTO adverts(title,image) VALUES(${String(title).slice(0, 120)},${image})`;
      return res.json({ ok: true });
    }
    if (req.method === 'DELETE') { await sql`DELETE FROM adverts WHERE id=${+req.query.id}`; return res.json({ ok: true }); }
    res.status(405).end();
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
}
