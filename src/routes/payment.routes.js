import { Router } from 'express';
import auth from '../middleware/auth.js';
import * as ctrl from '../controllers/payment.controller.js';

const r = Router();

// all payment routes require authentication
r.use(auth);

r.post('/', ctrl.createPayment);
r.get('/', ctrl.listPayments);
r.get('/:id', ctrl.getPayment);

export default r;
