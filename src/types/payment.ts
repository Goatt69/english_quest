import React from "react";

export interface PaymentPlan {
  id: number;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
}

export interface PaymentRequest {
  plan: number;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  message?: string;
  description?: string;
}

export interface PaymentResult {
  success: boolean;
  message: string;
  description: string;
}