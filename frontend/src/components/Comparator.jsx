import { useState, useEffect } from 'react';
import { useAtlas } from '../context/AtlasContext';
import { countryDatabase } from '../data/countries';

const COMPARE_OPTIONS = [
  { value: 'germany', label: 'vs 🇩🇪 Germany' },
  { value: 'brazil', label: 'vs 🇧🇷 Brazil' },
  { value: 'canada', label: 'vs 🇨🇦 Canada' },
  { value: 'kenya', label: 'vs 🇰🇪 Kenya' },
  { value: 'japan', label: 'vs 🇯🇵 Japan' },
  { value: 'france', label: 'vs 🇫🇷 France' },
  { value: 'norway', label: 'vs 🇳🇴 Norway' },
  { value: 'india', label: 'vs 🇮🇳 India' },
  { value: 'australia', label: 'vs 🇦🇺 Australia' },
  { value: 'egypt', label: 'vs 🇪🇬 Egypt' },
  { value: 'indonesia', label: 'vs 🇮🇩 Indonesia' },
];

function CompareBar({ labelA, valA, labelB, valB, shareA }) {
  const shareB = 100 - shareA;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-label-md">
        <span className="text-on-surface font-semibold">{labelA}: <span className="text-secondary">{valA}</span></span>
        <span className="text-on-surface-variant font-semibold">{valB} ({labelB})</span>
      </div>
      <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden flex">
        <div className="h-full bg-secondary rounded-l transition-all duration-500" style={{ width: `${shareA}%` }} />
        <div className="h-full bg-secondary-fixed-dim rounded-r transition-all duration-500" style={{ width: `${shareB}%` }} />
      </div>
    </div>
  );
}

export default function Comparator() {
  const { currentCountry } = useAtlas();
  const [compareKey, setCompareKey] = useState('germany');

  // Prevent comparing the same country with itself
  useEffect(() => {
    if (currentCountry && compareKey === currentCountry.id) {
      const fallback = currentCountry.id === 'germany' ? 'japan' : 'germany';
      setCompareKey(fallback);
    }
  }, [currentCountry, compareKey]);

  const target = countryDatabase[compareKey];
  if (!currentCountry || !target) return null;

  const curComp = currentCountry.comparisons;
  const tarComp = target.comparisons;

  const popShare = Math.round((curComp.popRaw / (curComp.popRaw + tarComp.popRaw)) * 100);
  const gdpShare = Math.round((curComp.gdpCapRaw / (curComp.gdpCapRaw + tarComp.gdpCapRaw)) * 100);
  const energyShare = Math.round((curComp.cleanEnergyRaw / (curComp.cleanEnergyRaw + tarComp.cleanEnergyRaw)) * 100);

  return (
    <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <span className="text-label-md text-secondary font-bold tracking-wider">ANALYTICS COMPARATOR</span>
          <h3 className="text-headline-sm font-bold text-on-surface">Side-by-Side Demographic Parity</h3>
        </div>
        <select
          value={compareKey}
          onChange={(e) => setCompareKey(e.target.value)}
          className="rounded-lg bg-surface-container border border-outline-variant/40 text-label-md px-2.5 py-1.5 text-on-surface outline-none cursor-pointer focus:ring-2 focus:ring-secondary/20"
        >
          {COMPARE_OPTIONS.filter((o) => o.value !== currentCountry.id).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3.5 pt-2">
        <CompareBar
          labelA={`Population: ${currentCountry.population} (Selected)`}
          valA={currentCountry.population}
          labelB={target.name}
          valB={target.population}
          shareA={popShare}
        />
        <CompareBar
          labelA={`GDP per Capita: ${curComp.gdpCap}`}
          valA={curComp.gdpCap}
          labelB={target.name}
          valB={tarComp.gdpCap}
          shareA={gdpShare}
        />
        <CompareBar
          labelA={`Clean Energy Mix: ${curComp.cleanEnergy}`}
          valA={curComp.cleanEnergy}
          labelB={target.name}
          valB={tarComp.cleanEnergy}
          shareA={energyShare}
        />
      </div>
    </section>
  );
}
