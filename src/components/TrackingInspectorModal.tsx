import React, { useState, useEffect } from 'react';
import { tracker } from '../services/tracking';
import { PixelConfig, TrackingEventRecord } from '../types';
import { TRACKING_DOCUMENTATION_MD } from '../data/trackingDocContent';
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
  FileText,
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
  UserCheck,
  Users,
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
  else if (
    e.eventName === 'view_item' ||
    e.eventName === 'customize_product' ||
    e.eventName === 'customize_inseam' ||
    e.eventName === 'gallery_interaction' ||
    e.eventName === 'update_quantity'
  )
    funnelStep = '2. Product Explore';
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
  const [funnelSubTab, setFunnelSubTab] = useState<'overview' | 'users'>('overview');
  const [docCopied, setDocCopied] = useState(false);

  const handleDownloadDoc = () => {
    const blob = new Blob([TRACKING_DOCUMENTATION_MD], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'TRACKING_DOCUMENTATION.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyDoc = () => {
    navigator.clipboard.writeText(TRACKING_DOCUMENTATION_MD);
    setDocCopied(true);
    setTimeout(() => setDocCopied(false), 2000);
  };

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
      setSelectedEvent((prev) => prev || (updatedEvents.length > 0 ? updatedEvents[0] : null));
    });
    return () => unsubscribe();
  }, []);

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
        {/* Streamlined Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-stone-800 bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Live Tracking & Funnel Console</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  4 Pixels Active (GTM · GA4 · Meta · TikTok)
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-md" title="Dữ liệu của tất cả mọi người gửi link đều được lưu trữ vĩnh viễn">
                  <Database className="w-3 h-3" />
                  Shared Data Active
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5 font-mono">
                <span>User: <strong className="text-emerald-400">{tracker.getUserId()}</strong></span>
                <span className="text-stone-600">·</span>
                <span>Session: <strong className="text-cyan-400">{tracker.getSessionId()}</strong></span>
                <button
                  onClick={() => {
                    tracker.renewSession();
                    setEvents(tracker.getEvents());
                  }}
                  className="text-[11px] text-stone-400 hover:text-white underline cursor-pointer"
                  title="Tạo session mới để kiểm tra phân biệt khách"
                >
                  (Đổi session)
                </button>
                <span className="text-stone-600">·</span>
                <span className="text-stone-400">{events.length} sự kiện ghi nhận</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (
                  window.confirm(
                    '⚠️ XÁC NHẬN XÓA DỮ LIỆU:\n\nBạn có chắc chắn muốn xóa toàn bộ dữ liệu tracking không?\nDữ liệu của tất cả người dùng trên hệ thống sẽ bị xóa vĩnh viễn và không thể khôi phục.'
                  )
                ) {
                  await tracker.clearEvents();
                  setEvents([]);
                }
              }}
              title="Chỉ xóa khi bạn chủ động xác nhận xóa"
              className="px-2.5 py-1.5 text-xs text-stone-400 hover:text-rose-400 hover:bg-stone-800/80 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-800"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa data</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 border-b border-stone-800 bg-stone-900/50">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'analytics'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Phễu Chuyển Đổi (Funnel)</span>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'events'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Nhật Ký Sự Kiện Live ({events.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'config'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Cấu Hình Pixel & GTM</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'guide'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Tài Liệu Tracking (Docs)</span>
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-hidden p-5 sm:p-6">
          {activeTab === 'analytics' && (
            <div className="h-full overflow-y-auto pr-1 space-y-5">
              {(() => {
                // 1. Phân nhóm sự kiện theo từng User ID duy nhất
                interface UserFunnelRow {
                  userId: string;
                  eventsCount: number;
                  hasStage1: number; // 01. Vào trang (Visit) -> +1 nếu thao tác, 0 nếu không
                  hasStage2: number; // 02. Xem/Chọn SP -> +1 hoặc 0
                  hasStage3: number; // 03. Thêm giỏ hàng -> +1 hoặc 0
                  hasStage4: number; // 04. Checkout -> +1 hoặc 0
                  hasStage5: number; // 05. Mua hàng -> +1 hoặc 0
                  revenue: number;
                  units: number;
                  hasUpsellClick: number;
                  hasUpsellImpression: number;
                  statusLabel: string;
                  lastActionTime: string;
                }

                const userMap = new Map<string, UserFunnelRow>();

                events.forEach((e) => {
                  const uid = e.userId || e.sessionId || 'usr_anonymous';
                  if (!userMap.has(uid)) {
                    userMap.set(uid, {
                      userId: uid,
                      eventsCount: 0,
                      hasStage1: 0,
                      hasStage2: 0,
                      hasStage3: 0,
                      hasStage4: 0,
                      hasStage5: 0,
                      revenue: 0,
                      units: 0,
                      hasUpsellClick: 0,
                      hasUpsellImpression: 0,
                      statusLabel: 'Chỉ ghé thăm (Bounce)',
                      lastActionTime: e.timestamp,
                    });
                  }
                  const u = userMap.get(uid)!;
                  u.eventsCount += 1;
                  u.lastActionTime = e.timestamp;
                  if (e.eventName === 'upsell_click') u.hasUpsellClick = 1;
                  if (e.eventName === 'upsell_impression') u.hasUpsellImpression = 1;
                });

                // Quy tắc nhị phân: User có thao tác = +1, không thao tác = 0
                userMap.forEach((u) => {
                  const userEvents = events.filter(
                    (e) => (e.userId || e.sessionId || 'usr_anonymous') === u.userId
                  );
                  const evSet = new Set(userEvents.map((e) => e.eventName));

                  u.hasStage1 = 1;

                  if (evSet.has('purchase')) {
                    u.hasStage5 = 1;
                    u.hasStage4 = 1;
                    u.hasStage3 = 1;
                    u.hasStage2 = 1;
                    u.statusLabel = 'Đã hoàn tất đơn hàng 🎉';
                    userEvents
                      .filter((e) => e.eventName === 'purchase')
                      .forEach((e) => {
                        u.revenue += Number(e.payload?.value || e.payload?.price || 0);
                        u.units += Number(e.payload?.quantity || e.payload?.num_items || 1);
                      });
                  } else if (
                    evSet.has('begin_checkout') ||
                    evSet.has('add_shipping_info') ||
                    evSet.has('add_payment_info')
                  ) {
                    u.hasStage4 = 1;
                    u.hasStage3 = 1;
                    u.hasStage2 = 1;
                    u.statusLabel = 'Rớt tại Checkout';
                  } else if (evSet.has('add_to_cart')) {
                    u.hasStage3 = 1;
                    u.hasStage2 = 1;
                    u.statusLabel = 'Rớt tại Giỏ hàng';
                  } else if (
                    evSet.has('view_item') ||
                    evSet.has('customize_product') ||
                    evSet.has('customize_inseam') ||
                    evSet.has('gallery_interaction') ||
                    evSet.has('update_quantity') ||
                    evSet.has('select_bundle') ||
                    evSet.has('review_interaction')
                  ) {
                    u.hasStage2 = 1;
                    u.statusLabel = 'Tương tác SP (chưa thêm giỏ)';
                  } else {
                    u.statusLabel = 'Thoát trang ngay (Bounce)';
                  }
                });

                let u1 = 0;
                let u2 = 0;
                let u3 = 0;
                let u4 = 0;
                let u5 = 0;
                let totalRevenue = 0;
                let totalUnits = 0;
                let totalUpsellClicks = 0;
                let totalUpsellImpressions = 0;

                const usersList = Array.from(userMap.values());

                usersList.forEach((u) => {
                  u1 += u.hasStage1;
                  u2 += u.hasStage2;
                  u3 += u.hasStage3;
                  u4 += u.hasStage4;
                  u5 += u.hasStage5;
                  totalRevenue += u.revenue;
                  totalUnits += u.units;
                  totalUpsellClicks += u.hasUpsellClick;
                  totalUpsellImpressions += u.hasUpsellImpression;
                });

                const cr = u1 > 0 ? ((u5 / u1) * 100).toFixed(1) : '0.0';
                const aov = u5 > 0 ? (totalRevenue / u5).toFixed(2) : '0.00';
                const upt = u5 > 0 ? (totalUnits / u5).toFixed(1) : '0.0';
                const upsellRate =
                  totalUpsellImpressions > 0
                    ? ((totalUpsellClicks / totalUpsellImpressions) * 100).toFixed(1)
                    : '0.0';

                const pct1 = u1 > 0 ? 100 : 0;
                const pct2 = u1 > 0 ? Number(((u2 / u1) * 100).toFixed(1)) : 0;
                const pct3 = u1 > 0 ? Number(((u3 / u1) * 100).toFixed(1)) : 0;
                const pct4 = u1 > 0 ? Number(((u4 / u1) * 100).toFixed(1)) : 0;
                const pct5 = u1 > 0 ? Number(((u5 / u1) * 100).toFixed(1)) : 0;

                const drop1Pct = u1 > 0 ? (((u1 - u2) / u1) * 100).toFixed(1) : '0.0';
                const drop2Pct = u2 > 0 ? (((u2 - u3) / u2) * 100).toFixed(1) : '0.0';
                const drop3Pct = u3 > 0 ? (((u3 - u4) / u3) * 100).toFixed(1) : '0.0';
                const drop4Pct = u4 > 0 ? (((u4 - u5) / u4) * 100).toFixed(1) : '0.0';

                // Bottleneck analysis
                const d1 = u1 > 0 ? (u1 - u2) / u1 : 0;
                const d2 = u2 > 0 ? (u2 - u3) / u2 : 0;
                const d3 = u3 > 0 ? (u3 - u4) / u3 : 0;
                const d4 = u4 > 0 ? (u4 - u5) / u4 : 0;

                let bottleneckTitle = 'Chưa có đủ dữ liệu tương tác để phân tích';
                let bottleneckAdvice = 'Hãy thử chọn màu, chọn size, thêm giỏ và thanh toán để phễu phân tích điểm rơi rụng.';
                if (u1 > 0) {
                  const maxDrop = Math.max(d1, d2, d3, d4);
                  if (maxDrop === d3 && u3 > 0) {
                    bottleneckTitle = 'Điểm nghẽn: Giỏ hàng ➔ Bắt đầu Thanh toán (Rớt ' + drop3Pct + '%)';
                    bottleneckAdvice = 'Khách đã thêm vào giỏ nhưng chưa bấm Checkout. Đề xuất: Thêm nút PayPal Express 1-click hoặc cam kết Miễn Phí Đổi Trả 30 ngày ngay trong giỏ.';
                  } else if (maxDrop === d2 && u2 > 0) {
                    bottleneckTitle = 'Điểm nghẽn: Xem Sản phẩm ➔ Thêm Giỏ hàng (Rớt ' + drop2Pct + '%)';
                    bottleneckAdvice = 'Khách có xem và chọn mẫu nhưng ngần ngại bấm mua. Đề xuất: Nổi bật ưu đãi "Giảm 70% hôm nay" và huy hiệu Best Seller.';
                  } else if (maxDrop === d4 && u4 > 0) {
                    bottleneckTitle = 'Điểm nghẽn: Bắt đầu Checkout ➔ Hoàn tất Mua hàng (Rớt ' + drop4Pct + '%)';
                    bottleneckAdvice = 'Khách mở form đặt hàng nhưng bỏ dở. Đề xuất: Rút gọn form xuống 3 trường cơ bản và thêm huy hiệu bảo mật SSL 256-bit.';
                  } else if (maxDrop === d1 && u1 > 0) {
                    bottleneckTitle = 'Điểm nghẽn: Trang chủ ➔ Tương tác Chọn sản phẩm (Rớt ' + drop1Pct + '%)';
                    bottleneckAdvice = 'Khách thoát trang ngay khi vào (Bounce). Đề xuất: Nâng cấp hình ảnh Hero Banner và hiển thị đánh giá 4.9 sao ở đầu trang.';
                  }
                }

                return (
                  <>
                    {/* 1. Sleek KPI Metrics Bar */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-stone-950/80 border border-stone-800/80 rounded-xl p-3.5 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">Conversion Rate</div>
                          <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{cr}%</div>
                          <div className="text-[11px] text-stone-400">{u5}/{u1} khách mua hàng</div>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <Percent className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="bg-stone-950/80 border border-stone-800/80 rounded-xl p-3.5 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">Tổng Doanh Thu</div>
                          <div className="text-xl font-bold font-mono text-white mt-0.5">${totalRevenue.toFixed(2)}</div>
                          <div className="text-[11px] text-stone-400">{u5} đơn hàng thành công</div>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="bg-stone-950/80 border border-stone-800/80 rounded-xl p-3.5 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">Giá Trị TB (AOV)</div>
                          <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">${aov}</div>
                          <div className="text-[11px] text-stone-400">{upt} quần / đơn ({totalUnits} chiếc)</div>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                          <ShoppingCart className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="bg-stone-950/80 border border-stone-800/80 rounded-xl p-3.5 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">Click Upsell (+30%)</div>
                          <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">{upsellRate}%</div>
                          <div className="text-[11px] text-stone-400">{totalUpsellClicks}/{totalUpsellImpressions} click ưu đãi</div>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                          <Flame className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Deep-Dive Sub-Tabs (Clean & Compact) */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 border-b border-stone-800/80 pb-2">
                        <button
                          onClick={() => setFunnelSubTab('overview')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                            funnelSubTab === 'overview'
                              ? 'bg-stone-800 text-white font-semibold shadow-xs'
                              : 'text-stone-400 hover:text-white hover:bg-stone-900'
                          }`}
                        >
                          <Filter className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Bảng Phễu Chuyển Đổi & Điểm Nghẽn</span>
                        </button>
                        <button
                          onClick={() => setFunnelSubTab('users')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                            funnelSubTab === 'users'
                              ? 'bg-stone-800 text-white font-semibold shadow-xs'
                              : 'text-stone-400 hover:text-white hover:bg-stone-900'
                          }`}
                        >
                          <Users className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Kiểm Chứng Từng User ({usersList.length})</span>
                        </button>
                      </div>

                      {/* SUB-VIEW 1: OVERVIEW & BOTTLENECK */}
                      {funnelSubTab === 'overview' && (
                        <div className="space-y-3">
                          {/* Compact CRO Callout */}
                          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </div>
                            <div className="space-y-0.5">
                              <h5 className="text-xs font-bold text-white">{bottleneckTitle}</h5>
                              <p className="text-xs text-stone-400 leading-relaxed">{bottleneckAdvice}</p>
                            </div>
                          </div>

                          {/* Compact 4-Column Step Table with visual retention bars */}
                          <div className="bg-stone-950/80 border border-stone-800 rounded-xl overflow-hidden">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-stone-900/60 text-stone-400 uppercase text-[10px] font-mono tracking-wider border-b border-stone-800">
                                  <th className="p-3">Tầng Phễu</th>
                                  <th className="p-3">Hành Vi Đo Lường (+1 nếu có)</th>
                                  <th className="p-3 text-center">Số User (+1/người)</th>
                                  <th className="p-3 text-right pr-6">% Giữ Chân (Retention)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-900 font-mono text-[11px]">
                                <tr className="hover:bg-stone-900/40">
                                  <td className="p-3 font-semibold text-emerald-400">01. Vào Trang</td>
                                  <td className="p-3 text-stone-300 font-sans">Khách truy cập Landing Page (PageView)</td>
                                  <td className="p-3 text-center text-white font-bold">{u1} khách</td>
                                  <td className="p-3 text-right pr-6">
                                    <div className="inline-flex items-center gap-2 font-bold text-emerald-400 justify-end">
                                      <span>{pct1}%</span>
                                      <div className="w-16 bg-stone-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct1}%` }} />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="hover:bg-stone-900/40">
                                  <td className="p-3 font-semibold text-cyan-400">02. Tương Tác SP</td>
                                  <td className="p-3 text-stone-300 font-sans">Khám phá, chọn màu sắc, chọn size, inseam</td>
                                  <td className="p-3 text-center text-white font-bold">{u2} khách</td>
                                  <td className="p-3 text-right pr-6">
                                    <div className="inline-flex items-center gap-2 font-bold text-cyan-400 justify-end">
                                      <span>{pct2}%</span>
                                      <div className="w-16 bg-stone-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                                        <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${pct2}%` }} />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="hover:bg-stone-900/40">
                                  <td className="p-3 font-semibold text-blue-400">03. Thêm Giỏ</td>
                                  <td className="p-3 text-stone-300 font-sans">Bấm nút "Add to Cart" hoặc mở giỏ hàng</td>
                                  <td className="p-3 text-center text-white font-bold">{u3} khách</td>
                                  <td className="p-3 text-right pr-6">
                                    <div className="inline-flex items-center gap-2 font-bold text-blue-400 justify-end">
                                      <span>{pct3}%</span>
                                      <div className="w-16 bg-stone-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${pct3}%` }} />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="hover:bg-stone-900/40">
                                  <td className="p-3 font-semibold text-indigo-400">04. Checkout</td>
                                  <td className="p-3 text-stone-300 font-sans">Bấm thanh toán, mở form điền địa chỉ giao hàng</td>
                                  <td className="p-3 text-center text-white font-bold">{u4} khách</td>
                                  <td className="p-3 text-right pr-6">
                                    <div className="inline-flex items-center gap-2 font-bold text-indigo-400 justify-end">
                                      <span>{pct4}%</span>
                                      <div className="w-16 bg-stone-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${pct4}%` }} />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="hover:bg-stone-900/40">
                                  <td className="p-3 font-semibold text-amber-400">05. Mua Hàng</td>
                                  <td className="p-3 text-stone-300 font-sans">Hoàn tất đặt đơn hàng thành công (Purchase)</td>
                                  <td className="p-3 text-center text-amber-400 font-bold">{u5} đơn</td>
                                  <td className="p-3 text-right pr-6">
                                    <div className="inline-flex items-center gap-2 font-bold text-amber-400 justify-end">
                                      <span>{pct5}%</span>
                                      <div className="w-16 bg-stone-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                                        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${pct5}%` }} />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* SUB-VIEW 2: USER AUDIT MATRIX */}
                      {funnelSubTab === 'users' && (
                        <div className="bg-stone-950/80 border border-stone-800 rounded-xl overflow-hidden space-y-0">
                          <div className="max-h-[320px] overflow-y-auto">
                            <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                              <thead>
                                <tr className="bg-stone-900/70 text-stone-400 uppercase text-[10px] font-mono tracking-wider sticky top-0 border-b border-stone-800">
                                  <th className="p-3">User ID</th>
                                  <th className="p-3 text-center">01. Vào Trang</th>
                                  <th className="p-3 text-center">02. Xem/Chọn SP</th>
                                  <th className="p-3 text-center">03. Thêm Giỏ</th>
                                  <th className="p-3 text-center">04. Checkout</th>
                                  <th className="p-3 text-center">05. Mua Hàng</th>
                                  <th className="p-3 text-right">Chi Tiêu ($)</th>
                                  <th className="p-3">Dừng Lại Tại</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-900 font-mono text-[11px]">
                                {usersList.length === 0 ? (
                                  <tr>
                                    <td colSpan={8} className="p-6 text-center text-stone-500 font-sans">
                                      Chưa có dữ liệu người dùng. Thao tác trên web (chọn màu, thêm giỏ, thanh toán) để kiểm tra tracking.
                                    </td>
                                  </tr>
                                ) : (
                                  usersList.map((u) => (
                                    <tr key={u.userId} className="hover:bg-stone-900/40 transition-colors">
                                      <td className="p-3 text-emerald-400 font-bold flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                        <span className="truncate max-w-[130px]">{u.userId}</span>
                                        {u.userId === tracker.getUserId() && (
                                          <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1 rounded font-normal font-sans">
                                            Hiện tại
                                          </span>
                                        )}
                                      </td>
                                      <td className="p-3 text-center">
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                                          +1
                                        </span>
                                      </td>
                                      <td className="p-3 text-center">
                                        {u.hasStage2 > 0 ? (
                                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
                                            +1
                                          </span>
                                        ) : (
                                          <span className="text-stone-600">0</span>
                                        )}
                                      </td>
                                      <td className="p-3 text-center">
                                        {u.hasStage3 > 0 ? (
                                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-950/80 text-blue-400 border border-blue-500/40">
                                            +1
                                          </span>
                                        ) : (
                                          <span className="text-stone-600">0</span>
                                        )}
                                      </td>
                                      <td className="p-3 text-center">
                                        {u.hasStage4 > 0 ? (
                                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-950/80 text-indigo-400 border border-indigo-500/40">
                                            +1
                                          </span>
                                        ) : (
                                          <span className="text-stone-600">0</span>
                                        )}
                                      </td>
                                      <td className="p-3 text-center">
                                        {u.hasStage5 > 0 ? (
                                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-500/40">
                                            +1
                                          </span>
                                        ) : (
                                          <span className="text-stone-600">0</span>
                                        )}
                                      </td>
                                      <td className="p-3 text-right font-bold text-white">
                                        {u.revenue > 0 ? `$${u.revenue.toFixed(2)}` : '-'}
                                      </td>
                                      <td className="p-3 font-sans text-xs">
                                        <span
                                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                            u.hasStage5 > 0
                                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                              : u.hasStage3 > 0
                                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                              : 'bg-stone-800 text-stone-400'
                                          }`}
                                        >
                                          {u.statusLabel}
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                          {usersList.length > 0 && (
                            <div className="bg-stone-900/90 px-4 py-2.5 border-t border-stone-800 flex items-center justify-between text-xs font-mono">
                              <span className="text-stone-400">Tổng cộng: <strong className="text-white">{usersList.length} users</strong></span>
                              <span className="text-emerald-400 font-bold">Tổng doanh thu: ${totalRevenue.toFixed(2)} (CR: {cr}%)</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
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
                          <th className="p-3">Mua nhiều (&gt;1)?</th>
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
                                      YES (&gt;1 quần)
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
              {/* Header Action Bar for Document Export */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-bold text-sm text-white">
                      Tài Liệu Đặc Tả Tracking & Phân Tích Hành Vi Người Dùng (Data Analyst Focus)
                    </h4>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono px-2 py-0.5 rounded">
                      North Star: CR & AOV
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    Đã lưu tại file <code className="text-emerald-400 font-mono">/docs/TRACKING_DOCUMENTATION.md</code> trong mã nguồn dự án.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyDoc}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
                  >
                    {docCopied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Đã sao chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép Markdown</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownloadDoc}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-emerald-500/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải file .md</span>
                  </button>
                </div>
              </div>

              {/* Section 1: North Star Metrics & KPI Framework */}
              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-emerald-400 rounded-full"></span>
                    I. Cặp Chỉ Số North Star (CR & AOV) & Tháp Đo Lường Kinh Doanh
                  </h4>
                  <span className="text-[11px] font-mono text-emerald-400">RPV = CR × AOV</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div className="bg-stone-900/60 p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/10">
                    <div className="text-[10px] text-emerald-400 uppercase font-mono font-bold">★ North Star #1: CR</div>
                    <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">3.5% – 5.0%</div>
                    <div className="text-[11px] text-stone-400 mt-1">Tỷ lệ chuyển đổi mua hàng</div>
                  </div>
                  <div className="bg-stone-900/60 p-3 rounded-xl border border-cyan-500/30 bg-cyan-950/10">
                    <div className="text-[10px] text-cyan-400 uppercase font-mono font-bold">★ North Star #2: AOV</div>
                    <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">&gt; $85.00</div>
                    <div className="text-[11px] text-stone-400 mt-1">Giá trị đơn hàng trung bình</div>
                  </div>
                  <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800">
                    <div className="text-[10px] text-stone-400 uppercase font-mono">Quy mô: UPT</div>
                    <div className="text-lg font-bold font-mono text-blue-400 mt-0.5">&gt; 1.8 – 2.4 quần</div>
                    <div className="text-[11px] text-stone-400 mt-1">Giảm 25% chiếc kế tiếp & Free ship $50</div>
                  </div>
                  <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800">
                    <div className="text-[10px] text-stone-400 uppercase font-mono">Gia tăng: Upsell Rate</div>
                    <div className="text-lg font-bold font-mono text-rose-400 mt-0.5">28% – 35%</div>
                    <div className="text-[11px] text-stone-400 mt-1">Cộng dồn +$9.95 vào AOV</div>
                  </div>
                </div>
              </div>

              {/* Section 2: Data Analyst Event Dictionary */}
              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-cyan-400 rounded-full"></span>
                    II. Từ Điển Dữ Liệu Sự Kiện Phục Vụ Báo Cáo & Phân Khúc (Data Dictionary)
                  </h4>
                  <span className="text-[11px] text-stone-400 font-mono">14 Behavioral Events</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-900/80 text-stone-400 uppercase text-[10px] font-mono tracking-wider border-b border-stone-800">
                        <th className="p-2.5">Tên Sự Kiện (Event)</th>
                        <th className="p-2.5">Hành Vi Người Dùng (Action)</th>
                        <th className="p-2.5">Mục Đích Phân Tích (Analytical Purpose)</th>
                        <th className="p-2.5">Trường Dữ Liệu Phân Khúc (Dimensions)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-900 font-mono text-[11px]">
                      <tr className="hover:bg-stone-900/40">
                        <td className="p-2.5 text-emerald-400 font-bold">page_view</td>
                        <td className="p-2.5 text-stone-300 font-sans">Khách truy cập vào Landing Page</td>
                        <td className="p-2.5 text-stone-400 font-sans">Đo lường dung lượng khách, tính mẫu số CR</td>
                        <td className="p-2.5 text-cyan-300">page_title, device_type, referrer</td>
                      </tr>
                      <tr className="hover:bg-stone-900/40">
                        <td className="p-2.5 text-emerald-400 font-bold">view_item</td>
                        <td className="p-2.5 text-stone-300 font-sans">Xem chi tiết sản phẩm StretchActive</td>
                        <td className="p-2.5 text-stone-400 font-sans">Tỷ lệ chuyển tiếp từ ghé thăm sang tìm hiểu</td>
                        <td className="p-2.5 text-cyan-300">item_id, style, base_price</td>
                      </tr>
                      <tr className="hover:bg-stone-900/40">
                        <td className="p-2.5 text-emerald-400 font-bold">customize_product</td>
                        <td className="p-2.5 text-stone-300 font-sans">Chọn đổi màu sắc, size eo hoặc kiểu ống</td>
                        <td className="p-2.5 text-stone-400 font-sans">Phân tích thị hiếu mẫu mã và phân khúc khách</td>
                        <td className="p-2.5 text-cyan-300">color, size, style (Straight/Jogger)</td>
                      </tr>
                      <tr className="hover:bg-stone-900/40">
                        <td className="p-2.5 text-emerald-400 font-bold">customize_inseam</td>
                        <td className="p-2.5 text-stone-300 font-sans">Chọn chiều dài ống quần (Inseam)</td>
                        <td className="p-2.5 text-stone-400 font-sans">Đánh giá thể hình theo chiều cao khách hàng</td>
                        <td className="p-2.5 text-cyan-300">inseam (28", 30", 32", 34")</td>
                      </tr>
                      <tr className="hover:bg-stone-900/40">
                        <td className="p-2.5 text-emerald-400 font-bold">update_quantity</td>
                        <td className="p-2.5 text-stone-300 font-sans">Tăng/giảm số lượng bằng nút +/-</td>
                        <td className="p-2.5 text-stone-400 font-sans">Đo lường ý định mua số lượng nhiều trước khi thêm giỏ</td>
                        <td className="p-2.5 text-cyan-300">quantity (1, 2, 3...), estimated_total</td>
                      </tr>
                      <tr className="hover:bg-stone-900/40">
                        <td className="p-2.5 text-emerald-400 font-bold">add_to_cart</td>
                        <td className="p-2.5 text-stone-300 font-sans">Bấm nút thêm sản phẩm vào giỏ</td>
                        <td className="p-2.5 text-stone-400 font-sans">Đo lường Add-to-Cart Rate & quy mô giỏ</td>
                        <td className="p-2.5 text-cyan-300">items_count, cart_value, bundle_type</td>
                      </tr>
                      <tr className="hover:bg-stone-900/40">
                        <td className="p-2.5 text-emerald-400 font-bold">upsell_impression</td>
                        <td className="p-2.5 text-stone-300 font-sans">Box ưu đãi bán kèm xuất hiện trong giỏ</td>
                        <td className="p-2.5 text-stone-400 font-sans">Số lượt tiếp cận cơ hội gia tăng AOV</td>
                        <td className="p-2.5 text-cyan-300">promo_id, discount_rate: 30%</td>
                      </tr>
                      <tr className="hover:bg-stone-900/40">
                        <td className="p-2.5 text-emerald-400 font-bold">upsell_click</td>
                        <td className="p-2.5 text-stone-300 font-sans">Bấm "Select now" nhận ưu đãi giỏ hàng</td>
                        <td className="p-2.5 text-stone-400 font-sans">Tính toán Upsell Take Rate & giá trị cộng dồn</td>
                        <td className="p-2.5 text-cyan-300">applied_value: +$9.95, target_item</td>
                      </tr>
                      <tr className="hover:bg-stone-900/40">
                        <td className="p-2.5 text-emerald-400 font-bold">begin_checkout</td>
                        <td className="p-2.5 text-stone-300 font-sans">Bấm Proceed to Checkout</td>
                        <td className="p-2.5 text-stone-400 font-sans">Đo lường Cart-to-Checkout Drop-off Rate</td>
                        <td className="p-2.5 text-cyan-300">checkout_value, items_count</td>
                      </tr>
                      <tr className="hover:bg-stone-900/40">
                        <td className="p-2.5 text-emerald-400 font-bold">purchase</td>
                        <td className="p-2.5 text-amber-400 font-sans font-bold">Hoàn tất đặt đơn hàng thành công</td>
                        <td className="p-2.5 text-amber-300 font-sans font-bold">Chốt chặn doanh thu: tính toán CR, AOV, UPT</td>
                        <td className="p-2.5 text-amber-300">transaction_id, total_revenue, items_list</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Data Analyst Segmentation & Insights */}
              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-amber-400 rounded-full"></span>
                    III. 3 Trọng Tâm Phân Tích Phân Khúc Dành Cho Data Analyst
                  </h4>
                  <span className="text-[11px] text-stone-400 font-mono">Business Decision Insights</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-stone-900/70 p-3.5 rounded-xl border border-stone-800 space-y-1.5">
                    <div className="text-xs font-bold text-emerald-400">1. Hiệu Quả Mua Nhiều Giảm Thêm</div>
                    <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                      So sánh tỷ trọng đơn và doanh thu giữa đơn 1 quần ($31.49), đơn 2 quần (đủ điều kiện Free Ship & giảm 25% chiếc thứ 2) và đơn 3+ quần để đo lường động lực thúc đẩy AOV.
                    </p>
                  </div>
                  <div className="bg-stone-900/70 p-3.5 rounded-xl border border-stone-800 space-y-1.5">
                    <div className="text-xs font-bold text-cyan-400">2. Độ Nhạy Bén Ưu Đãi Upsell</div>
                    <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                      Tính toán Upsell Take Rate và đo lường mức chênh lệch AOV giữa nhóm có chọn nâng cấp $9.95 so với nhóm từ chối ưu đãi để tối ưu hóa vị trí hiển thị.
                    </p>
                  </div>
                  <div className="bg-stone-900/70 p-3.5 rounded-xl border border-stone-800 space-y-1.5">
                    <div className="text-xs font-bold text-amber-400">3. Tương Quan Biến Thể Sản Phẩm</div>
                    <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                      Đối chiếu màu sắc (Đen/Ghi/Navy/Rêu) và chiều dài ống quần (Inseam 28-34") với tỷ lệ chốt đơn thành công để tối ưu kế hoạch nhập kho và bố trí giao diện.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
