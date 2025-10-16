// src/services/report.service.js
import Patient from '../models/Patient.js';

class ReportService {
  constructor() {
    this.reportTypes = {
      PATIENTS_LIST: 'patients_list',
      // Add more report types here as needed
    };
  }

  async generateReport(type, filters = {}, options = {}) {
    try {
      switch (type) {
        case this.reportTypes.PATIENTS_LIST:
          return await this.generatePatientsList(filters, options);
        // Add more cases for other report types
        default:
          throw new Error(`Unknown report type: ${type}`);
      }
    } catch (error) {
      throw new Error(`Report generation failed: ${error.message}`);
    }
  }

  async generatePatientsList(filters = {}, options = {}) {
    const {
      gender,
      ageRange,
      startDate,
      endDate,
      hasDocuments
    } = filters;

    const {
      format = 'json',
      includeDocuments = false
    } = options;

    // Build query
    let query = {};

    if (gender) {
      query['personal.gender'] = gender;
    }

    if (ageRange) {
      query['personal.age'] = {
        $gte: parseInt(ageRange.min),
        $lte: parseInt(ageRange.max)
      };
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (hasDocuments !== undefined) {
      if (hasDocuments === 'true' || hasDocuments === true) {
        query['documents.0'] = { $exists: true };
      } else {
        query.documents = { $size: 0 };
      }
    }

    // Fetch data without projection first, then transform
    const patients = await Patient.find(query).sort({ createdAt: -1 });

    // Transform the data based on includeDocuments option
    const transformedPatients = patients.map(patient => this.transformPatientData(patient, includeDocuments));

    return this.formatPatientsReport(transformedPatients, format);
  }

  transformPatientData(patient, includeDocuments = false) {
    const transformed = {
      patientId: patient.patientId,
      personal: {
        firstName: patient.personal.firstName,
        lastName: patient.personal.lastName,
        dob: patient.personal.dob,
        age: patient.personal.age,
        gender: patient.personal.gender,
        nic: patient.personal.nic,
        passport: patient.personal.passport
      },
      contact: {
        address: patient.contact.address,
        phone: patient.contact.phone,
        email: patient.contact.email
      },
      medical: {
        history: patient.medical.history,
        allergies: patient.medical.allergies,
        conditions: patient.medical.conditions
      },
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt
    };

    // Only include documents if requested
    if (includeDocuments) {
      transformed.documents = patient.documents;
    }

    return transformed;
  }

  formatPatientsReport(patients, format) {
    switch (format) {
      case 'csv':
        return this.toCSV(patients);
      case 'json':
      default:
        return {
          reportType: 'patients_list',
          generatedAt: new Date().toISOString(),
          totalPatients: patients.length,
          data: patients
        };
    }
  }

  toCSV(patients) {
    if (patients.length === 0) return '';

    const headers = [
      'Patient ID', 'First Name', 'Last Name', 'DOB', 'Age', 'Gender', 
      'NIC', 'Passport', 'Phone', 'Email', 'Address', 
      'Medical Conditions', 'Allergies', 'Created At'
    ];
    
    const rows = patients.map(patient => [
      patient.patientId || '',
      patient.personal.firstName || '',
      patient.personal.lastName || '',
      patient.personal.dob || '',
      patient.personal.age || '',
      patient.personal.gender || '',
      patient.personal.nic || '',
      patient.personal.passport || '',
      patient.contact.phone || '',
      patient.contact.email || '',
      patient.contact.address || '',
      patient.medical.conditions.join('; ') || '',
      patient.medical.allergies.join('; ') || '',
      patient.createdAt ? patient.createdAt.toISOString() : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    return csvContent;
  }

  // Helper method to get available report types
  getAvailableReports() {
    return Object.values(this.reportTypes);
  }

  // New method to get report statistics
  async getReportStats() {
    try {
      const totalPatients = await Patient.countDocuments();
      const patientsWithDocuments = await Patient.countDocuments({ 'documents.0': { $exists: true } });
      const genderStats = await Patient.aggregate([
        {
          $group: {
            _id: '$personal.gender',
            count: { $sum: 1 }
          }
        }
      ]);
      
      const conditionStats = await Patient.aggregate([
        { $unwind: '$medical.conditions' },
        {
          $group: {
            _id: '$medical.conditions',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      return {
        totalPatients,
        patientsWithDocuments,
        genderStats,
        topConditions: conditionStats
      };
    } catch (error) {
      throw new Error(`Failed to get report stats: ${error.message}`);
    }
  }
}

export default new ReportService();