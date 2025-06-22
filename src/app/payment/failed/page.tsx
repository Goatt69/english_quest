"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";
import Link from "next/link";

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

const shakeVariants = {
  hidden: { x: 0 },
  visible: {
    x: 0,
    transition: {
      delay: 0.5,
    }
  },
  shake: {
    x: [-10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
};

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "Payment failed";
  const description = searchParams.get("description") || "Your payment could not be processed. Please try again.";

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-16">
        <motion.div className="max-w-2xl mx-auto text-center" variants={containerVariants}>
          {/* Failed Icon */}
          <motion.div
            variants={shakeVariants}
            animate="shake"
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
              <XCircle className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div variants={itemVariants}>
            <Badge variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4 mr-2" />
              Payment Failed
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Payment Unsuccessful
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We couldn't process your payment. Don't worry, no charges were made to your account.
            </p>
          </motion.div>

          {/* Error Details Card */}
          <motion.div variants={itemVariants}>
            <Card className="mb-8 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-center text-red-600">
                  <XCircle className="h-5 w-5 mr-2" />
                  Payment Error Details
                </CardTitle>
                <CardDescription>
                  Here's what happened with your payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-red-800">Error:</span>
                      <span className="text-red-700 text-right flex-1 ml-4">{message}</span>
                    </div>
                  </div>
                  {description && (
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-orange-800">Details:</span>
                        <span className="text-orange-700 text-right flex-1 ml-4">{description}</span>
                      </div>
                    </div>
                  )}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-800">Account Status:</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">No Charges Made</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Link href="/payment">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Try Again
                </Button>
              </motion.div>
            </Link>
            
            <Link href="/pricing">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Pricing
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Help Section */}
          <motion.div 
            variants={itemVariants}
            className="grid md:grid-cols-2 gap-6"
          >
            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Common Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Insufficient funds in your account</li>
                  <li>• Card expired or blocked</li>
                  <li>• Network connection issues</li>
                  <li>• Payment cancelled by user</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <RefreshCw className="h-5 w-5 mr-2 text-green-600" />
                  What to Try
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Check your card details</li>
                  <li>• Try a different payment method</li>
                  <li>• Contact your bank</li>
                  <li>• Refresh and try again</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Support Contact */}
          <motion.div 
            variants={itemVariants}
            className="mt-12 p-6 bg-white/50 rounded-lg border"
          >
            <h3 className="font-semibold mb-2 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Need Help?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              If you continue to experience issues, our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact">
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </Link>
              <Link href="/help">
                <Button variant="outline" size="sm">
                  Help Center
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}