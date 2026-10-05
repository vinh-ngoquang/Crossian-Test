import React, { useState } from 'react';
import { SCREENSHOT_REVIEWS } from '../data/mockData';
import { tracker } from '../services/tracking';
import { CheckCircle2, Edit3, Star } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const displayedReviews = showAll ? SCREENSHOT_REVIEWS : SCREENSHOT_REVIEWS.slice(0, 3);

  const handleToggleShowMore = () => {
    const nextState = !showAll;
    setShowAll(nextState);

    if (nextState) {
      // Fire tracking event for "Show more"
      tracker.trackShowMoreReviews(3, SCREENSHOT_REVIEWS.length);
    } else {
      tracker.dispatch('show_less_reviews', 'engagement', ['gtm', 'ga4'], {
        action: 'show_less',
      });
    }
  };

  const handleWriteReview = () => {
    tracker.trackClickWriteReview();
    alert('Thank you! Review submission modal is being prepared.');
  };

  return (
    <section className="py-12 border-t border-stone-200 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Title Column */}
          <div className="md:col-span-3 space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">Reviews</h2>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-2xl font-extrabold text-stone-900">4.9</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
            </div>
            <div className="text-xs text-stone-500">Based on 284 ratings</div>
          </div>

          {/* Right Reviews List Column */}
          <div className="md:col-span-9 max-w-2xl space-y-6">
            {/* Write your review button */}
            <div className="flex justify-end pb-2">
              <button
                type="button"
                onClick={handleWriteReview}
                className="bg-black hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Write your review</span>
              </button>
            </div>

            {/* Individual Reviews */}
            <div className="divide-y divide-stone-200 space-y-6">
              {displayedReviews.map((rev) => (
                <div key={rev.id} className="pt-6 first:pt-0 space-y-2 text-xs sm:text-sm">
                  {/* Author Header */}
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{rev.name}</span>
                    {rev.verified && (
                      <span className="flex items-center gap-1 text-[11px] text-stone-500 font-normal">
                        <CheckCircle2 className="w-3 h-3 text-stone-400" />
                        Verified Buyer
                      </span>
                    )}
                  </div>

                  {/* Stars */}
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>

                  {/* Review Title */}
                  <div className="font-bold text-stone-900">{rev.title}</div>

                  {/* Customer Image */}
                  {rev.image && (
                    <div className="w-20 h-24 rounded overflow-hidden border border-stone-200">
                      <img
                        src={rev.image}
                        alt={rev.title}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  )}

                  {/* Comment */}
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>

            {/* Show more button with full tracking */}
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={handleToggleShowMore}
                className="px-6 py-2 border border-stone-300 hover:border-black text-stone-700 hover:text-black rounded text-xs font-semibold transition-colors cursor-pointer"
              >
                {showAll ? 'Show less' : 'Show more'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
