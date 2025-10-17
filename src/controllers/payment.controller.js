import Payment from '../models/Payment.js';
import User from '../models/User.js';

export async function createPayment(req, res) {
  const { method, amount, card, meta } = req.body;
  if (!method || !amount) return res.status(400).json({ message: 'method and amount required' });

  // For card payments, mask card number if provided
  let cardInfo = undefined;
  if (method === 'card' && card && card.number) {
    const num = String(card.number).replace(/\s+/g, '');
    cardInfo = { last4: num.slice(-4), brand: card.brand || null };
  }

  const p = await Payment.create({ userId: req.user.id, method, amount, card: cardInfo, meta });

  return res.status(201).json(p);
}

export async function listPayments(req, res) {
  const q = { userId: req.user.id };
  const items = await Payment.find(q).sort({ createdAt: -1 }).lean();
  return res.json(items);
}

export async function getPayment(req, res) {
  const id = req.params.id;
  const p = await Payment.findById(id).lean();
  if (!p) return res.status(404).json({ message: 'Not found' });
  if (String(p.userId) !== String(req.user.id)) return res.status(403).json({ message: 'Forbidden' });
  return res.json(p);
}
