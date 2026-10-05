import { PixelConfig, TrackingEventRecord } from '../types';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    ttq?: {
      track: (eventName: string, params?: any) => void;
      page?: () => void;
      load?: (pixelId: string) => void;
    };
  }
}

const STORAGE_KEY_CONFIG = 'stretchactive_pixel_config';
const STORAGE_KEY_EVENTS = 'stretchactive_event_logs';

const DEFAULT_CONFIG: PixelConfig = {
  gtmId: 'GTM-STRETCH88',
  ga4Id: 'G-7X9810ABC',
  metaPixelId: '98452174620199',
  tiktokPixelId: 'CTK892019SA001',
  debugMode: true,
};

type TrackingListener = (events: TrackingEventRecord[]) => void;
const listeners: Set<TrackingListener> = new Set();

class TrackingService {
  private config: PixelConfig;
  private events: TrackingEventRecord[] = [];

  constructor() {
    this.config = this.loadConfig();
    this.events = this.loadEvents();
    this.initializeScripts();
  }

  public getConfig(): PixelConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<PixelConfig>) {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(this.config));
    } catch (e) {
      console.warn('Could not save pixel config to localStorage', e);
    }
    this.initializeScripts();
  }

  public getEvents(): TrackingEventRecord[] {
    return [...this.events];
  }

  public clearEvents() {
    this.events = [];
    try {
      localStorage.removeItem(STORAGE_KEY_EVENTS);
    } catch (e) {
      console.warn('Failed clearing events from storage', e);
    }
    this.notify();
  }

  public subscribe(listener: TrackingListener): () => void {
    listeners.add(listener);
    listener([...this.events]);
    return () => listeners.delete(listener);
  }

  private notify() {
    const copy = [...this.events];
    listeners.forEach((listener) => listener(copy));
  }

  private loadConfig(): PixelConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch (e) {}
    return { ...DEFAULT_CONFIG };
  }

  private loadEvents(): TrackingEventRecord[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EVENTS);
      if (saved) return JSON.parse(saved).slice(0, 50);
    } catch (e) {}
    return [];
  }

  private recordEvent(record: TrackingEventRecord) {
    this.events.unshift(record);
    if (this.events.length > 100) {
      this.events = this.events.slice(0, 100);
    }
    try {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(this.events.slice(0, 50)));
    } catch (e) {}
    this.notify();
  }

  private initializeScripts() {
    if (typeof window === 'undefined') return;

    // Ensure dataLayer
    window.dataLayer = window.dataLayer || [];

    // Initialize Meta Pixel if ID provided
    if (window.fbq && this.config.metaPixelId) {
      try {
        window.fbq('init', this.config.metaPixelId);
      } catch (e) {
        console.error('FB Pixel Init Error', e);
      }
    }

    // Initialize TikTok Pixel if ID provided
    if (window.ttq && window.ttq.load && this.config.tiktokPixelId) {
      try {
        window.ttq.load(this.config.tiktokPixelId);
      } catch (e) {
        console.error('TikTok Pixel Load Error', e);
      }
    }
  }

  // --- CORE DISPATCH METHOD ---
  public dispatch(
    eventName: string,
    category: TrackingEventRecord['category'],
    platforms: TrackingEventRecord['platforms'],
    payload: Record<string, any>
  ) {
    const timestamp = new Date().toLocaleTimeString();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const eventRecord: TrackingEventRecord = {
      id,
      timestamp,
      eventName,
      category,
      platforms,
      payload: { ...payload },
    };

    // 1. Google Tag Manager (DataLayer)
    if (platforms.includes('gtm') && typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      const gtmPayload = {
        event: eventName,
        ecommerce: payload.ecommerce || payload,
        timestamp: new Date().toISOString(),
        ...payload,
      };
      window.dataLayer.push(gtmPayload);
      if (this.config.debugMode) {
        console.log(`[GTM dataLayer.push]`, eventName, gtmPayload);
      }
    }

    // 2. Google Analytics 4 (gtag)
    if (platforms.includes('ga4') && typeof window !== 'undefined' && typeof window.gtag === 'function') {
      try {
        window.gtag('event', eventName, payload);
        if (this.config.debugMode) {
          console.log(`[GA4 gtag event]`, eventName, payload);
        }
      } catch (e) {
        console.error('GA4 dispatch error', e);
      }
    }

    // 3. Meta Pixel (Facebook)
    if (platforms.includes('meta') && typeof window !== 'undefined' && typeof window.fbq === 'function') {
      try {
        // Map standard Meta event names
        const metaEventMap: Record<string, string> = {
          page_view: 'PageView',
          view_item: 'ViewContent',
          add_to_cart: 'AddToCart',
          begin_checkout: 'InitiateCheckout',
          purchase: 'Purchase',
          lead: 'Lead',
          contact: 'Contact',
          customize_product: 'CustomizeProduct',
        };

        const metaEvent = metaEventMap[eventName] || eventName;
        window.fbq('track', metaEvent, {
          content_name: payload.content_name || payload.item_name || 'Ultra-Stretch Ice Silk Pants',
          content_category: payload.content_category || 'Apparel & Accessories > Clothing > Pants',
          content_ids: payload.content_ids || [payload.item_id || 'SA-ICESILK-001'],
          content_type: 'product',
          value: payload.value || 0,
          currency: payload.currency || 'USD',
          num_items: payload.quantity || payload.num_items || 1,
          ...payload,
        });

        if (this.config.debugMode) {
          console.log(`[Meta fbq track]`, metaEvent, payload);
        }
      } catch (e) {
        console.error('Meta Pixel dispatch error', e);
      }
    }

    // 4. TikTok Pixel
    if (platforms.includes('tiktok') && typeof window !== 'undefined' && window.ttq && typeof window.ttq.track === 'function') {
      try {
        const ttEventMap: Record<string, string> = {
          page_view: 'PageLoaded',
          view_item: 'ViewContent',
          add_to_cart: 'AddToCart',
          begin_checkout: 'InitiateCheckout',
          purchase: 'CompletePayment',
          lead: 'SubmitForm',
        };
        const ttEvent = ttEventMap[eventName] || eventName;
        window.ttq.track(ttEvent, {
          content_id: payload.item_id || 'SA-ICESILK-001',
          content_type: 'product',
          content_name: payload.content_name || payload.item_name || 'Ultra-Stretch Ice Silk Pants',
          quantity: payload.quantity || 1,
          price: payload.value || 39.95,
          value: payload.value || 39.95,
          currency: payload.currency || 'USD',
          ...payload,
        });

        if (this.config.debugMode) {
          console.log(`[TikTok ttq.track]`, ttEvent, payload);
        }
      } catch (e) {
        console.error('TikTok dispatch error', e);
      }
    }

    this.recordEvent(eventRecord);
  }

  // --- STANDARD HIGH-CONVERTING E-COMMERCE TRACKING HELPERS ---

  public trackPageView() {
    this.dispatch('page_view', 'engagement', ['gtm', 'ga4', 'meta', 'tiktok'], {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  }

  public trackViewItem(product: {
    id: string;
    name: string;
    style: string;
    color: string;
    size: string;
    price: number;
    currency?: string;
  }) {
    this.dispatch('view_item', 'ecommerce', ['gtm', 'ga4', 'meta', 'tiktok'], {
      currency: product.currency || 'USD',
      value: product.price,
      content_name: product.name,
      content_category: 'Pants > Casual Pants',
      content_ids: [product.id],
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_variant: `${product.style} / ${product.color} / ${product.size}`,
          price: product.price,
          quantity: 1,
        },
      ],
    });
  }

  public trackCustomizeProduct(param: {
    attribute: 'style' | 'color' | 'size' | 'bundle';
    value: string;
    currentConfig: any;
  }) {
    this.dispatch('customize_product', 'engagement', ['gtm', 'ga4', 'meta'], {
      event_category: 'Product Customization',
      customization_type: param.attribute,
      customization_value: param.value,
      full_selection: param.currentConfig,
    });
  }

  public trackSelectBundle(bundle: {
    id: string;
    title: string;
    quantity: number;
    price: number;
    discount: number;
  }) {
    this.dispatch('select_bundle', 'engagement', ['gtm', 'ga4', 'meta'], {
      bundle_id: bundle.id,
      bundle_title: bundle.title,
      bundle_quantity: bundle.quantity,
      bundle_price: bundle.price,
      savings_percentage: bundle.discount,
    });
  }

  public trackAddToCart(item: {
    id: string;
    name: string;
    style: string;
    color: string;
    size: string;
    price: number;
    quantity: number;
    bundleTitle?: string;
    currency?: string;
  }) {
    const totalVal = Number((item.price * item.quantity).toFixed(2));
    this.dispatch('add_to_cart', 'ecommerce', ['gtm', 'ga4', 'meta', 'tiktok'], {
      currency: item.currency || 'USD',
      value: totalVal,
      content_name: item.name,
      content_ids: [item.id],
      content_type: 'product',
      quantity: item.quantity,
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          item_variant: `${item.style} - ${item.color} (${item.size})`,
          price: item.price,
          quantity: item.quantity,
        },
      ],
      bundle_title: item.bundleTitle || 'Single Pair',
    });
  }

  public trackViewCart(items: any[], totalValue: number) {
    this.dispatch('view_cart', 'ecommerce', ['gtm', 'ga4'], {
      currency: 'USD',
      value: totalValue,
      item_count: items.reduce((acc, cur) => acc + cur.quantity, 0),
      items: items.map((i) => ({
        item_id: i.id,
        item_name: i.productTitle,
        price: i.unitPrice,
        quantity: i.quantity,
      })),
    });
  }

  public trackBeginCheckout(order: {
    items: any[];
    totalValue: number;
    coupon?: string;
  }) {
    this.dispatch('begin_checkout', 'ecommerce', ['gtm', 'ga4', 'meta', 'tiktok'], {
      currency: 'USD',
      value: order.totalValue,
      coupon: order.coupon || '',
      num_items: order.items.reduce((acc, cur) => acc + cur.quantity, 0),
      items: order.items.map((i) => ({
        item_id: i.id,
        item_name: i.productTitle,
        item_variant: `${i.style} - ${i.color?.name || ''} - ${i.size}`,
        price: i.unitPrice,
        quantity: i.quantity,
      })),
    });
  }

  public trackAddShippingInfo(shippingMethod: string, shippingCost: number, cartTotal: number) {
    this.dispatch('add_shipping_info', 'ecommerce', ['gtm', 'ga4', 'meta'], {
      currency: 'USD',
      value: cartTotal,
      shipping_tier: shippingMethod,
      shipping_cost: shippingCost,
    });
  }

  public trackAddPaymentInfo(paymentMethod: string, cartTotal: number) {
    this.dispatch('add_payment_info', 'ecommerce', ['gtm', 'ga4', 'meta'], {
      currency: 'USD',
      value: cartTotal,
      payment_type: paymentMethod,
    });
  }

  public trackPurchase(order: {
    transactionId: string;
    value: number;
    tax?: number;
    shipping?: number;
    coupon?: string;
    items: any[];
    customerEmail?: string;
  }) {
    this.dispatch('purchase', 'ecommerce', ['gtm', 'ga4', 'meta', 'tiktok'], {
      transaction_id: order.transactionId,
      value: order.value,
      tax: order.tax || 0,
      shipping: order.shipping || 0,
      currency: 'USD',
      coupon: order.coupon || '',
      content_ids: order.items.map((i) => i.id || 'SA-ICESILK-001'),
      content_type: 'product',
      num_items: order.items.reduce((acc, cur) => acc + (cur.quantity || 1), 0),
      items: order.items.map((i) => ({
        item_id: i.id,
        item_name: i.productTitle || 'Ultra-Stretch Ice Silk Pants',
        item_variant: `${i.style || ''} - ${i.color?.name || ''} - ${i.size || ''}`,
        price: i.unitPrice || 39.95,
        quantity: i.quantity || 1,
      })),
    });
  }

  public trackLead(email: string, source: string) {
    this.dispatch('lead', 'lead', ['gtm', 'ga4', 'meta', 'tiktok'], {
      lead_source: source,
      email_domain: email.split('@')[1] || '',
    });
  }

  public trackInteractiveTool(toolName: string, details: Record<string, any>) {
    this.dispatch(`tool_${toolName}`, 'engagement', ['gtm', 'ga4'], {
      tool_name: toolName,
      ...details,
    });
  }

  public trackShowMoreReviews(currentCount: number, totalCount: number) {
    this.dispatch('show_more_reviews', 'engagement', ['gtm', 'ga4', 'meta', 'tiktok'], {
      event_category: 'Reviews',
      action: 'show_more',
      current_displayed: currentCount,
      total_available: totalCount,
      timestamp: new Date().toISOString(),
    });
  }

  public trackClickWriteReview() {
    this.dispatch('click_write_review', 'engagement', ['gtm', 'ga4', 'meta', 'tiktok'], {
      event_category: 'Reviews',
      action: 'write_review_intent',
    });
  }

  // --- CR & AOV SPECIFIC CRO TRACKING HELPERS ---

  public trackUpsellImpression(offerTitle: string, discountRate: string) {
    this.dispatch('upsell_impression', 'engagement', ['gtm', 'ga4', 'meta'], {
      event_category: 'AOV Optimization',
      offer_title: offerTitle,
      discount_rate: discountRate,
      placement: 'cart_drawer_bottom',
    });
  }

  public trackUpsellClick(offerTitle: string, discountRate: string) {
    this.dispatch('upsell_click', 'engagement', ['gtm', 'ga4', 'meta', 'tiktok'], {
      event_category: 'AOV Optimization',
      offer_title: offerTitle,
      discount_rate: discountRate,
      action: 'select_next_item_discount',
    });
  }

  public trackQuantityChange(itemId: string, direction: 'increase' | 'decrease', newQuantity: number, itemPrice: number) {
    this.dispatch('cart_quantity_change', 'ecommerce', ['gtm', 'ga4'], {
      event_category: 'AOV Mechanics',
      item_id: itemId,
      direction,
      new_quantity: newQuantity,
      item_price: itemPrice,
      potential_aov_delta: direction === 'increase' ? itemPrice : -itemPrice,
    });
  }

  public trackFloatingCheckoutClick(cartTotal: number, itemCount: number) {
    this.dispatch('floating_checkout_click', 'engagement', ['gtm', 'ga4', 'meta'], {
      event_category: 'CR Funnel',
      element_type: 'floating_sticky_pill',
      cart_value: cartTotal,
      item_count: itemCount,
    });
  }
}

export const tracker = new TrackingService();
