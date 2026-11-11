import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { countryDatabase as fallbackDatabase, continentMap } from '../data/countries';
import { countryAPI, bookmarkAPI } from '../services/api';
import { useAuth } from './AuthContext';

const AtlasContext = createContext(null);

export function AtlasProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  const [countries, setCountries] = useState(fallbackDatabase);
  const [currentCountryKey, setCurrentCountryKey] = useState('japan');
  const [savedCountryKeys, setSavedCountryKeys] = useState(new Set(['japan', 'brazil', 'kenya']));
  const [bookmarkDrawerOpen, setBookmarkDrawerOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = useCallback((message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 2600);
  }, []);

  // Fetch countries from backend API with fallback
  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await countryAPI.getAll();
        if (res.success && res.countries && res.countries.length > 0) {
          const dict = {};
          res.countries.forEach((c) => {
            dict[c.id] = c;
          });
          setCountries(dict);
        }
      } catch (e) {
        console.info('Using local fallback country catalog.');
      }
    }
    fetchCountries();
  }, []);

  // Sync user bookmarks from backend if authenticated
  useEffect(() => {
    async function syncBookmarks() {
      if (isAuthenticated) {
        try {
          const res = await bookmarkAPI.getAll();
          if (res.success && res.countryIds) {
            setSavedCountryKeys(new Set(res.countryIds));
          }
        } catch {
          // Keep local bookmarks on network issue
        }
      }
    }
    syncBookmarks();
  }, [isAuthenticated]);

  const selectCountry = useCallback((key) => {
    const k = key?.toLowerCase();
    if (!countries[k] && !fallbackDatabase[k]) return;
    setCurrentCountryKey(k);
  }, [countries]);

  const toggleBookmark = useCallback(async (key) => {
    const k = (key || currentCountryKey).toLowerCase();
    const countryName = countries[k]?.name || fallbackDatabase[k]?.name || k;

    // Optimistic UI update
    setSavedCountryKeys((prev) => {
      const next = new Set(prev);
      if (next.has(k)) {
        next.delete(k);
        showToast(`Removed ${countryName} from Bookmarks`);
      } else {
        next.add(k);
        showToast(`Saved ${countryName} to Atlas Bookmarks`);
      }
      return next;
    });

    // If authenticated, persist to backend
    if (isAuthenticated) {
      try {
        await bookmarkAPI.toggle(k);
      } catch (err) {
        console.warn('Could not sync bookmark with backend:', err.message);
      }
    }
  }, [currentCountryKey, countries, isAuthenticated, showToast]);

  const toggleBookmarkDrawer = useCallback(() => {
    setBookmarkDrawerOpen((v) => !v);
  }, []);

  const shuffleRandom = useCallback(() => {
    const keys = Object.keys(countries).filter((k) => k !== currentCountryKey);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    selectCountry(randomKey);
    const countryName = countries[randomKey]?.name || randomKey;
    showToast(`Navigated to ${countryName}!`);
    return randomKey;
  }, [currentCountryKey, countries, selectCountry, showToast]);

  const handleSearch = useCallback((query) => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    for (const [key, country] of Object.entries(countries)) {
      if (
        country.name.toLowerCase().includes(q) ||
        country.capital.toLowerCase().includes(q) ||
        country.region.toLowerCase().includes(q) ||
        country.economy?.exports?.some((e) => e.toLowerCase().includes(q))
      ) {
        selectCountry(key);
        break;
      }
    }
  }, [countries, selectCountry]);

  return (
    <AtlasContext.Provider
      value={{
        countries,
        currentCountryKey,
        currentCountry: countries[currentCountryKey] || fallbackDatabase[currentCountryKey],
        savedCountryKeys,
        bookmarkDrawerOpen,
        toast,
        selectCountry,
        toggleBookmark,
        toggleBookmarkDrawer,
        shuffleRandom,
        handleSearch,
        showToast,
      }}
    >
      {children}
    </AtlasContext.Provider>
  );
}

export function useAtlas() {
  return useContext(AtlasContext);
}
