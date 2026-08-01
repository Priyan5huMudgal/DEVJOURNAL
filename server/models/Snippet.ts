import mongoose, { Schema, Document } from 'mongoose';

export interface ISnippet extends Document {
  userId: mongoose.Types.ObjectId | string;
  title: string;
  language: string;
  description?: string;
  code: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SnippetSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  language: { type: String, required: true, default: 'typescript' },
  description: { type: String, default: '' },
  code: { type: String, required: true },
  tags: [{ type: String }],
  isFavorite: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default (mongoose.models.Snippet || mongoose.model<ISnippet>('Snippet', SnippetSchema)) as mongoose.Model<ISnippet>;
