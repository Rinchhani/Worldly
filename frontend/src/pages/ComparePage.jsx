import { Link } from 'react-router-dom';
import Comparator from '../components/Comparator';
import { useAtlas } from '../context/AtlasContext';
import { countryDatabase } from '../data/countries';

export default function ComparePage() {
  const { currentCountry, selectCountry } = useAtlas();

  return (
    <main className="max-w-7xl mx-auto px-gutter-mobile md:px-gutter pt-6 space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
        <div>
          <span className="text-label-md text-secondary font-bold tracking-wider">ANALYTICS COMPARATOR</span>
          <h1 className="text-[28px] md:text-headline-lg font-bold text-on-surface">Demographic &amp; Economic Parity</h1>
          <p className="text-body-sm text-on-surface-variant">Compare live metrics between nations across population, GDP per capita, and clean energy mix.</p>
        </div>
        <Link
          to="/"
          className="self-start sm:self-center flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface hover:bg-surface-container-high transition-all text-label-md font-semibold"
        >
          <span className="material-symbols-outlined text-[18px]">public</span>
          <span>Back to Global Atlas</span>
        </Link>
      </div>

      {/* Quick Select Nation */}
      <div className="bg-surface-container-low/60 p-3 rounded-xl border border-outline-variant/30 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-label-md text-outline font-semibold shrink-0">Selected Baseline:</span>
        {Object.values(countryDatabase).map((c) => (
          <button
            key={c.id}
            onClick={() => selectCountry(c.id)}
            className={`px-2.5 py-1 rounded-lg text-label-md shrink-0 transition-all ${
              currentCountry?.id === c.id
                ? 'bg-secondary text-on-secondary shadow-sm font-semibold'
                : 'bg-surface-container-lowest border border-outline-variant/30 hover:bg-surface-container-high text-on-surface'
            }`}
          >
            {c.flag} {c.name}
          </button>
        ))}
      </div>

      {/* Main Comparator Component */}
      <Comparator />
    </main>
  );
}

