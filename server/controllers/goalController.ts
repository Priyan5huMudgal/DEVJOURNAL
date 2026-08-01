import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import Goal from '../models/Goal';

export async function getAllGoals(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { type, status } = req.query;

  try {
    let query: any = { userId };
    if (type) query.type = type;
    if (status) query.status = status;

    const goals = await Goal.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, data: goals });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve goals.', error: error.message });
  }
}

export async function createGoal(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { title, description, type, priority, deadline, status, progress } = req.body;

  if (!title || !type) {
    return res.status(400).json({ success: false, message: 'Please provide title and goal type.' });
  }

  try {
    const goalDeadline = deadline ? new Date(deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const goalProgress = progress !== undefined ? Number(progress) : 0;
    const goalStatus = goalProgress === 100 ? 'completed' : (status || 'todo');

    const goal = await Goal.create({
      userId,
      title,
      description: description || '',
      type,
      priority: priority || 'medium',
      deadline: goalDeadline,
      status: goalStatus,
      progress: goalProgress
    });

    return res.status(201).json({ success: true, message: 'Goal created!', data: goal });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to create goal.', error: error.message });
  }
}

export async function updateGoal(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;
  const { title, description, type, priority, deadline, status, progress } = req.body;

  try {
    const goal = await Goal.findOne({ _id: id, userId });
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found.' });

    if (title) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (type) goal.type = type;
    if (priority) goal.priority = priority;
    if (deadline) goal.deadline = new Date(deadline);
    
    if (progress !== undefined) {
      goal.progress = Number(progress);
      if (goal.progress === 100) {
        goal.status = 'completed';
      } else if (goal.progress > 0) {
        goal.status = 'in-progress';
      } else {
        goal.status = 'todo';
      }
    } else if (status) {
      goal.status = status;
      if (status === 'completed') {
        goal.progress = 100;
      } else if (status === 'todo') {
        goal.progress = 0;
      }
    }

    await goal.save();
    return res.json({ success: true, message: 'Goal updated successfully!', data: goal });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update goal.', error: error.message });
  }
}

export async function deleteGoal(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;

  try {
    const result = await Goal.findOneAndDelete({ _id: id, userId });
    if (!result) return res.status(404).json({ success: false, message: 'Goal not found.' });

    return res.json({ success: true, message: 'Goal deleted.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete goal.', error: error.message });
  }
}
