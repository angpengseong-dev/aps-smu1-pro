import React from 'react';
import { IndexData, StockTicker } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerTapeProps {
  indices: IndexData[];
  stocks: StockTicker[];
  onSelectTicker: (symbol: string) => void;
}

export const TickerTape: React.FC<TickerTapeProps> = ({ indices, stocks, onSelectTicker }) => {
  const allTickers = [
    ...indices.map((i) => ({ symbol: i.symbol, name: i.name, price: i.price, changePercent: i.changePercent })),
    ...stocks.map((s) => ({ symbol: s.symbol, name: s.name, price: s.price, changePercent: s.changePercent }))
  ];

  return (
    <div className="bg-[#171b26] border-b border-[#363A45] py-1 px-4 overflow-hidden text-xs font-mono-data select-none relative z-30">
      <div className="flex items-center gap-6 animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
        {allTickers.concat(allTickers).map((item, idx) => {
          const isUp = item.changePercent >= 0;
          return (
            <button
              key={`${item.symbol}-${idx}`}
              onClick={() => onSelectTicker(item.symbol)}
              className="inline-flex items-center gap-1.5 hover:bg-[#2A2E39] px-2 py-0.5 rounded transition-colors group cursor-pointer"
            >
              <span className="font-bold text-[#dfe2f2] group-hover:text-[#b6c4ff]">{item.symbol}</span>
              <span className="text-[#c3c5d8]">
                ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`font-bold text-[11px] flex items-center ${isUp ? 'text-[#00E676]' : 'text-[#FF5252]'}`}>
                {isUp ? '▲' : '▼'} {isUp ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
