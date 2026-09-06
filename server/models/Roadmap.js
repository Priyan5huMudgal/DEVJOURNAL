import mongoose, { Schema } from "mongoose";
const TopicSchema = new Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ["todo", "in-progress", "completed"], default: "todo" },
  order: { type: Number, required: true }
});
const RoadmapSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  topics: [TopicSchema],
  progressPercentage: { type: Number, default: 0 },
  estimatedCompletion: { type: Date }
}, {
  timestamps: true
});
var Roadmap_default = mongoose.models.Roadmap || mongoose.model("Roadmap", RoadmapSchema);
export {
  Roadmap_default as default
};
