import mongoose from 'mongoose';

const AppMetadataSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  lastSync: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.models.AppMetadata || mongoose.model('AppMetadata', AppMetadataSchema);
