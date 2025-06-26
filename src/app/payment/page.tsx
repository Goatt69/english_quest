"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PaymentForm from "@/components/payment/PaymentForm";
import { createPayment } from "@/lib/payment";
import { toast } from "@/hooks/use-toast";
import SharedLayout from "@/components/SharedLayout";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function PaymentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue with your purchase.",
        variant: "destructive",
      });
      router.push("/login?redirect=/payment");
      return;
    }
    setIsCheckingAuth(false);
  }, [router]);

  const handlePayment = async (planId: number) => {
    setIsLoading(true);
    
    try {
      const response = await createPayment({ plan: planId });
      
      if (response.success && response.paymentUrl) {
        // Redirect to VNPAY
        window.location.href = response.paymentUrl;
      } else {
        toast({
          title: "Payment Error",
          description: response.message || "Failed to create payment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };
  return (
      <SharedLayout showFooter={false} showChatbox={false}>
        <motion.div
            className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
          <div className="container mx-auto px-4 py-16">
            <PaymentForm onPayment={handlePayment} isLoading={isLoading} />
          </div>
        </motion.div>
      </SharedLayout>
  );
}