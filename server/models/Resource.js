import mongoose, { Schema } from "mongoose";
const ResourceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  category: { type: String, required: true, default: "General" },
  isFavorite: { type: Boolean, default: false },
  notes: { type: String, default: "" }
}, {
  timestamps: true
});
var Resource_default = mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);
export {
  Resource_default as default
};
