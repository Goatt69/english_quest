"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Sparkles, Crown } from "lucide-react";
import Link from "next/link";
import { handlePaymentReturn } from "@/lib/payment";
import { toast } from "@/hooks/use-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
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

const celebrationVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 10,
      delay: 0.5
    }
  }
};

export default function PaymentSuccessPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const processPaymentReturn = async () => {
      try {
        // Check if we already have the result from URL params (direct redirect)
        const success = searchParams.get('success');
        const message = searchParams.get('message');
        const description = searchParams.get('description');
        const paymentId = searchParams.get('paymentId');
        const transactionId = searchParams.get('transactionId');

        if (success === 'true' && message && description) {
          // We have the result from URL params (direct redirect from backend)
          setPaymentResult({
            success: true,
            message: decodeURIComponent(message),
            description: decodeURIComponent(description),
            paymentId,
            transactionId
          });

          toast({
            title: "Payment Successful!",
            description: "Your subscription has been activated successfully.",
          });
        } else {
          // Fallback to API call (existing logic)
          const params = new URLSearchParams(searchParams.toString());
          const result = await handlePaymentReturn(params);

          setPaymentResult(result);

          if (!result.success) {
            router.push(`/payment/failed?message=${encodeURIComponent(result.message)}&description=${encodeURIComponent(result.description)}`);
            return;
          }

          toast({
            title: "Payment Successful!",
            description: "Your subscription has been activated successfully.",
          });
        }

      } catch (error) {
        console.error("Payment processing error:", error);
        router.push("/payment/failed?message=Payment processing error");
      } finally {
        setIsLoading(false);
      }
    };

    processPaymentReturn();
  }, [searchParams, router]);


  if (isLoading) {
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
  
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-16">
        <motion.div className="max-w-2xl mx-auto text-center" variants={containerVariants}>
          {/* Success Icon */}
          <motion.div
            variants={celebrationVariants}
            className="mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="h-12 w-12 text-white" />
              </motion.div>
              
              {/* Sparkles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
                    left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 40}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  <Sparkles className="w-2 h-2" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div variants={itemVariants}>
            <Badge variant="secondary" className="mb-4">
              <Crown className="h-4 w-4 mr-2" />
              Payment Successful
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Premium!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your payment has been processed successfully. You now have access to all premium features!
            </p>
          </motion.div>

          {/* Success Card */}
          <motion.div variants={itemVariants}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Payment Confirmed
                </CardTitle>
                <CardDescription>
                  Your subscription is now active and ready to use
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Status</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Plan</span>
                    <span className="font-semibold">Premium Access</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">Features Unlocked</span>
                    <span className="font-semibold">All Premium Features</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/dashboard">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </motion.div>
            </Link>
            
            <Link href="/lesson/1">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline">
                  Start Learning
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div 
            variants={itemVariants}
            className="mt-12 p-6 bg-white/50 rounded-lg border"
          >
            <h3 className="font-semibold mb-2">What's Next?</h3>
            <p className="text-gray-600 text-sm">
              You can now access all premium features including unlimited hearts, 
              AI tutor, pronunciation scoring, and advanced analytics. 
              Start your enhanced learning journey today!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}