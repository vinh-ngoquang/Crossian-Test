import React from 'react';
import { MapPin } from 'lucide-react';

interface Props {
  onScrollToTop: () => void;
}

export const Footer: React.FC<Props> = ({ onScrollToTop }) => {
  return (
    <footer className="bg-[#18181b] text-stone-300 text-xs pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-6xl mx-auto px-4">
        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-stone-800">
          {/* Col 1 */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs tracking-wide">How can we help you?</h4>
            <div>
              <a
                href="mailto:support@stretchactive.com"
                className="inline-block bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors"
              >
                Contact Us
              </a>
            </div>
            <div className="text-[11px] text-stone-500">Served by Shopify</div>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-stone-500" />
              <span>1851 Central Park Loop, Morrow, GA 30260</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs tracking-wide">Order</h4>
            <div className="space-y-1.5 text-stone-400">
              <div>
                <a href="#" className="hover:text-white transition-colors">
                  Order Tracking
                </a>
              </div>
              <div>
                <a href="#" className="hover:text-white transition-colors">
                  Exchanges & Returns
                </a>
              </div>
              <div>
                <a href="#" className="hover:text-white transition-colors">
                  Order & Shipping
                </a>
              </div>
            </div>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs tracking-wide">Resources</h4>
            <div className="space-y-1.5 text-stone-400">
              <div>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </div>
              <div>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>Powered by Redlove</div>
          <div>© {new Date().getFullYear()} stretchactive.com. All rights reserved.</div>
          <button
            type="button"
            onClick={onScrollToTop}
            className="hover:text-stone-300 transition-colors cursor-pointer"
          >
            Go to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};
