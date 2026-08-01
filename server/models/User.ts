import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  fullName?: string; // Legacy field
  username?: string;
  email: string;
  password?: string; // Legacy field
  passwordHash?: string;
  avatar?: string;
  profileImage?: string; // Legacy field
  bio?: string;
  preferences: {
    theme: string;
    notifications: boolean;
  };
  refreshToken?: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String }, // Made optional to support legacy users who only have fullName
  fullName: { type: String }, // Legacy
  username: { type: String, sparse: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  passwordHash: { type: String },
  avatar: { type: String, default: '' },
  profileImage: { type: String }, // Legacy
  bio: { type: String, default: '' },
  preferences: {
    theme: { type: String, default: 'midnight-dark' },
    notifications: { type: Boolean, default: true }
  },
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default (mongoose.models.User || mongoose.model<IUser>('User', UserSchema)) as mongoose.Model<IUser>;
