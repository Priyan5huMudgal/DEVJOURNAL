import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import Journal from '../models/Journal';

export async function getAllEntries(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { search, tag, mood, sort } = req.query;

  try {
    let query: any = { userId };
    
    if (search) {
      query.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { content: { $regex: search as string, $options: 'i' } }
      ];
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    if (mood) {
      query.mood = mood;
    }

    let entries = Journal.find(query);
    
    if (sort === 'oldest') {
      entries = entries.sort({ date: 1 });
    } else {
      entries = entries.sort({ date: -1 });
    }

    const results = await entries;
    return res.json({ success: true, data: results });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve journal entries.', error: error.message });
  }
}

export async function createEntry(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { title, content, mood, date, tags, images, codeSnippets } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Please provide title and content.' });
  }

  try {
    const entryDate = date ? new Date(date) : new Date();
    const entry = await Journal.create({
      userId,
      title,
      content,
      mood: mood || 'focused',
      date: entryDate,
      tags: tags || [],
      images: images || [],
      codeSnippets: codeSnippets || []
    });

    return res.status(201).json({ success: true, message: 'Journal entry created!', data: entry });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to create journal entry.', error: error.message });
  }
}

export async function updateEntry(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;
  const { title, content, mood, date, tags, images, codeSnippets } = req.body;

  try {
    const entry = await Journal.findOne({ _id: id, userId });
    
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Journal entry not found.' });
    }

    if (title) entry.title = title;
    if (content) entry.content = content;
    if (mood) entry.mood = mood;
    if (date) entry.date = new Date(date);
    if (tags) entry.tags = tags;
    if (images) entry.images = images;
    if (codeSnippets) entry.codeSnippets = codeSnippets;

    await entry.save();
    return res.json({ success: true, message: 'Journal entry updated successfully!', data: entry });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update journal entry.', error: error.message });
  }
}

export async function deleteEntry(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;

  try {
    const result = await Journal.findOneAndDelete({ _id: id, userId });
    if (!result) {
      return res.status(404).json({ success: false, message: 'Journal entry not found.' });
    }
    return res.json({ success: true, message: 'Journal entry deleted.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete journal entry.', error: error.message });
  }
}
