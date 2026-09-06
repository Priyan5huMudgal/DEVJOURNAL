import Resource from "../models/Resource.js";
async function getAllResources(req, res) {
  const userId = req.user?.id;
  const { category, isFavorite, search } = req.query;
  try {
    let query = { userId };
    if (category) query.category = category;
    if (isFavorite === "true") query.isFavorite = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
      ];
    }
    const resources = await Resource.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, data: resources });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to retrieve resources.",
        error: error.message,
      });
  }
}
async function createResource(req, res) {
  const userId = req.user?.id;
  const { title, url, category, isFavorite, notes } = req.body;
  if (!title || !url) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide title and URL." });
  }
  try {
    const resource = await Resource.create({
      userId,
      title,
      url,
      category: category || "General",
      isFavorite: isFavorite || false,
      notes: notes || "",
    });
    return res
      .status(201)
      .json({ success: true, message: "Resource added!", data: resource });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to create resource.",
        error: error.message,
      });
  }
}
async function updateResource(req, res) {
  const userId = req.user?.id;
  const { id } = req.params;
  const { title, url, category, isFavorite, notes } = req.body;
  try {
    const resource = await Resource.findOne({ _id: id, userId });
    if (!resource)
      return res
        .status(404)
        .json({ success: false, message: "Resource not found." });
    if (title) resource.title = title;
    if (url) resource.url = url;
    if (category) resource.category = category;
    if (isFavorite !== void 0) resource.isFavorite = isFavorite;
    if (notes !== void 0) resource.notes = notes;
    await resource.save();
    return res.json({
      success: true,
      message: "Resource updated!",
      data: resource,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to update resource.",
        error: error.message,
      });
  }
}
async function deleteResource(req, res) {
  const userId = req.user?.id;
  const { id } = req.params;
  try {
    const result = await Resource.findOneAndDelete({ _id: id, userId });
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Resource not found." });
    return res.json({ success: true, message: "Resource deleted." });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete resource.",
        error: error.message,
      });
  }
}
export { createResource, deleteResource, getAllResources, updateResource };
