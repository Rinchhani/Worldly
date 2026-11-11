import { useState } from 'react';
import { useAtlas } from '../context/AtlasContext';

const MAP_CHIPS = [
  { key: 'japan', flag: '🇯🇵', label: 'Japan' },
  { key: 'brazil', flag: '🇧🇷', label: 'Brazil' },
  { key: 'kenya', flag: '🇰🇪', label: 'Kenya' },
  { key: 'france', flag: '🇫🇷', label: 'France' },
  { key: 'norway', flag: '🇳🇴', label: 'Norway' },
  { key: 'canada', flag: '🇨🇦', label: 'Canada' },
  { key: 'india', flag: '🇮🇳', label: 'India' },
  { key: 'australia', flag: '🇦🇺', label: 'Australia' },
];

const COUNTRY_POLYGONS = [
  { key: 'canada', points: '130,75 220,65 270,90 250,135 180,140 140,110', fill: '#2d4368', stroke: '#3e5b8a' },
  { key: 'france', points: '460,120 485,115 490,135 470,145 455,135', fill: '#354f7a', stroke: '#4f71a8' },
  { key: 'germany', points: '488,105 510,102 512,125 490,128', fill: '#354f7a', stroke: '#4f71a8' },
  { key: 'norway', points: '490,65 520,60 515,95 495,95', fill: '#354f7a', stroke: '#4f71a8' },
  { key: 'kenya', points: '545,260 575,265 570,295 545,285', fill: '#3b5785', stroke: '#5279b8' },
  { key: 'egypt', points: '515,190 550,192 548,225 518,222', fill: '#354f7a', stroke: '#4f71a8' },
  { key: 'brazil', points: '255,270 325,285 338,340 300,380 270,350 250,305', fill: '#354f7a', stroke: '#4f71a8' },
  { key: 'india', points: '665,190 710,195 700,250 670,260 655,220', fill: '#354f7a', stroke: '#4f71a8' },
  { key: 'australia', points: '775,340 855,335 865,390 805,410 765,375', fill: '#354f7a', stroke: '#4f71a8' },
  { key: 'indonesia', points: '740,285 790,290 820,310 770,312', fill: '#354f7a', stroke: '#4f71a8' },
];

export default function WorldMap({ onScrollToDossier }) {
  const { currentCountry, currentCountryKey, selectCountry } = useAtlas();
  const [zoom, setZoom] = useState(1);

  function zoomMap(factor) {
    setZoom((z) => Math.min(Math.max(0.7, z * factor), 2.2));
  }

  function resetMap() {
    setZoom(1);
  }

  const radarCoords = currentCountry?.radarCoords || { x: 845, y: 155 };

  return (
    <section className="relative rounded-2xl overflow-hidden bg-primary-container border border-outline-variant/30 shadow-lg text-on-primary">
      {/* Top HUD */}
      <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-center pointer-events-none">
        <div className="bg-primary-container/85 backdrop-blur-md px-3 py-1 rounded-lg border border-outline/30 flex items-center gap-2 text-on-primary pointer-events-auto">
          <span className="inline-block w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
          <span className="text-label-md font-bold text-inverse-on-surface tracking-wider">CHART 01 // ORBITAL ATLAS</span>
          <span className="text-label-md text-primary-fixed-dim hidden sm:inline">{currentCountry?.coordinates}</span>
        </div>
        {/* Zoom controls */}
        <div className="flex items-center gap-1 bg-primary-container/90 backdrop-blur-md p-1 rounded-lg border border-outline/30 pointer-events-auto">
          <button onClick={() => zoomMap(1.15)} className="w-8 h-8 rounded flex items-center justify-center text-on-primary hover:bg-surface-variant/20 active:scale-95" title="Zoom In">
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
          <button onClick={() => zoomMap(0.85)} className="w-8 h-8 rounded flex items-center justify-center text-on-primary hover:bg-surface-variant/20 active:scale-95" title="Zoom Out">
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
          <button onClick={resetMap} className="w-8 h-8 rounded flex items-center justify-center text-on-primary hover:bg-surface-variant/20 active:scale-95" title="Center Focus">
            <span className="material-symbols-outlined text-[18px]">my_location</span>
          </button>
        </div>
      </div>

      {/* Map viewport */}
      <div className="relative w-full h-80 sm:h-96 bg-primary-container overflow-hidden flex items-center justify-center select-none">
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <line stroke="#b9c7e4" strokeDasharray="4,4" x1="0" x2="100%" y1="25%" y2="25%" />
          <line stroke="#5bb8fe" strokeWidth="1.5" x1="0" x2="100%" y1="50%" y2="50%" />
          <line stroke="#b9c7e4" strokeDasharray="4,4" x1="0" x2="100%" y1="75%" y2="75%" />
          <line stroke="#b9c7e4" strokeDasharray="4,4" x1="25%" x2="25%" y1="0" y2="100%" />
          <line stroke="#5bb8fe" strokeWidth="1.5" x1="50%" x2="50%" y1="0" y2="100%" />
          <line stroke="#b9c7e4" strokeDasharray="4,4" x1="75%" x2="75%" y1="0" y2="100%" />
        </svg>

        {/* World SVG */}
        <svg
          className="w-full h-full max-w-full transition-transform duration-500 ease-out"
          style={{ transform: `scale(${zoom})` }}
          viewBox="0 0 1000 520"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient cx="50%" cy="50%" id="oceanGlow" r="50%">
              <stop offset="0%" stopColor="#14284b" />
              <stop offset="100%" stopColor="#0a192f" />
            </radialGradient>
          </defs>
          <rect fill="url(#oceanGlow)" height="520" width="1000" />

          {/* Continent base silhouettes */}
          <path d="M 120 70 L 190 60 L 260 85 L 290 120 L 250 170 L 230 220 L 190 230 L 150 180 L 110 130 Z" fill="#1b2d49" stroke="#253e66" strokeWidth="1.2" />
          <path d="M 230 250 L 320 280 L 340 340 L 300 440 L 260 460 L 240 370 L 220 300 Z" fill="#1b2d49" stroke="#253e66" strokeWidth="1.2" />
          <path d="M 440 80 L 530 75 L 560 110 L 530 160 L 460 170 L 430 130 Z" fill="#1b2d49" stroke="#253e66" strokeWidth="1.2" />
          <path d="M 440 185 L 540 185 L 590 260 L 560 360 L 510 400 L 460 350 L 430 250 Z" fill="#1b2d49" stroke="#253e66" strokeWidth="1.2" />
          <path d="M 545 70 L 780 65 L 860 120 L 880 200 L 800 240 L 720 280 L 640 240 L 570 170 Z" fill="#1b2d49" stroke="#253e66" strokeWidth="1.2" />
          <path d="M 760 330 L 870 325 L 880 400 L 810 425 L 750 380 Z" fill="#1b2d49" stroke="#253e66" strokeWidth="1.2" />

          {/* Interactive country polygons */}
          {COUNTRY_POLYGONS.map(({ key, points, fill, stroke }) => (
            <polygon
              key={key}
              className="country-node"
              points={points}
              fill={currentCountryKey === key ? '#006398' : fill}
              stroke={currentCountryKey === key ? '#5bb8fe' : stroke}
              strokeWidth={currentCountryKey === key ? 2 : 1}
              style={{ filter: currentCountryKey === key ? 'drop-shadow(0 0 6px rgba(0,99,152,0.5))' : undefined }}
              onClick={() => selectCountry(key)}
            />
          ))}

          {/* Japan polygon */}
          <g className="cursor-pointer" onClick={() => selectCountry('japan')}>
            <polygon
              className="country-node"
              points="835,138 855,142 858,168 845,178 830,165"
              fill={currentCountryKey === 'japan' ? '#006398' : '#354f7a'}
              stroke={currentCountryKey === 'japan' ? '#5bb8fe' : '#4f71a8'}
              strokeWidth={currentCountryKey === 'japan' ? 2 : 1}
              style={{ filter: currentCountryKey === 'japan' ? 'drop-shadow(0 0 6px rgba(0,99,152,0.5))' : undefined }}
            />
          </g>

          {/* Radar marker */}
          <g transform={`translate(${radarCoords.x}, ${radarCoords.y})`}>
            <circle className="animate-radar" fill="#5bb8fe" r="18" opacity="0.6" />
            <circle fill="#5bb8fe" r="6" stroke="#ffffff" strokeWidth="2" />
          </g>
        </svg>

        {/* Live floating HUD */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-80 bg-surface-container-lowest/95 backdrop-blur-md rounded-xl p-3 border border-outline-variant/40 shadow-xl flex items-center justify-between transition-all duration-300">
          <div className="flex items-center gap-3">
            <span className="text-3xl filter drop-shadow">{currentCountry?.flag}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-title-md font-bold text-on-surface">{currentCountry?.name}</h4>
                <span className="px-1.5 rounded-full text-[10px] bg-secondary-fixed text-on-secondary-fixed font-bold">Featured</span>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Capital: {currentCountry?.capital} • {currentCountry?.region}
              </p>
            </div>
          </div>
          <button
            onClick={onScrollToDossier}
            className="p-2 rounded-lg bg-primary-container text-on-primary hover:bg-secondary active:scale-95 transition-all shadow-sm"
            title="Explore Full Dossier"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
          </button>
        </div>
      </div>

      {/* Quick chip selector */}
      <div className="bg-surface-container-low/60 px-3 py-2 border-t border-outline-variant/30 flex items-center gap-2 overflow-x-auto scrollbar-none text-on-surface">
        <span className="text-label-md text-outline font-semibold shrink-0">Click Pin:</span>
        {MAP_CHIPS.map(({ key, flag, label }) => (
          <button
            key={key}
            onClick={() => selectCountry(key)}
            className={`map-chip-btn px-2.5 py-1 rounded-lg text-label-md shrink-0 transition-all ${
              currentCountryKey === key
                ? 'bg-secondary text-on-secondary'
                : 'bg-surface-container-lowest border border-outline-variant/30 hover:bg-surface-container-high'
            }`}
          >
            {flag} {label}
          </button>
        ))}
      </div>
    </section>
  );
}

