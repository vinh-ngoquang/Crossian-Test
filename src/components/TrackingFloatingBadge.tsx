import React, { useState } from 'react';
import { Activity, ChevronDown, ChevronUp, Terminal } from 'lucide-react';

interface Props {
  eventCount: number;
  lastEventName?: string;
  onOpenModal: () => void;
}

export const TrackingFloatingBadge: React.FC<Props> = ({
  eventCount,
  lastEventName,
  onOpenModal,
}) => {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 left-4 z-40 bg-stone-900 text-emerald-400 p-2.5 rounded-full shadow-2xl border border-stone-700 hover:scale-110 transition-all cursor-pointer"
        title="Mở thanh trạng thái Tracking Pixels"
      >
        <Activity className="w-5 h-5 animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 bg-stone-950/95 backdrop-blur-md text-white border border-stone-800 rounded-2xl shadow-2xl p-2.5 flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-200">
      <button
        onClick={onOpenModal}
        className="flex items-center gap-2.5 text-left group cursor-pointer"
      >
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4 animate-pulse" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors">
              Tracking Console
            </span>
            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold rounded-full border border-emerald-500/30">
              {eventCount} events
            </span>
          </div>
          <div className="text-[10px] text-stone-400 font-mono truncate max-w-[150px]">
            {lastEventName ? `Last: ${lastEventName}` : 'All 4 Pixels Active'}
          </div>
        </div>
      </button>

      <div className="flex items-center gap-1 border-l border-stone-800 pl-2">
        <button
          onClick={onOpenModal}
          className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          title="Mở giao diện gỡ lỗi chi tiết"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
        </button>
        <button
          onClick={() => setMinimized(true)}
          className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          title="Thu nhỏ"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
