"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { PaymentPlan } from "@/types/payment";

interface PlanCardProps {
  plan: PaymentPlan;
  onSelect: (planId: number) => void;
  isLoading?: boolean;
  selectedPlan?: number;
}

const cardVariants = {
  hidden: { y: 50, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6 }
  },
  hover: {
    y: -10,
    scale: 1.02,
    transition: { duration: 0.3 }
  }
};

export default function PlanCard({ plan, onSelect, isLoading, selectedPlan }: PlanCardProps) {
  const isSelected = selectedPlan === plan.id;

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="h-full"
    >
      <Card 
        className={`relative h-full cursor-pointer transition-all duration-300 ${
          plan.popular 
            ? "border-2 border-blue-500 shadow-xl" 
            : isSelected
            ? "border-2 border-green-500 shadow-lg"
            : "border border-gray-200 shadow-lg hover:shadow-xl"
        }`}
        onClick={() => onSelect(plan.id)}
      >
        {plan.popular && (
          <motion.div 
            className="absolute -top-4 left-1/2 transform -translate-x-1/2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Badge className="bg-blue-500 text-white px-4 py-1">
              Most Popular
            </Badge>
          </motion.div>
        )}

        {isSelected && (
          <motion.div 
            className="absolute -top-4 right-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Badge className="bg-green-500 text-white px-3 py-1">
              Selected
            </Badge>
          </motion.div>
        )}
        
        <CardHeader className="text-center pb-8">
          <motion.div 
            className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center ${
              plan.id === 1 ? "bg-blue-100 text-blue-600" : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
            }`}
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            {plan.icon}
          </motion.div>
          
          <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            {plan.description}
          </CardDescription>
          
          <motion.div 
            className="mt-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold text-gray-900">
                ₫{plan.price}
              </span>
              <span className="text-gray-600 ml-2">
                {plan.period}
              </span>
            </div>
          </motion.div>
        </CardHeader>

        <CardContent className="px-6">
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <motion.li 
                key={index} 
                className="flex items-start"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                </motion.div>
                <span className="text-sm text-gray-900">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="px-6 pb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <Button 
              className={`w-full ${isSelected ? 'bg-green-600 hover:bg-green-700' : ''}`}
              size="lg"
              disabled={isLoading}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(plan.id);
              }}
            >
              {isLoading ? "Processing..." : isSelected ? "Selected" : "Select Plan"}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}