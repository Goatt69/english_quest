import { apiFetch } from "./api";
import { PaymentRequest, PaymentResponse, PaymentResult } from "@/types/payment";

export const createPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const response = await apiFetch<PaymentResponse>("/api/v1/payment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      requiresAuth: true,
    });

    return response;
  } catch (error) {
    console.error("Create payment error:", error);
    throw error;
  }
};

export const handlePaymentReturn = async (searchParams: URLSearchParams): Promise<PaymentResult> => {
  try {
    // Convert URLSearchParams to query string
    const queryString = searchParams.toString();
    
    const response = await apiFetch<PaymentResult>(`/api/v1/payment/vnpay-return?${queryString}`, {
      method: "GET",
      requiresAuth: true,
    });

    return response;
  } catch (error) {
    console.error("Payment return handling error:", error);
    throw error;
  }
};