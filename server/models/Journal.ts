import mongoose, { Schema, Document } from 'mongoose';

export interface IJournal extends Document {
  userId: mongoose.Types.ObjectId | string;
  title: string;
  content: string;
  mood: string; // e.g., 'happy', 'productive', 'focused', 'tired', 'stressed'
  date: Date;
  tags: string[];
  images: string[];
  codeSnippets: {
    language: string;
    code: string;
    title?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const JournalSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  mood: { type: String, required: true, default: 'focused' },
  date: { type: Date, required: true, default: Date.now },
  tags: [{ type: String }],
  images: [{ type: String }],
  codeSnippets: [{
    language: { type: String, required: true },
    code: { type: String, required: true },
    title: { type: String }
  }]
}, {
  timestamps: true
});

export default (mongoose.models.Journal || mongoose.model<IJournal>('Journal', JournalSchema)) as mongoose.Model<IJournal>;
