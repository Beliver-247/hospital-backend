// src/routes/report.routes.js
import { Router } from 'express';
import { 
  generateReport, 
  getReportTypes, 
  getReportStatistics 
} from '../controllers/report.controller.js';

const router = Router();

// GET /api/reports/types - Get available report types
router.get('/types', getReportTypes);

// GET /api/reports/stats - Get report statistics
router.get('/stats', getReportStatistics);

// GET /api/reports/generate - Generate report
router.get('/generate', generateReport);

export default router;