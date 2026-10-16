import { init, admissionsOpen } from './_lib.js';
export default async function handler(req, res) {
  try { await init(); res.setHeader('Cache-Control', 'no-store'); res.json({ admissions: await admissionsOpen() }); }
  catch (e) { console.error(e); res.json({ admissions: true }); }
}
