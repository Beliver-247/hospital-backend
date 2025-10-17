// src/models/Report.js
import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  reportType: {
    type: String,
    required: true,
    enum: ['patients_list', 'appointments_list', 'appointments_stats']
  },
  filters: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  options: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  recordCount: {
    type: Number,
    default: 0
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for faster queries
ReportSchema.index({ reportType: 1, generatedAt: -1 });
ReportSchema.index({ createdAt: -1 });

export default mongoose.model('Report', ReportSchema);