import { Stock, StockTransfer, StockPriceUpdate, StockActivity } from '../types';

export const mockStocks: Stock[] = [
  {
    id: '1',
    variety: 'Red Potato',
    quantity: 1500,
    unit: 'kg',
    price: 25,
    storage: 'Warehouse A',
    dateReceived: '2025-06-01',
    quality: 'Premium',
    supplier: 'FarmFresh Ltd',
    status: 'In Stock'
  },
  {
    id: '2',
    variety: 'White Potato',
    quantity: 2000,
    unit: 'kg',
    price: 20,
    storage: 'Warehouse B',
    dateReceived: '2025-06-02',
    quality: 'Standard',
    supplier: 'Green Fields Co',
    status: 'In Stock'
  },
  {
    id: '3',
    variety: 'Baby Potato',
    quantity: 800,
    unit: 'kg',
    price: 30,
    storage: 'Warehouse A',
    dateReceived: '2025-06-03',
    quality: 'Premium',
    supplier: 'Highland Farms',
    status: 'Low Stock'
  },
  {
    id: '4',
    variety: 'Russet Potato',
    quantity: 3000,
    unit: 'kg',
    price: 22,
    storage: 'Warehouse C',
    dateReceived: '2025-06-01',
    quality: 'Standard',
    supplier: 'Valley Produce',
    status: 'In Stock'
  }
];

export const mockStockTransfers: StockTransfer[] = [
  {
    id: 't1',
    sourceStockId: '1',
    quantity: 300,
    destinationStorage: 'Warehouse B',
    date: '2025-06-03',
    notes: 'Transfer for warehouse balancing',
    status: 'completed'
  },
  {
    id: 't2',
    sourceStockId: '2',
    quantity: 500,
    destinationStorage: 'Warehouse A',
    date: '2025-06-04',
    notes: 'Urgent transfer for order fulfillment',
    status: 'pending'
  }
];

export const mockPriceUpdates: StockPriceUpdate[] = [
  {
    id: 'p1',
    stockId: '1',
    oldPrice: 22,
    newPrice: 25,
    date: '2025-06-02',
    reason: 'Market price adjustment'
  },
  {
    id: 'p2',
    stockId: '3',
    oldPrice: 28,
    newPrice: 30,
    date: '2025-06-03',
    reason: 'Quality premium adjustment'
  }
];

export const mockActivities: StockActivity[] = [
  {
    id: 'a1',
    type: 'add',
    stockId: '4',
    date: '2025-06-01',
    details: 'Added 3000 kg of Russet Potato from Valley Produce'
  },
  {
    id: 'a2',
    type: 'transfer',
    stockId: '1',
    date: '2025-06-03',
    details: 'Transferred 300 kg to Warehouse B'
  },
  {
    id: 'a3',
    type: 'price-update',
    stockId: '1',
    date: '2025-06-02',
    details: 'Price updated from ₹22 to ₹25 per kg'
  }
];
