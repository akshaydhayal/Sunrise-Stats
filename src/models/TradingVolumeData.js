import mongoose from 'mongoose';

const TradingVolumeDataSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  token: {
    type: String,
    required: true,
    enum: ['MON', 'HYPE', 'INX', 'LIT'],
  },
  dex_volume: {
    type: Number,
  },
  cex_volume: {
    type: Number,
  },
  cex_price: {
    type: Number,
  }
}, {
  timestamps: true
});

// Compound index to ensure unique entries per day per token
TradingVolumeDataSchema.index({ date: 1, token: 1 }, { unique: true });

export default mongoose.models.TradingVolumeData || mongoose.model('TradingVolumeData', TradingVolumeDataSchema);
