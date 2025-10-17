import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['DOCTOR', 'STAFF', 'PATIENT'], required: true },
    name: { type: String, default: '' },
    // NEW FIELD ↓
    doctorType: {
      type: String,
      enum: [
        'Cardiologist',
        'Pediatric',
        'Dermatologist',
        'Orthopedic',
        'Neurologist',
        'Opthalmologist',
        'Outpatient Department (OPD)'
      ],
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
