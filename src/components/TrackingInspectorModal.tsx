import React, { useState, useEffect } from 'react';
import { tracker } from '../services/tracking';
import { PixelConfig, TrackingEventRecord } from '../types';
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Code,
  Copy,
  CreditCard,
  Database,
  Download,
  ExternalLink,
  Eye,
  Filter,
  Flame,
  Info,
  Layers,
  Maximize2,
  Minimize2,
  Percent,
  RefreshCw,
  Settings,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sliders,
  Table,
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

export interface FlattenedEventRow {
  timestamp: string;
  userId: string;
  sessionId: string;
  sessionNumber: number;
  funnelStep: string;
  eventName: string;
  category: string;
  itemName: string;
  style: string;
  color: string;
  size: string;
  inseam: string;
  quantity: number | string;
  unitPrice: number | string;
  totalValue: number | string;
  savings: number | string;
  isMultiItem: string;
  paymentMethod: string;
  actionDetail: string;
  platforms: string;
}

export function flattenRecord(e: TrackingEventRecord): FlattenedEventRow {
  const p = e.payload || {};
  const firstItem = Array.isArray(p.items) && p.items.length > 0 ? p.items[0] : null;

  let funnelStep = 'Engagement';
  if (e.eventName === 'page_view') funnelStep = '1. Landing';
  else if (e.eventName === 'view_item' || e.eventName === 'customize_product') funnelStep = '2. Product Explore';
  else if (e.eventName === 'add_to_cart' || e.eventName === 'upsell_click' || e.eventName === 'cart_quantity_change') funnelStep = '3. Cart Building';
  else if (e.eventName === 'begin_checkout' || e.eventName === 'add_shipping_info' || e.eventName === 'add_payment_info') funnelStep = '4. Checkout';
  else if (e.eventName === 'purchase') funnelStep = '5. Purchase';

  const itemName = p.content_name || p.item_name || firstItem?.productTitle || firstItem?.item_name || 'StretchActive™ Ice Silk Pants';
  const style = p.style || p.full_selection?.style || firstItem?.style || (p.item_variant?.includes('Jogger') ? 'Jogger' : p.item_variant?.includes('Straight') ? 'Straight' : '-');
  const color = p.color || p.full_selection?.color?.name || firstItem?.color || '-';
  const size = p.size || p.full_selection?.size || firstItem?.size || '-';
  const inseam = p.inseam || p.full_selection?.inseam || firstItem?.inseam || '-';

  const qty = p.quantity || p.num_items || firstItem?.quantity || (e.eventName === 'add_to_cart' || e.eventName === 'purchase' ? 1 : '-');
  const unitPrice = p.price || firstItem?.price || firstItem?.unitPrice || (typeof p.value === 'number' && typeof qty === 'number' ? (p.value / qty).toFixed(2) : '-');
  const totalValue = p.value !== undefined ? Number(p.value).toFixed(2) : '-';
  const savings = p.savings_amount !== undefined ? Number(p.savings_amount).toFixed(2) : (typeof qty === 'number' && qty > 1 ? (74.04).toFixed(2) : '0.00');
  const isMultiItem = typeof qty === 'number' ? (qty > 1 ? 'YES' : 'NO') : '-';
  const paymentMethod = p.payment_type || p.payment_method || '-';
  const actionDetail = p.action || p.offer_title || p.button_name || p.customization_value || p.page_title || '-';

  return {
    timestamp: e.timestamp,
    userId: e.userId || tracker.getUserId(),
    sessionId: e.sessionId || tracker.getSessionId(),
    sessionNumber: p.session_number || 1,
    funnelStep,
    eventName: e.eventName,
    category: e.category,
    itemName,
    style: String(style),
    color: String(color),
    size: String(size),
    inseam: String(inseam),
    quantity: qty,
    unitPrice: typeof unitPrice === 'number' ? unitPrice.toFixed(2) : unitPrice,
    totalValue,
    savings,
    isMultiItem,
    paymentMethod: String(paymentMethod),
    actionDetail: String(actionDetail),
    platforms: e.platforms.join('+'),
  };
}

export const TrackingInspectorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'events' | 'analytics' | 'config' | 'guide'>('analytics');
  const [eventViewMode, setEventViewMode] = useState<'table' | 'json'>('table');
  const [events, setEvents] = useState<TrackingEventRecord[]>([]);
  const [config, setConfig] = useState<PixelConfig>(tracker.getConfig());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TrackingEventRecord | null>(null);

  const handleExportCsv = () => {
    if (events.length === 0) return;
    const headers = [
      'Timestamp',
      'User_ID',
      'Session_ID',
      'Session_Number',
      'Funnel_Step',
      'Event_Name',
      'Category',
      'Item_Name',
      'Style',
      'Color',
      'Size',
      'Inseam',
      'Quantity',
      'Unit_Price_USD',
      'Total_Value_USD',
      'Savings_USD',
      'Is_Multi_Item',
      'Payment_Method',
      'Action_Detail',
      'Platforms',
    ];

    const rows = events.map((e) => {
      const f = flattenRecord(e);
      return [
        `"${f.timestamp}"`,
        `"${f.userId}"`,
        `"${f.sessionId}"`,
        f.sessionNumber,
        `"${f.funnelStep}"`,
        `"${f.eventName}"`,
        `"${f.category}"`,
        `"${f.itemName.replace(/"/g, '""')}"`,
        `"${f.style}"`,
        `"${f.color}"`,
        `"${f.size}"`,
        `"${f.inseam}"`,
        f.quantity,
        f.unitPrice,
        f.totalValue,
        f.savings,
        `"${f.isMultiItem}"`,
        `"${f.paymentMethod}"`,
        `"${f.actionDetail.replace(/"/g, '""')}"`,
        `"${f.platforms}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `stretchactive_bi_events_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              onClick={() => {
                tracker.clearEvents();
                setEvents([]);
              }}
              title="Xóa toàn bộ dữ liệu tracking"
              className="p-2 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
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
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-2.5 py-1 rounded-md text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-stone-400 font-mono">User_ID:</span>
              <span className="text-emerald-400 font-mono font-bold">{tracker.getUserId()}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-2.5 py-1 rounded-md text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span className="text-stone-400 font-mono">Session_ID:</span>
              <span className="text-cyan-400 font-mono font-bold">{tracker.getSessionId()}</span>
              <button
                onClick={() => {
                  tracker.renewSession();
                  setEvents(tracker.getEvents());
                }}
                className="ml-1 text-[10px] text-stone-400 hover:text-white underline cursor-pointer"
                title="Tạo phiên mới để kiểm tra phân biệt session"
              >
                (Đổi session)
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-stone-400 font-mono">GTM:</span>
              <span className="text-white font-mono bg-stone-800 px-1.5 py-0.5 rounded">{config.gtmId}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-stone-400 font-mono">GA4:</span>
              <span className="text-white font-mono bg-stone-800 px-1.5 py-0.5 rounded">{config.ga4Id}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span className="text-stone-400 font-mono">Meta:</span>
              <span className="text-white font-mono bg-stone-800 px-1.5 py-0.5 rounded">{config.metaPixelId}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-400"></span>
              <span className="text-stone-400 font-mono">TikTok:</span>
              <span className="text-white font-mono bg-stone-800 px-1.5 py-0.5 rounded">{config.tiktokPixelId}</span>
            </div>
          </div>

          <div className="text-stone-400 font-mono">
            Tổng sự kiện: <span className="text-emerald-400 font-bold">{events.length}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-stone-800 bg-stone-900/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Filter className="w-4 h-4 text-emerald-400" />
            Sơ Đồ Phễu Chuyển Đổi (Visual Funnel & CR)
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
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
            className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
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
            className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
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
              {/* Top 4 KPI Metrics (Computed 100% Real-Time from Events) */}
              {(() => {
                const pageViews = events.filter((e) => e.eventName === 'page_view').length;
                const purchases = events.filter((e) => e.eventName === 'purchase');
                const purchaseCount = purchases.length;
                const totalRevenue = purchases.reduce(
                  (acc, p) => acc + (p.payload.value || p.payload.price || 0),
                  0
                );
                const totalUnits = purchases.reduce(
                  (acc, p) => acc + (p.payload.quantity || p.payload.num_items || 1),
                  0
                );
                const upsellClicks = events.filter((e) => e.eventName === 'upsell_click').length;
                const upsellImpressions = events.filter((e) => e.eventName === 'upsell_impression').length;

                const cr =
                  pageViews > 0 && purchaseCount > 0
                    ? ((purchaseCount / pageViews) * 100).toFixed(1)
                    : '0.0';
                const aov = purchaseCount > 0 ? (totalRevenue / purchaseCount).toFixed(2) : '0.00';
                const upt = purchaseCount > 0 ? (totalUnits / purchaseCount).toFixed(1) : '0.0';
                const upsellRate =
                  upsellImpressions > 0 && upsellClicks > 0
                    ? ((upsellClicks / upsellImpressions) * 100).toFixed(1)
                    : '0.0';

                const customizeCount = events.filter(
                  (e) => e.eventName === 'customize_product'
                ).length;
                const cartCount = events.filter((e) => e.eventName === 'add_to_cart').length;
                const checkoutCount = events.filter(
                  (e) => e.eventName === 'begin_checkout'
                ).length;

                const funnelSteps = [
                  {
                    stage: '1. Truy cập Trang (PageView)',
                    event: 'page_view',
                    count: pageViews,
                    rate: pageViews > 0 ? '100%' : '0%',
                    note: 'Lưu lượng truy cập thực tế từ Ads / Direct',
                  },
                  {
                    stage: '2. Tương tác & Chọn Size/Màu (ViewContent / Customize)',
                    event: 'customize_product',
                    count: customizeCount,
                    rate:
                      pageViews > 0
                        ? `${((customizeCount / pageViews) * 100).toFixed(1)}%`
                        : '0%',
                    note: 'Khách chọn Dáng quần (Straight/Jogger), Màu sắc và Size chuẩn',
                  },
                  {
                    stage: '3. Thêm vào Giỏ hàng (AddToCart)',
                    event: 'add_to_cart',
                    count: cartCount,
                    rate:
                      pageViews > 0 ? `${((cartCount / pageViews) * 100).toFixed(1)}%` : '0%',
                    note: 'Chuyển đổi micro cốt lõi (Micro-CR: Add to Cart Rate)',
                  },
                  {
                    stage: '4. Bắt đầu Thanh toán (InitiateCheckout)',
                    event: 'begin_checkout',
                    count: checkoutCount,
                    rate:
                      pageViews > 0
                        ? `${((checkoutCount / pageViews) * 100).toFixed(1)}%`
                        : '0%',
                    note: 'Khách bấm Proceed To Checkout hoặc nút PayPal',
                  },
                  {
                    stage: '5. Hoàn tất Đơn hàng (Purchase / CompletePayment)',
                    event: 'purchase',
                    count: purchaseCount,
                    rate:
                      pageViews > 0
                        ? `${((purchaseCount / pageViews) * 100).toFixed(1)}%`
                        : '0%',
                    note: 'Ghi nhận doanh thu thực tế, gửi tín hiệu Conversion về Pixel',
                  },
                ];

                return (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                        <div className="flex items-center justify-between text-xs text-stone-400">
                          <span>Overall CR (Tỷ lệ chuyển đổi)</span>
                          <Percent className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-2xl font-black text-white mt-2 font-mono">
                          {cr}%
                        </div>
                        <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>
                            {purchaseCount > 0
                              ? `${purchaseCount}/${pageViews} lượt mua`
                              : 'Chưa có đơn hàng'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                        <div className="flex items-center justify-between text-xs text-stone-400">
                          <span>Average Order Value (AOV)</span>
                          <TrendingUp className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="text-2xl font-black text-amber-400 mt-2 font-mono">
                          ${aov}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-1">
                          {purchaseCount > 0
                            ? `Tổng DT: $${totalRevenue.toFixed(2)}`
                            : 'Chưa có doanh thu'}
                        </div>
                      </div>

                      <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                        <div className="flex items-center justify-between text-xs text-stone-400">
                          <span>Units Per Order (UPT)</span>
                          <ShoppingCart className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="text-2xl font-black text-white mt-2 font-mono">
                          {upt} quần / đơn
                        </div>
                        <div className="text-[11px] text-cyan-400 mt-1">
                          {purchaseCount > 0
                            ? `Tổng đã bán: ${totalUnits} chiếc`
                            : 'Chưa có sản phẩm bán ra'}
                        </div>
                      </div>

                      <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                        <div className="flex items-center justify-between text-xs text-stone-400">
                          <span>Tỷ lệ Click Upsell (+30%)</span>
                          <Flame className="w-4 h-4 text-rose-400" />
                        </div>
                        <div className="text-2xl font-black text-rose-400 mt-2 font-mono">
                          {upsellRate}%
                        </div>
                        <div className="text-[11px] text-stone-400 mt-1">
                          {upsellImpressions > 0
                            ? `${upsellClicks}/${upsellImpressions} lượt click ưu đãi`
                            : 'Chưa mở giỏ hàng'}
                        </div>
                      </div>
                    </div>

                    {/* SƠ ĐỒ HÌNH PHỄU TRỰC QUAN (VISUAL STEPPED FUNNEL DIAGRAM) */}
                    <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4">
                        <div>
                          <h4 className="font-bold text-base text-white flex items-center gap-2">
                            <Filter className="w-5 h-5 text-emerald-400" />
                            Sơ Đồ Phễu Chuyển Đổi Trực Quan (E-Commerce Visual Funnel)
                          </h4>
                          <p className="text-xs text-stone-400 mt-0.5">
                            Hình phễu 5 tầng đo lường chính xác lượng khách qua từng bước & tỷ lệ rớt (Drop-off Rate)
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-stone-400">Tỷ lệ hoàn tất phễu:</span>
                          <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded-lg">
                            {cr}% CR
                          </span>
                        </div>
                      </div>

                      {/* Visual Funnel Tiers & Drop-off Bridges */}
                      <div className="flex flex-col items-center gap-2 py-2">
                        {/* TẦNG 1: PageView */}
                        <div className="w-full bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-emerald-950/80 border border-emerald-500/40 rounded-xl p-4 shadow-md transition-all hover:border-emerald-400">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <div className="flex items-center gap-2.5 font-bold text-white">
                              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                                <Eye className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-emerald-400 font-mono text-[11px] uppercase mr-2">Tầng 1</span>
                                <span className="font-semibold text-white">Truy cập Trang (PageView)</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono font-black text-white text-base">
                                {pageViews} <span className="text-xs text-stone-400 font-normal">lượt</span>
                              </div>
                              <span className="text-[11px] font-mono text-emerald-400 font-bold">100% (Đỉnh phễu)</span>
                            </div>
                          </div>
                        </div>

                        {/* BRIDGE 1 -> 2: Drop-off */}
                        <div className="flex flex-col items-center justify-center my-0.5">
                          <div className="h-4 w-px bg-stone-700"></div>
                          <div className="flex items-center gap-2 px-3 py-1 bg-stone-900 border border-stone-800 rounded-full text-[11px] font-mono text-stone-300 shadow-sm">
                            <ArrowDown className="w-3 h-3 text-stone-400" />
                            {pageViews > 0 ? (
                              <>
                                <span className="text-rose-400 font-bold">
                                  -{(Math.max(0, 100 - (customizeCount / pageViews) * 100)).toFixed(1)}% Rớt
                                </span>
                                <span className="text-stone-500">({Math.max(0, pageViews - customizeCount)} khách thoát)</span>
                                <span className="text-stone-600">|</span>
                                <span className="text-emerald-400">
                                  {pageViews > 0 ? ((customizeCount / pageViews) * 100).toFixed(1) : 0}% chuyển tiếp
                                </span>
                              </>
                            ) : (
                              <span className="text-stone-500">Chưa có dữ liệu</span>
                            )}
                          </div>
                          <div className="h-4 w-px bg-stone-700"></div>
                        </div>

                        {/* TẦNG 2: ViewContent / Customize */}
                        <div
                          style={{
                            width: pageViews > 0 ? `${Math.max(48, Math.min(92, (customizeCount / pageViews) * 100))}%` : '85%',
                          }}
                          className="bg-gradient-to-r from-cyan-950/80 via-cyan-900/40 to-cyan-950/80 border border-cyan-500/40 rounded-xl p-4 shadow-md transition-all hover:border-cyan-400 min-w-[280px]"
                        >
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <div className="flex items-center gap-2.5 font-bold text-white">
                              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                                <Sliders className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-cyan-400 font-mono text-[11px] uppercase mr-2">Tầng 2</span>
                                <span className="font-semibold text-white">Khám phá & Chọn Size / Màu</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono font-black text-white text-base">
                                {customizeCount} <span className="text-xs text-stone-400 font-normal">lượt</span>
                              </div>
                              <span className="text-[11px] font-mono text-cyan-400 font-bold">
                                {pageViews > 0 ? ((customizeCount / pageViews) * 100).toFixed(1) : 0}% của tổng
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* BRIDGE 2 -> 3: Drop-off */}
                        <div className="flex flex-col items-center justify-center my-0.5">
                          <div className="h-4 w-px bg-stone-700"></div>
                          <div className="flex items-center gap-2 px-3 py-1 bg-stone-900 border border-stone-800 rounded-full text-[11px] font-mono text-stone-300 shadow-sm">
                            <ArrowDown className="w-3 h-3 text-stone-400" />
                            {customizeCount > 0 ? (
                              <>
                                <span className="text-rose-400 font-bold">
                                  -{(Math.max(0, 100 - (cartCount / customizeCount) * 100)).toFixed(1)}% Rớt
                                </span>
                                <span className="text-stone-500">({Math.max(0, customizeCount - cartCount)} xem không thêm giỏ)</span>
                                <span className="text-stone-600">|</span>
                                <span className="text-cyan-400">
                                  {customizeCount > 0 ? ((cartCount / customizeCount) * 100).toFixed(1) : 0}% chuyển tiếp
                                </span>
                              </>
                            ) : (
                              <span className="text-stone-500">Chưa có dữ liệu</span>
                            )}
                          </div>
                          <div className="h-4 w-px bg-stone-700"></div>
                        </div>

                        {/* TẦNG 3: AddToCart */}
                        <div
                          style={{
                            width: pageViews > 0 ? `${Math.max(42, Math.min(84, (cartCount / pageViews) * 100))}%` : '70%',
                          }}
                          className="bg-gradient-to-r from-blue-950/80 via-blue-900/40 to-blue-950/80 border border-blue-500/40 rounded-xl p-4 shadow-md transition-all hover:border-blue-400 min-w-[260px]"
                        >
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <div className="flex items-center gap-2.5 font-bold text-white">
                              <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                                <ShoppingCart className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-blue-400 font-mono text-[11px] uppercase mr-2">Tầng 3</span>
                                <span className="font-semibold text-white">Thêm vào Giỏ hàng (AddToCart)</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono font-black text-white text-base">
                                {cartCount} <span className="text-xs text-stone-400 font-normal">lượt</span>
                              </div>
                              <span className="text-[11px] font-mono text-blue-400 font-bold">
                                {pageViews > 0 ? ((cartCount / pageViews) * 100).toFixed(1) : 0}% của tổng
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* BRIDGE 3 -> 4: Drop-off */}
                        <div className="flex flex-col items-center justify-center my-0.5">
                          <div className="h-4 w-px bg-stone-700"></div>
                          <div className="flex items-center gap-2 px-3 py-1 bg-stone-900 border border-stone-800 rounded-full text-[11px] font-mono text-stone-300 shadow-sm">
                            <ArrowDown className="w-3 h-3 text-stone-400" />
                            {cartCount > 0 ? (
                              <>
                                <span className="text-rose-400 font-bold">
                                  -{(Math.max(0, 100 - (checkoutCount / cartCount) * 100)).toFixed(1)}% Rớt
                                </span>
                                <span className="text-stone-500">({Math.max(0, cartCount - checkoutCount)} bỏ quên giỏ - Cart Abandonment)</span>
                                <span className="text-stone-600">|</span>
                                <span className="text-indigo-400">
                                  {cartCount > 0 ? ((checkoutCount / cartCount) * 100).toFixed(1) : 0}% chuyển tiếp
                                </span>
                              </>
                            ) : (
                              <span className="text-stone-500">Chưa có dữ liệu</span>
                            )}
                          </div>
                          <div className="h-4 w-px bg-stone-700"></div>
                        </div>

                        {/* TẦNG 4: InitiateCheckout */}
                        <div
                          style={{
                            width: pageViews > 0 ? `${Math.max(36, Math.min(74, (checkoutCount / pageViews) * 100))}%` : '55%',
                          }}
                          className="bg-gradient-to-r from-indigo-950/80 via-indigo-900/40 to-indigo-950/80 border border-indigo-500/40 rounded-xl p-4 shadow-md transition-all hover:border-indigo-400 min-w-[240px]"
                        >
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <div className="flex items-center gap-2.5 font-bold text-white">
                              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                                <CreditCard className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-indigo-400 font-mono text-[11px] uppercase mr-2">Tầng 4</span>
                                <span className="font-semibold text-white">Bắt đầu Thanh toán (Checkout)</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono font-black text-white text-base">
                                {checkoutCount} <span className="text-xs text-stone-400 font-normal">lượt</span>
                              </div>
                              <span className="text-[11px] font-mono text-indigo-400 font-bold">
                                {pageViews > 0 ? ((checkoutCount / pageViews) * 100).toFixed(1) : 0}% của tổng
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* BRIDGE 4 -> 5: Drop-off */}
                        <div className="flex flex-col items-center justify-center my-0.5">
                          <div className="h-4 w-px bg-stone-700"></div>
                          <div className="flex items-center gap-2 px-3 py-1 bg-stone-900 border border-stone-800 rounded-full text-[11px] font-mono text-stone-300 shadow-sm">
                            <ArrowDown className="w-3 h-3 text-stone-400" />
                            {checkoutCount > 0 ? (
                              <>
                                <span className="text-rose-400 font-bold">
                                  -{(Math.max(0, 100 - (purchaseCount / checkoutCount) * 100)).toFixed(1)}% Rớt
                                </span>
                                <span className="text-stone-500">({Math.max(0, checkoutCount - purchaseCount)} hủy thanh toán)</span>
                                <span className="text-stone-600">|</span>
                                <span className="text-amber-400">
                                  {checkoutCount > 0 ? ((purchaseCount / checkoutCount) * 100).toFixed(1) : 0}% thành công
                                </span>
                              </>
                            ) : (
                              <span className="text-stone-500">Chưa có dữ liệu</span>
                            )}
                          </div>
                          <div className="h-4 w-px bg-stone-700"></div>
                        </div>

                        {/* TẦNG 5: Purchase (Đáy Phễu) */}
                        <div
                          style={{
                            width: pageViews > 0 ? `${Math.max(30, Math.min(65, (purchaseCount / pageViews) * 100))}%` : '42%',
                          }}
                          className="bg-gradient-to-r from-amber-950/90 via-emerald-950/60 to-amber-950/90 border-2 border-amber-500/60 rounded-xl p-4 shadow-xl shadow-amber-500/10 transition-all hover:border-amber-400 min-w-[220px]"
                        >
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <div className="flex items-center gap-2.5 font-bold text-white">
                              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-amber-400" />
                              </div>
                              <div>
                                <span className="text-amber-400 font-mono text-[11px] uppercase mr-2 font-bold">Tầng 5 (Đích)</span>
                                <span className="font-bold text-amber-300">Hoàn tất Mua hàng (Purchase)</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono font-black text-amber-400 text-lg">
                                {purchaseCount} <span className="text-xs text-stone-300 font-normal">đơn</span>
                              </div>
                              <div className="text-[11px] font-mono text-emerald-400 font-bold">
                                CR: {cr}% (${totalRevenue.toFixed(2)})
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CHẨN ĐOÁN ĐIỂM NGHẼN (CRO FUNNEL BOTTLENECK DIAGNOSTICS) */}
                      {(() => {
                        const drop1 = pageViews > 0 ? (pageViews - customizeCount) / pageViews : 0;
                        const drop2 = customizeCount > 0 ? (customizeCount - cartCount) / customizeCount : 0;
                        const drop3 = cartCount > 0 ? (cartCount - checkoutCount) / cartCount : 0;
                        const drop4 = checkoutCount > 0 ? (checkoutCount - purchaseCount) / checkoutCount : 0;

                        let bottleneck = 'Chưa có đủ dữ liệu duyệt web để chẩn đoán';
                        let advice = 'Hãy thử chọn màu, chọn size, thêm giỏ và thanh toán để phễu phân tích điểm rơi rụng.';
                        if (pageViews > 0) {
                          const maxDrop = Math.max(drop1, drop2, drop3, drop4);
                          if (maxDrop === drop3 && cartCount > 0) {
                            bottleneck = 'Điểm nghẽn lớn nhất: Giỏ hàng ➔ Bắt đầu Thanh toán (Cart Abandonment)';
                            advice = 'Khách thêm vào giỏ nhưng không bấm Checkout. Giải pháp: Thêm nút PayPal Express 1-click hoặc hiển thị rõ cam kết Miễn Phí Đổi Trả 30 ngày.';
                          } else if (maxDrop === drop2 && customizeCount > 0) {
                            bottleneck = 'Điểm nghẽn lớn nhất: Chọn Biến thể ➔ Thêm Giỏ hàng';
                            advice = 'Khách chọn màu và size nhưng chần chừ bấm Add to Cart. Giải pháp: Nổi bật ưu đãi "Giảm 70% hôm nay" và đồng hồ đếm ngược kích cầu.';
                          } else if (maxDrop === drop4 && checkoutCount > 0) {
                            bottleneck = 'Điểm nghẽn lớn nhất: Bắt đầu Checkout ➔ Hoàn tất Mua hàng';
                            advice = 'Khách mở form thanh toán nhưng bỏ dở. Giải pháp: Đơn giản hóa form, bổ sung huy hiệu bảo mật SSL và đa dạng cổng thanh toán.';
                          } else if (maxDrop === drop1) {
                            bottleneck = 'Điểm nghẽn lớn nhất: Trang chủ ➔ Tương tác Chọn sản phẩm';
                            advice = 'Khách vừa vào đã thoát (Bounce). Giải pháp: Tối ưu hình ảnh Hero Banner, hiển thị ngay điểm số 4.9 sao và đánh giá thực tế của khách hàng.';
                          }
                        }

                        return (
                          <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 flex items-start gap-3 mt-4">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                              <AlertTriangle className="w-4 h-4" />
                            </div>
                            <div className="space-y-1">
                              <h5 className="text-xs font-bold text-white font-sans">{bottleneck}</h5>
                              <p className="text-xs text-stone-400 font-sans leading-relaxed">{advice}</p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </>
                );
              })()}

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
            <div className="h-full flex flex-col gap-4 overflow-hidden">
              {/* Controls bar: Toggle Table/JSON + Export CSV + Test buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-stone-900 p-1 rounded-lg border border-stone-800">
                    <button
                      onClick={() => setEventViewMode('table')}
                      className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        eventViewMode === 'table'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      <Table className="w-3.5 h-3.5" />
                      <span>Dạng Bảng Đa Chiều (Table View)</span>
                    </button>
                    <button
                      onClick={() => setEventViewMode('json')}
                      className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        eventViewMode === 'json'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Dạng JSON Tree</span>
                    </button>
                  </div>

                  <button
                    onClick={handleExportCsv}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    title="Tải về file Excel / CSV dạng bảng đầy đủ 18 cột"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất CSV 18 Cột Chuẩn BI</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-stone-500 text-[11px] hidden sm:inline">Bắn test:</span>
                  <button
                    onClick={() => handleTestEvent('view_item')}
                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs cursor-pointer"
                  >
                    + View
                  </button>
                  <button
                    onClick={() => handleTestEvent('add_to_cart')}
                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-emerald-400 rounded text-xs cursor-pointer"
                  >
                    + Cart
                  </button>
                  <button
                    onClick={() => handleTestEvent('purchase')}
                    className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded text-xs cursor-pointer"
                  >
                    + Purchase
                  </button>
                </div>
              </div>

              {/* TABLE VIEW (Dạng Bảng Phân Tích Chuẩn Excel / Sheets) */}
              {eventViewMode === 'table' ? (
                <div className="flex-1 bg-stone-950 rounded-xl border border-stone-800 overflow-hidden flex flex-col">
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                      <thead>
                        <tr className="bg-stone-900 border-b border-stone-800 text-stone-400 uppercase text-[10px] font-mono tracking-wider sticky top-0">
                          <th className="p-3">Thời gian</th>
                          <th className="p-3">User ID</th>
                          <th className="p-3">Session ID</th>
                          <th className="p-3">Bước Phễu (Funnel)</th>
                          <th className="p-3">Sự kiện (Event)</th>
                          <th className="p-3">Dáng quần (Style)</th>
                          <th className="p-3">Màu sắc</th>
                          <th className="p-3">Size / Inseam</th>
                          <th className="p-3">Số lượng (UPT)</th>
                          <th className="p-3">Đơn giá ($)</th>
                          <th className="p-3">Tổng ($)</th>
                          <th className="p-3">Tiết kiệm ($)</th>
                          <th className="p-3">Combo?</th>
                          <th className="p-3">Chi tiết / Offer</th>
                          <th className="p-3">Cổng TT</th>
                          <th className="p-3">Nền tảng</th>
                          <th className="p-3 text-right">Xem JSON</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-900 font-mono">
                        {events.length === 0 ? (
                          <tr>
                            <td colSpan={17} className="p-8 text-center text-stone-500 font-sans">
                              Chưa có sự kiện nào. Hãy tương tác với trang (chọn màu, chọn size, thêm giỏ, thanh toán) để kiểm tra tracking!
                            </td>
                          </tr>
                        ) : (
                          events.map((evt) => {
                            const f = flattenRecord(evt);
                            return (
                              <tr key={evt.id} className="hover:bg-stone-900/60 transition-colors">
                                <td className="p-3 text-stone-400 text-[11px]">{f.timestamp}</td>
                                <td className="p-3 text-emerald-400 font-bold text-[11px]">{f.userId}</td>
                                <td className="p-3 text-cyan-400 text-[11px]">{f.sessionId}</td>
                                <td className="p-3">
                                  <span className="bg-stone-800 text-stone-200 px-2 py-0.5 rounded text-[10px] font-sans font-semibold">
                                    {f.funnelStep}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <span className="font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                                    {f.eventName}
                                  </span>
                                </td>
                                <td className="p-3 text-stone-200 font-sans">{f.style}</td>
                                <td className="p-3 text-stone-300 font-sans">{f.color}</td>
                                <td className="p-3 text-stone-300 font-sans">{f.size} {f.inseam !== '-' ? `/ ${f.inseam}` : ''}</td>
                                <td className="p-3 font-bold text-center text-white">{f.quantity}</td>
                                <td className="p-3 text-stone-300">{f.unitPrice !== '-' ? `$${f.unitPrice}` : '-'}</td>
                                <td className="p-3 font-bold text-emerald-400">{f.totalValue !== '-' ? `$${f.totalValue}` : '-'}</td>
                                <td className="p-3 text-green-400">{f.savings !== '-' && f.savings !== '0.00' ? `$${f.savings}` : '-'}</td>
                                <td className="p-3">
                                  {f.isMultiItem === 'YES' ? (
                                    <span className="bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                      YES (Combo)
                                    </span>
                                  ) : (
                                    <span className="text-stone-500 text-[10px]">NO</span>
                                  )}
                                </td>
                                <td className="p-3 text-stone-300 max-w-[160px] truncate font-sans" title={f.actionDetail}>
                                  {f.actionDetail}
                                </td>
                                <td className="p-3 text-stone-300 uppercase text-[10px]">{f.paymentMethod}</td>
                                <td className="p-3">
                                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-stone-800 text-stone-300">
                                    {f.platforms}
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => {
                                      setSelectedEvent(evt);
                                      setEventViewMode('json');
                                    }}
                                    className="text-emerald-400 hover:text-emerald-300 underline text-[11px] cursor-pointer"
                                  >
                                    JSON
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* JSON TREE VIEW */
                <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
                  {/* Left: Event Stream List */}
                  <div className="w-full md:w-5/12 flex flex-col h-full bg-stone-950 rounded-xl border border-stone-800 overflow-hidden">
                    <div className="flex-1 overflow-y-auto divide-y divide-stone-900/60 p-2 space-y-1">
                      {events.map((evt) => {
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
                      })}
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
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors border border-stone-700 cursor-pointer"
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
