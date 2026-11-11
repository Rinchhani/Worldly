import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAtlas } from '../context/AtlasContext';

const TABS = [
  { id: 'economy', label: 'Economy & Trade' },
  { id: 'resources', label: 'Resources & Agri' },
  { id: 'geography', label: 'Geography & Nature' },
  { id: 'culture', label: 'Culture & Trivia' },
];

function EconomyPane({ country }) {
  const { economy } = country;
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/40 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-title-md font-semibold text-on-surface">GDP Sector Composition</span>
          <span className="text-label-md text-outline">Macro Distribution</span>
        </div>
        <div className="h-3.5 w-full bg-surface-container rounded-full overflow-hidden flex">
          <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${economy.services}%` }} title={`Services: ${economy.services}%`} />
          <div className="h-full bg-secondary-container transition-all duration-500" style={{ width: `${economy.industry}%` }} title={`Industry: ${economy.industry}%`} />
          <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${economy.agriculture}%` }} title={`Agriculture: ${economy.agriculture}%`} />
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-1 text-label-md">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
            <span className="text-on-surface">Services: <strong>{economy.services}%</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
            <span className="text-on-surface">Industry: <strong>{economy.industry}%</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-on-surface">Agriculture: <strong>{economy.agriculture}%</strong></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
          <h5 className="text-title-md font-semibold text-on-surface mb-2.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary">local_shipping</span>
            Leading Export Products
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {economy.exports.map((exp) => (
              <span key={exp} className="px-2.5 py-1 rounded-lg bg-surface-container text-label-md text-on-surface">{exp}</span>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
          <h5 className="text-title-md font-semibold text-on-surface mb-2.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary">hub</span>
            Top Bilateral Partners
          </h5>
          <div className="space-y-1.5 text-body-sm">
            {economy.partners.map((p) => (
              <div key={p.name} className="flex justify-between items-center p-1.5 rounded bg-surface-container-low">
                <span>{p.name}</span>
                <span className="font-semibold text-secondary">{p.share}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourcesPane({ country }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest space-y-2">
        <h5 className="text-title-md font-semibold text-on-surface flex items-center gap-1.5">
          <span className="material-symbols-outlined text-emerald-700">nature</span>
          Strategic Mineral &amp; Energy Deposits
        </h5>
        <p className="text-body-sm text-on-surface-variant">Extracted resources, maritime economic zones, and mineral reserves.</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {country.resources.map((r) => (
            <span key={r} className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-label-md">{r}</span>
          ))}
        </div>
      </div>
      <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest space-y-2">
        <h5 className="text-title-md font-semibold text-on-surface flex items-center gap-1.5">
          <span className="material-symbols-outlined text-amber-700">agriculture</span>
          Specialized Agricultural Yields
        </h5>
        <p className="text-body-sm text-on-surface-variant">Intensive precision agriculture and high-value terroir products.</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {country.agriculture.map((a) => (
            <span key={a} className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-800 text-label-md">{a}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function GeographyPane({ country }) {
  const { geography } = country;
  return (
    <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/40 space-y-3">
      <h5 className="text-title-md font-semibold text-on-surface flex items-center gap-1.5">
        <span className="material-symbols-outlined text-secondary">landscape</span>
        Topography &amp; Biomes
      </h5>
      <p className="text-body-md text-on-surface leading-relaxed">{geography.desc}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
        <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30">
          <span className="text-label-md text-outline block">HIGHEST ELEVATION</span>
          <span className="text-title-md font-bold text-on-surface">{geography.peak}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30">
          <span className="text-label-md text-outline block">UNESCO HERITAGE</span>
          <span className="text-title-md font-bold text-secondary">{geography.unesco}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 col-span-2 sm:col-span-1">
          <span className="text-label-md text-outline block">CLIMATE ZONES</span>
          <span className="text-title-md font-bold text-on-surface">{geography.climate}</span>
        </div>
      </div>
    </div>
  );
}

function CulturePane({ country }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {country.trivia.map((t, idx) => (
        <div key={idx} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1.5">
          <span className="w-7 h-7 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center font-bold text-sm">
            {idx + 1}
          </span>
          <h6 className="text-title-md font-semibold text-on-surface">{t.title}</h6>
          <p className="text-body-sm text-on-surface-variant">{t.text}</p>
        </div>
      ))}
    </div>
  );
}

export default function CountryDossier({ sectionRef }) {
  const { currentCountry, savedCountryKeys, toggleBookmark, showToast } = useAtlas();
  const [activeTab, setActiveTab] = useState('economy');

  if (!currentCountry) return null;

  const isSaved = savedCountryKeys.has(currentCountry.id);

  function shareCountryCard() {
    if (navigator.share) {
      navigator.share({
        title: `WORLDLY Atlas - ${currentCountry.name}`,
        text: `Explore the demographic & geographic dossier for ${currentCountry.name} on WORLDLY.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Dossier URL copied to clipboard!');
    }
  }

  return (
    <section
      ref={sectionRef}
      className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm p-4 sm:p-6 space-y-6"
    >
      {/* Dossier Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-16 h-12 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-center text-4xl shadow-inner shrink-0">
            {currentCountry.flag}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[24px] md:text-headline-lg font-bold text-on-surface">{currentCountry.name}</h2>
              <span className="text-label-lg px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">{currentCountry.nativeName}</span>
              <span className="text-label-md px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">{currentCountry.region}</span>
            </div>
            <p className="text-body-sm text-on-surface-variant mt-0.5">
              {currentCountry.subtitle} • Capital: <strong className="text-on-surface">{currentCountry.capital}</strong> • Currency: <strong className="text-on-surface">{currentCountry.currency}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
          <Link
            to="/tasks"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface hover:bg-surface-container-high transition-all text-label-md font-semibold"
            title="Create expedition research task for this country"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">assignment</span>
            <span className="hidden sm:inline">Research Task</span>
          </Link>
          <button
            onClick={() => toggleBookmark()}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-outline-variant/40 text-label-md font-semibold transition-all active:scale-95 ${
              isSaved ? 'bg-secondary-fixed/50 text-secondary' : 'bg-surface-container-low text-secondary hover:bg-secondary-fixed/50'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span>{isSaved ? 'Saved to Atlas' : 'Add to Atlas'}</span>
          </button>
          <button
            onClick={shareCountryCard}
            className="p-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface hover:bg-surface-container-high active:scale-95 transition-all"
            title="Share Country Brief"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
          </button>
        </div>
      </div>

      {/* Stat Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-secondary/40 transition-colors">
          <div className="flex items-center justify-between text-outline text-[12px] font-semibold">
            <span>POPULATION</span>
            <span className="material-symbols-outlined text-secondary text-[16px]">group</span>
          </div>
          <div className="text-stat-metric text-on-surface mt-1">{currentCountry.population}</div>
          <div className="text-label-md text-amber-700 flex items-center gap-0.5 mt-0.5">
            <span className="material-symbols-outlined text-[14px]">
              {currentCountry.popDelta.startsWith('-') ? 'trending_down' : 'trending_up'}
            </span>
            {currentCountry.popDelta}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-secondary/40 transition-colors">
          <div className="flex items-center justify-between text-outline text-[12px] font-semibold">
            <span>TOTAL AREA</span>
            <span className="material-symbols-outlined text-secondary text-[16px]">square_foot</span>
          </div>
          <div className="text-stat-metric text-on-surface mt-1">{currentCountry.area}</div>
          <div className="text-label-md text-on-surface-variant mt-0.5">km²</div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-secondary/40 transition-colors">
          <div className="flex items-center justify-between text-outline text-[12px] font-semibold">
            <span>GDP (NOMINAL)</span>
            <span className="material-symbols-outlined text-secondary text-[16px]">payments</span>
          </div>
          <div className="text-stat-metric text-on-surface mt-1">{currentCountry.gdp}</div>
          <div className="text-label-md text-emerald-800 flex items-center gap-0.5 mt-0.5">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            {currentCountry.gdpRank}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-secondary/40 transition-colors">
          <div className="flex items-center justify-between text-outline text-[12px] font-semibold">
            <span>HUMAN DEV INDEX</span>
            <span className="material-symbols-outlined text-secondary text-[16px]">military_tech</span>
          </div>
          <div className="text-stat-metric text-on-surface mt-1">{currentCountry.hdi.split(' ')[0]}</div>
          <div className="text-label-md text-secondary font-semibold mt-0.5">{currentCountry.hdi.split('(')[1]?.replace(')', '') || 'High'}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-xl overflow-x-auto scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-label-lg font-semibold transition-all text-center ${
                activeTab === tab.id
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'economy' && <EconomyPane country={currentCountry} />}
        {activeTab === 'resources' && <ResourcesPane country={currentCountry} />}
        {activeTab === 'geography' && <GeographyPane country={currentCountry} />}
        {activeTab === 'culture' && <CulturePane country={currentCountry} />}
      </div>
    </section>
  );
}

