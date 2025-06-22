"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CreditCard, Shield, Zap, Crown } from "lucide-react";
import { PaymentPlan } from "@/types/payment";
import PlanCard from "./PlanCard";

interface PaymentFormProps {
  onPayment: (planId: number) => Promise<void>;
  isLoading: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const paymentPlans: PaymentPlan[] = [
  {
    id: 1,
    name: "Support",
    price: "29,000",
    period: "One-time payment",
    description: "Support our mission and unlock full content",
    icon: <Zap className="h-8 w-8" />,
    features: [
      "Access to ALL sections",
      "6 hearts per level",
      "No advertisements",
      "Advanced progress analytics",
      "Text-to-speech for vocabulary",
      "Priority customer support"
    ],
    popular: true,
  },
  {
    id: 2,
    name: "Premium",
    price: "99,000",
    period: "per month",
    description: "The ultimate English learning experience",
    icon: <Crown className="h-8 w-8" />,
    features: [
      "Everything in Support",
      "Unlimited hearts",
      "Unlimited AI tutor access",
      "Pronunciation scoring",
      "Advanced analytics",
      "Offline mode"
    ],
  },
];

export default function PaymentForm({ onPayment, isLoading }: PaymentFormProps) {
  const [selectedPlan, setSelectedPlan] = useState<number | undefined>();

  const handlePlanSelect = (planId: number) => {
    setSelectedPlan(planId);
  };

  const handlePayment = async () => {
    if (selectedPlan) {
      await onPayment(selectedPlan);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <motion.div className="text-center mb-12" variants={itemVariants}>
        <Badge variant="secondary" className="mb-4">
          <CreditCard className="h-4 w-4 mr-2" />
          Secure Payment
        </Badge>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select the perfect plan for your English learning journey. 
          All payments are secure and processed through VNPAY.
        </p>
      </motion.div>

      {/* Plan Selection */}
      <motion.div 
        className="grid md:grid-cols-2 gap-8 mb-12"
        variants={containerVariants}
      >
        {paymentPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onSelect={handlePlanSelect}
            isLoading={isLoading}
            selectedPlan={selectedPlan}
          />
        ))}
      </motion.div>

      {/* Payment Button */}
      {selectedPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Secure Payment
              </CardTitle>
              <CardDescription>
                You will be redirected to VNPAY for secure payment processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handlePayment}
                  disabled={isLoading}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                    <CreditCard className="h-5 w-5 mr-2" />
                  )}
                  {isLoading ? "Processing..." : "Proceed to Payment"}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Security Notice */}
      <motion.div
        variants={itemVariants}
        className="mt-8 text-center text-sm text-gray-500"
      >
        <p className="flex items-center justify-center">
          <Shield className="h-4 w-4 mr-1" />
          Your payment information is secure and encrypted
        </p>
      </motion.div>
    </motion.div>
  );
}