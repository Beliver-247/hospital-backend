// src/controllers/report.controller.js
import reportService from '../services/report.service.js';

export const generateReport = async (req, res, next) => {
  try {
    const { type, format = 'json', includeDocuments, ...filters } = req.query;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Report type is required'
      });
    }

    // Parse boolean parameters
    const options = {
      format,
      includeDocuments: includeDocuments === 'true' || includeDocuments === true
    };

    // Parse age range if provided
    if (filters.ageRange) {
      if (typeof filters.ageRange === 'object') {
        // Already parsed by express if sent as ageRange[min]=18&ageRange[max]=65
        filters.ageRange = {
          min: parseInt(filters.ageRange.min) || 0,
          max: parseInt(filters.ageRange.max) || 100
        };
      }
    }

    const result = await reportService.generateReport(type, filters, options);

    // Set appropriate headers based on format
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${type}_${Date.now()}.csv"`);
      return res.send(result);
    }

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};

export const getReportTypes = async (req, res, next) => {
  try {
    const reportTypes = reportService.getAvailableReports();
    
    res.json({
      success: true,
      data: reportTypes
    });
  } catch (error) {
    next(error);
  }
};

export const getReportStatistics = async (req, res, next) => {
  try {
    const stats = await reportService.getReportStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};