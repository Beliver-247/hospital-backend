// src/routes/index.js
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import patientRoutes from './patient.routes.js';
import uploadRoutes from './upload.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ ok: true, service: 'hospital-backend', ts: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/uploads', uploadRoutes); // <-- add this

export default router;
