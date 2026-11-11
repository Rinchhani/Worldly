import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import WorldMap from '../components/WorldMap';
import CountryDossier from '../components/CountryDossier';
import Comparator from '../components/Comparator';
import QuizCard from '../components/QuizCard';
import { useAtlas } from '../context/AtlasContext';
import { countryDatabase } from '../data/countries';

export default function HomePage() {
  const { countryId } = useParams();
  const { selectCountry } = useAtlas();
  const dossierRef = useRef(null);

  // Sync route param with AtlasContext if valid
  useEffect(() => {
    if (countryId && countryDatabase[countryId.toLowerCase()]) {
      selectCountry(countryId.toLowerCase());
    }
  }, [countryId, selectCountry]);

  function scrollToDossier() {
    dossierRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main className="max-w-7xl mx-auto px-gutter-mobile md:px-gutter pt-4 space-y-6">
      <SearchBar />
      <WorldMap onScrollToDossier={scrollToDossier} />
      <CountryDossier sectionRef={dossierRef} />
      <div id="comparator-section">
        <Comparator />
      </div>
      <div id="quiz-section">
        <QuizCard />
      </div>
    </main>
  );
}
