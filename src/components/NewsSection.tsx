import React, { useState } from 'react';
import { NewsItem } from '../types';
import { Newspaper, TrendingUp, TrendingDown, Clock, Filter, ExternalLink } from 'lucide-react';

interface NewsSectionProps {
  news: NewsItem[];
  onSelectTicker: (symbol: string) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news, onSelectTicker }) => {
  const [filter, setFilter] = useState<'all' | 'bullish' | 'bearish' | 'neutral'>('all');

  const filteredNews = news.filter((item) => filter === 'all' || item.sentiment === filter);

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto px-6 py-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-[#1E222D] p-4 rounded-lg border border-[#363A45]">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-[#b6c4ff]" />
          <h2 className="text-lg font-bold font-display text-[#dfe2f2]">Financial Intelligence & News</h2>
        </div>

        {/* Sentiment Filter */}
        <div className="flex items-center gap-1.5 bg-[#2A2E39] p-1 rounded-lg border border-[#363A45] text-xs">
          <Filter className="w-3.5 h-3.5 text-[#c3c5d8] ml-1" />
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              filter === 'all' ? 'bg-[#313441] text-[#dfe2f2]' : 'text-[#c3c5d8] hover:text-[#dfe2f2]'
            }`}
          >
            All News
          </button>
          <button
            onClick={() => setFilter('bullish')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              filter === 'bullish' ? 'bg-[#00E676]/20 text-[#00E676]' : 'text-[#c3c5d8] hover:text-[#dfe2f2]'
            }`}
          >
            Bullish
          </button>
          <button
            onClick={() => setFilter('bearish')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              filter === 'bearish' ? 'bg-[#FF5252]/20 text-[#FF5252]' : 'text-[#c3c5d8] hover:text-[#dfe2f2]'
            }`}
          >
            Bearish
          </button>
        </div>
      </div>

      {/* News Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((item) => (
          <div
            key={item.id}
            className="bg-[#1E222D] border border-[#363A45] rounded-lg p-5 flex flex-col justify-between hover:border-[#434656] transition-colors shadow-sm"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold text-[#b6c4ff] font-mono-data">
                  {item.source} • {item.timeAgo}
                </span>

                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono-data ${
                    item.sentiment === 'bullish'
                      ? 'bg-[#00E676]/10 text-[#00E676]'
                      : item.sentiment === 'bearish'
                      ? 'bg-[#FF5252]/10 text-[#FF5252]'
                      : 'bg-[#b6c4ff]/10 text-[#b6c4ff]'
                  }`}
                >
                  {item.sentiment}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#dfe2f2] mb-2 leading-snug hover:text-[#b6c4ff] transition-colors cursor-pointer">
                {item.title}
              </h3>

              <p className="text-xs text-[#c3c5d8] leading-relaxed mb-4">
                {item.snippet}
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#363A45]">
              {item.ticker && (
                <button
                  onClick={() => onSelectTicker(item.ticker!)}
                  className="bg-[#2A2E39] border border-[#363A45] hover:border-[#b6c4ff] px-2.5 py-1 rounded text-xs font-mono-data font-bold text-[#dfe2f2] hover:text-[#b6c4ff] transition-colors"
                >
                  Related: ${item.ticker}
                </button>
              )}

              <span className="text-xs text-[#c3c5d8] flex items-center gap-1 hover:text-[#dfe2f2] cursor-pointer">
                Read full report <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
