import mongoose, { Schema } from "mongoose";
const GoalSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  type: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  deadline: { type: Date },
  status: { type: String, enum: ["todo", "in-progress", "completed"], default: "todo" },
  progress: { type: Number, default: 0, min: 0, max: 100 }
}, {
  timestamps: true
});
var Goal_default = mongoose.models.Goal || mongoose.model("Goal", GoalSchema);
export {
  Goal_default as default
};
