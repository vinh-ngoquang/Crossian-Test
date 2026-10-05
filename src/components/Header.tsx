import React from 'react';
import { Menu } from 'lucide-react';

interface Props {
  onOpenTracking: () => void;
}

export const Header: React.FC<Props> = ({ onOpenTracking }) => {
  return (
    <header className="w-full bg-white border-b border-stone-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left Hamburger */}
        <button
          type="button"
          onClick={onOpenTracking}
          title="Open menu / tracking"
          className="text-stone-900 p-2 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
        >
          <Menu className="w-6 h-6 stroke-[2]" />
        </button>

        {/* Center Stylized SA Logo */}
        <div className="flex items-center justify-center">
          <a href="#" className="flex items-center gap-1 group">
            <svg
              viewBox="0 0 100 80"
              className="w-10 h-8 fill-black transition-transform group-hover:scale-105"
            >
              {/* Stylized geometric SA monogram matching screenshot */}
              <path d="M22,18 C12,18 6,24 6,32 C6,44 26,45 26,54 C26,60 19,63 12,61 C8,60 5,56 4,52 L0,55 C2,62 7,67 14,68 C25,70 33,63 33,52 C33,40 13,38 13,29 C13,24 18,22 23,23 C27,24 30,27 31,31 L35,28 C33,22 29,18 22,18 Z" />
              <path d="M48,68 L55,68 L69,22 L62,22 L48,68 Z" />
              <path d="M72,22 L86,68 L93,68 L79,22 L72,22 Z" />
              <polygon points="56,52 77,52 75,46 58,46" />
            </svg>
          </a>
        </div>

        {/* Right spacer to keep SA logo centered */}
        <div className="w-10"></div>
      </div>
    </header>
  );
};
