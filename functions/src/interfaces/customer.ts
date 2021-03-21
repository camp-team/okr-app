export interface Customer {
  uid: string;
  customerId: string;
  paymentMethods: string;
  defaultPaymentMethod: string;
  plan?: string;
  cancelAtPeriodEnd?: number;
}
