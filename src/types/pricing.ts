export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  maxProducts?: number;
  transactionFee: number;
}

export interface Subscription {
  userId: string;
  planId: string;
  isYearly: boolean;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired';
}