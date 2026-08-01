import mongoose, { Schema, Document } from 'mongoose';

export interface ITopic {
  name: string;
  status: 'todo' | 'in-progress' | 'completed';
  order: number;
}

export interface IRoadmap extends Document {
  userId: mongoose.Types.ObjectId | string;
  title: string;
  topics: ITopic[];
  progressPercentage: number;
  estimatedCompletion?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TopicSchema = new Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['todo', 'in-progress', 'completed'], default: 'todo' },
  order: { type: Number, required: true }
});

const RoadmapSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  topics: [TopicSchema],
  progressPercentage: { type: Number, default: 0 },
  estimatedCompletion: { type: Date }
}, {
  timestamps: true
});

export default (mongoose.models.Roadmap || mongoose.model<IRoadmap>('Roadmap', RoadmapSchema)) as mongoose.Model<IRoadmap>;
