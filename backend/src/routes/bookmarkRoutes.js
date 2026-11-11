import express from 'express';
import Bookmark from '../models/Bookmark.js';
import Country from '../models/Country.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All bookmark routes require authentication
router.use(protect);

// @route   GET /api/bookmarks
// @desc    Get all bookmarked countries for the logged in user
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id }).sort({ createdAt: -1 });
    const countryIds = bookmarks.map((b) => b.countryId);

    // Fetch corresponding country documents
    const countries = await Country.find({ id: { $in: countryIds } });

    res.json({
      success: true,
      count: bookmarks.length,
      countryIds,
      bookmarks,
      countries,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/bookmarks/:countryId
// @desc    Add or toggle bookmark for a country
// @access  Private
router.post('/:countryId', async (req, res, next) => {
  try {
    const countryId = req.params.countryId.toLowerCase();
    const { notes } = req.body;

    const existing = await Bookmark.findOne({
      user: req.user._id,
      countryId,
    });

    if (existing) {
      await Bookmark.deleteOne({ _id: existing._id });
      return res.json({
        success: true,
        action: 'removed',
        message: `Removed ${countryId} from Atlas bookmarks`,
        countryId,
      });
    }

    const bookmark = await Bookmark.create({
      user: req.user._id,
      countryId,
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      action: 'added',
      message: `Saved ${countryId} to Atlas bookmarks`,
      bookmark,
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/bookmarks/:countryId
// @desc    Remove bookmark for a country
// @access  Private
router.delete('/:countryId', async (req, res, next) => {
  try {
    const countryId = req.params.countryId.toLowerCase();

    const result = await Bookmark.findOneAndDelete({
      user: req.user._id,
      countryId,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Bookmark for '${countryId}' not found`,
      });
    }

    res.json({
      success: true,
      message: `Removed ${countryId} from bookmarks`,
      countryId,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

