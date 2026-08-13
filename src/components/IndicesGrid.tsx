import React from 'react';
import { IndexData } from '../types';

interface IndicesGridProps {
  indices: IndexData[];
  onSelectIndex: (indexItem: IndexData) => void;
}

export const IndicesGrid: React.FC<IndicesGridProps> = ({ indices, onSelectIndex }) => {
  // Generate SVG path for sparkline array
  const createSparklinePath = (points: number[]) => {
    if (!points || points.length === 0) return '';
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 100;
    const height = 30;

    return points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * width;
        // Invert Y axis for SVG (0 at top)
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 
          className="text-xl font-semibold font-display flex items-center gap-1 cursor-pointer hover:text-[#b6c4ff] transition-colors"
        >
          <span>Indices</span>
          <span className="material-symbols-outlined text-lg">chevron_right</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indices.map((item) => {
          const isUp = item.changePercent >= 0;
          const strokeColor = isUp ? '#00E676' : '#FF5252';
          const bgGradientClass = isUp ? 'from-[#00E676]/20' : 'from-[#FF5252]/20';
          const pathD = createSparklinePath(item.sparkline);

          return (
            <div
              key={item.symbol}
              onClick={() => onSelectIndex(item)}
              className="bg-[#1E222D] border border-[#363A45] rounded-lg p-4 flex flex-col hover:border-[#434656] transition-all cursor-pointer group shadow-sm hover:shadow-md"
            >
              {/* Header: Badge, Name, Change Badge */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-[#2A2E39] flex items-center justify-center text-[11px] font-bold text-[#dfe2f2] border border-[#363A45] font-mono-data">
                    {item.symbol}
                  </div>
                  <span className="text-sm font-semibold text-[#dfe2f2] group-hover:text-[#b6c4ff] transition-colors">
                    {item.name}
                  </span>
                </div>
                <span 
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold font-mono-data ${
                    isUp 
                      ? 'text-[#00E676] bg-[#00E676]/10' 
                      : 'text-[#FF5252] bg-[#FF5252]/10'
                  }`}
                >
                  {isUp ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                </span>
              </div>

              {/* Price & Sparkline */}
              <div className="mt-auto">
                <div className="text-lg font-bold font-mono-data text-[#dfe2f2]">
                  {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>

                <div className="h-10 mt-2 rounded bg-[#0f131e] overflow-hidden relative border border-[#363A45]">
                  <div className={`absolute bottom-0 left-0 h-full w-full bg-gradient-to-t ${bgGradientClass} to-transparent opacity-60`}></div>
                  <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path
                      d={pathD}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
