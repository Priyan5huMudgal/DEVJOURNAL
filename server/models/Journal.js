import mongoose, { Schema } from "mongoose";
const JournalSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  mood: { type: String, required: true, default: "focused" },
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
var Journal_default = mongoose.models.Journal || mongoose.model("Journal", JournalSchema);
export {
  Journal_default as default
};
