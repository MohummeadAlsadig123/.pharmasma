
export type Language = 'en' | 'ar';

export type MedicineFormType = 'Tablet' | 'Syrup' | 'Ampoule' | 'Drops' | 'Injection' | 'Pieces' | 'Box';

export type Theme = 'light' | 'dark';
export type FontSize = 'small' | 'medium' | 'large';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  barcode: string;
  category: 'Antibiotic' | 'Analgesic' | 'Antiviral' | 'Supplements' | 'Cardiology' | 'Other';
  formType: MedicineFormType;
  stock: number;
  expiryDate: string;
  buyPrice: number;
  price: number;
  dosage: string;
  location: string;
}

export interface SaleItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  buyPrice: number; 
  price: number;    
  subtotal: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  timestamp: Date;
  bankTransactionId?: string;
  customerName?: string;
  customerPhone?: string;
}

export interface PurchaseItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  buyPrice: number;
  subtotal: number;
}

export interface Purchase {
  id: string;
  supplierName: string;
  invoiceNumber: string;
  items: PurchaseItem[];
  total: number;
  timestamp: Date;
  bankTransactionId?: string;
}

export interface AppSettings {
  pharmacyName: string;
  theme: Theme;
  fontSize: FontSize;
}

export interface LicenseKey {
  key: string;
  status: 'active' | 'expired' | 'pending';
  expiryDate: string;
  tier: 'Lite' | 'Pro' | 'Enterprise';
}

export interface PrinterConfig {
  ip: string;
  port: number;
  type: '80mm' | '58mm';
  status: 'connected' | 'disconnected' | 'error';
  autoPrint: boolean;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop';
  lastSeen: Date;
  status: 'online' | 'offline';
}

export type AppTab = 'dashboard' | 'inventory' | 'sales' | 'wholesale' | 'sales-history' | 'device-sync' | 'ai-assistant' | 'licensing' | 'settings';
