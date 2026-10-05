import React from 'react';
import {
  Compass,
  Droplets,
  Layers,
  Lock,
  Sparkles,
  Sun,
  ThermometerSnowflake,
  Wind,
  Zap,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-16 sm:py-24 bg-stone-100/60 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Engineered For Performance & Comfort
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-950 tracking-tight mt-3">
            Why 185,000+ Women Swapped Their Heavy Jeans For StretchActive™
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
            Crafted from high-performance COOLMAX® ice-silk fabric that combines the sleek elegance of luxury trousers with the buttery soft freedom of athletic wear.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: COOLMAX */}
          <div className="bg-white p-7 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ThermometerSnowflake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">
              Instant -3°C Ice Silk Cooling
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Infused with genuine COOLMAX® micro-fibers that conduct body heat outward on contact. Even in 95°F summer heat, your legs stay refreshingly cool and dry.
            </p>
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-cyan-700">
              <Wind className="w-4 h-4" />
              <span>3x more breathable than cotton</span>
            </div>
          </div>

          {/* Card 2: 4-Way Stretch */}
          <div className="bg-white p-7 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">
              360° Zero-Pinch Hyper Stretch
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Formulated with 24% high-rebound Spandex elastane. Squat, stretch, walk 20,000 steps, or sit in long flights without feeling restricted or bagging at the knees.
            </p>
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <Layers className="w-4 h-4" />
              <span>Never bags out or loses its shape</span>
            </div>
          </div>

          {/* Card 3: Deep Zipper Pockets */}
          <div className="bg-white p-7 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">
              Dual Waterproof Zipper Pockets
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              No more shallow women's pockets! Features 2 deep concealed pockets with waterproof zippers that hold iPhone Pro Max, passport, and car keys without bulging.
            </p>
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-amber-700">
              <Droplets className="w-4 h-4" />
              <span>Sealed zippers protect your phone</span>
            </div>
          </div>

          {/* Card 4: Wrinkle Free & Travel Ready */}
          <div className="bg-white p-7 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">
              Suitcase Ready: 100% Wrinkle-Free
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Roll them up in your carry-on luggage, unroll at your destination, and wear immediately. The fluid fabric drape eliminates deep creases with zero ironing needed.
            </p>
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-indigo-700">
              <Sparkles className="w-4 h-4" />
              <span>Zero iron, zero steamer required</span>
            </div>
          </div>

          {/* Card 5: Pet Hair Repel */}
          <div className="bg-white p-7 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">
              Anti-Static & Pet Hair Repellent
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Unlike cheap leggings that act like magnets for cat and dog fur, our ultra-dense ice-silk weave naturally sheds pet hair with a gentle sweep of your hand.
            </p>
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-rose-700">
              <Sparkles className="w-4 h-4" />
              <span>Fur & lint brush off instantly</span>
            </div>
          </div>

          {/* Card 6: Flattering High Waist */}
          <div className="bg-white p-7 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">
              Gentle Tummy Smoothing Waistband
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Engineered with a high-rise contour band and hidden internal drawstring that gently smooths your midsection without squeezing your organs or rolling down.
            </p>
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-purple-700">
              <Zap className="w-4 h-4" />
              <span>Zero muffin top, all-day ease</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
