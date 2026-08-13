import React from 'react';
import { StockTicker } from '../types';
import { Grid, Flame, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MarketHeatmapProps {
  stocks: StockTicker[];
  onSelectStock: (stock: StockTicker) => void;
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({ stocks, onSelectStock }) => {
  return (
    <div className="bg-[#1E222D] border border-[#363A45] rounded-xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-[#363A45] pb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#b6c4ff]" />
          <h2 className="text-base font-bold font-display text-[#dfe2f2]">Institutional Market Heatmap</h2>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono-data">
          <span className="text-[#c3c5d8]">Sizing: <strong>Volume Weight</strong></span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#FF5252]"></span> <span className="text-[#FF5252]">-3%+</span>
            <span className="w-3 h-3 rounded bg-[#FF5252]/40"></span> <span className="text-[#FF5252]/80">-1%</span>
            <span className="w-3 h-3 rounded bg-[#00E676]/40"></span> <span className="text-[#00E676]/80">+1%</span>
            <span className="w-3 h-3 rounded bg-[#00E676]"></span> <span className="text-[#00E676]">+3%+</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 min-h-[320px]">
        {stocks.map((stock) => {
          const isUp = stock.changePercent >= 0;
          const absVal = Math.abs(stock.changePercent);

          // Color intensity calculation
          let bgClass = 'bg-[#2A2E39]';
          if (isUp) {
            if (absVal > 3) bgClass = 'bg-[#00E676]/90 text-[#0f131e]';
            else if (absVal > 1) bgClass = 'bg-[#00E676]/60 text-white';
            else bgClass = 'bg-[#00E676]/30 text-[#dfe2f2]';
          } else {
            if (absVal > 3) bgClass = 'bg-[#FF5252]/90 text-white';
            else if (absVal > 1) bgClass = 'bg-[#FF5252]/60 text-white';
            else bgClass = 'bg-[#FF5252]/30 text-[#dfe2f2]';
          }

          return (
            <div
              key={stock.symbol}
              onClick={() => onSelectStock(stock)}
              className={`${bgClass} rounded-lg p-4 flex flex-col justify-between border border-[#363A45] hover:scale-[1.02] transition-transform cursor-pointer group shadow-sm`}
            >
              <div className="flex justify-between items-start">
                <span className="font-extrabold text-base font-mono-data tracking-tight group-hover:underline">
                  {stock.symbol}
                </span>
                <span className="text-[10px] uppercase font-semibold opacity-80">
                  {stock.sector || 'Equity'}
                </span>
              </div>

              <div className="my-2 text-xs font-sans opacity-90 truncate font-medium">
                {stock.name}
              </div>

              <div className="flex justify-between items-end font-mono-data font-bold">
                <span className="text-sm">${stock.price.toFixed(2)}</span>
                <span className="text-xs flex items-center">
                  {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {isUp ? `+${stock.changePercent.toFixed(1)}%` : `${stock.changePercent.toFixed(1)}%`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
