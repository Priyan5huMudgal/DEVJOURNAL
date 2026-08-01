import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import Snippet from '../models/Snippet';

export async function getAllSnippets(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { language, isFavorite, search, tag } = req.query;

  try {
    let query: any = { userId };
    
    if (language) query.language = language;
    if (isFavorite === 'true') query.isFavorite = true;
    if (tag) query.tags = tag;
    
    if (search) {
      query.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
        { code: { $regex: search as string, $options: 'i' } }
      ];
    }

    const snippets = await Snippet.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, data: snippets });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve code snippets.', error: error.message });
  }
}

export async function createSnippet(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { title, language, description, code, tags, isFavorite } = req.body;

  if (!title || !code) {
    return res.status(400).json({ success: false, message: 'Please provide title and code content.' });
  }

  try {
    const snippet = await Snippet.create({
      userId,
      title,
      language: language || 'typescript',
      description: description || '',
      code,
      tags: tags || [],
      isFavorite: isFavorite || false
    });
    
    return res.status(201).json({ success: true, message: 'Snippet saved!', data: snippet });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to create code snippet.', error: error.message });
  }
}

export async function updateSnippet(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;
  const { title, language, description, code, tags, isFavorite } = req.body;

  try {
    const snippet = await Snippet.findOne({ _id: id, userId });
    
    if (!snippet) return res.status(404).json({ success: false, message: 'Code snippet not found.' });

    if (title) snippet.title = title;
    if (language) snippet.language = language;
    if (description !== undefined) snippet.description = description;
    if (code) snippet.code = code;
    if (tags) snippet.tags = tags;
    if (isFavorite !== undefined) snippet.isFavorite = isFavorite;

    await snippet.save();
    return res.json({ success: true, message: 'Snippet updated!', data: snippet });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update snippet.', error: error.message });
  }
}

export async function deleteSnippet(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;

  try {
    const result = await Snippet.findOneAndDelete({ _id: id, userId });
    if (!result) return res.status(404).json({ success: false, message: 'Code snippet not found.' });
    
    return res.json({ success: true, message: 'Snippet deleted.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete snippet.', error: error.message });
  }
}
