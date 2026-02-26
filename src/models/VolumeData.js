import mongoose from 'mongoose';

const VolumeDataSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  token: {
    type: String,
    required: true,
    enum: ['MON', 'HYPE', 'INX', 'LIT'],
  },
  buy_volume_usd: {
    type: Number,
  },
  sell_volume_usd: {
    type: Number,
  },
  net_buy_volume_usd: {
    type: Number,
  }
}, {
  timestamps: true
});

VolumeDataSchema.index({ date: 1, token: 1 }, { unique: true });

export default mongoose.models.VolumeData || mongoose.model('VolumeData', VolumeDataSchema);
