import { Link } from 'react-router-dom';
import QuizCard from '../components/QuizCard';

export default function QuizPage() {
  return (
    <main className="max-w-7xl mx-auto px-gutter-mobile md:px-gutter pt-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
        <div>
          <span className="text-label-md text-secondary font-bold tracking-wider">CHALLENGE ARENA</span>
          <h1 className="text-[28px] md:text-headline-lg font-bold text-on-surface">Daily Cartography &amp; Geo Quiz</h1>
          <p className="text-body-sm text-on-surface-variant">Test your knowledge of commodities, capitals, geography, and global geopolitics.</p>
        </div>
        <Link
          to="/"
          className="self-start sm:self-center flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface hover:bg-surface-container-high transition-all text-label-md font-semibold"
        >
          <span className="material-symbols-outlined text-[18px]">public</span>
          <span>Back to Global Atlas</span>
        </Link>
      </div>

      {/* Main Quiz Widget */}
      <QuizCard />

      {/* Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-1">
          <div className="flex items-center gap-2 text-secondary font-bold text-label-md">
            <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
            <span>Level 4 Cartographer</span>
          </div>
          <p className="text-body-sm text-on-surface-variant">Complete daily challenges to earn Atlas XP and unlock historic cartographic projections.</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-1">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-label-md">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>94.2% Accuracy Rate</span>
          </div>
          <p className="text-body-sm text-on-surface-variant">Strongest domains: Maritime Trade Routes, Asian Demographics, and Clean Energy.</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-1">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-label-md">
            <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
            <span>Active Streak</span>
          </div>
          <p className="text-body-sm text-on-surface-variant">Log in daily to maintain your discovery streak and compete on the global leaderboard.</p>
        </div>
      </div>
    </main>
  );
}

