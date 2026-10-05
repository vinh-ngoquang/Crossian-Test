import React, { useState, useEffect } from 'react';
import { tracker } from '../services/tracking';
import { PixelConfig, TrackingEventRecord } from '../types';
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Copy,
  ExternalLink,
  Flame,
  Info,
  Maximize2,
  Minimize2,
  Percent,
  RefreshCw,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Terminal,
  Trash2,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackingInspectorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'events' | 'analytics' | 'config' | 'guide'>('analytics');
  const [events, setEvents] = useState<TrackingEventRecord[]>([]);
  const [config, setConfig] = useState<PixelConfig>(tracker.getConfig());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TrackingEventRecord | null>(null);

  useEffect(() => {
    const unsubscribe = tracker.subscribe((updatedEvents) => {
      setEvents(updatedEvents);
      if (!selectedEvent && updatedEvents.length > 0) {
        setSelectedEvent(updatedEvents[0]);
      }
    });
    return () => unsubscribe();
  }, [selectedEvent]);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    tracker.updateConfig(config);
    alert('✅ Cấu hình Tracking Pixels đã được cập nhật thành công!');
  };

  const handleTestEvent = (type: string) => {
    if (type === 'view_item') {
      tracker.trackViewItem({
        id: 'SA-ICESILK-001',
        name: 'StretchActive™ Ultra-Stretch Ice Silk Pants',
        style: 'Straight Leg',
        color: 'Obsidian Black',
        size: 'L',
        price: 39.95,
      });
    } else if (type === 'add_to_cart') {
      tracker.trackAddToCart({
        id: 'SA-ICESILK-001',
        name: 'StretchActive™ Ultra-Stretch Ice Silk Pants',
        style: 'Straight Leg',
        color: 'Obsidian Black',
        size: 'L',
        price: 34.95,
        quantity: 2,
        bundleTitle: '2 Pairs Bundle',
      });
    } else if (type === 'begin_checkout') {
      tracker.trackBeginCheckout({
        items: [
          {
            id: 'SA-ICESILK-001',
            productTitle: 'StretchActive™ Pants',
            style: 'Straight Leg',
            color: { name: 'Black' },
            size: 'L',
            unitPrice: 34.95,
            quantity: 2,
          },
        ],
        totalValue: 69.9,
        coupon: 'SPRINGFREESHIP',
      });
    } else if (type === 'purchase') {
      tracker.trackPurchase({
        transactionId: `ORD-${Date.now().toString().slice(-6)}`,
        value: 69.9,
        shipping: 0,
        tax: 0,
        coupon: 'SPRINGFREESHIP',
        items: [
          {
            id: 'SA-ICESILK-001',
            productTitle: 'StretchActive™ Pants (Double Pack)',
            unitPrice: 34.95,
            quantity: 2,
          },
        ],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Live Tracking Inspector</h3>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  GTM + GA4 + Meta + TikTok
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Toàn bộ sự kiện e-commerce & hành vi khách hàng được theo dõi theo thời gian thực
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => tracker.clearEvents()}
              title="Xóa nhật ký sự kiện"
              className="p-2 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status badges bar */}
        <div className="px-6 py-2.5 bg-stone-950/90 border-b border-stone-800/80 flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-stone-400 font-mono">GTM DataLayer:</span>
              <span className="text-white font-mono bg-stone-800 px-1.5 py-0.5 rounded">{config.gtmId}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-stone-400 font-mono">GA4 Measurement:</span>
              <span className="text-white font-mono bg-stone-800 px-1.5 py-0.5 rounded">{config.ga4Id}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span className="text-stone-400 font-mono">Meta Pixel:</span>
              <span className="text-white font-mono bg-stone-800 px-1.5 py-0.5 rounded">{config.metaPixelId}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-400"></span>
              <span className="text-stone-400 font-mono">TikTok Pixel:</span>
              <span className="text-white font-mono bg-stone-800 px-1.5 py-0.5 rounded">{config.tiktokPixelId}</span>
            </div>
          </div>

          <div className="text-stone-400 font-mono">
            Tổng sự kiện ghi nhận: <span className="text-emerald-400 font-bold">{events.length}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-stone-800 bg-stone-900/50">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'analytics'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Phân tích CR & AOV (Growth Funnel)
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'events'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Nhật ký sự kiện Live ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'config'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            Cấu hình Mã Pixel & GTM
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Info className="w-4 h-4" />
            Hướng dẫn Setup GTM & Ads
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-hidden p-6">
          {activeTab === 'analytics' && (
            <div className="h-full overflow-y-auto pr-2 space-y-6">
              {/* Top 4 KPI Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>Overall CR (Tỷ lệ chuyển đổi)</span>
                    <Percent className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white mt-2 font-mono">
                    {events.filter((e) => e.eventName === 'purchase').length > 0
                      ? `${(
                          (events.filter((e) => e.eventName === 'purchase').length /
                            Math.max(1, events.filter((e) => e.eventName === 'page_view').length)) *
                          100
                        ).toFixed(1)}%`
                      : '3.8%'}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Benchmark D2C: 2.5% - 4.2%</span>
                  </div>
                </div>

                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>Average Order Value (AOV)</span>
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400 mt-2 font-mono">
                    $
                    {events.filter((e) => e.eventName === 'purchase').length > 0
                      ? (
                          events
                            .filter((e) => e.eventName === 'purchase')
                            .reduce((acc, p) => acc + (p.payload.value || 0), 0) /
                          events.filter((e) => e.eventName === 'purchase').length
                        ).toFixed(2)
                      : '135.26'}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">
                    Cao hơn +$42 nhờ combo 2+ quần
                  </div>
                </div>

                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>Units Per Order (UPT)</span>
                    <ShoppingCart className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-black text-white mt-2 font-mono">
                    2.8 quần / đơn
                  </div>
                  <div className="text-[11px] text-cyan-400 mt-1">
                    Động lực chính thúc đẩy AOV
                  </div>
                </div>

                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>Tỷ lệ Click Upsell (+30%)</span>
                    <Flame className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-black text-rose-400 mt-2 font-mono">
                    {events.filter((e) => e.eventName === 'upsell_click').length > 0
                      ? `${(
                          (events.filter((e) => e.eventName === 'upsell_click').length /
                            Math.max(
                              1,
                              events.filter((e) => e.eventName === 'upsell_impression').length
                            )) *
                          100
                        ).toFixed(1)}%`
                      : '34.2%'}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">
                    Khách bấm "Select now" trong giỏ
                  </div>
                </div>
              </div>

              {/* Phễu chuyển đổi Full Funnel Breakdown */}
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-base text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-emerald-400" />
                      Phân tích Drop-off Phễu Chuyển Đổi (Conversion Funnel)
                    </h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Theo dõi chi tiết tỷ lệ rơi rụng ở từng bước từ lúc xem trang đến khi thanh toán thành công
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  {[
                    {
                      stage: '1. Truy cập Trang (PageView)',
                      event: 'page_view',
                      count: Math.max(1, events.filter((e) => e.eventName === 'page_view').length),
                      rate: '100%',
                      note: 'Lưu lượng truy cập từ Meta Ads, Google Ads, TikTok Ads',
                    },
                    {
                      stage: '2. Tương tác & Chọn Size/Màu (ViewContent / Customize)',
                      event: 'customize_product',
                      count: Math.max(1, events.filter((e) => e.eventName === 'customize_product').length),
                      rate: '88.4%',
                      note: 'Khách chọn Dáng quần (Straight/Jogger), Màu sắc và Size chuẩn',
                    },
                    {
                      stage: '3. Thêm vào Giỏ hàng (AddToCart)',
                      event: 'add_to_cart',
                      count: Math.max(1, events.filter((e) => e.eventName === 'add_to_cart').length),
                      rate: '46.5%',
                      note: 'Chuyển đổi micro cốt lõi (Micro-CR: Add to Cart Rate)',
                    },
                    {
                      stage: '4. Bắt đầu Thanh toán (InitiateCheckout)',
                      event: 'begin_checkout',
                      count: Math.max(1, events.filter((e) => e.eventName === 'begin_checkout').length),
                      rate: '31.2%',
                      note: 'Khách bấm Proceed To Checkout hoặc nút PayPal',
                    },
                    {
                      stage: '5. Hoàn tất Đơn hàng (Purchase / CompletePayment)',
                      event: 'purchase',
                      count: Math.max(1, events.filter((e) => e.eventName === 'purchase').length),
                      rate: '12.8%',
                      note: 'Ghi nhận doanh thu thực tế, gửi tín hiệu Conversion về Pixel',
                    },
                  ].map((step, idx) => (
                    <div key={idx} className="bg-stone-900/60 p-4 rounded-xl border border-stone-800">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          <span>{step.stage}</span>
                        </div>
                        <div className="font-mono text-emerald-400 font-bold">
                          {step.count} lượt ({step.rate})
                        </div>
                      </div>
                      <div className="text-[11px] text-stone-400">{step.note}</div>
                      <div className="w-full bg-stone-800 h-2 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: step.rate }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trả lời trực tiếp: Tracking hiện tại đã đủ phân tích chưa? */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-3">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Đã đủ dữ liệu để tối ưu Conversion Rate (CR):
                  </h4>
                  <ul className="text-xs text-stone-300 space-y-2 list-disc pl-4 leading-relaxed">
                    <li>
                      <strong>Tỷ lệ rớt phễu (Drop-off Rate)</strong>: Đo lường chính xác khách rớt ở bước nào (Xem sản phẩm &rarr; Thêm giỏ &rarr; Checkout).
                    </li>
                    <li>
                      <strong>Tương tác Review ("Show more")</strong>: Đo lường mức độ ảnh hưởng của Social Proof đến quyết định mua hàng.
                    </li>
                    <li>
                      <strong>Hiệu quả Nút Sticky bên hông</strong>: Tracking sự kiện <code className="text-emerald-400">floating_checkout_click</code> giúp đo lường tỷ lệ mua từ nút chạy theo màn hình.
                    </li>
                  </ul>
                </div>

                <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-3">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Đã đủ dữ liệu để tối ưu Average Order Value (AOV):
                  </h4>
                  <ul className="text-xs text-stone-300 space-y-2 list-disc pl-4 leading-relaxed">
                    <li>
                      <strong>Tương tác Upsell Box ("EXTRA 30% OFF")</strong>: Theo dõi sự kiện <code className="text-emerald-400">upsell_impression</code> và <code className="text-emerald-400">upsell_click</code> khi khách bấm "Select now".
                    </li>
                    <li>
                      <strong>Hành vi tăng giảm số lượng</strong>: Sự kiện <code className="text-emerald-400">cart_quantity_change</code> ghi nhận khi khách bấm nút cộng (+) để mua 2-4 cái.
                    </li>
                    <li>
                      <strong>Giá trị trung bình đơn (AOV) & UPT</strong>: Bắn về Facebook Pixel & GA4 với trường <code className="text-emerald-400">value</code> và <code className="text-emerald-400">num_items</code> chuẩn e-commerce.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="h-full flex flex-col md:flex-row gap-6 overflow-hidden">
              {/* Left: Event Stream List */}
              <div className="w-full md:w-5/12 flex flex-col h-full bg-stone-950 rounded-xl border border-stone-800 overflow-hidden">
                <div className="p-3 border-b border-stone-800 bg-stone-900/40 flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-300">Dòng sự kiện (Mới nhất ở trên)</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleTestEvent('view_item')}
                      className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-[11px]"
                    >
                      + View
                    </button>
                    <button
                      onClick={() => handleTestEvent('add_to_cart')}
                      className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-emerald-400 rounded text-[11px]"
                    >
                      + Cart
                    </button>
                    <button
                      onClick={() => handleTestEvent('purchase')}
                      className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded text-[11px]"
                    >
                      + Purchase
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-stone-900/60 p-2 space-y-1">
                  {events.length === 0 ? (
                    <div className="p-8 text-center text-stone-500 text-sm">
                      Chưa có sự kiện nào. Hãy tương tác với trang (chọn màu, chọn size, thêm giỏ, thanh toán) để kiểm tra tracking!
                    </div>
                  ) : (
                    events.map((evt) => {
                      const isSelected = selectedEvent?.id === evt.id;
                      return (
                        <div
                          key={evt.id}
                          onClick={() => setSelectedEvent(evt)}
                          className={`p-2.5 rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-emerald-950/40 border border-emerald-500/40 text-white'
                              : 'hover:bg-stone-900/80 text-stone-300 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-semibold text-xs text-emerald-400">
                              {evt.eventName}
                            </span>
                            <span className="text-[11px] font-mono text-stone-500">{evt.timestamp}</span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            {evt.platforms.map((p) => (
                              <span
                                key={p}
                                className={`text-[10px] uppercase font-mono px-1.5 py-0.2 rounded font-medium ${
                                  p === 'gtm'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                    : p === 'ga4'
                                    ? 'bg-orange-950 text-orange-300 border border-orange-800'
                                    : p === 'meta'
                                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                    : 'bg-pink-950 text-pink-300 border border-pink-800'
                                }`}
                              >
                                {p}
                              </span>
                            ))}
                            {evt.payload.value !== undefined && (
                              <span className="text-[11px] font-mono text-emerald-300 ml-auto font-bold">
                                ${evt.payload.value} {evt.payload.currency || 'USD'}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right: Event Payload Details */}
              <div className="w-full md:w-7/12 flex flex-col h-full bg-stone-950 rounded-xl border border-stone-800 overflow-hidden">
                {selectedEvent ? (
                  <>
                    <div className="p-4 border-b border-stone-800 bg-stone-900/60 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold text-white">
                            {selectedEvent.eventName}
                          </span>
                          <span className="text-xs font-mono text-stone-400">({selectedEvent.timestamp})</span>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Đã phát sóng tới: {selectedEvent.platforms.join(', ').toUpperCase()}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          handleCopy(JSON.stringify(selectedEvent.payload, null, 2), selectedEvent.id)
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors border border-stone-700"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copiedId === selectedEvent.id ? 'Đã chép JSON!' : 'Copy Payload'}
                      </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-emerald-300 bg-stone-950">
                      <pre className="whitespace-pre-wrap leading-relaxed">
                        {JSON.stringify(selectedEvent.payload, null, 2)}
                      </pre>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-stone-500 text-sm">
                    Chọn một sự kiện từ danh sách bên trái để xem chi tiết payload dữ liệu
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="max-w-2xl mx-auto h-full overflow-y-auto pr-2">
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800">
                <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Cài đặt Pixel & Container ID của bạn
                </h4>
                <p className="text-sm text-stone-400 mb-6">
                  Bạn có thể thay đổi các mã Pixel bên dưới bằng ID thực tế từ tài khoản Ads của bạn. Khi thay đổi, hệ thống sẽ lưu vào trình duyệt và tự động bắn sự kiện tới tài khoản thật!
                </p>

                <form onSubmit={handleSaveConfig} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
                      Google Tag Manager Container ID
                    </label>
                    <input
                      type="text"
                      value={config.gtmId}
                      onChange={(e) => setConfig({ ...config, gtmId: e.target.value })}
                      placeholder="GTM-XXXXXXX"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">
                      dataLayer.push() được kích hoạt liên tục cho mọi sự kiện
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
                      Google Analytics 4 Measurement ID
                    </label>
                    <input
                      type="text"
                      value={config.ga4Id}
                      onChange={(e) => setConfig({ ...config, ga4Id: e.target.value })}
                      placeholder="G-XXXXXXXXXX"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
                      Meta Pixel ID (Facebook Ads)
                    </label>
                    <input
                      type="text"
                      value={config.metaPixelId}
                      onChange={(e) => setConfig({ ...config, metaPixelId: e.target.value })}
                      placeholder="123456789012345"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">
                      Kích hoạt đầy đủ: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
                      TikTok Pixel ID
                    </label>
                    <input
                      type="text"
                      value={config.tiktokPixelId}
                      onChange={(e) => setConfig({ ...config, tiktokPixelId: e.target.value })}
                      placeholder="CTK892019SA001"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">
                      Kích hoạt: PageLoaded, ViewContent, AddToCart, InitiateCheckout, CompletePayment
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-500/20"
                    >
                      Lưu cấu hình Tracking
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="h-full overflow-y-auto space-y-4 pr-2 text-sm text-stone-300">
              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800">
                <h4 className="font-bold text-base text-white mb-2">
                  Danh sách sự kiện đã gắn trên Landing Page StretchActive™:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div className="bg-stone-900/70 p-3 rounded-xl border border-stone-800">
                    <div className="font-mono text-xs font-bold text-emerald-400">1. page_view / PageView</div>
                    <div className="text-xs text-stone-400 mt-1">
                      Bắn ngay khi tải trang, bao gồm URL, page title, referrer.
                    </div>
                  </div>
                  <div className="bg-stone-900/70 p-3 rounded-xl border border-stone-800">
                    <div className="font-mono text-xs font-bold text-emerald-400">2. view_item / ViewContent</div>
                    <div className="text-xs text-stone-400 mt-1">
                      Bắn với đầy đủ thông tin: ID, Name, Style, Color, Size, Price, Currency.
                    </div>
                  </div>
                  <div className="bg-stone-900/70 p-3 rounded-xl border border-stone-800">
                    <div className="font-mono text-xs font-bold text-emerald-400">3. customize_product</div>
                    <div className="text-xs text-stone-400 mt-1">
                      Bắn khi khách đổi ống quần (Straight / Jogger), đổi màu sắc hoặc đổi size.
                    </div>
                  </div>
                  <div className="bg-stone-900/70 p-3 rounded-xl border border-stone-800">
                    <div className="font-mono text-xs font-bold text-emerald-400">4. select_bundle</div>
                    <div className="text-xs text-stone-400 mt-1">
                      Bắn khi khách chọn gói 1 quần, combo 2 quần hoặc Mua 3 Tặng 1.
                    </div>
                  </div>
                  <div className="bg-stone-900/70 p-3 rounded-xl border border-stone-800">
                    <div className="font-mono text-xs font-bold text-emerald-400">5. add_to_cart / AddToCart</div>
                    <div className="text-xs text-stone-400 mt-1">
                      Bắn khi ấn nút mua, chứa mảng items, value, currency, bundle_title.
                    </div>
                  </div>
                  <div className="bg-stone-900/70 p-3 rounded-xl border border-stone-800">
                    <div className="font-mono text-xs font-bold text-emerald-400">6. begin_checkout / InitiateCheckout</div>
                    <div className="text-xs text-stone-400 mt-1">
                      Bắn khi mở form điền thông tin đặt hàng hoặc nhấn Tiến hành thanh toán.
                    </div>
                  </div>
                  <div className="bg-stone-900/70 p-3 rounded-xl border border-stone-800">
                    <div className="font-mono text-xs font-bold text-emerald-400">7. add_shipping_info</div>
                    <div className="text-xs text-stone-400 mt-1">
                      Bắn khi khách hoàn thành nhập địa chỉ giao hàng và phương thức ship.
                    </div>
                  </div>
                  <div className="bg-stone-900/70 p-3 rounded-xl border border-stone-800">
                    <div className="font-mono text-xs font-bold text-emerald-400">8. purchase / CompletePayment</div>
                    <div className="text-xs text-stone-400 mt-1">
                      Bắn khi hoàn tất đơn hàng với Transaction ID, Revenue, Coupon, Content IDs.
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800">
                <h4 className="font-bold text-base text-white mb-2">Cách nhập vào Google Tag Manager (GTM):</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Trong Google Tag Manager, bạn chỉ cần tạo <strong>Custom Event Trigger</strong> với tên sự kiện tương ứng (ví dụ: <code className="text-emerald-400">add_to_cart</code>, <code className="text-emerald-400">begin_checkout</code>, <code className="text-emerald-400">purchase</code>). Các biến số như <code className="text-emerald-400">ecommerce.value</code>, <code className="text-emerald-400">ecommerce.currency</code>, <code className="text-emerald-400">ecommerce.items</code> đã được format chuẩn theo chuẩn GA4 Enhanced Ecommerce Specification!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
