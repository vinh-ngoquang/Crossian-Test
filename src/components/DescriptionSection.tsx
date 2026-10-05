import React from 'react';
import { Check, ShieldCheck, Truck, Headphones, Tag } from 'lucide-react';

interface Props {
  onScrollToTop: () => void;
}

export const DescriptionSection: React.FC<Props> = ({ onScrollToTop }) => {
  return (
    <section className="py-12 border-t border-stone-200 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Title Column */}
          <div className="md:col-span-3">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 sticky top-20">
              Description
            </h2>
          </div>

          {/* Right Content Column */}
          <div className="md:col-span-9 max-w-2xl space-y-10 text-stone-800 text-sm leading-relaxed">
            {/* 1. Maximum Comfort, Effortless Style */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-stone-900">
                Maximum Comfort, Effortless Style
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm">
                Be ready for anything with StretchActive, made with <strong>COOLMAX®</strong> fabric
                with incredible stretch for optimal mobility.
              </p>

              {/* Graphic Banner: For Women Over 50 / Flash Sale 70% */}
              <div className="rounded-lg overflow-hidden border border-stone-200 bg-stone-50">
                <div className="bg-[#1e293b] text-white py-2 px-4 text-center">
                  <div className="text-xs font-semibold tracking-wider uppercase">
                    FOR WOMEN OVER 50
                  </div>
                  <div className="text-amber-400 font-extrabold text-sm tracking-wide">
                    FLASH SALE 70% OFF
                  </div>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80"
                  alt="Women wearing StretchActive pants"
                  className="w-full h-72 sm:h-96 object-cover object-top"
                />
              </div>

              {/* Second lifestyle image */}
              <div className="rounded-lg overflow-hidden border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=900&auto=format&fit=crop&q=80"
                  alt="StretchActive pants drape and movement"
                  className="w-full h-80 sm:h-96 object-cover object-top"
                />
              </div>
            </div>

            {/* 2. Breeze through Summer */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-stone-900">Breeze through Summer</h3>
              <p className="text-stone-600 text-xs sm:text-sm">
                StretchActive is made from advanced <strong>COOLMAX®</strong> fibers that offer a{' '}
                <strong>cool touch, wick moisture</strong> and <strong>release heat</strong>. These
                pants ensure you stay dry as if they're breathing, maintaining a fresh feel all day.
              </p>

              <div className="rounded-lg overflow-hidden border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=900&auto=format&fit=crop&q=80"
                  alt="COOLMAX Ice Silk Fiber Cooling Fabric"
                  className="w-full h-64 sm:h-80 object-cover object-center"
                />
              </div>
            </div>

            {/* 3. Move without Limits */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-stone-900">Move without Limits</h3>
              <p className="text-stone-600 text-xs sm:text-sm">
                Experience superb <strong>360° stretch</strong> with no deformation. Bid farewell to
                rigid, restrictive pants and welcome <strong>dynamic mobility</strong>.
              </p>

              <div className="rounded-lg overflow-hidden border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80"
                  alt="Dynamic 360 stretch pants"
                  className="w-full h-72 sm:h-96 object-cover object-top"
                />
              </div>
            </div>

            {/* 4. Simple yet Practical Design */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-stone-900">Simple yet Practical Design</h3>
              <p className="text-stone-600 text-xs sm:text-sm">
                StretchActive features an elastic waist with drawcord, and 2 waterproof zipper
                pockets, making them the perfect staple for easy-going days.
              </p>

              {/* Convenient design infographic card */}
              <div className="p-6 bg-stone-50 border border-stone-200 rounded-lg text-center space-y-4">
                <div className="text-xs font-black uppercase tracking-widest text-stone-400">
                  StretchActive
                </div>
                <h4 className="text-lg font-bold text-stone-900">CONVENIENT DESIGN</h4>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-white rounded border border-stone-200">
                    <div className="font-bold text-xs text-stone-900">Elastic waistband</div>
                    <div className="text-[11px] text-stone-500">with drawcord</div>
                  </div>
                  <div className="p-3 bg-white rounded border border-stone-200">
                    <div className="font-bold text-xs text-stone-900">Deep waterproof</div>
                    <div className="text-[11px] text-stone-500">zipper pockets</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Enduring Quality */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-stone-900">Enduring Quality</h3>
              <p className="text-stone-600 text-xs sm:text-sm">
                StretchActive is made of high-quality materials and impeccable attention to detail
                that ensures your investment <strong>stands the test of time</strong>.
              </p>

              <div className="space-y-2 text-xs sm:text-sm text-stone-700 pl-1">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-xs border border-emerald-600 bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <span>Wrinkle-resistant, Non-pilling</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-xs border border-emerald-600 bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <span>High-tech Stretch with Shape Retention</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-xs border border-emerald-600 bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <span>Machine Washable, Fade-resistant</span>
                </div>
              </div>
            </div>

            {/* 6. Versatile for Any Occasion */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-stone-900">Versatile for Any Occasion</h3>
              <p className="text-stone-600 text-xs sm:text-sm">
                Whether you're on your everyday commute or exploring the great outdoors, StretchActive
                will be the most versatile piece of pants in your closet.
              </p>

              {/* Active lifestyle 4-feature grid */}
              <div className="p-5 bg-stone-50 border border-stone-200 rounded-lg text-center">
                <div className="text-xs font-black uppercase text-stone-400 mb-1">
                  StretchActive
                </div>
                <div className="text-sm font-bold text-stone-900 mb-4">FOR ACTIVE LIFESTYLES</div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-white rounded border border-stone-200 font-semibold text-[11px]">
                    Flexible
                  </div>
                  <div className="p-2 bg-white rounded border border-stone-200 font-semibold text-[11px]">
                    Breathable
                  </div>
                  <div className="p-2 bg-white rounded border border-stone-200 font-semibold text-[11px]">
                    Quick drying
                  </div>
                  <div className="p-2 bg-white rounded border border-stone-200 font-semibold text-[11px]">
                    Water repellent
                  </div>
                </div>
              </div>
            </div>

            {/* 7. Fit & Sizing Guide */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-stone-900">Fit & Sizing Guide</h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                <strong>Regular fit:</strong> universal, easy fit for a comfortable range of motion.
                <br />
                Our size chart follows US standards. Please refer to the size guide below to get your
                correct size.
              </p>

              {/* Visual Size Chart Table */}
              <div className="border border-stone-300 rounded-md overflow-hidden bg-white text-xs">
                <div className="bg-[#0284c7] text-white p-2.5 text-center font-bold tracking-wide">
                  SIZE CHART (INCHES)
                </div>
                <table className="w-full text-center border-collapse text-[11px] sm:text-xs">
                  <thead>
                    <tr className="bg-stone-100 font-bold border-b border-stone-300 text-stone-700">
                      <th className="p-2 border-r border-stone-300">US SIZE</th>
                      <th className="p-2 border-r border-stone-300">WAIST</th>
                      <th className="p-2">HIPS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    <tr>
                      <td className="p-1.5 font-bold border-r border-stone-200 bg-stone-50">
                        XS (0-2)
                      </td>
                      <td className="p-1.5 border-r border-stone-200">24 - 27"</td>
                      <td className="p-1.5">32 - 35"</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-bold border-r border-stone-200 bg-stone-50">
                        S (4-6)
                      </td>
                      <td className="p-1.5 border-r border-stone-200">26 - 29"</td>
                      <td className="p-1.5">34 - 37"</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-bold border-r border-stone-200 bg-stone-50">
                        M (8-10)
                      </td>
                      <td className="p-1.5 border-r border-stone-200">28 - 31"</td>
                      <td className="p-1.5">36 - 39"</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-bold border-r border-stone-200 bg-stone-50">
                        L (12-14)
                      </td>
                      <td className="p-1.5 border-r border-stone-200">30 - 33"</td>
                      <td className="p-1.5">38 - 41"</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-bold border-r border-stone-200 bg-stone-50">
                        XL (16-18)
                      </td>
                      <td className="p-1.5 border-r border-stone-200">32 - 35"</td>
                      <td className="p-1.5">40 - 43"</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-bold border-r border-stone-200 bg-stone-50">
                        2XL (18-20)
                      </td>
                      <td className="p-1.5 border-r border-stone-200">34 - 37"</td>
                      <td className="p-1.5">42 - 45"</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-bold border-r border-stone-200 bg-stone-50">
                        3XL (20W-22W)
                      </td>
                      <td className="p-1.5 border-r border-stone-200">38 - 41"</td>
                      <td className="p-1.5">46 - 49"</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-bold border-r border-stone-200 bg-stone-50">
                        4XL (24W)
                      </td>
                      <td className="p-1.5 border-r border-stone-200">42 - 45"</td>
                      <td className="p-1.5">50 - 53"</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-bold border-r border-stone-200 bg-stone-50">
                        5XL (26W)
                      </td>
                      <td className="p-1.5 border-r border-stone-200">45 - 48"</td>
                      <td className="p-1.5">53 - 56"</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-bold border-r border-stone-200 bg-stone-50">
                        6XL (28W)
                      </td>
                      <td className="p-1.5 border-r border-stone-200">48 - 52"</td>
                      <td className="p-1.5">56 - 59"</td>
                    </tr>
                  </tbody>
                </table>
                <div className="bg-[#e0f2fe] text-[#0369a1] p-2 text-center text-[11px] font-semibold border-t border-stone-200">
                  INSEAMS: Petite (26-28") for 5'4 and under | Regular (29-31") for 5'5 - 5'10 | Tall
                  (32-34") for 5'11 and above
                </div>
              </div>
            </div>

            {/* 8. Specifications */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-stone-900">Specifications</h3>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-stone-600">
                <li>
                  Materials: <strong>76% Polyamide + 24% Spandex</strong>, with <strong>COOLMAX®</strong> fibers
                </li>
                <li>Color: Black, Gray, Navy, Ocean Blue, White, Khaki, Brown</li>
                <li>Style: Straight & Jogger</li>
                <li>Machine Washable</li>
              </ul>
            </div>

            {/* 9. Why Us? */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-stone-900">Why Us?</h3>
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-500" />
                    <span>Direct Factory Price</span>
                  </div>
                  <p className="text-stone-600 mt-0.5 text-xs">
                    We work directly with manufacturers to ensure the best price and quality of our
                    products. We have a Quality Control Department which helps us to keep our
                    promises!
                  </p>
                </div>

                <div>
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Exclusive 45-Day Satisfaction Guarantee</span>
                  </div>
                  <p className="text-stone-600 mt-0.5 text-xs">
                    Easy exchange, return and refund policy extended for an impressive 45-day
                    duration. Enjoy hassle-free online shopping because your satisfaction is our top
                    priority!
                  </p>
                </div>

                <div>
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Secured & Insured Shipping</span>
                  </div>
                  <p className="text-stone-600 mt-0.5 text-xs">
                    Our real-time tracking system keeps you informed about your package's journey
                    through email or SMS notifications. If your packages are lost, we've got you
                    covered - it's on us!
                  </p>
                </div>

                <div>
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5 text-purple-600" />
                    <span>24/7 Customer Care</span>
                  </div>
                  <p className="text-stone-600 mt-0.5 text-xs">
                    No sale is ever final (including clearance sales). Contact us via phone or email
                    anytime, anywhere - we're here for you!
                  </p>
                </div>
              </div>
            </div>

            {/* Final Banner */}
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={onScrollToTop}
                className="text-base sm:text-lg font-black text-black hover:text-[#dc2626] transition-colors cursor-pointer"
              >
                Get Yours Now At 70% OFF!
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
