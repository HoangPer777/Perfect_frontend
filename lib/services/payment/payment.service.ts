// D:\Projects\tmđt-fe-location\Perfect_frontend\types\payment.ts
export interface PaymentInitRequest {
    amount: number;
    orderId: string;
    provider: 'VNPAY' | 'PAYPAL';
}

export interface PaymentResponse {
    paymentUrl: string;
    transactionId: string;
}