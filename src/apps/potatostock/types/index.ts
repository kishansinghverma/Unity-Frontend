export interface Stock {
  id: string;
  variety: string;
  quantity: number;
  unit: string;
  price: number;
  storage: string;
  dateReceived: string;
  quality: string;
  supplier: string;
  status: string;
}

export interface StockFormData extends Omit<Stock, 'id'> {}

export interface StockTransfer {
  id: string;
  sourceStockId: string;
  quantity: number;
  destinationStorage: string;
  date: string;
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface StockPriceUpdate {
  id: string;
  stockId: string;
  oldPrice: number;
  newPrice: number;
  date: string;
  reason?: string;
}

export interface StockActivity {
  id: string;
  type: 'add' | 'update' | 'transfer' | 'price-update';
  stockId: string;
  date: string;
  details: string;
}
