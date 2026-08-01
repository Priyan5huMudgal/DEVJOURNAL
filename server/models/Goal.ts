import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  userId: mongoose.Types.ObjectId | string;
  title: string;
  description?: string;
  type: 'daily' | 'weekly' | 'monthly';
  priority: 'low' | 'medium' | 'high';
  deadline?: Date;
  status: 'todo' | 'in-progress' | 'completed';
  progress: number; // 0 to 100
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  deadline: { type: Date },
  status: { type: String, enum: ['todo', 'in-progress', 'completed'], default: 'todo' },
  progress: { type: Number, default: 0, min: 0, max: 100 }
}, {
  timestamps: true
});

export default (mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema)) as mongoose.Model<IGoal>;
