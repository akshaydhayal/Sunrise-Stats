import mongoose from 'mongoose';

const AssetDataSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  token: {
    type: String,
    required: true,
    enum: ['MON', 'HYPE', 'INX', 'LIT'], // The 4 main assets supported currently
  },
  marketcap: {
    type: Number,
  },
  price: {
    type: Number,
  },
  total_supply: {
    type: Number,
  }
}, {
  timestamps: true
});

// Create a compound unique index so we don't store duplicate data for the same token on the same day
AssetDataSchema.index({ date: 1, token: 1 }, { unique: true });

export default mongoose.models.AssetData || mongoose.model('AssetData', AssetDataSchema);
