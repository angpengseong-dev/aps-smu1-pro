export type MarketCategory = 
  | 'US stocks' 
  | 'World stocks' 
  | 'Crypto' 
  | 'Futures' 
  | 'Forex' 
  | 'Government bonds' 
  | 'Corporate bonds' 
  | 'ETFs';

export interface IndexData {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  changeValue: number;
  sparkline: number[]; // Array of numbers normalized 0-100 or price points
  category: MarketCategory;
}

export interface StockTicker {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  changeValue: number;
  volume: string;
  volumeNum: number;
  marketCap: string;
  peRatio?: number;
  high52w?: number;
  low52w?: number;
  category: MarketCategory;
  sparkline: number[];
  sector?: string;
  isPopular?: boolean;
}

export interface CommunityTrend {
  symbol: string;
  name: string;
  avatarLetter: string;
  trend: 'up' | 'down' | 'flat';
  changePercent: number;
  category: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  url?: string;
  ticker?: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  snippet: string;
}

export interface AIAnalysisResult {
  ticker: string;
  summary: string;
  technicalSignal: 'BUY' | 'SELL' | 'HOLD';
  confidenceScore: number;
  catalysts: string[];
  risks: string[];
  priceTargetRange: { low: number; mid: number; high: number };
}

export interface PortfolioPosition {
  symbol: string;
  shares: number;
  avgBuyPrice: number;
  currentPrice: number;
}
