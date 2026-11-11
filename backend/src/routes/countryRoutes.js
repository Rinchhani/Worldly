import express from 'express';
import Country from '../models/Country.js';

const router = express.Router();

// @route   GET /api/countries
// @desc    Get all countries with optional region filter or search
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { region, search } = req.query;
    const filter = {};

    if (region && region !== 'all') {
      filter.region = { $regex: region, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { capital: { $regex: search, $options: 'i' } },
        { region: { $regex: search, $options: 'i' } },
        { 'economy.exports': { $regex: search, $options: 'i' } },
        { resources: { $regex: search, $options: 'i' } },
      ];
    }

    const countries = await Country.find(filter).sort({ name: 1 });

    // Format as dictionary map or list depending on query
    res.json({
      success: true,
      count: countries.length,
      countries,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/countries/:id
// @desc    Get single country dossier by ID (e.g. 'japan', 'brazil')
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const country = await Country.findOne({ id: req.params.id.toLowerCase() });

    if (!country) {
      return res.status(404).json({
        success: false,
        message: `Country with ID '${req.params.id}' not found`,
      });
    }

    res.json({
      success: true,
      country,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

