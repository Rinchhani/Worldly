import express from 'express';
import { body, param, query } from 'express-validator';
import Task from '../models/Task.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// All task routes require authentication
router.use(protect);

// @route   GET /api/tasks
// @desc    Retrieve all tasks for the logged in user
// @access  Private
router.get(
  '/',
  validate([
    query('status').optional().isIn(['pending', 'in_progress', 'completed']),
    query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    query('countryId').optional().trim(),
    query('search').optional().trim(),
  ]),
  async (req, res, next) => {
    try {
      const { status, priority, countryId, search } = req.query;

      const filter = { user: req.user._id };

      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (countryId) filter.countryId = countryId.toLowerCase();
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      const tasks = await Task.find(filter).sort({ createdAt: -1 });

      res.json({
        success: true,
        count: tasks.length,
        tasks,
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   GET /api/tasks/:id
// @desc    Retrieve a single task by ID
// @access  Private
router.get(
  '/:id',
  validate([param('id').isMongoId().withMessage('Invalid task ID format')]),
  async (req, res, next) => {
    try {
      const task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found or access denied',
        });
      }

      res.json({
        success: true,
        task,
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   POST /api/tasks
// @desc    Create a new task / research expedition
// @access  Private
router.post(
  '/',
  validate([
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }),
    body('description').optional().trim().isLength({ max: 1000 }),
    body('countryId').optional().trim(),
    body('category').optional().isIn(['research', 'economic_analysis', 'demographic_study', 'field_trip', 'general']),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    body('status').optional().isIn(['pending', 'in_progress', 'completed']),
    body('dueDate').optional({ nullable: true }).isISO8601().toDate(),
  ]),
  async (req, res, next) => {
    try {
      const { title, description, countryId, category, priority, status, dueDate } = req.body;

      const task = await Task.create({
        user: req.user._id,
        title,
        description: description || '',
        countryId: countryId ? countryId.toLowerCase() : '',
        category: category || 'research',
        priority: priority || 'medium',
        status: status || 'pending',
        dueDate: dueDate || null,
      });

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        task,
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   PUT /api/tasks/:id
// @desc    Update an existing task
// @access  Private
router.put(
  '/:id',
  validate([
    param('id').isMongoId().withMessage('Invalid task ID format'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 100 }),
    body('description').optional().trim().isLength({ max: 1000 }),
    body('countryId').optional().trim(),
    body('category').optional().isIn(['research', 'economic_analysis', 'demographic_study', 'field_trip', 'general']),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    body('status').optional().isIn(['pending', 'in_progress', 'completed']),
    body('dueDate').optional({ nullable: true }),
  ]),
  async (req, res, next) => {
    try {
      const task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found or access denied',
        });
      }

      // Fields to update
      const fields = ['title', 'description', 'countryId', 'category', 'priority', 'status', 'dueDate'];
      fields.forEach((field) => {
        if (req.body[field] !== undefined) {
          if (field === 'countryId' && req.body[field]) {
            task[field] = req.body[field].toLowerCase();
          } else {
            task[field] = req.body[field];
          }
        }
      });

      await task.save();

      res.json({
        success: true,
        message: 'Task updated successfully',
        task,
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete(
  '/:id',
  validate([param('id').isMongoId().withMessage('Invalid task ID format')]),
  async (req, res, next) => {
    try {
      const task = await Task.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found or access denied',
        });
      }

      res.json({
        success: true,
        message: 'Task deleted successfully',
        deletedTaskId: req.params.id,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

