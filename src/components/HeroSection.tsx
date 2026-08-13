import React, { useState } from 'react';
import { MarketCategory } from '../types';
import { ChevronDown, Globe } from 'lucide-react';

interface HeroSectionProps {
  selectedCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

const CATEGORIES: MarketCategory[] = [
  'US stocks',
  'World stocks',
  'Crypto',
  'Futures',
  'Forex',
  'Government bonds',
  'Corporate bonds',
  'ETFs'
];

const REGIONS = ['Global', 'US Markets', 'European Markets', 'Asian Markets'];

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion
}) => {
  const [showRegionMenu, setShowRegionMenu] = useState(false);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-6 py-8 flex flex-col items-center text-center">
      {/* Title with dropdown */}
      <div className="relative mb-6">
        <button
          onClick={() => setShowRegionMenu(!showRegionMenu)}
          className="text-3xl sm:text-4xl font-bold font-display flex items-center gap-2 hover:text-[#b6c4ff] transition-colors focus:outline-none"
        >
          <span>Markets, everywhere</span>
          <span className="material-symbols-outlined text-3xl sm:text-4xl transition-transform duration-200">
            expand_more
          </span>
        </button>

        {showRegionMenu && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-[#1E222D] border border-[#363A45] rounded-lg shadow-xl z-30 py-2 text-left">
            <div className="px-3 py-1.5 text-[11px] font-bold text-[#c3c5d8] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#363A45]">
              <Globe className="w-3.5 h-3.5" />
              <span>Select Region</span>
            </div>
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => {
                  onSelectRegion(region);
                  setShowRegionMenu(false);
                }}
                className={`w-full px-4 py-2 text-xs text-left hover:bg-[#2A2E39] transition-colors flex justify-between items-center ${
                  selectedRegion === region ? 'text-[#b6c4ff] font-semibold bg-[#2A2E39]/50' : 'text-[#dfe2f2]'
                }`}
              >
                <span>{region}</span>
                {selectedRegion === region && <span className="text-[#00E676] text-xs">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto max-w-full scrollbar-hide py-2 border border-[#363A45] rounded-full px-2 bg-[#1E222D]">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-1.5 rounded-full text-xs transition-colors whitespace-nowrap ${
                isSelected
                  ? 'bg-[#2A2E39] border border-[#363A45] text-[#dfe2f2] font-medium shadow-sm'
                  : 'text-[#c3c5d8] hover:text-[#dfe2f2] hover:bg-[#2A2E39]/40'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </section>
  );
};
