import { ColorStyleOption } from '../data/mockData';

export interface CartItem {
  id: string;
  productTitle: string;
  colorStyle: ColorStyleOption;
  size: string;
  inseam: string;
  quantity: number;
  unitPrice: number;
}

export interface TrackingEventRecord {
  id: string;
  timestamp: string;
  userId: string;
  sessionId: string;
  eventName: string;
  category: 'ecommerce' | 'engagement' | 'lead' | 'custom';
  platforms: ('gtm' | 'ga4' | 'meta' | 'tiktok')[];
  payload: Record<string, any>;
}

export interface PixelConfig {
  gtmId: string;
  ga4Id: string;
  metaPixelId: string;
  tiktokPixelId: string;
  debugMode: boolean;
}

export interface CheckoutCustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  paymentMethod: 'card' | 'applepay' | 'paypal' | 'cod';
}
