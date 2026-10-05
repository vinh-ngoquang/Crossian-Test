import React from 'react';
import { Activity, CheckCircle2, PackageCheck, Sparkles, Truck, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  orderData: any;
  onOpenTracking: () => void;
}

export const OrderSuccessModal: React.FC<Props> = ({
  isOpen,
  onClose,
  orderData,
  onOpenTracking,
}) => {
  if (!isOpen || !orderData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-200">
        <div className="p-6 sm:p-8 text-center bg-emerald-50/50 border-b border-emerald-100">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-600/30">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Order Confirmed & Payment Received
          </span>

          <h3 className="text-2xl font-black text-stone-950 mt-2">
            Thank You For Your Order!
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Order Confirmation #{orderData.transactionId} has been sent to{' '}
            <strong>{orderData.customerEmail || 'your email'}</strong>
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Tracking Pixels Verification Box */}
          <div className="bg-stone-900 text-white p-4 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                <Activity className="w-4 h-4 animate-pulse" />
                Tracking Purchase Event Fired:
              </span>
              <button
                onClick={onOpenTracking}
                className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-emerald-300 rounded font-semibold text-[11px] underline cursor-pointer"
              >
                Inspect Event Payload
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap font-mono text-[10px] text-stone-300">
              <span className="bg-stone-800 px-1.5 py-0.5 rounded">GTM: purchase</span>
              <span className="bg-stone-800 px-1.5 py-0.5 rounded">GA4: purchase</span>
              <span className="bg-stone-800 px-1.5 py-0.5 rounded">Meta: Purchase</span>
              <span className="bg-stone-800 px-1.5 py-0.5 rounded">TikTok: CompletePayment</span>
            </div>
            <div className="text-[11px] text-stone-400">
              Revenue recorded: <strong className="text-white">${orderData.value} USD</strong>
            </div>
          </div>

          {/* Delivery estimate */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3 text-xs">
            <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-stone-900">Estimated Delivery: 2 - 4 Business Days</div>
              <div className="text-stone-500">
                Fulfillment facility: 1851 Central Park Loop, Morrow, GA 30260
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-stone-950 hover:bg-stone-800 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
