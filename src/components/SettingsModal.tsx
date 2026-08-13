import React from 'react';
import { X, Sliders, Moon, RefreshCw, Layers } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: string;
  setCurrency: (curr: string) => void;
  autoRefreshRate: number;
  setAutoRefreshRate: (rate: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currency,
  setCurrency,
  autoRefreshRate,
  setAutoRefreshRate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1E222D] border border-[#363A45] rounded-xl w-full max-w-md overflow-hidden shadow-2xl space-y-4">
        <div className="p-4 border-b border-[#363A45] flex justify-between items-center bg-[#171b26]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#b6c4ff]" />
            <h3 className="text-sm font-bold text-[#dfe2f2]">Terminal Preferences</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#c3c5d8] hover:text-[#dfe2f2]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Display Currency */}
          <div className="space-y-1.5">
            <label className="text-[#c3c5d8] font-semibold block">Display Currency</label>
            <div className="grid grid-cols-3 gap-2">
              {['USD ($)', 'EUR (€)', 'GBP (£)'].map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`p-2 rounded border text-center font-mono-data font-bold transition-colors ${
                    currency === curr
                      ? 'bg-[#b6c4ff] text-[#002780] border-[#b6c4ff]'
                      : 'bg-[#2A2E39] text-[#dfe2f2] border-[#363A45] hover:border-[#b6c4ff]'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Refresh interval */}
          <div className="space-y-1.5">
            <label className="text-[#c3c5d8] font-semibold block">Data Stream Refresh Rate</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '1 Sec (Live)', value: 1000 },
                { label: '3 Sec', value: 3000 },
                { label: '5 Sec', value: 5000 }
              ].map((rate) => (
                <button
                  key={rate.value}
                  onClick={() => setAutoRefreshRate(rate.value)}
                  className={`p-2 rounded border text-center font-mono-data font-bold transition-colors ${
                    autoRefreshRate === rate.value
                      ? 'bg-[#b6c4ff] text-[#002780] border-[#b6c4ff]'
                      : 'bg-[#2A2E39] text-[#dfe2f2] border-[#363A45] hover:border-[#b6c4ff]'
                  }`}
                >
                  {rate.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Preset */}
          <div className="space-y-1.5 pt-2 border-t border-[#363A45]">
            <label className="text-[#c3c5d8] font-semibold block">Terminal Theme Canvas</label>
            <div className="p-2 bg-[#0f131e] border border-[#363A45] rounded text-[11px] text-[#c3c5d8] flex items-center gap-2">
              <Moon className="w-4 h-4 text-[#b6c4ff]" />
              <span>Pro Dark Obsidian High-Contrast Canvas (Active)</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#363A45] bg-[#171b26] text-right">
          <button
            onClick={onClose}
            className="bg-[#b6c4ff] text-[#002780] font-bold text-xs px-4 py-2 rounded hover:opacity-90 transition-opacity"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
