import { Link } from 'react-router-dom';
import { useAtlas } from '../context/AtlasContext';
import { countryDatabase } from '../data/countries';

export default function BookmarkDrawer() {
  const { bookmarkDrawerOpen, toggleBookmarkDrawer, savedCountryKeys, selectCountry, showToast } = useAtlas();

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

  const savedList = Array.from(savedCountryKeys)
    .map((k) => countryDatabase[k])
    .filter(Boolean);

  return (
    <>
      {/* Backdrop */}
      {bookmarkDrawerOpen && (
        <div
          className="fixed inset-0 bg-[#0A192F]/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={toggleBookmarkDrawer}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-80 sm:w-96 bg-surface-container-lowest shadow-2xl border-l border-outline-variant/30 transform transition-transform duration-300 ease-in-out p-5 flex flex-col justify-between ${
          bookmarkDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>bookmarks</span>
              <h3 className="text-headline-sm font-bold text-on-surface">Saved &amp; Highlights</h3>
            </div>
            <button className="p-1.5 rounded-lg text-outline hover:text-on-surface" onClick={toggleBookmarkDrawer} title="Close Drawer">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Quick link to full saved page */}
          <div className="flex items-center justify-between px-1">
            <span className="text-label-md text-on-surface-variant font-medium">{savedList.length} bookmarked</span>
            <Link
              to="/saved"
              onClick={toggleBookmarkDrawer}
              className="text-label-md text-secondary font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>View full page</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {/* Saved country list */}
          <div className="space-y-2 overflow-y-auto max-h-[580px]">
            {savedList.length === 0 && (
              <p className="text-body-sm text-on-surface-variant text-center py-8">No countries saved yet.</p>
            )}
            {savedList.map((country) => (
              <div
                key={country.id}
                onClick={() => { selectCountry(country.id); toggleBookmarkDrawer(); }}
                className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between hover:bg-surface-container cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <h5 className="text-title-md font-bold text-on-surface">{country.name}</h5>
                    <p className="text-body-sm text-outline">{country.capital} • {country.gdp} GDP</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary">chevron_right</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant/30 text-center">
          <button
            onClick={exportNotes}
            className="w-full py-2.5 rounded-xl bg-primary-container text-on-primary text-label-md font-semibold hover:bg-secondary transition-colors"
          >
            Export Cartography Study Notes (.JSON)
          </button>
        </div>
      </aside>
    </>
  );
}
