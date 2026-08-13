import React, { useState, useEffect } from 'react';
import { StockTicker, IndexData, AIAnalysisResult } from '../types';
import { X, Sparkles, TrendingUp, TrendingDown, Star, DollarSign, AlertCircle, RefreshCw, BarChart2, Activity, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StockDetailModalProps {
  item: StockTicker | IndexData | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string) => void;
  cashBalance: number;
  onExecuteTrade: (symbol: string, name: string, price: number, shares: number, isBuy: boolean) => void;
}

type Timeframe = '1D' | '1W' | '1M' | '1Y' | '5Y';
type ChartStyle = 'line' | 'candlestick';

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  item,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  cashBalance,
  onExecuteTrade
}) => {
  if (!item) return null;

  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('line');
  const [showIndicators, setShowIndicators] = useState(true);
  const [aiReport, setAiReport] = useState<AIAnalysisResult | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [tradeShares, setTradeShares] = useState(10);
  const [orderType, setOrderType] = useState<'Market' | 'Limit'>('Market');
  const [tradeSuccessMsg, setTradeSuccessMsg] = useState<string | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const isUp = item.changePercent >= 0;

  // Generate synthetic chart data
  const generateChartData = () => {
    const basePrice = item.price;
    const points = 32;
    const data: { label: string; open: number; high: number; low: number; close: number; volume: number }[] = [];
    const volatility = (Math.abs(item.changePercent) || 2) / 80;

    let current = basePrice * 0.92;
    for (let i = 0; i < points; i++) {
      const change = (Math.sin(i / 2.5) + (Math.random() - 0.45)) * volatility * current;
      const open = current;
      const close = Math.max(0.1, open + change);
      const high = Math.max(open, close) + Math.random() * volatility * current * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * current * 0.5;
      const volume = Math.floor(Math.random() * 500000 + 100000);

      data.push({
        label: `Pt ${i + 1}`,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume
      });
      current = close;
    }
    // Set last point close to actual price
    data[data.length - 1].close = item.price;
    return data;
  };

  const chartData = generateChartData();
  const allValues = chartData.flatMap((d) => [d.high, d.low]);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const range = maxVal - minVal || 1;

  // SVG dimensions
  const svgWidth = 640;
  const svgHeight = 220;

  // Line path
  const linePathD = chartData
    .map((d, i) => {
      const x = (i / (chartData.length - 1)) * svgWidth;
      const y = svgHeight - ((d.close - minVal) / range) * (svgHeight - 30) - 15;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  // Moving average line (MA20 simulation)
  const maPathD = chartData
    .map((d, i) => {
      const x = (i / (chartData.length - 1)) * svgWidth;
      // average of last 5
      const slice = chartData.slice(Math.max(0, i - 4), i + 1);
      const avg = slice.reduce((a, b) => a + b.close, 0) / slice.length;
      const y = svgHeight - ((avg - minVal) / range) * (svgHeight - 30) - 15;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const fetchAiAnalysis = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: item.symbol,
          name: item.name,
          price: item.price,
          changePercent: item.changePercent
        })
      });
      const data = await res.json();
      setAiReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleBuy = () => {
    const cost = item.price * tradeShares;
    if (cost > cashBalance) {
      setTradeSuccessMsg(`Insufficient Funds! Required: $${cost.toFixed(2)}, Available: $${cashBalance.toFixed(2)}`);
      return;
    }
    onExecuteTrade(item.symbol, item.name, item.price, tradeShares, true);
    setTradeSuccessMsg(`Executed Market BUY: ${tradeShares} shares of ${item.symbol} @ $${item.price.toFixed(2)}`);
    setTimeout(() => setTradeSuccessMsg(null), 3500);
  };

  const handleSell = () => {
    onExecuteTrade(item.symbol, item.name, item.price, tradeShares, false);
    setTradeSuccessMsg(`Executed Market SELL: ${tradeShares} shares of ${item.symbol} @ $${item.price.toFixed(2)}`);
    setTimeout(() => setTradeSuccessMsg(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1E222D] border border-[#363A45] rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Topbar */}
        <div className="p-4 border-b border-[#363A45] flex justify-between items-center bg-[#171b26]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2A2E39] border border-[#363A45] flex items-center justify-center font-bold text-base text-[#b6c4ff] font-mono-data shadow-inner">
              {item.symbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#dfe2f2]">{item.name}</h3>
                <span className="text-xs text-[#b6c4ff] font-mono-data font-bold bg-[#2962ff]/20 border border-[#2962ff]/40 px-2 py-0.5 rounded">
                  {('category' in item && item.category) || 'EQUITY'}
                </span>
              </div>
              <p className="text-xs text-[#c3c5d8] font-mono-data">Exchange: NASDAQ • Real-Time L1 Direct Stream</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(item.symbol)}
              className={`p-2 rounded-lg border transition-colors ${
                isWatchlisted 
                  ? 'border-[#00E676] bg-[#00E676]/10 text-[#00E676]' 
                  : 'border-[#363A45] text-[#c3c5d8] hover:text-[#dfe2f2]'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-[#00E676]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-[#363A45] text-[#c3c5d8] hover:text-[#dfe2f2] hover:bg-[#2A2E39] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Header Stats & Chart Controls */}
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div>
              <div className="text-4xl font-extrabold font-mono-data text-[#dfe2f2] tracking-tight">
                ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`text-sm font-bold font-mono-data flex items-center gap-1.5 mt-1 ${isUp ? 'text-[#00E676]' : 'text-[#FF5252]'}`}>
                {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{isUp ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}</span>
                <span className="text-xs text-[#c3c5d8] font-sans">
                  ({isUp ? '+' : ''}${item.changeValue ? item.changeValue.toFixed(2) : (item.price * item.changePercent / 100).toFixed(2)} Today)
                </span>
              </div>
            </div>

            {/* Timeframe & Chart Style Toggles */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Line vs Candlestick toggle */}
              <div className="flex items-center gap-1 bg-[#2A2E39] p-1 rounded-lg border border-[#363A45] text-xs font-mono-data">
                <button
                  onClick={() => setChartStyle('line')}
                  className={`px-2.5 py-1 rounded font-bold transition-colors ${
                    chartStyle === 'line' ? 'bg-[#313441] text-[#b6c4ff]' : 'text-[#c3c5d8]'
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartStyle('candlestick')}
                  className={`px-2.5 py-1 rounded font-bold transition-colors ${
                    chartStyle === 'candlestick' ? 'bg-[#313441] text-[#b6c4ff]' : 'text-[#c3c5d8]'
                  }`}
                >
                  Candles
                </button>
                <button
                  onClick={() => setShowIndicators(!showIndicators)}
                  className={`px-2.5 py-1 rounded font-bold transition-colors ${
                    showIndicators ? 'bg-[#2962ff]/20 text-[#b6c4ff]' : 'text-[#c3c5d8]'
                  }`}
                  title="Toggle MA20 Overlay"
                >
                  MA20
                </button>
              </div>

              {/* Timeframes */}
              <div className="flex items-center gap-1 bg-[#2A2E39] p-1 rounded-lg border border-[#363A45] text-xs font-mono-data">
                {(['1D', '1W', '1M', '1Y', '5Y'] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded font-bold transition-colors ${
                      timeframe === tf
                        ? 'bg-[#b6c4ff] text-[#002780]'
                        : 'text-[#c3c5d8] hover:text-[#dfe2f2]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Chart Canvas */}
          <div className="bg-[#0f131e] border border-[#363A45] rounded-xl p-4 relative overflow-hidden bg-grid-pattern shadow-inner">
            <div className="flex justify-between items-center text-[11px] text-[#c3c5d8] font-mono-data mb-2">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E676] inline-block"></span>
                <span>{timeframe} Interactive Price Canvas</span>
                {showIndicators && <span className="text-[#FFB74D]">● MA(20) Overlay</span>}
              </span>
              <span>
                Cursor: <strong className="text-[#dfe2f2]">
                  ${(hoverIndex !== null ? chartData[hoverIndex]?.close : item.price).toFixed(2)}
                </strong>
              </span>
            </div>

            <div className="h-56 relative">
              <div className={`absolute inset-0 bg-gradient-to-t ${isUp ? 'from-[#00E676]/10' : 'from-[#FF5252]/10'} to-transparent pointer-events-none`}></div>
              
              <svg 
                className="w-full h-full overflow-visible" 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                preserveAspectRatio="none"
              >
                {/* Horizontal reference grid lines */}
                <line x1="0" y1="30" x2={svgWidth} y2="30" stroke="#363A45" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="0" y1="110" x2={svgWidth} y2="110" stroke="#363A45" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="0" y1="190" x2={svgWidth} y2="190" stroke="#363A45" strokeWidth="0.5" strokeDasharray="3 3" />

                {chartStyle === 'line' ? (
                  <>
                    <path
                      d={linePathD}
                      fill="none"
                      stroke={isUp ? '#00E676' : '#FF5252'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {showIndicators && (
                      <path
                        d={maPathD}
                        fill="none"
                        stroke="#FFB74D"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                      />
                    )}
                  </>
                ) : (
                  /* Candlesticks view */
                  chartData.map((d, i) => {
                    const x = (i / (chartData.length - 1)) * svgWidth;
                    const candleUp = d.close >= d.open;
                    const color = candleUp ? '#00E676' : '#FF5252';

                    const highY = svgHeight - ((d.high - minVal) / range) * (svgHeight - 30) - 15;
                    const lowY = svgHeight - ((d.low - minVal) / range) * (svgHeight - 30) - 15;
                    const openY = svgHeight - ((d.open - minVal) / range) * (svgHeight - 30) - 15;
                    const closeY = svgHeight - ((d.close - minVal) / range) * (svgHeight - 30) - 15;

                    const bodyY = Math.min(openY, closeY);
                    const bodyH = Math.max(2, Math.abs(openY - closeY));

                    return (
                      <g key={i}>
                        <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth="1" />
                        <rect
                          x={x - 3}
                          y={bodyY}
                          width="6"
                          height={bodyH}
                          fill={color}
                          stroke={color}
                          rx="1"
                        />
                      </g>
                    );
                  })
                )}

                {/* Hover dots & crosshair */}
                {hoverIndex !== null && (
                  <>
                    <line
                      x1={(hoverIndex / (chartData.length - 1)) * svgWidth}
                      y1="0"
                      x2={(hoverIndex / (chartData.length - 1)) * svgWidth}
                      y2={svgHeight}
                      stroke="#b6c4ff"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx={(hoverIndex / (chartData.length - 1)) * svgWidth}
                      cy={svgHeight - ((chartData[hoverIndex].close - minVal) / range) * (svgHeight - 30) - 15}
                      r="5"
                      fill="#b6c4ff"
                      stroke="#0f131e"
                      strokeWidth="2"
                    />
                  </>
                )}
              </svg>

              {/* Crosshair Overlay */}
              <div 
                className="absolute inset-0 cursor-crosshair"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const idx = Math.min(chartData.length - 1, Math.max(0, Math.round((x / rect.width) * (chartData.length - 1))));
                  setHoverIndex(idx);
                }}
                onMouseLeave={() => setHoverIndex(null)}
              ></div>
            </div>
          </div>

          {/* Key Fundamental Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#171b26] p-4 rounded-xl border border-[#363A45]">
            <div>
              <div className="text-[11px] text-[#c3c5d8]">24H Volume</div>
              <div className="text-sm font-bold font-mono-data text-[#dfe2f2]">
                {('volume' in item && item.volume) || '45.2M'}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#c3c5d8]">Market Cap</div>
              <div className="text-sm font-bold font-mono-data text-[#dfe2f2]">
                {('marketCap' in item && item.marketCap) || '$145.8B'}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#c3c5d8]">52W High</div>
              <div className="text-sm font-bold font-mono-data text-[#dfe2f2]">
                ${('high52w' in item && item.high52w) || (item.price * 1.2).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#c3c5d8]">52W Low</div>
              <div className="text-sm font-bold font-mono-data text-[#dfe2f2]">
                ${('low52w' in item && item.low52w) || (item.price * 0.7).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Gemini AI Quantitative Analyst Box */}
          <div className="bg-[#2A2E39]/40 border border-[#363A45] rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#b6c4ff] animate-pulse" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#b6c4ff] font-mono-data">
                  Gemini AI Financial Intelligence Desk
                </h4>
              </div>

              <button
                onClick={fetchAiAnalysis}
                disabled={loadingAi}
                className="bg-[#2962ff] hover:bg-[#2962ff]/80 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
              >
                {loadingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{loadingAi ? 'Synthesizing Intelligence...' : 'Generate AI Report'}</span>
              </button>
            </div>

            {aiReport && (
              <div className="bg-[#171b26] p-4 rounded-xl border border-[#363A45] space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-[#363A45] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#c3c5d8]">Quantitative Signal:</span>
                    <span className={`font-bold font-mono-data px-2.5 py-0.5 rounded text-xs ${
                      aiReport.technicalSignal === 'BUY' ? 'bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/40' :
                      aiReport.technicalSignal === 'SELL' ? 'bg-[#FF5252]/20 text-[#FF5252] border border-[#FF5252]/40' :
                      'bg-[#b6c4ff]/20 text-[#b6c4ff] border border-[#b6c4ff]/40'
                    }`}>
                      {aiReport.technicalSignal}
                    </span>
                  </div>
                  <span className="text-[#c3c5d8] font-mono-data">
                    Confidence: <strong className="text-[#00E676]">{aiReport.confidenceScore}%</strong>
                  </span>
                </div>

                <p className="text-[#dfe2f2] leading-relaxed">{aiReport.summary}</p>

                {aiReport.priceTargetRange && (
                  <div className="pt-2 border-t border-[#363A45] flex justify-between items-center text-[11px] font-mono-data">
                    <span className="text-[#c3c5d8]">12M Projected Target Range:</span>
                    <span className="text-[#dfe2f2]">
                      Bear: <span className="text-[#FF5252]">${aiReport.priceTargetRange.low}</span> | Base: <strong className="text-[#b6c4ff]">${aiReport.priceTargetRange.mid}</strong> | Bull: <span className="text-[#00E676]">${aiReport.priceTargetRange.high}</span>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Paper Trading Ticket Execution */}
          <div className="bg-[#171b26] border border-[#363A45] rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#dfe2f2] font-mono-data">Simulated Order Ticket</span>
              <span className="text-xs text-[#c3c5d8] font-mono-data">
                Cash Balance: <strong className="text-[#00E676]">${cashBalance.toFixed(2)}</strong>
              </span>
            </div>

            {tradeSuccessMsg && (
              <div className="p-2.5 bg-[#00E676]/10 border border-[#00E676]/30 rounded-lg text-xs text-[#00E676] font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{tradeSuccessMsg}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 bg-[#2A2E39] border border-[#363A45] rounded-lg px-2.5 py-1.5">
                <span className="text-xs text-[#c3c5d8]">Shares:</span>
                <input
                  type="number"
                  min="1"
                  value={tradeShares}
                  onChange={(e) => setTradeShares(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 bg-transparent text-xs font-bold font-mono-data text-[#dfe2f2] text-center focus:outline-none"
                />
              </div>

              <div className="text-xs text-[#c3c5d8] font-mono-data flex-1">
                Est Total: <strong className="text-[#dfe2f2]">${(item.price * tradeShares).toFixed(2)}</strong>
              </div>

              <button
                onClick={handleBuy}
                className="bg-[#00E676] hover:opacity-90 text-[#003918] text-xs font-bold px-5 py-2 rounded-lg transition-opacity shadow-sm"
              >
                BUY {item.symbol}
              </button>
              <button
                onClick={handleSell}
                className="bg-[#FF5252] hover:opacity-90 text-white text-xs font-bold px-5 py-2 rounded-lg transition-opacity shadow-sm"
              >
                SELL {item.symbol}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
