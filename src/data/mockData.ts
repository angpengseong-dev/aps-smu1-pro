import { IndexData, StockTicker, CommunityTrend, NewsItem } from '../types';

export const INITIAL_INDICES: IndexData[] = [
  // US Stocks
  {
    symbol: 'SPX',
    name: 'S&P 500',
    price: 5432.10,
    changePercent: 1.24,
    changeValue: 66.50,
    sparkline: [25, 22, 28, 15, 18, 10, 12, 5, 8, 2, 0],
    category: 'US stocks'
  },
  {
    symbol: 'NDX',
    name: 'Nasdaq 100',
    price: 19102.45,
    changePercent: -0.85,
    changeValue: -163.70,
    sparkline: [5, 8, 2, 15, 12, 20, 18, 25, 22, 28, 30],
    category: 'US stocks'
  },
  {
    symbol: 'DJI',
    name: 'Dow 30',
    price: 38765.20,
    changePercent: 0.42,
    changeValue: 162.40,
    sparkline: [20, 18, 22, 15, 16, 12, 14, 8, 10, 5, 2],
    category: 'US stocks'
  },

  // World Stocks
  {
    symbol: 'FTSE',
    name: 'FTSE 100',
    price: 8245.10,
    changePercent: 0.65,
    changeValue: 53.20,
    sparkline: [18, 16, 14, 10, 12, 8, 6, 4, 3, 1, 0],
    category: 'World stocks'
  },
  {
    symbol: 'N225',
    name: 'Nikkei 225',
    price: 38920.50,
    changePercent: 1.82,
    changeValue: 695.10,
    sparkline: [28, 24, 20, 16, 12, 8, 6, 4, 2, 1, 0],
    category: 'World stocks'
  },
  {
    symbol: 'DAX',
    name: 'DAX 40',
    price: 18450.80,
    changePercent: -0.31,
    changeValue: -57.40,
    sparkline: [2, 5, 8, 12, 16, 20, 22, 25, 28, 29, 30],
    category: 'World stocks'
  },

  // Crypto
  {
    symbol: 'BTCUSD',
    name: 'Bitcoin',
    price: 67450.00,
    changePercent: 3.45,
    changeValue: 2250.00,
    sparkline: [25, 20, 22, 15, 10, 8, 12, 5, 3, 1, 0],
    category: 'Crypto'
  },
  {
    symbol: 'ETHUSD',
    name: 'Ethereum',
    price: 3520.10,
    changePercent: 2.15,
    changeValue: 74.20,
    sparkline: [22, 19, 21, 14, 12, 9, 7, 4, 2, 1, 0],
    category: 'Crypto'
  },
  {
    symbol: 'SOLUSD',
    name: 'Solana',
    price: 148.80,
    changePercent: -1.95,
    changeValue: -2.95,
    sparkline: [3, 6, 10, 14, 18, 22, 20, 25, 28, 29, 30],
    category: 'Crypto'
  },

  // Futures
  {
    symbol: 'CL1!',
    name: 'Crude Oil WTI',
    price: 78.42,
    changePercent: -1.12,
    changeValue: -0.89,
    sparkline: [4, 7, 11, 15, 18, 21, 23, 26, 28, 29, 30],
    category: 'Futures'
  },
  {
    symbol: 'GC1!',
    name: 'Gold Futures',
    price: 2385.60,
    changePercent: 0.88,
    changeValue: 20.80,
    sparkline: [20, 17, 18, 12, 10, 7, 5, 3, 2, 1, 0],
    category: 'Futures'
  },
  {
    symbol: 'NG1!',
    name: 'Natural Gas',
    price: 2.48,
    changePercent: 4.20,
    changeValue: 0.10,
    sparkline: [28, 25, 21, 17, 12, 8, 5, 3, 2, 1, 0],
    category: 'Futures'
  },

  // Forex
  {
    symbol: 'EURUSD',
    name: 'EUR / USD',
    price: 1.0892,
    changePercent: 0.18,
    changeValue: 0.0020,
    sparkline: [15, 14, 16, 12, 10, 8, 9, 6, 4, 2, 1],
    category: 'Forex'
  },
  {
    symbol: 'USDJPY',
    name: 'USD / JPY',
    price: 156.84,
    changePercent: -0.42,
    changeValue: -0.66,
    sparkline: [2, 5, 8, 12, 15, 19, 22, 24, 27, 28, 30],
    category: 'Forex'
  },
  {
    symbol: 'GBPUSD',
    name: 'GBP / USD',
    price: 1.2745,
    changePercent: 0.35,
    changeValue: 0.0044,
    sparkline: [18, 15, 14, 11, 9, 6, 5, 3, 2, 1, 0],
    category: 'Forex'
  },

  // Govt Bonds
  {
    symbol: 'US10Y',
    name: 'US 10 YR Bond Yield',
    price: 4.225,
    changePercent: -0.82,
    changeValue: -0.035,
    sparkline: [5, 8, 12, 16, 19, 22, 24, 26, 28, 29, 30],
    category: 'Government bonds'
  },
  {
    symbol: 'US02Y',
    name: 'US 2 YR Bond Yield',
    price: 4.682,
    changePercent: -0.45,
    changeValue: -0.021,
    sparkline: [8, 10, 14, 17, 20, 22, 25, 27, 28, 29, 30],
    category: 'Government bonds'
  },

  // Corporate Bonds
  {
    symbol: 'LQD',
    name: 'iShares Investment Grade',
    price: 109.15,
    changePercent: 0.32,
    changeValue: 0.35,
    sparkline: [20, 18, 16, 12, 10, 8, 5, 3, 2, 1, 0],
    category: 'Corporate bonds'
  },
  {
    symbol: 'HYG',
    name: 'iShares High Yield Bond',
    price: 77.80,
    changePercent: 0.21,
    changeValue: 0.16,
    sparkline: [18, 16, 14, 10, 8, 6, 4, 3, 2, 1, 0],
    category: 'Corporate bonds'
  },

  // ETFs
  {
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust',
    price: 482.10,
    changePercent: -0.82,
    changeValue: -3.98,
    sparkline: [4, 7, 10, 14, 18, 20, 23, 26, 28, 29, 30],
    category: 'ETFs'
  },
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    price: 541.80,
    changePercent: 1.18,
    changeValue: 6.32,
    sparkline: [24, 21, 22, 16, 14, 10, 8, 5, 3, 1, 0],
    category: 'ETFs'
  }
];

export const INITIAL_STOCKS: StockTicker[] = [
  {
    symbol: 'MU',
    name: 'Micron Tech',
    price: 132.45,
    changePercent: 4.20,
    changeValue: 5.34,
    volume: '45.2M',
    volumeNum: 45200000,
    marketCap: '146.5B',
    peRatio: 18.4,
    high52w: 157.50,
    low52w: 61.20,
    category: 'US stocks',
    sector: 'Technology',
    sparkline: [120, 122, 121, 125, 128, 127, 130, 131, 132.45],
    isPopular: true
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    price: 128.90,
    changePercent: -1.50,
    changeValue: -1.96,
    volume: '112.8M',
    volumeNum: 112800000,
    marketCap: '3.16T',
    peRatio: 72.1,
    high52w: 140.76,
    low52w: 40.85,
    category: 'US stocks',
    sector: 'Technology',
    sparkline: [131.5, 130.8, 131.2, 129.5, 128.0, 129.8, 128.9],
    isPopular: true
  },
  {
    symbol: 'INTC',
    name: 'Intel Corp',
    price: 34.50,
    changePercent: 0.80,
    changeValue: 0.27,
    volume: '38.9M',
    volumeNum: 38900000,
    marketCap: '147.2B',
    peRatio: 31.2,
    high52w: 51.28,
    low52w: 29.73,
    category: 'US stocks',
    sector: 'Technology',
    sparkline: [34.0, 34.1, 33.9, 34.2, 34.4, 34.3, 34.5],
    isPopular: true
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc',
    price: 224.30,
    changePercent: 1.85,
    changeValue: 4.07,
    volume: '62.4M',
    volumeNum: 62400000,
    marketCap: '3.44T',
    peRatio: 33.5,
    high52w: 237.23,
    low52w: 164.08,
    category: 'US stocks',
    sector: 'Technology',
    sparkline: [219.0, 220.5, 221.2, 222.0, 223.4, 224.3],
    isPopular: true
  },
  {
    symbol: 'PLTR',
    name: 'Palantir Technologies',
    price: 28.65,
    changePercent: 5.40,
    changeValue: 1.47,
    volume: '78.1M',
    volumeNum: 78100000,
    marketCap: '63.8B',
    peRatio: 85.0,
    high52w: 30.20,
    low52w: 13.68,
    category: 'US stocks',
    sector: 'Technology',
    sparkline: [27.0, 27.2, 27.5, 28.0, 28.3, 28.65],
    isPopular: true
  },
  {
    symbol: 'GOOG',
    name: 'Alphabet Inc',
    price: 178.20,
    changePercent: 0.12,
    changeValue: 0.21,
    volume: '24.5M',
    volumeNum: 24500000,
    marketCap: '2.21T',
    peRatio: 26.8,
    high52w: 191.75,
    low52w: 120.21,
    category: 'US stocks',
    sector: 'Communication Services',
    sparkline: [177.8, 178.0, 177.9, 178.4, 178.1, 178.2],
    isPopular: true
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc',
    price: 254.10,
    changePercent: -2.80,
    changeValue: -7.32,
    volume: '95.3M',
    volumeNum: 95300000,
    marketCap: '809.5B',
    peRatio: 64.2,
    high52w: 271.00,
    low52w: 138.80,
    category: 'US stocks',
    sector: 'Consumer Cyclical',
    sparkline: [262.0, 260.5, 258.0, 256.4, 255.0, 254.1],
    isPopular: true
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc',
    price: 186.50,
    changePercent: 1.20,
    changeValue: 2.21,
    volume: '41.2M',
    volumeNum: 41200000,
    marketCap: '1.94T',
    peRatio: 42.1,
    high52w: 201.20,
    low52w: 118.35,
    category: 'US stocks',
    sector: 'Consumer Cyclical',
    sparkline: [184.0, 184.8, 185.2, 185.9, 186.5],
    isPopular: true
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp',
    price: 448.90,
    changePercent: 0.65,
    changeValue: 2.90,
    volume: '21.8M',
    volumeNum: 21800000,
    marketCap: '3.33T',
    peRatio: 37.8,
    high52w: 468.35,
    low52w: 309.45,
    category: 'US stocks',
    sector: 'Technology',
    sparkline: [445.0, 446.2, 447.0, 448.1, 448.9],
    isPopular: true
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    price: 158.40,
    changePercent: 3.10,
    changeValue: 4.76,
    volume: '54.6M',
    volumeNum: 54600000,
    marketCap: '256.1B',
    peRatio: 112.5,
    high52w: 227.30,
    low52w: 93.12,
    category: 'US stocks',
    sector: 'Technology',
    sparkline: [153.2, 154.5, 156.0, 157.2, 158.4],
    isPopular: true
  }
];

export const COMMUNITY_TRENDS: CommunityTrend[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc',
    avatarLetter: 'A',
    trend: 'up',
    changePercent: 1.85,
    category: 'Technology'
  },
  {
    symbol: 'PLTR',
    name: 'Palantir',
    avatarLetter: 'P',
    trend: 'up',
    changePercent: 5.40,
    category: 'Software'
  },
  {
    symbol: 'GOOG',
    name: 'Alphabet Inc',
    avatarLetter: 'G',
    trend: 'flat',
    changePercent: 0.12,
    category: 'Internet'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    avatarLetter: 'N',
    trend: 'up',
    changePercent: -1.50,
    category: 'Semiconductors'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc',
    avatarLetter: 'T',
    trend: 'down',
    changePercent: -2.80,
    category: 'Automotive'
  }
];

export const MARKET_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Fed Signals Potential Rate Cut as Inflation Pressure Eases',
    source: 'Bloomberg Markets',
    timeAgo: '25m ago',
    ticker: 'SPX',
    sentiment: 'bullish',
    snippet: 'Federal Reserve officials signaled growing confidence that inflation is returning to their 2% target, opening the door for policy easing.'
  },
  {
    id: 'n2',
    title: 'Semiconductor Rally Extends on AI Infrastructure Demand',
    source: 'Reuters Finance',
    timeAgo: '1h ago',
    ticker: 'MU',
    sentiment: 'bullish',
    snippet: 'Micron and memory chip providers report surge in enterprise AI server orders, boosting sector outlook.'
  },
  {
    id: 'n3',
    title: 'Tech Earnings Preview: Cloud Growth in Focus for Big Tech',
    source: 'Financial Times',
    timeAgo: '2h ago',
    ticker: 'MSFT',
    sentiment: 'neutral',
    snippet: 'Investors gear up for Q2 tech earnings as hyperscaler capital expenditure projections face close scrutiny.'
  },
  {
    id: 'n4',
    title: 'Oil Prices Dip Amid Global Inventory Build Expectations',
    source: 'Energy Daily',
    timeAgo: '3h ago',
    ticker: 'CL1!',
    sentiment: 'bearish',
    snippet: 'WTI crude trades lower following EIA supply report showing higher than anticipated commercial crude reserves.'
  }
];
