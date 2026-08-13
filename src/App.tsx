import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { HeroSection } from './components/HeroSection';
import { IndicesGrid } from './components/IndicesGrid';
import { DataTableSection } from './components/DataTableSection';
import { MarketHeatmap } from './components/MarketHeatmap';
import { RightSidebar } from './components/RightSidebar';
import { StockDetailModal } from './components/StockDetailModal';
import { SearchModal } from './components/SearchModal';
import { NewsSection } from './components/NewsSection';
import { WatchlistSection } from './components/WatchlistSection';
import { SettingsModal } from './components/SettingsModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';

import { INITIAL_INDICES, INITIAL_STOCKS, COMMUNITY_TRENDS, MARKET_NEWS } from './data/mockData';
import { MarketCategory, IndexData, StockTicker, PortfolioPosition } from './types';
import { LayoutGrid, Flame, Table, Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('Markets');
  const [viewMode, setViewMode] = useState<'overview' | 'heatmap'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('US stocks');
  const [selectedRegion, setSelectedRegion] = useState('Global');

  // Real-time market state
  const [indices, setIndices] = useState<IndexData[]>(INITIAL_INDICES);
  const [stocks, setStocks] = useState<StockTicker[]>(INITIAL_STOCKS);

  // Modals & Panels State
  const [selectedItem, setSelectedItem] = useState<StockTicker | IndexData | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // User Watchlist & Portfolio State
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(() => {
    const saved = localStorage.getItem('terminal_watchlist');
    return saved ? JSON.parse(saved) : ['AAPL', 'NVDA', 'MU', 'PLTR'];
  });

  const [portfolio, setPortfolio] = useState<PortfolioPosition[]>(() => {
    const saved = localStorage.getItem('terminal_portfolio');
    return saved ? JSON.parse(saved) : [
      { symbol: 'AAPL', shares: 10, avgBuyPrice: 215.00, currentPrice: 224.30 },
      { symbol: 'MU', shares: 25, avgBuyPrice: 125.50, currentPrice: 132.45 }
    ];
  });

  const [cashBalance, setCashBalance] = useState<number>(() => {
    const saved = localStorage.getItem('terminal_cash');
    return saved ? parseFloat(saved) : 100000.00;
  });

  const [currency, setCurrency] = useState('USD ($)');
  const [autoRefreshRate, setAutoRefreshRate] = useState(3000);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('terminal_watchlist', JSON.stringify(watchlistSymbols));
  }, [watchlistSymbols]);

  useEffect(() => {
    localStorage.setItem('terminal_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem('terminal_cash', cashBalance.toString());
  }, [cashBalance]);

  // Real-time price simulation stream
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate indices slightly
      setIndices((prev) =>
        prev.map((idx) => {
          const deltaPct = (Math.random() - 0.49) * 0.15;
          const newPrice = Math.max(0.01, idx.price * (1 + deltaPct / 100));
          const newSparkline = [...idx.sparkline.slice(1), newPrice];
          return {
            ...idx,
            price: newPrice,
            changePercent: idx.changePercent + deltaPct / 2,
            sparkline: newSparkline
          };
        })
      );

      // Fluctuate stocks slightly
      setStocks((prev) =>
        prev.map((stk) => {
          const deltaPct = (Math.random() - 0.48) * 0.25;
          const newPrice = Math.max(0.01, stk.price * (1 + deltaPct / 100));
          const newSparkline = [...stk.sparkline.slice(1), newPrice];
          return {
            ...stk,
            price: newPrice,
            changePercent: stk.changePercent + deltaPct / 2,
            sparkline: newSparkline
          };
        })
      );
    }, autoRefreshRate);

    return () => clearInterval(interval);
  }, [autoRefreshRate]);

  // Filter indices by selected category
  const filteredIndices = indices.filter((idx) => idx.category === selectedCategory);
  const displayIndices = filteredIndices.length >= 3 ? filteredIndices.slice(0, 3) : indices.slice(0, 3);

  // Filter stocks by category
  const filteredStocks = stocks.filter((stk) => stk.category === selectedCategory);
  const displayStocks = filteredStocks.length > 0 ? filteredStocks : stocks;

  const handleToggleWatchlist = (symbol: string) => {
    setWatchlistSymbols((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const handleExecuteTrade = (
    symbol: string,
    name: string,
    price: number,
    shares: number,
    isBuy: boolean
  ) => {
    if (isBuy) {
      const cost = price * shares;
      if (cost > cashBalance) return;
      setCashBalance((prev) => prev - cost);

      setPortfolio((prev) => {
        const existingIndex = prev.findIndex((p) => p.symbol === symbol);
        if (existingIndex >= 0) {
          const existing = prev[existingIndex];
          const totalShares = existing.shares + shares;
          const totalCost = existing.avgBuyPrice * existing.shares + cost;
          const updated = [...prev];
          updated[existingIndex] = {
            ...existing,
            shares: totalShares,
            avgBuyPrice: totalCost / totalShares,
            currentPrice: price
          };
          return updated;
        } else {
          return [...prev, { symbol, shares, avgBuyPrice: price, currentPrice: price }];
        }
      });
    } else {
      // Sell
      setPortfolio((prev) => {
        const existingIndex = prev.findIndex((p) => p.symbol === symbol);
        if (existingIndex < 0) return prev;
        const existing = prev[existingIndex];
        const sharesToSell = Math.min(existing.shares, shares);
        const revenue = price * sharesToSell;
        setCashBalance((c) => c + revenue);

        if (existing.shares <= sharesToSell) {
          return prev.filter((p) => p.symbol !== symbol);
        } else {
          const updated = [...prev];
          updated[existingIndex] = {
            ...existing,
            shares: existing.shares - sharesToSell,
            currentPrice: price
          };
          return updated;
        }
      });
    }
  };

  const handleSelectTickerBySymbol = (symbol: string) => {
    const foundStock = stocks.find((s) => s.symbol === symbol);
    if (foundStock) {
      setSelectedItem(foundStock);
      return;
    }
    const foundIndex = indices.find((i) => i.symbol === symbol);
    if (foundIndex) {
      setSelectedItem(foundIndex);
    }
  };

  return (
    <div className="bg-[#0f131e] text-[#dfe2f2] min-h-screen flex flex-col font-sans antialiased selection:bg-[#2962ff] selection:text-white">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenTradeSimulator={() => setActiveTab('Watchlist')}
        watchlistCount={watchlistSymbols.length}
      />

      {/* Scrolling Live Ticker Tape Bar */}
      <TickerTape
        indices={indices}
        stocks={stocks}
        onSelectTicker={handleSelectTickerBySymbol}
      />

      <main className="flex-1 pb-12">
        {activeTab === 'Markets' || activeTab === 'Products' || activeTab === 'Community' || activeTab === 'Brokers' ? (
          <>
            {/* Hero Section */}
            <HeroSection
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
            />

            {/* Layout Mode Selector Bar */}
            <div className="max-w-[1440px] mx-auto px-6 mb-6 flex justify-between items-center">
              <div className="flex items-center gap-2 bg-[#1E222D] border border-[#363A45] p-1 rounded-xl text-xs font-mono-data">
                <button
                  onClick={() => setViewMode('overview')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                    viewMode === 'overview'
                      ? 'bg-[#b6c4ff] text-[#002780] shadow-sm'
                      : 'text-[#c3c5d8] hover:text-[#dfe2f2]'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Overview & Screener</span>
                </button>
                <button
                  onClick={() => setViewMode('heatmap')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                    viewMode === 'heatmap'
                      ? 'bg-[#b6c4ff] text-[#002780] shadow-sm'
                      : 'text-[#c3c5d8] hover:text-[#dfe2f2]'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Market Heatmap</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-mono-data text-[#c3c5d8]">
                <Activity className="w-3.5 h-3.5 text-[#00E676] animate-pulse" />
                <span>Stream Rate: {(autoRefreshRate / 1000).toFixed(0)}s</span>
              </div>
            </div>

            {/* Main Content Area Grid */}
            <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {viewMode === 'overview' ? (
                <>
                  {/* Left Main Column (Indices & Volume Data Table) */}
                  <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-8">
                    {/* Indices Section */}
                    <IndicesGrid
                      indices={displayIndices}
                      onSelectIndex={(item) => setSelectedItem(item)}
                    />

                    {/* Data Table Section */}
                    <DataTableSection
                      stocks={displayStocks}
                      onSelectStock={(stock) => setSelectedItem(stock)}
                      watchlistSymbols={watchlistSymbols}
                      onToggleWatchlist={handleToggleWatchlist}
                    />
                  </div>

                  {/* Right Sidebar (Market Status, Community Trends, Order Depth, Economic Calendar) */}
                  <div className="lg:col-span-4 xl:col-span-3">
                    <RightSidebar
                      communityTrends={COMMUNITY_TRENDS}
                      stocks={stocks}
                      onSelectTicker={handleSelectTickerBySymbol}
                    />
                  </div>
                </>
              ) : (
                /* Full Heatmap Mode */
                <div className="lg:col-span-12">
                  <MarketHeatmap
                    stocks={stocks}
                    onSelectStock={(stock) => setSelectedItem(stock)}
                  />
                </div>
              )}
            </div>
          </>
        ) : activeTab === 'News' ? (
          <NewsSection news={MARKET_NEWS} onSelectTicker={handleSelectTickerBySymbol} />
        ) : activeTab === 'Watchlist' ? (
          <WatchlistSection
            watchlistSymbols={watchlistSymbols}
            stocks={stocks}
            portfolio={portfolio}
            cashBalance={cashBalance}
            onSelectTicker={handleSelectTickerBySymbol}
            onRemoveFromWatchlist={handleToggleWatchlist}
          />
        ) : null}
      </main>

      {/* Ticker Detail & AI Analyst Modal */}
      <StockDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isWatchlisted={selectedItem ? watchlistSymbols.includes(selectedItem.symbol) : false}
        onToggleWatchlist={handleToggleWatchlist}
        cashBalance={cashBalance}
        onExecuteTrade={handleExecuteTrade}
      />

      {/* Global Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        stocks={stocks}
        indices={indices}
        onSelectTicker={handleSelectTickerBySymbol}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currency={currency}
        setCurrency={setCurrency}
        autoRefreshRate={autoRefreshRate}
        setAutoRefreshRate={setAutoRefreshRate}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectTicker={handleSelectTickerBySymbol}
      />
    </div>
  );
}
