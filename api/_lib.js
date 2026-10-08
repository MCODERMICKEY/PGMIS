import { neon } from '@neondatabase/serverless';
import crypto from 'node:crypto';
export const sql = neon(process.env.DATABASE_URL);
const SECRET = process.env.AUTH_SECRET || '';
export const hash = p => { const s = crypto.randomBytes(16).toString('hex'); return s + ':' + crypto.scryptSync(p, s, 64).toString('hex'); };
export const verify = (p, h) => { if (!h) return false; const [s, k] = h.split(':'); const a = Buffer.from(k, 'hex'), b = crypto.scryptSync(String(p || ''), s, 64); return a.length === b.length && crypto.timingSafeEqual(a, b); };
const hm = b => crypto.createHmac('sha256', SECRET).update(b).digest('base64url');
export const makeToken = () => { const b = Buffer.from(JSON.stringify({ exp: Date.now() + 8 * 36e5 })).toString('base64url'); return b + '.' + hm(b); };
export function isAdmin(req) {
  const m = /(?:^|; )adm=([^;]+)/.exec(req.headers.cookie || ''); if (!m || !SECRET) return false;
  const [b, s] = m[1].split('.'); if (!b || !s || s.length !== hm(b).length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(s), Buffer.from(hm(b)))) return false;
  return JSON.parse(Buffer.from(b, 'base64url')).exp > Date.now();
}
let ready;
export const init = () => ready ||= (async () => {
  await sql`CREATE TABLE IF NOT EXISTS admin(id INT PRIMARY KEY, username TEXT, pass TEXT, questions JSONB, answers JSONB)`;
  await sql`CREATE TABLE IF NOT EXISTS applications(id SERIAL PRIMARY KEY, data JSONB, status TEXT DEFAULT 'New', created TIMESTAMPTZ DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS adverts(id SERIAL PRIMARY KEY, title TEXT, image TEXT, created TIMESTAMPTZ DEFAULT now())`;
  if (!(await sql`SELECT 1 FROM admin WHERE id=1`).length)
    await sql`INSERT INTO admin(id,username,pass) VALUES(1,${process.env.ADMIN_USERNAME || 'admin'},${hash(process.env.ADMIN_INITIAL_PASSWORD || 'ChangeMe123!')})`;
})();
export const norm = a => String(a || '').trim().toLowerCase();
