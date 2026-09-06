import mongoose, { Schema } from "mongoose";
const SnippetSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  language: { type: String, required: true, default: "typescript" },
  description: { type: String, default: "" },
  code: { type: String, required: true },
  tags: [{ type: String }],
  isFavorite: { type: Boolean, default: false }
}, {
  timestamps: true
});
var Snippet_default = mongoose.models.Snippet || mongoose.model("Snippet", SnippetSchema);
export {
  Snippet_default as default
};
