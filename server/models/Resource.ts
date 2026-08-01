import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  userId: mongoose.Types.ObjectId | string;
  title: string;
  url: string;
  category: string; // e.g., 'DSA', 'React', 'Node', 'System Design', 'AI'
  isFavorite: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  category: { type: String, required: true, default: 'General' },
  isFavorite: { type: Boolean, default: false },
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

export default (mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema)) as mongoose.Model<IResource>;
