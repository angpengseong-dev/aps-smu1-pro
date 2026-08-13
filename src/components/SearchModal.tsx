import React, { useState } from 'react';
import { StockTicker, IndexData } from '../types';
import { Search, X, TrendingUp, TrendingDown } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: StockTicker[];
  indices: IndexData[];
  onSelectTicker: (symbol: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  stocks,
  indices,
  onSelectTicker
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const filteredStocks = stocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredIndices = indices.filter(
    (i) =>
      i.symbol.toLowerCase().includes(query.toLowerCase()) ||
      i.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-[#1E222D] border border-[#363A45] rounded-xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-[#363A45] flex items-center gap-3 bg-[#171b26]">
          <Search className="w-5 h-5 text-[#b6c4ff]" />
          <input
            type="text"
            autoFocus
            placeholder="Search symbol, stock name, crypto, forex (e.g. NVDA, Bitcoin)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-[#dfe2f2] placeholder-[#c3c5d8] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-[#c3c5d8] hover:text-[#dfe2f2] hover:bg-[#2A2E39]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#363A45]">
          {filteredStocks.length === 0 && filteredIndices.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#c3c5d8]">
              No instruments found matching "{query}". Try searching for NVDA, AAPL, SPX, BTC...
            </div>
          ) : (
            <>
              {filteredIndices.map((idx) => (
                <button
                  key={idx.symbol}
                  onClick={() => {
                    onSelectTicker(idx.symbol);
                    onClose();
                  }}
                  className="w-full p-3 flex justify-between items-center hover:bg-[#2A2E39] transition-colors rounded text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded bg-[#2A2E39] border border-[#363A45] flex items-center justify-center font-mono-data text-xs font-bold text-[#b6c4ff]">
                      {idx.symbol}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-[#dfe2f2] group-hover:text-[#b6c4ff]">
                        {idx.name}
                      </div>
                      <div className="text-[10px] text-[#c3c5d8]">Index Market Benchmark</div>
                    </div>
                  </div>

                  <div className="text-right font-mono-data text-xs">
                    <div className="font-bold text-[#dfe2f2]">${idx.price.toFixed(2)}</div>
                    <div className={idx.changePercent >= 0 ? 'text-[#00E676]' : 'text-[#FF5252]'}>
                      {idx.changePercent >= 0 ? `+${idx.changePercent}%` : `${idx.changePercent}%`}
                    </div>
                  </div>
                </button>
              ))}

              {filteredStocks.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => {
                    onSelectTicker(stock.symbol);
                    onClose();
                  }}
                  className="w-full p-3 flex justify-between items-center hover:bg-[#2A2E39] transition-colors rounded text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded bg-[#2A2E39] border border-[#363A45] flex items-center justify-center font-mono-data text-xs font-bold text-[#dfe2f2]">
                      {stock.symbol}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-[#dfe2f2] group-hover:text-[#b6c4ff]">
                        {stock.name}
                      </div>
                      <div className="text-[10px] text-[#c3c5d8]">{stock.sector || 'US Equity'}</div>
                    </div>
                  </div>

                  <div className="text-right font-mono-data text-xs">
                    <div className="font-bold text-[#dfe2f2]">${stock.price.toFixed(2)}</div>
                    <div className={stock.changePercent >= 0 ? 'text-[#00E676]' : 'text-[#FF5252]'}>
                      {stock.changePercent >= 0 ? `+${stock.changePercent}%` : `${stock.changePercent}%`}
                    </div>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
