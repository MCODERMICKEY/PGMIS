import { sql, init, isAdmin, hash, verify, makeToken, norm } from './_lib.js';
const strong = p => typeof p === 'string' && p.length >= 8;
export default async function handler(req, res) {
  try {
    await init();
    const a = req.query.action, b = req.body || {};
    const [adm] = await sql`SELECT * FROM admin WHERE id=1`;
    if (a === 'login') {
      await new Promise(r => setTimeout(r, 600));
      if (norm(b.username) === norm(adm.username) && verify(b.password, adm.pass)) {
        res.setHeader('Set-Cookie', `adm=${makeToken()}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`);
        return res.json({ ok: true });
      }
      return res.status(401).json({ error: 'Wrong username or password' });
    }
    if (a === 'logout') { res.setHeader('Set-Cookie', 'adm=; HttpOnly; Secure; Path=/; Max-Age=0'); return res.json({ ok: true }); }
    if (a === 'questions') {
      if (norm(b.username) !== norm(adm.username) || !adm.questions) return res.status(404).json({ error: 'No security questions set up for this account.' });
      return res.json({ questions: adm.questions });
    }
    if (a === 'recover') {
      await new Promise(r => setTimeout(r, 800));
      const ok = norm(b.username) === norm(adm.username) && adm.answers && Array.isArray(b.answers) && adm.answers.every((h, i) => verify(norm(b.answers[i]), h));
      if (!ok) return res.status(401).json({ error: 'One or more answers are incorrect.' });
      if (!strong(b.next)) return res.status(400).json({ error: 'New password must be at least 8 characters.' });
      await sql`UPDATE admin SET pass=${hash(b.next)} WHERE id=1`; return res.json({ ok: true });
    }
    if (!isAdmin(req)) return res.status(401).json({ error: 'Not authorised' });
    if (a === 'me') return res.json({ ok: true, username: adm.username, hasQuestions: !!adm.questions, questions: adm.questions });
    if (a === 'apps') return res.json(await sql`SELECT id,data,status,created FROM applications ORDER BY id DESC`);
    if (a === 'status') { await sql`UPDATE applications SET status=${String(b.status).slice(0, 20)} WHERE id=${+b.id}`; return res.json({ ok: true }); }
    if (a === 'delete') { await sql`DELETE FROM applications WHERE id=${+b.id}`; return res.json({ ok: true }); }
    if (a === 'password') {
      if (!verify(b.current, adm.pass)) return res.status(400).json({ error: 'Current password is incorrect.' });
      if (!strong(b.next)) return res.status(400).json({ error: 'New password must be at least 8 characters.' });
      await sql`UPDATE admin SET pass=${hash(b.next)} WHERE id=1`; return res.json({ ok: true });
    }
    if (a === 'setquestions') {
      if (!verify(b.current, adm.pass)) return res.status(400).json({ error: 'Current password is incorrect.' });
      const q = b.questions, an = b.answers;
      if (!Array.isArray(q) || q.length !== 3 || !Array.isArray(an) || an.length !== 3 || q.some(x => !String(x).trim()) || an.some(x => !norm(x))) return res.status(400).json({ error: 'Provide 3 questions and 3 answers.' });
      await sql`UPDATE admin SET questions=${JSON.stringify(q.map(String))}, answers=${JSON.stringify(an.map(x => hash(norm(x))))} WHERE id=1`;
      return res.json({ ok: true });
    }
    res.status(404).json({ error: 'Unknown action' });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
}
