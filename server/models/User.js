import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema({
  name: { type: String },
  // Made optional to support legacy users who only have fullName
  fullName: { type: String },
  // Legacy
  username: { type: String, sparse: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  passwordHash: { type: String },
  avatar: { type: String, default: "" },
  profileImage: { type: String },
  // Legacy
  bio: { type: String, default: "" },
  preferences: {
    theme: { type: String, default: "midnight-dark" },
    notifications: { type: Boolean, default: true }
  },
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now }
});
var User_default = mongoose.models.User || mongoose.model("User", UserSchema);
export {
  User_default as default
};
