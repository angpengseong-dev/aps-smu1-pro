import React from 'react';
import { X, Bell, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTicker: (symbol: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectTicker
}) => {
  if (!isOpen) return null;

  const NOTIFICATIONS = [
    {
      id: '1',
      title: 'MU Micron Tech Volume Spike',
      message: 'Micron Tech trading volume reached 45.2M shares (+4.2% price surge).',
      time: '5m ago',
      ticker: 'MU',
      type: 'surge'
    },
    {
      id: '2',
      title: 'SPX S&P 500 All-Time High Test',
      message: 'S&P 500 crossed 5,430 mark driven by tech sector buying momentum.',
      time: '18m ago',
      ticker: 'SPX',
      type: 'alert'
    },
    {
      id: '3',
      title: 'NVDA Pullback Alert',
      message: 'NVIDIA Corp dips -1.5% to $128.90 on consolidation.',
      time: '42m ago',
      ticker: 'NVDA',
      type: 'dip'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end">
      <div className="bg-[#1E222D] border-l border-[#363A45] w-full max-w-sm h-full flex flex-col shadow-2xl">
        <div className="p-4 border-b border-[#363A45] flex justify-between items-center bg-[#171b26]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#b6c4ff]" />
            <h3 className="text-sm font-bold text-[#dfe2f2]">Live Market Alerts</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#c3c5d8] hover:text-[#dfe2f2]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 divide-y divide-[#363A45] overflow-y-auto flex-1">
          {NOTIFICATIONS.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                onSelectTicker(notif.ticker);
                onClose();
              }}
              className="p-3 hover:bg-[#2A2E39] cursor-pointer transition-colors space-y-1 rounded"
            >
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-[#b6c4ff] font-mono-data">${notif.ticker}</span>
                <span className="text-[#c3c5d8]">{notif.time}</span>
              </div>
              <h4 className="text-xs font-bold text-[#dfe2f2]">{notif.title}</h4>
              <p className="text-[11px] text-[#c3c5d8] leading-relaxed">{notif.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
