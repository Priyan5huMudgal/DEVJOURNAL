import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import Resource from '../models/Resource';

export async function getAllResources(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { category, isFavorite, search } = req.query;

  try {
    let query: any = { userId };
    
    if (category) query.category = category;
    if (isFavorite === 'true') query.isFavorite = true;
    
    if (search) {
      query.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { notes: { $regex: search as string, $options: 'i' } }
      ];
    }

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, data: resources });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve resources.', error: error.message });
  }
}

export async function createResource(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { title, url, category, isFavorite, notes } = req.body;

  if (!title || !url) {
    return res.status(400).json({ success: false, message: 'Please provide title and URL.' });
  }

  try {
    const resource = await Resource.create({
      userId,
      title,
      url,
      category: category || 'General',
      isFavorite: isFavorite || false,
      notes: notes || ''
    });
    
    return res.status(201).json({ success: true, message: 'Resource added!', data: resource });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to create resource.', error: error.message });
  }
}

export async function updateResource(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;
  const { title, url, category, isFavorite, notes } = req.body;

  try {
    const resource = await Resource.findOne({ _id: id, userId });
    
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found.' });

    if (title) resource.title = title;
    if (url) resource.url = url;
    if (category) resource.category = category;
    if (isFavorite !== undefined) resource.isFavorite = isFavorite;
    if (notes !== undefined) resource.notes = notes;

    await resource.save();
    return res.json({ success: true, message: 'Resource updated!', data: resource });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update resource.', error: error.message });
  }
}

export async function deleteResource(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;

  try {
    const result = await Resource.findOneAndDelete({ _id: id, userId });
    if (!result) return res.status(404).json({ success: false, message: 'Resource not found.' });
    
    return res.json({ success: true, message: 'Resource deleted.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete resource.', error: error.message });
  }
}
