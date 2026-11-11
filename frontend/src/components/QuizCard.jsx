import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { quizAPI } from '../services/api';

const LOCAL_QUESTIONS = [
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

export default function QuizCard() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState(LOCAL_QUESTIONS);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [streak, setStreak] = useState(user?.streak || 5);
  const [xpGained, setXpGained] = useState(0);

  useEffect(() => {
    if (user?.streak) {
      setStreak(user.streak);
    }
  }, [user]);

  const q = questions[currentQIndex] || LOCAL_QUESTIONS[0];

  async function handleAnswer(opt) {
    setSelectedOptionId(opt.id);

    try {
      // Try submitting to backend API
      const res = await quizAPI.submitAnswer(q.id, opt.id);
      if (res.success) {
        setFeedback({
          correct: res.correct,
          explanation: res.explanation,
        });
        if (res.correct) {
          setXpGained(res.xpGained || 50);
          if (res.streak) setStreak(res.streak);
          else setStreak((s) => s + 1);
        }
        return;
      }
    } catch {
      // Fallback to local evaluation
    }

    setFeedback({ correct: opt.correct, explanation: opt.explanation });
    if (opt.correct) {
      setXpGained(50);
      setStreak((s) => s + 1);
    }
  }

  function handleNextOrReset() {
    setSelectedOptionId(null);
    setFeedback(null);
    setXpGained(0);
    setCurrentQIndex((prev) => (prev + 1) % questions.length);
  }

  return (
    <section className="bg-gradient-to-br from-primary-container to-[#172c4e] text-on-primary rounded-2xl p-5 sm:p-6 shadow-md border border-outline-variant/20 relative overflow-hidden">
      <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-9xl text-white/5 pointer-events-none">quiz</span>

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-label-md bg-secondary text-on-secondary font-bold">DAILY ATLAS QUIZ</span>
            <span className="text-label-md text-secondary-container">{q.round}</span>
          </div>
          <div className="flex items-center gap-1 text-label-md px-2.5 py-1 rounded-lg bg-white/10 text-white backdrop-blur">
            <span>🔥</span>
            <span className="font-bold">{streak} Day Streak</span>
          </div>
        </div>

        {/* Question */}
        <div className="space-y-1">
          <h4 className="text-headline-sm font-bold text-white">{q.question}</h4>
          <p className="text-body-sm text-primary-fixed-dim">{q.hint}</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {q.options.map((opt) => {
            let cls = 'bg-white/10 border-white/15';
            if (selectedOptionId === opt.id) {
              cls = opt.correct ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-red-600 text-white border-red-400';
            }
            return (
              <button
                key={opt.id}
                onClick={() => handleAnswer(opt)}
                disabled={selectedOptionId !== null}
                className={`text-left p-3 rounded-xl hover:bg-white/20 border text-label-lg transition-all active:scale-95 flex items-center justify-between ${cls}`}
              >
                <span>{opt.label}</span>
                <span className="material-symbols-outlined text-[18px]">
                  {selectedOptionId === opt.id ? (opt.correct ? 'check_circle' : 'cancel') : 'radio_button_unchecked'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`p-3 rounded-xl text-body-sm flex items-start justify-between gap-2.5 transition-all ${
            feedback.correct ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-red-100 text-red-900'
          }`}>
            <div className="flex items-start gap-2.5">
              <span className={`material-symbols-outlined text-[22px] shrink-0 ${feedback.correct ? 'text-secondary' : 'text-red-600'}`}>
                {feedback.correct ? 'verified' : 'help'}
              </span>
              <div>
                <strong className={`block text-title-md ${feedback.correct ? 'text-secondary' : 'text-red-700'}`}>
                  {feedback.correct ? `Accurate Answer! (+${xpGained} XP)` : 'Not Quite - Check Atlas Context:'}
                </strong>
                <span>{feedback.explanation}</span>
              </div>
            </div>
            <button
              onClick={handleNextOrReset}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary text-label-md font-semibold hover:bg-secondary transition-colors"
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
