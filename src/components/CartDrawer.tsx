import React, { useEffect } from 'react';
import { CartItem } from '../types';
import { tracker } from '../services/tracking';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  onSelectNextItem?: () => void;
}

export const CartDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onSelectNextItem,
}) => {
  useEffect(() => {
    if (isOpen) {
      const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
      tracker.trackViewCart(items, subtotal);
      if (items.length > 0) {
        tracker.trackUpsellImpression('EXTRA 30% OFF for next item', '30%');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate pricing & savings
  // When multiple items are added, progressive tiered discounts apply (as shown in screenshot: 1 item ~$31.46, next item ~$25.95)
  const originalPerUnit = 99.99;
  const totalUnits = items.reduce((acc, i) => acc + i.quantity, 0);

  const calculateItemPrice = (item: CartItem, index: number) => {
    // If multiple items, subsequent items or higher quantities get $25.95 (Extra 30% off)
    const unitPrice = index > 0 || item.quantity > 1 ? 25.95 : 31.46;
    const totalOriginal = originalPerUnit * item.quantity;
    const totalCurrent = unitPrice * item.quantity;
    const saved = totalOriginal - totalCurrent;
    return { unitPrice, totalOriginal, totalCurrent, saved };
  };

  const calculatedItems = items.map((item, index) => ({
    ...item,
    pricing: calculateItemPrice(item, index),
  }));

  const grandOriginal = calculatedItems.reduce((acc, i) => acc + i.pricing.totalOriginal, 0);
  const grandTotal = calculatedItems.reduce((acc, i) => acc + i.pricing.totalCurrent, 0);

  const handleQuantityUpdate = (id: string, delta: number, currentQty: number, unitPrice: number) => {
    const newQty = currentQty + delta;
    if (newQty > 0) {
      tracker.trackQuantityChange(id, delta > 0 ? 'increase' : 'decrease', newQty, unitPrice);
    }
    onUpdateQuantity(id, delta);
  };

  const handleSelectNow = () => {
    tracker.trackUpsellClick('EXTRA 30% OFF for next item', '30%');
    if (onSelectNextItem) {
      onSelectNextItem();
    } else {
      onClose();
      const buyBox = document.getElementById('buy-box') || document.querySelector('section');
      buyBox?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCheckoutClick = () => {
    tracker.trackBeginCheckout({
      items,
      totalValue: grandTotal,
    });
    onProceedToCheckout();
  };

  const handlePayPalCheckout = () => {
    tracker.trackAddPaymentInfo('paypal', grandTotal);
    tracker.trackBeginCheckout({
      items,
      totalValue: grandTotal,
      coupon: 'PAYPAL_INSTANT',
    });
    onProceedToCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10">
        <div className="w-screen max-w-[420px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
            <h3 className="font-bold text-[#16a34a] text-base sm:text-lg tracking-tight">
              Final clearance deal already applied!
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-300 hover:bg-stone-400 text-stone-700 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Close cart"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {items.length === 0 ? (
              <div className="h-72 flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-3 text-stone-400">
                  <ShoppingBag className="w-7 h-7 text-stone-500" />
                </div>
                <p className="font-bold text-stone-900 text-base">Your cart is empty</p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
                  Choose your favorite style, color and size to get the 50% - 70% clearance deal!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    const buyBox = document.getElementById('buy-box') || document.querySelector('section');
                    buyBox?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-5 px-6 py-2.5 bg-[#18181b] hover:bg-black text-white text-xs font-bold uppercase rounded-lg tracking-wider transition-colors cursor-pointer"
                >
                  Shop Now & Save 70%
                </button>
              </div>
            ) : (
              calculatedItems.map((item) => (
                <div key={item.id} className="space-y-3 pb-4 border-b border-stone-100 last:border-b-0">
                  <div className="flex gap-4 items-start">
                    {/* Thumbnail Image matching screenshot */}
                    <div className="relative w-24 h-28 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                      {/* SA Watermark */}
                      <span className="absolute top-1 left-1.5 font-black text-[10px] text-stone-700">
                        SA
                      </span>
                      {/* Upper right badge */}
                      <span className="absolute top-1 right-1.5 font-bold text-[8px] uppercase tracking-tighter text-stone-800 bg-white/70 px-1 rounded">
                        {item.colorStyle.name.toUpperCase()}
                      </span>
                      <img
                        src={item.colorStyle.image}
                        alt={item.productTitle}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    {/* Title & Remove */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-stone-900 text-xs sm:text-[13px] leading-snug">
                          {item.productTitle}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#ef4444] hover:text-[#dc2626] text-xs underline underline-offset-2 shrink-0 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Specs lines */}
                      <div className="text-[11px] text-stone-800 mt-2 space-y-0.5">
                        <div>
                          <strong>Color & Style:</strong> {item.colorStyle.name}
                        </div>
                        <div>
                          <strong>US Size:</strong> {item.size}
                        </div>
                        <div>
                          <strong>Inseam:</strong> {item.inseam}
                        </div>
                      </div>

                      {/* Stepper & Price row */}
                      <div className="flex items-center justify-between pt-3">
                        {/* Stepper [- Qty +] */}
                        <div className="flex items-center border border-stone-300 rounded px-1 py-0.5 bg-white">
                          <button
                            type="button"
                            onClick={() => handleQuantityUpdate(item.id, -1, item.quantity, item.pricing.unitPrice)}
                            className="px-2 py-0.5 text-stone-500 hover:text-black cursor-pointer text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-stone-900 min-w-5 text-center font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityUpdate(item.id, 1, item.quantity, item.pricing.unitPrice)}
                            className="px-2 py-0.5 text-stone-500 hover:text-black cursor-pointer text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price Breakdown */}
                        <div className="text-right">
                          <div className="flex items-baseline gap-1.5 justify-end">
                            <span className="text-stone-400 line-through text-xs font-mono">
                              ${(originalPerUnit * item.quantity).toFixed(2)}
                            </span>
                            <span className="font-bold text-stone-950 text-sm font-mono">
                              ${item.pricing.totalCurrent.toFixed(2)}
                            </span>
                          </div>
                          {item.pricing.saved > 0 && (
                            <div className="text-[11px] font-bold text-[#16a34a]">
                              You saved ${item.pricing.saved.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* EXTRA 30% OFF Dashed Banner Box (Exact match to screenshot!) */}
            {items.length > 0 && (
              <div className="p-3 border-2 border-dashed border-[#16a34a] rounded-md bg-[#f0fdf4]/50 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <strong className="text-[#16a34a] font-black uppercase">EXTRA 30% OFF</strong>{' '}
                  <span className="text-stone-700">for next item</span>
                </div>
                <button
                  type="button"
                  onClick={handleSelectNow}
                  className="px-4 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded transition-colors shadow-xs cursor-pointer whitespace-nowrap"
                >
                  Select now
                </button>
              </div>
            )}
          </div>

          {/* Footer with Subtotal, Checkout Button, PayPal button */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-white space-y-4">
              {/* Subtotal line */}
              <div className="flex items-baseline justify-end gap-2 text-sm">
                <span className="text-stone-700 text-sm font-normal">Subtotal</span>
                <span className="text-stone-400 line-through text-sm font-mono">
                  ${grandOriginal.toFixed(2)}
                </span>
                <span className="font-black text-stone-950 text-base font-mono">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>

              {/* Black PROCEED TO SECURE CHECKOUT button */}
              <button
                type="button"
                onClick={handleCheckoutClick}
                className="w-full py-3.5 bg-[#18181b] hover:bg-black text-white font-bold text-xs tracking-wider uppercase rounded transition-colors shadow-sm cursor-pointer text-center"
              >
                PROCEED TO SECURE CHECKOUT
              </button>

              {/* Or quick checkout with PayPal divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-stone-300"></div>
                <span className="bg-white px-3 text-[11px] text-stone-400 font-normal">
                  or quick checkout with
                </span>
              </div>

              {/* Yellow PayPal Button */}
              <button
                type="button"
                onClick={handlePayPalCheckout}
                className="w-full py-3 bg-[#ffc439] hover:bg-[#f6b828] text-stone-900 rounded transition-colors shadow-sm flex items-center justify-center cursor-pointer"
                title="Pay with PayPal"
              >
                <span className="font-black text-lg italic tracking-tight text-[#003087]">
                  Pay<span className="text-[#0079C1]">Pal</span>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
