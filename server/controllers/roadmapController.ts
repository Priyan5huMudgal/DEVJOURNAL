import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import Roadmap from '../models/Roadmap';

// Helper to calculate progress percentage
function calculateProgress(topics: any[]): number {
  if (!topics || topics.length === 0) return 0;
  const completedCount = topics.filter(t => t.status === 'completed').length;
  return Math.round((completedCount / topics.length) * 100);
}

export async function getAllRoadmaps(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;

  try {
    const roadmaps = await Roadmap.find({ userId }).sort({ createdAt: -1 });
    return res.json({ success: true, data: roadmaps });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve roadmaps.', error: error.message });
  }
}

export async function createRoadmap(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { title, topics, estimatedCompletion } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Please provide a roadmap title.' });
  }

  try {
    const formattedTopics = (topics || []).map((t: any, index: number) => ({
      name: t.name,
      status: t.status || 'todo',
      order: t.order || index + 1
    }));
    const progressPercentage = calculateProgress(formattedTopics);
    const estComp = estimatedCompletion ? new Date(estimatedCompletion) : undefined;

    const roadmap = await Roadmap.create({
      userId,
      title,
      topics: formattedTopics,
      progressPercentage,
      estimatedCompletion: estComp
    });
    
    return res.status(201).json({ success: true, message: 'Roadmap created successfully!', data: roadmap });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to create roadmap.', error: error.message });
  }
}

export async function updateRoadmap(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;
  const { title, topics, estimatedCompletion } = req.body;

  try {
    const roadmap = await Roadmap.findOne({ _id: id, userId });
    
    if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found.' });

    if (title) roadmap.title = title;
    if (estimatedCompletion) roadmap.estimatedCompletion = new Date(estimatedCompletion);
    
    if (topics) {
      roadmap.topics = topics.map((t: any, index: number) => ({
        name: t.name,
        status: t.status || 'todo',
        order: t.order || index + 1
      }));
      roadmap.progressPercentage = calculateProgress(roadmap.topics);
    }

    await roadmap.save();
    return res.json({ success: true, message: 'Roadmap updated successfully!', data: roadmap });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update roadmap.', error: error.message });
  }
}

export async function updateTopicStatus(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { id, topicIndex } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Please provide the topic status.' });
  }

  try {
    const roadmap = await Roadmap.findOne({ _id: id, userId });
    
    if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found.' });

    const index = parseInt(topicIndex);
    if (isNaN(index) || index < 0 || index >= roadmap.topics.length) {
      return res.status(400).json({ success: false, message: 'Invalid topic index.' });
    }

    roadmap.topics[index].status = status;
    roadmap.progressPercentage = calculateProgress(roadmap.topics);
    
    await roadmap.save();
    return res.json({ success: true, message: 'Topic status updated!', data: roadmap });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update topic status.', error: error.message });
  }
}

export async function deleteRoadmap(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;

  try {
    const result = await Roadmap.findOneAndDelete({ _id: id, userId });
    if (!result) return res.status(404).json({ success: false, message: 'Roadmap not found.' });
    
    return res.json({ success: true, message: 'Roadmap deleted.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete roadmap.', error: error.message });
  }
}
