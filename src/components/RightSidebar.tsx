import React, { useState, useEffect } from 'react';
import { CommunityTrend, StockTicker } from '../types';
import { Clock, Calendar, Zap, Activity, ShieldCheck, Layers } from 'lucide-react';

interface RightSidebarProps {
  communityTrends: CommunityTrend[];
  stocks: StockTicker[];
  onSelectTicker: (symbol: string) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  communityTrends,
  stocks,
  onSelectTicker
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(13500); // ~3h 45m
  const [activeRightTab, setActiveRightTab] = useState<'trends' | 'orderbook'>('trends');

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours}h ${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  // Order Book Bids & Asks simulation for top ticker (NVDA or MU)
  const orderBookTicker = stocks[0] || { symbol: 'NVDA', price: 128.90 };
  const baseP = orderBookTicker.price;

  const bids = [
    { price: (baseP - 0.05).toFixed(2), size: 1420 },
    { price: (baseP - 0.12).toFixed(2), size: 3100 },
    { price: (baseP - 0.20).toFixed(2), size: 2850 },
    { price: (baseP - 0.35).toFixed(2), size: 5400 }
  ];

  const asks = [
    { price: (baseP + 0.05).toFixed(2), size: 1850 },
    { price: (baseP + 0.10).toFixed(2), size: 2400 },
    { price: (baseP + 0.22).toFixed(2), size: 3900 },
    { price: (baseP + 0.40).toFixed(2), size: 6100 }
  ];

  return (
    <aside className="flex flex-col gap-4">
      {/* Market Status & Sentiment Card */}
      <div className="bg-[#1E222D] border border-[#363A45] rounded-xl p-4 flex flex-col gap-3.5 relative overflow-hidden shadow-sm">
        <div className="flex justify-between items-center border-b border-[#363A45] pb-2.5">
          <span className="text-[11px] font-bold font-mono-data text-[#c3c5d8] uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#b6c4ff]" />
            NYSE / NASDAQ FEED
          </span>
          <div className="flex items-center gap-1.5 bg-[#00E676]/10 border border-[#00E676]/30 px-2 py-0.5 rounded text-[11px] font-bold text-[#00E676]">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-ping"></span>
            <span>LIVE</span>
          </div>
        </div>

        <div>
          <div className="text-xs text-[#c3c5d8] flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#b6c4ff]" />
              Market Closes In:
            </span>
            <span className="text-[#dfe2f2] font-bold font-mono-data bg-[#2A2E39] px-2 py-0.5 rounded border border-[#363A45]">
              {formatCountdown(secondsRemaining)}
            </span>
          </div>
        </div>

        {/* Sentiment Gauge */}
        <div className="space-y-1.5 pt-2 border-t border-[#363A45]">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#c3c5d8]">Fear & Greed Index</span>
            <span className="font-bold text-[#00E676] font-mono-data">74 - Extreme Greed</span>
          </div>
          <div className="w-full bg-[#2A2E39] h-2 rounded-full overflow-hidden flex">
            <div className="bg-[#FF5252] h-full w-[20%]"></div>
            <div className="bg-[#FFB74D] h-full w-[30%]"></div>
            <div className="bg-[#00E676] h-full w-[50%]"></div>
          </div>
        </div>
      </div>

      {/* Community Trends vs Order Book Depth Tab Box */}
      <div className="bg-[#1E222D] border border-[#363A45] rounded-xl flex flex-col shadow-sm overflow-hidden">
        {/* Tab Headers */}
        <div className="p-2 border-b border-[#363A45] flex items-center gap-1 bg-[#171b26] text-xs font-mono-data">
          <button
            onClick={() => setActiveRightTab('trends')}
            className={`flex-1 py-1.5 rounded font-bold transition-colors ${
              activeRightTab === 'trends' ? 'bg-[#2A2E39] text-[#b6c4ff] border border-[#363A45]' : 'text-[#c3c5d8] hover:text-[#dfe2f2]'
            }`}
          >
            Community Trends
          </button>
          <button
            onClick={() => setActiveRightTab('orderbook')}
            className={`flex-1 py-1.5 rounded font-bold transition-colors ${
              activeRightTab === 'orderbook' ? 'bg-[#2A2E39] text-[#b6c4ff] border border-[#363A45]' : 'text-[#c3c5d8] hover:text-[#dfe2f2]'
            }`}
          >
            Order Depth
          </button>
        </div>

        {activeRightTab === 'trends' ? (
          <div className="flex flex-col divide-y divide-[#363A45]">
            {communityTrends.map((trend) => {
              const isUp = trend.trend === 'up';
              const isDown = trend.trend === 'down';

              return (
                <button
                  key={trend.symbol}
                  onClick={() => onSelectTicker(trend.symbol)}
                  className="flex items-center justify-between p-3 hover:bg-[#2A2E39] transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#b6c4ff]/15 flex items-center justify-center text-[#b6c4ff] text-xs font-bold font-mono-data border border-[#b6c4ff]/30">
                      {trend.avatarLetter}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#dfe2f2] group-hover:text-[#b6c4ff] transition-colors">
                        {trend.symbol}
                      </span>
                      <span className="text-[11px] text-[#c3c5d8]">
                        {trend.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold font-mono-data ${isUp ? 'text-[#00E676]' : isDown ? 'text-[#FF5252]' : 'text-[#c3c5d8]'}`}>
                      {isUp ? `+${trend.changePercent}%` : `${trend.changePercent}%`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Order Book Depth Simulation */
          <div className="p-3 text-xs font-mono-data space-y-2">
            <div className="flex justify-between items-center text-[11px] text-[#c3c5d8] pb-1 border-b border-[#363A45]">
              <span>PRICE (${orderBookTicker.symbol})</span>
              <span>SIZE</span>
            </div>

            {/* Asks (Sells - Red) */}
            <div className="space-y-1">
              {asks.slice().reverse().map((ask, i) => (
                <div key={i} className="flex justify-between items-center text-[#FF5252] bg-[#FF5252]/10 px-2 py-0.5 rounded">
                  <span>${ask.price}</span>
                  <span>{ask.size}</span>
                </div>
              ))}
            </div>

            <div className="text-center py-1 font-bold text-[#dfe2f2] border-y border-[#363A45] bg-[#2A2E39]/50">
              SPREAD $0.10 • LAST ${orderBookTicker.price.toFixed(2)}
            </div>

            {/* Bids (Buys - Green) */}
            <div className="space-y-1">
              {bids.map((bid, i) => (
                <div key={i} className="flex justify-between items-center text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded">
                  <span>${bid.price}</span>
                  <span>{bid.size}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Economic Catalyst Calendar Widget */}
      <div className="bg-[#1E222D] border border-[#363A45] rounded-xl p-4 flex flex-col gap-3 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#363A45] pb-2">
          <Calendar className="w-4 h-4 text-[#b6c4ff]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#dfe2f2]">Macro Economic Events</h4>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center py-1.5 border-b border-[#363A45]/50">
            <div>
              <div className="font-semibold text-[#dfe2f2]">FOMC Rate Decision</div>
              <div className="text-[10px] text-[#c3c5d8]">High Volatility Impact</div>
            </div>
            <span className="text-[10px] font-bold text-[#b6c4ff] bg-[#2A2E39] px-2 py-0.5 rounded border border-[#363A45]">Tomorrow</span>
          </div>

          <div className="flex justify-between items-center py-1.5">
            <div>
              <div className="font-semibold text-[#dfe2f2]">NVDA Earnings Report</div>
              <div className="text-[10px] text-[#c3c5d8]">Post-Market Release</div>
            </div>
            <span className="text-[10px] font-bold text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded border border-[#00E676]/30">In 2 Days</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
