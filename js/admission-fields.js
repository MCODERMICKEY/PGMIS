// ===================================================================
// ADMISSION FORM FIELDS — mirrors "STUDENT APPLICATION / ADMISSION FORM".
// Edit this ONE file to add/rename fields; the public form, the admin
// viewer, print and download all update automatically.
// type: text | date | tel | email | select | textarea   req: 1 = required
// ===================================================================
const BLOOD = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Not sure'];
const ADMISSION_SECTIONS = [
  { title: 'Child Information', child: 1, fields: [
    { k: 'full_name', l: 'Full Name', req: 1 }, { k: 'dob', l: 'Date of Birth', type: 'date', req: 1 },
    { k: 'gender', l: 'Gender', type: 'select', o: ['Male', 'Female'], req: 1 },
    { k: 'preferred_class', l: 'Preferred Class', type: 'select', o: ['Pre - Level', 'Lower Level', 'Upper Level', 'Junior High Level'], req: 1 },
    { k: 'home_address', l: 'Home Address', full: 1, req: 1 } ] },
  { title: "Mother's Information", fields: [
    { k: 'm_name', l: 'Full Name' }, { k: 'm_phone', l: 'Phone', type: 'tel' }, { k: 'm_occ', l: 'Occupation' } ] },
  { title: "Father's Information", fields: [
    { k: 'f_name', l: 'Full Name' }, { k: 'f_phone', l: 'Phone', type: 'tel' }, { k: 'f_occ', l: 'Occupation' } ] },
  { title: 'Guardian Information (if different from above)', fields: [
    { k: 'g_name', l: 'Guardian Name' }, { k: 'g_rel', l: 'Relationship' }, { k: 'g_phone', l: 'Phone', type: 'tel' },
    { k: 'g_email', l: 'Email', type: 'email' }, { k: 'g_occ', l: 'Occupation' }, { k: 'g_address', l: 'Address' } ] },
  { title: 'Emergency Contact', fields: [
    { k: 'e_name', l: 'Name', req: 1 }, { k: 'e_phone', l: 'Phone', type: 'tel', req: 1 } ] },
  { title: 'Medical Information', fields: [
    { k: 'blood_group', l: 'Blood Group', type: 'select', o: BLOOD }, { k: 'allergies', l: 'Allergies' },
    { k: 'medical_notes', l: 'Medical Notes', full: 1 } ] },
  { title: 'Declaration', fields: [
    { k: 'signature', l: 'Parent / Guardian Signature (type full name)', req: 1 }, { k: 'sign_date', l: 'Date', type: 'date', req: 1 } ] }
];
function admissionFieldHTML(f) {
  const id = 'f_' + f.k, r = f.req ? ' required' : '', t = f.type || 'text';
  let c;
  if (t === 'select') c = `<select id="${id}" name="${f.k}"${r}><option value="">Select</option>${f.o.map(o => `<option>${o}</option>`).join('')}</select>`;
  else c = `<input id="${id}" name="${f.k}" type="${t}"${r}>`;
  return `<div class="field${f.full ? ' full' : ''}"><label for="${id}">${f.l}${f.req ? ' *' : ''}</label>${c}</div>`;
}
