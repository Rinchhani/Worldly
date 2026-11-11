import { useState, useRef, useEffect } from 'react';
import { useAtlas } from '../context/AtlasContext';

const QUICK_TAGS = [
  { label: 'Coffee producers', tag: 'Coffee', className: 'bg-amber-500/10 text-amber-800 border border-amber-500/20 hover:bg-amber-500/20' },
  { label: 'Lithium reserves', tag: 'Lithium', className: 'bg-secondary-fixed/50 text-secondary border border-secondary/20 hover:bg-secondary-fixed' },
  { label: 'Top GDP Nations', tag: 'GDP', className: 'bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 hover:bg-emerald-500/20' },
  { label: 'Ancient Monarchies', tag: 'Monarchy', className: 'bg-purple-500/10 text-purple-800 border border-purple-500/20 hover:bg-purple-500/20' },
];

export default function SearchBar() {
  const { handleSearch, selectCountry, showToast } = useAtlas();
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function onInput(e) {
    setValue(e.target.value);
    handleSearch(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim()) {
      handleSearch(value);
    }
  }

  function clearSearch() {
    setValue('');
    handleSearch('');
    inputRef.current?.focus();
  }

  function triggerQuickTag(tag) {
    setValue(tag);
    if (tag === 'Coffee') selectCountry('brazil');
    else if (tag === 'Lithium') selectCountry('australia');
    else if (tag === 'GDP') selectCountry('japan');
    else if (tag === 'Monarchy') selectCountry('japan');
    showToast(`Filter applied: "${tag}"`);
  }

  return (
    <section className="space-y-2">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-3.5 text-outline pointer-events-none">search</span>
        <input
          id="searchInput"
          ref={inputRef}
          type="text"
          value={value}
          onChange={onInput}
          placeholder="Search 195+ countries, capitals, resources..."
          className="w-full h-12 pl-11 pr-24 rounded-xl bg-surface-container-lowest border border-outline-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-body-md text-on-surface placeholder:text-outline transition-all shadow-sm outline-none"
        />
        <div className="absolute right-2 flex items-center gap-1">
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-outline bg-surface-container rounded border border-outline-variant/40">⌘K</kbd>
          {value && (
            <button type="button" onClick={clearSearch} className="p-1.5 rounded-lg text-outline hover:text-on-surface" title="Clear">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </form>

      {/* Quick suggestion badges */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        <span className="text-label-md text-outline flex items-center gap-1 shrink-0">
          <span className="material-symbols-outlined text-[16px]">insights</span> Quick:
        </span>
        {QUICK_TAGS.map(({ label, tag, className }) => (
          <button
            key={tag}
            type="button"
            onClick={() => triggerQuickTag(tag)}
            className={`shrink-0 px-2.5 py-0.5 rounded-full text-label-md transition-colors ${className}`}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
