import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-jwt-key';

// Helper to sign tokens
function generateTokens(user: { id: string; email: string }) {
  const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
  const refreshToken = jwt.sign({ id: user.id, email: user.email }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

export async function register(req: AuthenticatedRequest, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      preferences: { theme: 'midnight-dark', notifications: true }
    });

    const { accessToken, refreshToken } = generateTokens({ id: user._id.toString(), email: user.email });
    
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        user: {
          id: user._id.toString(),
          name: user.name || user.fullName || 'Unknown',
          email: user.email,
          avatar: user.avatar || user.profileImage || '',
          bio: user.bio,
          preferences: user.preferences
        },
        accessToken
      }
    });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
}

export async function login(req: AuthenticatedRequest, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password.' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const hashToCompare = user.passwordHash || user.password;
    if (!hashToCompare) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, hashToCompare);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const { accessToken, refreshToken } = generateTokens({ id: user._id.toString(), email: user.email });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });

    return res.json({
      success: true,
      message: 'Login successful!',
      data: {
        user: {
          id: user._id.toString(),
          name: user.name || user.fullName || 'Unknown',
          email: user.email,
          avatar: user.avatar || user.profileImage || '',
          bio: user.bio,
          preferences: user.preferences
        },
        accessToken
      }
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
}

export async function logout(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  try {
    if (userId) {
      await User.findByIdAndUpdate(userId, { refreshToken: '' });
    }
    res.clearCookie('refreshToken');
    return res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error: any) {
    console.error('Logout Error:', error);
    return res.status(500).json({ success: false, message: 'Error during logout.', error: error.message });
  }
}

export async function getProfile(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    
    return res.json({
      success: true,
      data: {
        id: user._id.toString(),
        name: user.name || user.fullName || 'Unknown',
        email: user.email,
        avatar: user.avatar || user.profileImage || '',
        bio: user.bio,
        preferences: user.preferences
      }
    });
  } catch (error: any) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching profile.', error: error.message });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { name, bio, preferences, avatar } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    return res.json({
      success: true,
      data: {
        id: user._id.toString(),
        name: user.name || user.fullName || 'Unknown',
        email: user.email,
        avatar: user.avatar || user.profileImage || '',
        bio: user.bio,
        preferences: user.preferences
      }
    });
  } catch (error: any) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Error updating profile.', error: error.message });
  }
}

export async function changePassword(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Please provide current and new passwords.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const hashToCompare = user.passwordHash || user.password;
    if (!hashToCompare) {
      return res.status(401).json({ success: false, message: 'Invalid current password.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, hashToCompare);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid current password.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
}
