import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		method: { type: String, enum: ['card', 'cash', 'insurance'], required: true },
		amount: { type: Number, required: true },
		status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
		// card info - only store masked number and brand
		card: {
			brand: { type: String },
			last4: { type: String },
		},
		meta: { type: Object },
	},
	{ timestamps: true }
);

export default mongoose.model('Payment', PaymentSchema);
