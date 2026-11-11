import express from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  validate([
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ]),
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }

      const user = await User.create({
        name,
        email,
        password,
      });

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          xp: user.xp,
          streak: user.streak,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  validate([
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          xp: user.xp,
          streak: user.streak,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current authenticated user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      xp: req.user.xp,
      streak: req.user.streak,
      avatar: req.user.avatar,
      createdAt: req.user.createdAt,
    },
  });
});

// @route   PUT /api/auth/profile
// @desc    Update profile details (name, avatar)
// @access  Private
router.put(
  '/profile',
  protect,
  validate([
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('avatar').optional().trim(),
  ]),
  async (req, res, next) => {
    try {
      const updates = {};
      if (req.body.name) updates.name = req.body.name;
      if (req.body.avatar) updates.avatar = req.body.avatar;

      const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true,
      });

      res.json({
        success: true,
        message: 'Profile updated successfully.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          xp: user.xp,
          streak: user.streak,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

