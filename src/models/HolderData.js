import mongoose from 'mongoose';

const HolderDataSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  token: { type: String, required: true },
  total_holders: { type: Number, required: true },
  holder_growth: { type: Number }
}, { timestamps: true });

// Compound index to ensure unique entries per day per token
HolderDataSchema.index({ date: 1, token: 1 }, { unique: true });

export default mongoose.models.HolderData || mongoose.model('HolderData', HolderDataSchema);
