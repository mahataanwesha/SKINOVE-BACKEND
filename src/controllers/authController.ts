import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';

export const authUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await (user as any).matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id.toString()),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Seed initial admin
export const seedAdmin = async (req: Request, res: Response) => {
  try {
    const adminExists = await User.findOne({ email: 'admin@skinova.ai' });
    if (adminExists) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@skinova.ai',
      password: 'password123',
      role: 'admin',
    });

    res.status(201).json({
      success: true,
      message: 'Admin seeded successfully',
      data: { email: admin.email, password: 'password123' }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
