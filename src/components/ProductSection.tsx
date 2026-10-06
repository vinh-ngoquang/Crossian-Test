import React, { useState } from 'react';
import {
  COLOR_STYLE_OPTIONS,
  ColorStyleOption,
  INSEAM_OPTIONS,
  PRODUCT_GALLERY,
  US_SIZES,
} from '../data/mockData';
import { CartItem } from '../types';
import { tracker } from '../services/tracking';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';

interface Props {
  onAddToCart: (item: CartItem) => void;
}

export const ProductSection: React.FC<Props> = ({ onAddToCart }) => {
  // Initial state matching screenshot:
  // Black Jogger, 4XL (24W), Tall (32-34")
  const [selectedColorStyle, setSelectedColorStyle] = useState<ColorStyleOption>(
    COLOR_STYLE_OPTIONS.find((c) => c.id === 'black-jogger') || COLOR_STYLE_OPTIONS[7]
  );
  const [selectedSize, setSelectedSize] = useState<string>('4XL (24W)');
  const [selectedInseam, setSelectedInseam] = useState<string>('Tall (32-34")');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const price = 31.49;
  const originalPrice = 59.99;

  const handlePrevImage = () => {
    const newIdx = activeImageIndex === 0 ? PRODUCT_GALLERY.length - 1 : activeImageIndex - 1;
    setActiveImageIndex(newIdx);
    tracker.dispatch('gallery_interaction', 'engagement', ['gtm', 'ga4'], {
      action: 'prev_image',
      image_index: newIdx,
      badge: PRODUCT_GALLERY[newIdx]?.badge || 'Gallery',
    });
  };

  const handleNextImage = () => {
    const newIdx = activeImageIndex === PRODUCT_GALLERY.length - 1 ? 0 : activeImageIndex + 1;
    setActiveImageIndex(newIdx);
    tracker.dispatch('gallery_interaction', 'engagement', ['gtm', 'ga4'], {
      action: 'next_image',
      image_index: newIdx,
      badge: PRODUCT_GALLERY[newIdx]?.badge || 'Gallery',
    });
  };

  const handleSelectThumbnail = (idx: number) => {
    setActiveImageIndex(idx);
    tracker.dispatch('gallery_interaction', 'engagement', ['gtm', 'ga4'], {
      action: 'select_thumbnail',
      image_index: idx,
      badge: PRODUCT_GALLERY[idx]?.badge || 'Gallery',
    });
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQty = Math.max(1, prev + delta);
      if (newQty !== prev) {
        tracker.dispatch('update_quantity', 'engagement', ['gtm', 'ga4'], {
          previous_quantity: prev,
          quantity: newQty,
          direction: delta > 0 ? 'increase' : 'decrease',
          estimated_total: Number((price * newQty).toFixed(2)),
        });
      }
      return newQty;
    });
  };

  const handleColorStyleSelect = (option: ColorStyleOption) => {
    setSelectedColorStyle(option);
    tracker.trackCustomizeProduct({
      attribute: 'color',
      value: option.name,
      currentConfig: {
        colorStyle: option.name,
        size: selectedSize,
        inseam: selectedInseam,
      },
    });
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    tracker.trackCustomizeProduct({
      attribute: 'size',
      value: size,
      currentConfig: {
        colorStyle: selectedColorStyle.name,
        size,
        inseam: selectedInseam,
      },
    });
  };

  const handleInseamSelect = (inseam: string) => {
    setSelectedInseam(inseam);
    tracker.dispatch('customize_inseam', 'engagement', ['gtm', 'ga4'], {
      inseam,
    });
  };

  const handleAddToCartClick = () => {
    const item: CartItem = {
      id: `SA-${selectedColorStyle.id}-${selectedSize.replace(/\s+/g, '')}-${selectedInseam.slice(0, 3)}`,
      productTitle: "StretchActive – Women's Ultra Stretch Ice Silk Comfort Casual Pants",
      colorStyle: selectedColorStyle,
      size: selectedSize,
      inseam: selectedInseam,
      quantity,
      unitPrice: price,
    };

    tracker.trackAddToCart({
      id: item.id,
      name: item.productTitle,
      style: selectedColorStyle.type,
      color: selectedColorStyle.name,
      size: selectedSize,
      price,
      quantity,
      bundleTitle: `${selectedColorStyle.name} / ${selectedSize} / ${selectedInseam}`,
    });

    onAddToCart(item);
  };

  return (
    <section className="py-6 sm:py-10 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* LEFT: Image Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-4/5 w-full bg-stone-100 rounded-lg overflow-hidden border border-stone-200 group">
              {/* Watermark Logo top left */}
              <div className="absolute top-4 left-4 z-10 opacity-70">
                <span className="font-black text-xl tracking-tighter text-black">SA</span>
              </div>

              {/* Badge top right */}
              <div className="absolute top-4 right-4 z-10 bg-black text-white text-[11px] font-bold px-3 py-1 rounded">
                {selectedColorStyle.name.toUpperCase()} (
                {selectedColorStyle.type === 'jogger' ? 'Jogger Pants' : 'Straight Pants'})
              </div>

              {/* Main Image */}
              <img
                src={
                  activeImageIndex === 0
                    ? selectedColorStyle.image
                    : PRODUCT_GALLERY[activeImageIndex]?.url || selectedColorStyle.image
                }
                alt={selectedColorStyle.name}
                className="w-full h-full object-cover object-top transition-transform duration-300"
              />

              {/* Nav Arrows */}
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-800 flex items-center justify-center shadow-md transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-800 flex items-center justify-center shadow-md transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnail Carousel strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {PRODUCT_GALLERY.map((gal, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectThumbnail(idx)}
                    className={`w-14 h-16 rounded overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      isActive ? 'border-black' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={gal.url}
                      alt={gal.badge}
                      className="w-full h-full object-cover object-top"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Product Details & Selectors */}
          <div className="flex flex-col space-y-4">
            {/* Category */}
            <div className="text-xs text-stone-400 font-medium">Pants</div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight leading-snug">
              StretchActive – Women's Ultra Stretch Ice Silk Comfort Casual Pants
            </h1>

            {/* Price Line */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#dc2626]">${price.toFixed(2)}</span>
              <span className="text-sm text-stone-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            </div>

            {/* Final clearance note */}
            <div className="text-xs text-stone-500 italic">Final clearance deal already applied!</div>

            {/* Summer Super Sale Banner */}
            <div className="space-y-1 pt-1">
              <span className="inline-block bg-[#e0f2fe] text-[#0284c7] text-xs font-bold px-3 py-1 rounded">
                SUMMER SUPER SALE
              </span>
              <div className="text-xs font-bold text-stone-900">
                70% OFF - Buy More Save More!
              </div>
            </div>

            {/* 1. Color & Style selector */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-stone-700">Color & Style</div>
              <div className="flex flex-wrap gap-1.5">
                {COLOR_STYLE_OPTIONS.map((opt) => {
                  const isSelected = selectedColorStyle.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleColorStyleSelect(opt)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-black bg-stone-100 text-black font-semibold shadow-xs'
                          : 'border-stone-300 text-stone-600 bg-white hover:border-stone-400'
                      }`}
                    >
                      {opt.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. US Size selector */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-bold text-stone-700">US Size</div>
              <div className="flex flex-wrap gap-1.5">
                {US_SIZES.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleSizeSelect(sz)}
                      className={`text-xs px-2.5 py-1.5 rounded-md border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#38bdf8] bg-[#f0f9ff] text-[#0284c7] font-semibold'
                          : 'border-stone-300 text-stone-600 bg-white hover:border-stone-400'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Inseam selector */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-bold text-stone-700">Inseam</div>
              <div className="flex flex-wrap gap-2">
                {INSEAM_OPTIONS.map((ins) => {
                  const isSelected = selectedInseam === ins;
                  return (
                    <button
                      key={ins}
                      type="button"
                      onClick={() => handleInseamSelect(ins)}
                      className={`text-xs px-3 py-1.5 rounded-md border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#38bdf8] bg-[#f0f9ff] text-[#0284c7] font-semibold'
                          : 'border-stone-300 text-stone-600 bg-white hover:border-stone-400'
                      }`}
                    >
                      {ins}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Green Promo Box */}
            <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-md text-center text-xs space-y-0.5">
              <div className="font-bold text-[#065f46]">
                EXTRA 25% OFF FOR NEXT ITEM IN CART
              </div>
              <div className="text-[11px] text-[#047857]">
                Apply to any Color & Style and US Size and Inseam
              </div>
            </div>

            {/* Stepper + Add to Cart Button */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-stone-300 rounded-md bg-white">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-2.5 text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 py-2 text-xs font-bold text-stone-900 min-w-8 text-center font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-2.5 text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCartClick}
                className="flex-1 py-3 px-6 bg-black hover:bg-stone-800 text-white font-bold text-sm rounded-md transition-colors shadow-sm cursor-pointer text-center"
              >
                Add to Cart
              </button>
            </div>

            {/* Urgency text */}
            <div className="text-xs text-stone-500 pt-1">
              <span className="italic">Limited stock!</span>{' '}
              <strong className="text-stone-800 font-bold">156</strong> people are viewing this and{' '}
              <strong className="text-stone-800 font-bold">2785</strong> purchased it.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
