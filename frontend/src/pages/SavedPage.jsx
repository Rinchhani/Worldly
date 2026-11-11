import { Link } from 'react-router-dom';
import { useAtlas } from '../context/AtlasContext';
import { countryDatabase } from '../data/countries';

export default function SavedPage() {
  const { savedCountryKeys, toggleBookmark, selectCountry, showToast } = useAtlas();

  const savedList = Array.from(savedCountryKeys)
    .map((k) => countryDatabase[k])
    .filter(Boolean);

  function exportNotes() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(Array.from(savedCountryKeys)));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'worldly_atlas_bookmarks.json');
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Atlas study notes exported!');
  }

  return (
    <main className="max-w-7xl mx-auto px-gutter-mobile md:px-gutter pt-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>bookmarks</span>
            <span className="text-label-md text-secondary font-bold tracking-wider">ATLAS HIGHLIGHTS</span>
          </div>
          <h1 className="text-[28px] md:text-headline-lg font-bold text-on-surface">Saved Countries &amp; Research Dossiers</h1>
          <p className="text-body-sm text-on-surface-variant">Your personal curated atlas of demographic, geopolitical, and resource briefs ({savedList.length} saved).</p>
        </div>
        <div className="flex items-center gap-2">
          {savedList.length > 0 && (
            <button
              onClick={exportNotes}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-container text-on-primary hover:bg-secondary transition-all text-label-md font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export JSON</span>
            </button>
          )}
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface hover:bg-surface-container-high transition-all text-label-md font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">public</span>
            <span>Atlas Map</span>
          </Link>
        </div>
      </div>

      {/* Saved Countries Grid */}
      {savedList.length === 0 ? (
        <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 space-y-3">
          <span className="material-symbols-outlined text-5xl text-outline">bookmark_border</span>
          <h3 className="text-headline-sm font-bold text-on-surface">No Saved Countries Yet</h3>
          <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
            Explore the world map and click the star icon on any country dossier to save it to your research highlights.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-on-secondary font-semibold text-label-md hover:bg-secondary/90 transition-all"
          >
            Explore Atlas Map
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedList.map((country) => (
            <div
              key={country.id}
              className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{country.flag}</span>
                    <div>
                      <h3 className="text-title-md font-bold text-on-surface">{country.name}</h3>
                      <span className="text-label-md text-on-surface-variant">{country.nativeName} • {country.region}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBookmark(country.id)}
                    className="p-1.5 rounded-lg text-secondary hover:bg-surface-container-low transition-colors"
                    title="Remove from bookmarks"
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </button>
                </div>

                <p className="text-body-sm text-on-surface-variant mt-3">{country.subtitle}</p>

                {/* Quick stats chips */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-outline-variant/20 text-center">
                  <div className="p-1.5 rounded-lg bg-surface-container-low">
                    <span className="text-[10px] text-outline block">POP</span>
                    <span className="text-label-md font-bold text-on-surface">{country.population}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-surface-container-low">
                    <span className="text-[10px] text-outline block">GDP</span>
                    <span className="text-label-md font-bold text-on-surface">{country.gdp}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-surface-container-low">
                    <span className="text-[10px] text-outline block">HDI</span>
                    <span className="text-label-md font-bold text-on-surface">{country.hdi.split(' ')[0]}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Link
                  to={`/country/${country.id}`}
                  onClick={() => selectCountry(country.id)}
                  className="flex-1 py-2 rounded-xl bg-primary-container text-on-primary hover:bg-secondary text-center text-label-md font-semibold transition-colors"
                >
                  View Dossier
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

