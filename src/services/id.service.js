import Counter from '../models/Counter.js';

export async function nextPatientId() {
  const year = new Date().getFullYear();
  const key = `patient-${year}`;
  const doc = await Counter.findOneAndUpdate({ key }, { $inc: { seq: 1 } }, { new: true, upsert: true });
  const n = String(doc.seq).padStart(6, '0');
  return `PAT-${year}-${n}`;
}
