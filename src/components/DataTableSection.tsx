import React, { useState } from 'react';
import { StockTicker } from '../types';
import { Star, ArrowUpDown, ChevronRight, Search, Zap, ExternalLink } from 'lucide-react';

interface DataTableSectionProps {
  stocks: StockTicker[];
  onSelectStock: (stock: StockTicker) => void;
  watchlistSymbols: string[];
  onToggleWatchlist: (symbol: string) => void;
  onSeeAll?: () => void;
}

type TableTab = 'volume' | 'gainers' | 'losers' | 'all';
type SortField = 'symbol' | 'price' | 'changePercent' | 'volumeNum';

export const DataTableSection: React.FC<DataTableSectionProps> = ({
  stocks,
  onSelectStock,
  watchlistSymbols,
  onToggleWatchlist,
  onSeeAll
}) => {
  const [activeTab, setActiveTab] = useState<TableTab>('volume');
  const [showAll, setShowAll] = useState(false);
  const [tableSearch, setTableSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('volumeNum');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getProcessedStocks = () => {
    let list = [...stocks];

    // Filter search
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      list = list.filter((s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
    }

    // Filter tab
    if (activeTab === 'gainers') {
      list = list.filter((s) => s.changePercent > 0);
    } else if (activeTab === 'losers') {
      list = list.filter((s) => s.changePercent < 0);
    }

    // Sort
    list.sort((a, b) => {
      let valA = a[sortField] || 0;
      let valB = b[sortField] || 0;
      if (typeof valA === 'string') valA = (valA as string).toLowerCase();
      if (typeof valB === 'string') valB = (valB as string).toLowerCase();

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return showAll ? list : list.slice(0, 6);
  };

  const displayed = getProcessedStocks();

  // Create mini sparkline path
  const createMiniPath = (points: number[]) => {
    if (!points || points.length === 0) return '';
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    return points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * 60;
        const y = 18 - ((val - min) / range) * 14 - 2;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  return (
    <section className="bg-[#1E222D] border border-[#363A45] rounded-xl overflow-hidden shadow-md">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-[#363A45] flex flex-wrap justify-between items-center gap-3 bg-[#171b26]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#b6c4ff]" />
            <h3 className="text-base font-bold font-display text-[#dfe2f2]">
              Market Tickers & Screener
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-[#2A2E39] p-0.5 rounded-lg border border-[#363A45] text-xs font-mono-data">
            {[
              { id: 'volume', label: 'Volume' },
              { id: 'gainers', label: 'Gainers' },
              { id: 'losers', label: 'Losers' },
              { id: 'all', label: 'All Tickers' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TableTab)}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#313441] text-[#b6c4ff] font-bold shadow-sm'
                    : 'text-[#c3c5d8] hover:text-[#dfe2f2]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* In-table search input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#c3c5d8]" />
            <input
              type="text"
              placeholder="Filter table..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="bg-[#2A2E39] border border-[#363A45] rounded text-xs pl-8 pr-2.5 py-1 text-[#dfe2f2] placeholder-[#c3c5d8] focus:outline-none focus:border-[#b6c4ff] w-36 sm:w-48 font-mono-data"
            />
          </div>

          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-[11px] font-bold font-mono-data text-[#b6c4ff] hover:underline uppercase tracking-wider flex items-center gap-0.5 bg-[#2A2E39] px-2.5 py-1 rounded border border-[#363A45]"
          >
            <span>{showAll ? 'Collapse' : 'Expand All'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#2A2E39]/80 border-b border-[#363A45] text-[#c3c5d8] text-[11px] font-bold tracking-wider uppercase font-mono-data">
              <th className="p-3 cursor-pointer hover:text-[#dfe2f2]" onClick={() => handleSort('symbol')}>
                <div className="flex items-center gap-1">
                  <span>TICKER & NAME</span>
                  <ArrowUpDown className="w-3 h-3 text-[#c3c5d8]" />
                </div>
              </th>
              <th className="p-3 cursor-pointer hover:text-[#dfe2f2]" onClick={() => handleSort('price')}>
                <div className="flex items-center gap-1">
                  <span>PRICE</span>
                  <ArrowUpDown className="w-3 h-3 text-[#c3c5d8]" />
                </div>
              </th>
              <th className="p-3 text-right cursor-pointer hover:text-[#dfe2f2]" onClick={() => handleSort('changePercent')}>
                <div className="flex items-center justify-end gap-1">
                  <span>24H CHANGE</span>
                  <ArrowUpDown className="w-3 h-3 text-[#c3c5d8]" />
                </div>
              </th>
              <th className="p-3 text-center">24H TREND</th>
              <th className="p-3 text-right cursor-pointer hover:text-[#dfe2f2]" onClick={() => handleSort('volumeNum')}>
                <div className="flex items-center justify-end gap-1">
                  <span>VOLUME</span>
                  <ArrowUpDown className="w-3 h-3 text-[#c3c5d8]" />
                </div>
              </th>
              <th className="p-3 text-right hidden lg:table-cell">MARKET CAP</th>
              <th className="p-3 text-center w-12">STAR</th>
            </tr>
          </thead>
          <tbody className="font-mono-data text-xs divide-y divide-[#363A45]/60">
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-xs text-[#c3c5d8]">
                  No matching stock tickers found for "{tableSearch}".
                </td>
              </tr>
            ) : (
              displayed.map((stock, index) => {
                const isUp = stock.changePercent >= 0;
                const isWatchlisted = watchlistSymbols.includes(stock.symbol);
                const sparkPath = createMiniPath(stock.sparkline);

                return (
                  <tr
                    key={stock.symbol}
                    onClick={() => onSelectStock(stock)}
                    className={`hover:bg-[#2A2E39] transition-colors cursor-pointer group ${
                      index % 2 === 1 ? 'bg-[#1E222D]' : 'bg-[#171b26]'
                    }`}
                  >
                    {/* Ticker Symbol & Name */}
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#2A2E39] border border-[#363A45] flex items-center justify-center font-bold text-xs text-[#b6c4ff]">
                          {stock.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="font-bold text-[#dfe2f2] group-hover:text-[#b6c4ff] transition-colors flex items-center gap-1.5">
                            <span>{stock.symbol}</span>
                            {stock.isPopular && (
                              <span className="text-[9px] bg-[#2962ff]/20 text-[#b6c4ff] px-1.5 py-0.2 rounded font-sans uppercase">
                                Popular
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#c3c5d8] font-sans truncate max-w-[150px]">
                            {stock.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-3 font-bold text-[#dfe2f2] text-sm">
                      ${stock.price.toFixed(2)}
                    </td>

                    {/* 24h Change Pill */}
                    <td className="p-3 text-right">
                      <span 
                        className={`inline-block px-2.5 py-1 rounded font-bold text-xs ${
                          isUp 
                            ? 'text-[#00E676] bg-[#00E676]/15 border border-[#00E676]/30' 
                            : 'text-[#FF5252] bg-[#FF5252]/15 border border-[#FF5252]/30'
                        }`}
                      >
                        {isUp ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                      </span>
                    </td>

                    {/* Inline Sparkline */}
                    <td className="p-3 text-center">
                      <div className="w-16 h-5 mx-auto relative overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 60 20">
                          <path
                            d={sparkPath}
                            fill="none"
                            stroke={isUp ? '#00E676' : '#FF5252'}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </td>

                    {/* Volume */}
                    <td className="p-3 text-right text-[#c3c5d8] font-medium">
                      {stock.volume}
                    </td>

                    {/* Market Cap */}
                    <td className="p-3 text-right text-[#c3c5d8] hidden lg:table-cell">
                      {stock.marketCap}
                    </td>

                    {/* Star Button */}
                    <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleWatchlist(stock.symbol)}
                        className={`p-1.5 rounded hover:bg-[#2A2E39] transition-colors ${
                          isWatchlisted ? 'text-[#00E676]' : 'text-[#8d90a2] hover:text-[#dfe2f2]'
                        }`}
                        title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-[#00E676]' : ''}`} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
