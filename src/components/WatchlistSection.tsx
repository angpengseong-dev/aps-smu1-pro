import React from 'react';
import { StockTicker, PortfolioPosition } from '../types';
import { Star, Trash2, ArrowUpRight, ArrowDownRight, Briefcase, TrendingUp } from 'lucide-react';

interface WatchlistSectionProps {
  watchlistSymbols: string[];
  stocks: StockTicker[];
  portfolio: PortfolioPosition[];
  cashBalance: number;
  onSelectTicker: (symbol: string) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
}

export const WatchlistSection: React.FC<WatchlistSectionProps> = ({
  watchlistSymbols,
  stocks,
  portfolio,
  cashBalance,
  onSelectTicker,
  onRemoveFromWatchlist
}) => {
  const watchlistedStocks = stocks.filter((s) => watchlistSymbols.includes(s.symbol));

  const totalPortfolioValue = portfolio.reduce((acc, pos) => {
    const stock = stocks.find((s) => s.symbol === pos.symbol);
    const price = stock ? stock.price : pos.currentPrice;
    return acc + price * pos.shares;
  }, 0);

  const netWorth = cashBalance + totalPortfolioValue;

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto px-6 py-6">
      {/* Portfolio Summary Banner */}
      <div className="bg-[#1E222D] border border-[#363A45] rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
        <div>
          <div className="text-xs font-bold text-[#c3c5d8] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-[#b6c4ff]" />
            <span>Total Account Value</span>
          </div>
          <div className="text-3xl font-extrabold font-mono-data text-[#dfe2f2]">
            ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-[#c3c5d8] uppercase tracking-wider mb-1">Available Cash</div>
          <div className="text-2xl font-bold font-mono-data text-[#00E676]">
            ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-[#c3c5d8] uppercase tracking-wider mb-1">Open Positions Value</div>
          <div className="text-2xl font-bold font-mono-data text-[#b6c4ff]">
            ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Holdings Section */}
      {portfolio.length > 0 && (
        <div className="bg-[#1E222D] border border-[#363A45] rounded-lg overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#363A45] flex justify-between items-center bg-[#171b26]">
            <h3 className="text-sm font-bold text-[#dfe2f2] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00E676]" />
              <span>Active Portfolio Holdings</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono-data text-xs border-collapse">
              <thead>
                <tr className="bg-[#2A2E39] border-b border-[#363A45] text-[#c3c5d8] text-[11px] uppercase">
                  <th className="p-3">TICKER</th>
                  <th className="p-3">SHARES</th>
                  <th className="p-3">AVG BUY</th>
                  <th className="p-3">CURRENT PRICE</th>
                  <th className="p-3 text-right">TOTAL VALUE</th>
                  <th className="p-3 text-right">PROFIT / LOSS</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((pos) => {
                  const stock = stocks.find((s) => s.symbol === pos.symbol);
                  const currPrice = stock ? stock.price : pos.currentPrice;
                  const totalVal = currPrice * pos.shares;
                  const costBasis = pos.avgBuyPrice * pos.shares;
                  const pnl = totalVal - costBasis;
                  const pnlPercent = (pnl / costBasis) * 100;
                  const isProfit = pnl >= 0;

                  return (
                    <tr
                      key={pos.symbol}
                      onClick={() => onSelectTicker(pos.symbol)}
                      className="border-b border-[#363A45] hover:bg-[#2A2E39]/60 cursor-pointer transition-colors"
                    >
                      <td className="p-3 font-bold text-[#dfe2f2]">{pos.symbol}</td>
                      <td className="p-3 text-[#dfe2f2]">{pos.shares}</td>
                      <td className="p-3 text-[#c3c5d8]">${pos.avgBuyPrice.toFixed(2)}</td>
                      <td className="p-3 font-bold text-[#dfe2f2]">${currPrice.toFixed(2)}</td>
                      <td className="p-3 text-right font-bold text-[#dfe2f2]">${totalVal.toFixed(2)}</td>
                      <td className={`p-3 text-right font-bold ${isProfit ? 'text-[#00E676]' : 'text-[#FF5252]'}`}>
                        {isProfit ? '+' : ''}${pnl.toFixed(2)} ({isProfit ? '+' : ''}{pnlPercent.toFixed(1)}%)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Saved Watchlist Section */}
      <div className="bg-[#1E222D] border border-[#363A45] rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#363A45] flex justify-between items-center bg-[#171b26]">
          <h3 className="text-sm font-bold text-[#dfe2f2] flex items-center gap-2">
            <Star className="w-4 h-4 text-[#00E676] fill-[#00E676]" />
            <span>Starred Watchlist Tickers</span>
          </h3>
          <span className="text-xs text-[#c3c5d8] font-mono-data">
            {watchlistedStocks.length} Saved Items
          </span>
        </div>

        {watchlistedStocks.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#c3c5d8]">
            Your watchlist is empty. Star tickers on the Markets overview table to track them here!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono-data text-xs border-collapse">
              <thead>
                <tr className="bg-[#2A2E39] border-b border-[#363A45] text-[#c3c5d8] text-[11px] uppercase">
                  <th className="p-3">TICKER</th>
                  <th className="p-3">NAME</th>
                  <th className="p-3">PRICE</th>
                  <th className="p-3 text-right">24H CHANGE</th>
                  <th className="p-3 text-right">VOLUME</th>
                  <th className="p-3 text-center w-12">REMOVE</th>
                </tr>
              </thead>
              <tbody>
                {watchlistedStocks.map((stock) => {
                  const isUp = stock.changePercent >= 0;

                  return (
                    <tr
                      key={stock.symbol}
                      onClick={() => onSelectTicker(stock.symbol)}
                      className="border-b border-[#363A45] hover:bg-[#2A2E39]/60 cursor-pointer transition-colors"
                    >
                      <td className="p-3 font-bold text-[#dfe2f2] text-sm">{stock.symbol}</td>
                      <td className="p-3 text-[#c3c5d8] font-sans">{stock.name}</td>
                      <td className="p-3 font-bold text-[#dfe2f2]">${stock.price.toFixed(2)}</td>
                      <td className={`p-3 text-right font-bold ${isUp ? 'text-[#00E676]' : 'text-[#FF5252]'}`}>
                        {isUp ? `+${stock.changePercent}%` : `${stock.changePercent}%`}
                      </td>
                      <td className="p-3 text-right text-[#c3c5d8]">{stock.volume}</td>
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onRemoveFromWatchlist(stock.symbol)}
                          className="p-1 rounded text-[#8d90a2] hover:text-[#FF5252] hover:bg-[#2A2E39]"
                          title="Remove from Watchlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
