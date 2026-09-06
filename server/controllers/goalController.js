import Goal from "../models/Goal.js";
async function getAllGoals(req, res) {
  const userId = req.user?.id;
  const { type, status } = req.query;
  try {
    let query = { userId };
    if (type) query.type = type;
    if (status) query.status = status;
    const goals = await Goal.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, data: goals });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to retrieve goals.",
        error: error.message,
      });
  }
}
async function createGoal(req, res) {
  const userId = req.user?.id;
  const { title, description, type, priority, deadline, status, progress } =
    req.body;
  if (!title || !type) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide title and goal type." });
  }
  try {
    const goalDeadline = deadline
      ? new Date(deadline)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
    const goalProgress = progress !== void 0 ? Number(progress) : 0;
    const goalStatus = goalProgress === 100 ? "completed" : status || "todo";
    const goal = await Goal.create({
      userId,
      title,
      description: description || "",
      type,
      priority: priority || "medium",
      deadline: goalDeadline,
      status: goalStatus,
      progress: goalProgress,
    });
    return res
      .status(201)
      .json({ success: true, message: "Goal created!", data: goal });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to create goal.",
        error: error.message,
      });
  }
}
async function updateGoal(req, res) {
  const userId = req.user?.id;
  const { id } = req.params;
  const { title, description, type, priority, deadline, status, progress } =
    req.body;
  try {
    const goal = await Goal.findOne({ _id: id, userId });
    if (!goal)
      return res
        .status(404)
        .json({ success: false, message: "Goal not found." });
    if (title) goal.title = title;
    if (description !== void 0) goal.description = description;
    if (type) goal.type = type;
    if (priority) goal.priority = priority;
    if (deadline) goal.deadline = new Date(deadline);
    if (progress !== void 0) {
      goal.progress = Number(progress);
      if (goal.progress === 100) {
        goal.status = "completed";
      } else if (goal.progress > 0) {
        goal.status = "in-progress";
      } else {
        goal.status = "todo";
      }
    } else if (status) {
      goal.status = status;
      if (status === "completed") {
        goal.progress = 100;
      } else if (status === "todo") {
        goal.progress = 0;
      }
    }
    await goal.save();
    return res.json({
      success: true,
      message: "Goal updated successfully!",
      data: goal,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to update goal.",
        error: error.message,
      });
  }
}
async function deleteGoal(req, res) {
  const userId = req.user?.id;
  const { id } = req.params;
  try {
    const result = await Goal.findOneAndDelete({ _id: id, userId });
    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Goal not found." });
    return res.json({ success: true, message: "Goal deleted." });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete goal.",
        error: error.message,
      });
  }
}
export { createGoal, deleteGoal, getAllGoals, updateGoal };
