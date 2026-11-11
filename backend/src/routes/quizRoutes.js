import express from 'express';
import { optionalAuth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

const QUESTIONS = [
  {
    id: 'q1',
    round: '#Round 412',
    question: "Which country reigns as the world's leading exporter of copper?",
    hint: 'Mining economics & global raw industrial commodity trade.',
    options: [
      { id: 'a', label: 'A) 🇦🇺 Australia', correct: false, explanation: 'Australia accounts for massive iron ore, but ranks 5th in copper output.' },
      { id: 'b', label: 'B) 🇨🇱 Chile', correct: true, explanation: 'Correct! Chile commands over 28% of entire global copper output with giants like Escondida.' },
      { id: 'c', label: 'C) 🇵🇪 Peru', correct: false, explanation: "Peru is currently the world's second-largest copper producer, trailing closely behind Chile." },
      { id: 'd', label: 'D) 🇿🇲 Zambia', correct: false, explanation: 'Zambia holds legendary copperbelt reserves in Central Africa, but ranks 8th globally.' },
    ],
  },
  {
    id: 'q2',
    round: '#Round 413',
    question: 'Which nation contains more natural lakes than the rest of the world combined?',
    hint: 'Glaciated freshwater hydrology & northern biomes.',
    options: [
      { id: 'a', label: 'A) 🇷🇺 Russia', correct: false, explanation: 'Russia holds Lake Baikal (deepest), but not the highest count of natural lakes.' },
      { id: 'b', label: 'B) 🇨🇦 Canada', correct: true, explanation: 'Spot on! Canada is home to over 2 million lakes, covering ~9% of its total surface area.' },
      { id: 'c', label: 'C) 🇫🇮 Finland', correct: false, explanation: 'Known as the Land of a Thousand Lakes (~188k lakes), yet surpassed by Canada by sheer volume.' },
      { id: 'd', label: 'D) 🇺🇸 United States', correct: false, explanation: 'The US has vast reservoirs and the Great Lakes, but fewer total natural lakes than Canada.' },
    ],
  },
  {
    id: 'q3',
    round: '#Round 414',
    question: 'Which nation spans 12 distinct official time zones due to its global overseas territories?',
    hint: 'Global maritime history & archipelagic sovereignty.',
    options: [
      { id: 'a', label: 'A) 🇷🇺 Russia', correct: false, explanation: 'Russia spans 11 contiguous time zones across Eurasia, but France spans 12 with territories.' },
      { id: 'b', label: 'B) 🇫🇷 France', correct: true, explanation: 'Correct! France holds territories across the Pacific, Indian, and Atlantic oceans totaling 12 time zones.' },
      { id: 'c', label: 'C) 🇬🇧 United Kingdom', correct: false, explanation: 'The UK holds 9 overseas territory time zones, trailing France.' },
      { id: 'd', label: 'D) 🇺🇸 United States', correct: false, explanation: 'The US spans 11 time zones including island territories in the Pacific and Caribbean.' },
    ],
  },
];

// @route   GET /api/quiz/daily
// @desc    Get current daily questions
// @access  Public
router.get('/daily', (req, res) => {
  // Hide correct answers from client payload
  const sanitized = QUESTIONS.map((q) => ({
    id: q.id,
    round: q.round,
    question: q.question,
    hint: q.hint,
    options: q.options.map((o) => ({ id: o.id, label: o.label })),
  }));

  res.json({
    success: true,
    count: sanitized.length,
    questions: sanitized,
  });
});

// @route   POST /api/quiz/answer
// @desc    Verify answer and optionally reward XP
// @access  Public (tracks user if logged in)
router.post('/answer', optionalAuth, async (req, res, next) => {
  try {
    const { questionId, optionId } = req.body;

    const question = QUESTIONS.find((q) => q.id === questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const option = question.options.find((o) => o.id === optionId);
    if (!option) {
      return res.status(400).json({ success: false, message: 'Invalid option selected' });
    }

    let xpGained = 0;
    let newStreak = null;

    if (option.correct && req.user) {
      xpGained = 50;
      req.user.xp = (req.user.xp || 0) + xpGained;
      req.user.streak = (req.user.streak || 0) + 1;
      await req.user.save();
      newStreak = req.user.streak;
    }

    res.json({
      success: true,
      correct: option.correct,
      explanation: option.explanation,
      xpGained,
      streak: newStreak,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

