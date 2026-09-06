import Snippet from "../models/Snippet.js";
async function getAllSnippets(req, res) {
  const userId = req.user?.id;
  const { language, isFavorite, search, tag } = req.query;
  try {
    let query = { userId };
    if (language) query.language = language;
    if (isFavorite === "true") query.isFavorite = true;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }
    const snippets = await Snippet.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, data: snippets });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to retrieve code snippets.",
        error: error.message,
      });
  }
}
async function createSnippet(req, res) {
  const userId = req.user?.id;
  const { title, language, description, code, tags, isFavorite } = req.body;
  if (!title || !code) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Please provide title and code content.",
      });
  }
  try {
    const snippet = await Snippet.create({
      userId,
      title,
      language: language || "typescript",
      description: description || "",
      code,
      tags: tags || [],
      isFavorite: isFavorite || false,
    });
    return res
      .status(201)
      .json({ success: true, message: "Snippet saved!", data: snippet });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to create code snippet.",
        error: error.message,
      });
  }
}
async function updateSnippet(req, res) {
  const userId = req.user?.id;
  const { id } = req.params;
  const { title, language, description, code, tags, isFavorite } = req.body;
  try {
    const snippet = await Snippet.findOne({ _id: id, userId });
    if (!snippet)
      return res
        .status(404)
        .json({ success: false, message: "Code snippet not found." });
    if (title) snippet.title = title;
    if (language) snippet.language = language;
    if (description !== void 0) snippet.description = description;
    if (code) snippet.code = code;
    if (tags) snippet.tags = tags;
    if (isFavorite !== void 0) snippet.isFavorite = isFavorite;
    await snippet.save();
    return res.json({
      success: true,
      message: "Snippet updated!",
      data: snippet,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to update snippet.",
        error: error.message,
      });
  }
}
async function deleteSnippet(req, res) {
  const userId = req.user?.id;
  const { id } = req.params;
  try {
    const result = await Snippet.findOneAndDelete({ _id: id, userId });
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Code snippet not found." });
    return res.json({ success: true, message: "Snippet deleted." });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete snippet.",
        error: error.message,
      });
  }
}
export { createSnippet, deleteSnippet, getAllSnippets, updateSnippet };
