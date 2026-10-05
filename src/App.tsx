/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CartItem } from './types';
import { tracker } from './services/tracking';
import { Header } from './components/Header';
import { ProductSection } from './components/ProductSection';
import { DescriptionSection } from './components/DescriptionSection';
import { ReviewsSection } from './components/ReviewsSection';
import { ShippingReturnsSection } from './components/ShippingReturnsSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { TrackingInspectorModal } from './components/TrackingInspectorModal';
import { TrackingFloatingBadge } from './components/TrackingFloatingBadge';
import { ShoppingCart } from 'lucide-react';
import { COLOR_STYLE_OPTIONS } from './data/mockData';

export default function App() {
  // Fresh visitor starts with an empty cart on every F5
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [lastOrderData, setLastOrderData] = useState<any>(null);
  const [eventCount, setEventCount] = useState(0);
  const [lastEventName, setLastEventName] = useState<string | undefined>(undefined);

  // Initialize PageView Tracking and event subscriber
  useEffect(() => {
    tracker.trackPageView();
    tracker.trackViewItem({
      id: 'SA-ICESILK-001',
      name: 'StretchActive™ Ultra-Stretch Ice Silk Pants',
      style: 'Straight Leg',
      color: 'Obsidian Black',
      size: 'L',
      price: 39.95,
    });

    const unsubscribe = tracker.subscribe((events) => {
      setEventCount(events.length);
      if (events.length > 0) {
        setLastEventName(events[0].eventName);
      }
    });

    return () => unsubscribe();
  }, []);

  // Cart operations
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (orderData: any) => {
    setLastOrderData(orderData);
    setIsCheckoutOpen(false);
    setCartItems([]);
    setIsOrderSuccessOpen(true);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900 font-sans selection:bg-stone-900 selection:text-white antialiased">
      {/* 1. Header (Hamburger, SA Logo) */}
      <Header onOpenTracking={() => setIsTrackingModalOpen(true)} />

      {/* 2. Floating Sticky Checkout Pill (Cuộn đến đâu thì box chạy theo màn hình) */}
      <button
        onClick={() => {
          tracker.trackFloatingCheckoutClick(
            cartItems.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0),
            totalCartCount
          );
          setIsCartOpen(true);
        }}
        className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 bg-black hover:bg-stone-800 text-white text-xs sm:text-[13px] font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 shadow-2xl border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        title="Go to checkout"
      >
        <span>Go to checkout</span>
        <ShoppingCart className="w-4 h-4" />
        <span className="font-bold bg-white text-black text-[11px] px-1.5 py-0.2 rounded-full min-w-4 text-center">
          {totalCartCount}
        </span>
      </button>

      {/* 3. Product Hero Section */}
      <main className="flex-1">
        <ProductSection onAddToCart={handleAddToCart} />

        {/* 4. Description Section with 2-Column layout */}
        <DescriptionSection onScrollToTop={scrollToTop} />

        {/* 5. Reviews Section */}
        <ReviewsSection />

        {/* 6. Shipping & Returns Section */}
        <ShippingReturnsSection />
      </main>

      {/* 7. Footer (Dark background with 3 columns) */}
      <Footer onScrollToTop={scrollToTop} />

      {/* 8. Tracking Floating Inspector Pill (Bottom-left to not collide with right checkout button) */}
      <TrackingFloatingBadge
        eventCount={eventCount}
        lastEventName={lastEventName}
        onOpenModal={() => setIsTrackingModalOpen(true)}
      />

      {/* Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
        onSelectNextItem={() => {
          setIsCartOpen(false);
          scrollToTop();
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onSuccess={handleOrderSuccess}
      />

      <OrderSuccessModal
        isOpen={isOrderSuccessOpen}
        onClose={() => setIsOrderSuccessOpen(false)}
        orderData={lastOrderData}
        onOpenTracking={() => setIsTrackingModalOpen(true)}
      />

      <TrackingInspectorModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
      />
    </div>
  );
}
