import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAtlas } from '../context/AtlasContext';
import { useAuth } from '../context/AuthContext';
import { continentMap } from '../data/countries';

const CONTINENTS = [
  { label: 'All Continents', key: 'all' },
  { label: 'Asia', key: 'asia' },
  { label: 'Americas', key: 'americas' },
  { label: 'Europe', key: 'europe' },
  { label: 'Africa', key: 'africa' },
  { label: 'Oceania', key: 'oceania' },
];

export default function Header() {
  const { savedCountryKeys, toggleBookmarkDrawer, shuffleRandom, selectCountry } = useAtlas();
  const { user, isAuthenticated, logout, setAuthModalOpen } = useAuth();
  const [activeContinent, setActiveContinent] = useState('all');
  const [diceRotated, setDiceRotated] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const location = useLocation();

  function handleDice() {
    setDiceRotated(true);
    setTimeout(() => {
      setDiceRotated(false);
      shuffleRandom();
    }, 300);
  }

  function filterContinent(key) {
    setActiveContinent(key);
    selectCountry(continentMap[key] || 'japan');
  }

  const isHome = location.pathname === '/' || location.pathname.startsWith('/country');

  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest shadow-sm border-b border-outline-variant/30">
      <div className="flex justify-between items-center w-full px-gutter-mobile md:px-gutter max-w-7xl mx-auto h-16">
        {/* Brand & Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-secondary-container">public</span>
          </div>
          <div>
            <span className="font-bold tracking-tight text-on-surface block leading-tight text-[24px]">WORLDLY</span>
            <span className="text-label-md text-on-surface-variant block -mt-0.5">Global Explorer &amp; Atlas</span>
          </div>
        </Link>

        {/* Center Navigation Links for Tablet & Desktop */}
        <nav className="hidden lg:flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/30">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-label-md font-semibold transition-all ${
              isHome
                ? 'bg-surface-container-lowest text-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Atlas Map
          </Link>
          <Link
            to="/compare"
            className={`px-3 py-1.5 rounded-lg text-label-md font-semibold transition-all ${
              location.pathname === '/compare'
                ? 'bg-surface-container-lowest text-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Comparator
          </Link>
          <Link
            to="/tasks"
            className={`px-3 py-1.5 rounded-lg text-label-md font-semibold transition-all ${
              location.pathname === '/tasks'
                ? 'bg-surface-container-lowest text-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Expeditions
          </Link>
          <Link
            to="/quiz"
            className={`px-3 py-1.5 rounded-lg text-label-md font-semibold transition-all ${
              location.pathname === '/quiz'
                ? 'bg-surface-container-lowest text-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Quiz Arena
          </Link>
          <Link
            to="/saved"
            className={`px-3 py-1.5 rounded-lg text-label-md font-semibold transition-all ${
              location.pathname === '/saved'
                ? 'bg-surface-container-lowest text-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Saved ({savedCountryKeys.size})
          </Link>
        </nav>

        {/* Action cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Random dice */}
          <button
            onClick={handleDice}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-secondary text-label-md border border-outline-variant/40 hover:bg-surface-container-high transition-colors active:scale-95 duration-150"
            title="Random Country Explorer"
          >
            <span
              className="material-symbols-outlined text-secondary transition-transform duration-500"
              style={{ transform: diceRotated ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              casino
            </span>
            <span className="hidden sm:inline">Random</span>
          </button>

          {/* Search quick button */}
          <button
            aria-label="Search Explorer"
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low active:scale-95 transition-transform duration-150"
            onClick={() => {
              if (!isHome) {
                window.location.href = '/';
              } else {
                document.getElementById('searchInput')?.focus();
              }
            }}
          >
            <span className="material-symbols-outlined">search</span>
          </button>

          {/* Bookmark drawer trigger */}
          <button
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface hover:bg-surface-container-high active:scale-95 transition-all"
            onClick={toggleBookmarkDrawer}
            title="Open Saved Highlights"
          >
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
            <span className="text-label-md font-bold px-1.5 rounded-full bg-secondary-container text-on-secondary-container">
              {savedCountryKeys.size}
            </span>
          </button>

          {/* User Auth Profile / Login Button */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown((v) => !v)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary-fixed/50 border border-secondary/30 text-on-surface hover:bg-secondary-fixed transition-all"
              >
                <span>{user.avatar || '🧭'}</span>
                <span className="text-label-md font-bold hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                <span className="material-symbols-outlined text-[16px] text-outline">expand_more</span>
              </button>

              {userDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-2 z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 border-b border-outline-variant/20">
                    <p className="text-label-md font-bold text-on-surface">{user.name}</p>
                    <p className="text-[11px] text-outline truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-secondary font-semibold">
                      <span>{user.xp} XP</span>
                      <span>•</span>
                      <span>🔥 {user.streak}d streak</span>
                    </div>
                  </div>
                  <Link
                    to="/tasks"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 text-label-md text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">assignment</span>
                    <span>My Tasks</span>
                  </Link>
                  <Link
                    to="/saved"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 text-label-md text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">bookmark</span>
                    <span>Saved Atlas</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-label-md text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-semibold text-label-md hover:bg-secondary transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Continent selector pills (only on Atlas home page) */}
      {isHome && (
        <div className="px-gutter-mobile md:px-gutter max-w-7xl mx-auto pb-2.5 overflow-x-auto scrollbar-none flex items-center gap-2">
          {CONTINENTS.map((c) => (
            <button
              key={c.key}
              onClick={() => filterContinent(c.key)}
              className={`continent-pill whitespace-nowrap px-3.5 py-1 rounded-full text-label-md font-semibold transition-all ${
                activeContinent === c.key
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant bg-surface-container-lowest border border-outline-variant/40 hover:bg-surface-container-low'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
