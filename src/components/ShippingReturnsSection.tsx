import React from 'react';

export const ShippingReturnsSection: React.FC = () => {
  return (
    <section className="py-12 border-t border-stone-200 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Title Column */}
          <div className="md:col-span-3">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              Shipping &<br />Returns
            </h2>
          </div>

          {/* Right Content Column */}
          <div className="md:col-span-9 max-w-2xl text-xs sm:text-sm text-stone-600 leading-relaxed space-y-2">
            <p>
              <strong>StretchActive</strong> stands by our product quality and offers returns,
              refunds, and exchanges. Please see our policy details{' '}
              <a href="#" className="underline font-medium text-stone-900 hover:text-black">
                here
              </a>
              . You may also learn more about shipping FAQs{' '}
              <a href="#" className="underline font-medium text-stone-900 hover:text-black">
                here
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
