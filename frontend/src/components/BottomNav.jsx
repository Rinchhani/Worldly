import { Link, useLocation } from 'react-router-dom';
import { useAtlas } from '../context/AtlasContext';

export default function BottomNav() {
  const { toggleBookmarkDrawer } = useAtlas();
  const location = useLocation();

  const isHome = location.pathname === '/' || location.pathname.startsWith('/country');
  const isCompare = location.pathname === '/compare';
  const isTasks = location.pathname === '/tasks';
  const isQuiz = location.pathname === '/quiz';

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-gutter-mobile py-2 bg-surface-container-lowest shadow-md lg:hidden border-t border-outline-variant/30">
      {/* Explore */}
      <Link
        to="/"
        className={`flex flex-col items-center justify-center px-3 py-1.5 transition-all rounded-xl ${
          isHome
            ? 'bg-secondary-fixed text-on-secondary-fixed font-semibold'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <span className="material-symbols-outlined">map</span>
        <span className="text-[11px] mt-0.5">Explore</span>
      </Link>

      {/* Compare */}
      <Link
        to="/compare"
        className={`flex flex-col items-center justify-center px-3 py-1.5 transition-all rounded-xl ${
          isCompare
            ? 'bg-secondary-fixed text-on-secondary-fixed font-semibold'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <span className="material-symbols-outlined">compare_arrows</span>
        <span className="text-[11px] mt-0.5">Compare</span>
      </Link>

      {/* Tasks / Expeditions */}
      <Link
        to="/tasks"
        className={`flex flex-col items-center justify-center px-3 py-1.5 transition-all rounded-xl ${
          isTasks
            ? 'bg-secondary-fixed text-on-secondary-fixed font-semibold'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <span className="material-symbols-outlined">assignment</span>
        <span className="text-[11px] mt-0.5">Tasks</span>
      </Link>

      {/* Quiz */}
      <Link
        to="/quiz"
        className={`flex flex-col items-center justify-center px-3 py-1.5 transition-all rounded-xl ${
          isQuiz
            ? 'bg-secondary-fixed text-on-secondary-fixed font-semibold'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <span className="material-symbols-outlined">military_tech</span>
        <span className="text-[11px] mt-0.5">Quiz</span>
      </Link>

      {/* Bookmarks */}
      <button
        onClick={toggleBookmarkDrawer}
        className="flex flex-col items-center justify-center px-3 py-1.5 transition-all rounded-xl text-on-surface-variant hover:text-on-surface"
      >
        <span className="material-symbols-outlined">bookmark</span>
        <span className="text-[11px] mt-0.5">Saved</span>
      </button>
    </nav>
  );
}
