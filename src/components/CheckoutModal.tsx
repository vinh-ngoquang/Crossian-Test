import React, { useState } from 'react';
import { CartItem, CheckoutCustomerInfo } from '../types';
import { tracker } from '../services/tracking';
import { Lock, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onSuccess: (orderSummary: any) => void;
}

export const CheckoutModal: React.FC<Props> = ({ isOpen, onClose, items, onSuccess }) => {
  const [formData, setFormData] = useState<CheckoutCustomerInfo>({
    email: 'sarah.miller@example.com',
    firstName: 'Sarah',
    lastName: 'Miller',
    phone: '(555) 382-9102',
    address: '1428 Elm Street',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    country: 'United States',
    paymentMethod: 'card',
  });

  if (!isOpen) return null;

  const total = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transactionId = `SA-${Date.now().toString().slice(-6)}`;

    const orderData = {
      transactionId,
      value: Number(total.toFixed(2)),
      tax: 0,
      shipping: 0,
      items: items.map((i) => ({
        id: i.id,
        productTitle: i.productTitle,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        style: i.colorStyle.type,
        color: i.colorStyle.name,
        size: `${i.size} / ${i.inseam}`,
      })),
      customerEmail: formData.email,
    };

    tracker.trackPurchase(orderData);
    onSuccess({
      ...orderData,
      customer: formData,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-2xl overflow-hidden border border-stone-200">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-black" />
            <h3 className="font-bold text-stone-900 text-sm">Secure Checkout</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Shipping Address
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">State</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Zip Code</label>
              <input
                type="text"
                required
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-xs"
              />
            </div>
          </div>

          <div className="p-3 bg-stone-100 rounded space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Items Total ({items.reduce((a, b) => a + b.quantity, 0)})</span>
              <span>${total.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between font-bold text-stone-900 border-t border-stone-200 pt-1">
              <span>Total</span>
              <span>${total.toFixed(2)} USD</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-black hover:bg-stone-800 text-white font-bold text-xs rounded transition-colors cursor-pointer text-center"
          >
            PAY NOW • ${total.toFixed(2)} USD
          </button>
        </form>
      </div>
    </div>
  );
};
