"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X, Star, Heart, Zap, Crown } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ReactNode;
  features: {
    text: string;
    included: boolean;
  }[];
  popular?: boolean;
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary";
}

const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "0",
    period: "Forever",
    description: "Perfect for getting started with English learning",
    icon: <Heart className="h-6 w-6" />,
    features: [
      { text: "Access to first 2 sections", included: true },
      { text: "5 hearts per level", included: true },
      { text: "Basic progress tracking", included: true },
      { text: "Text-to-speech for vocabulary", included: true },
      { text: "Daily streak tracking", included: true },
      { text: "Community leaderboard", included: true },
      { text: "Contains advertisements", included: false },
      { text: "Limited AI tutor access", included: false },
      { text: "All sections access", included: false },
      { text: "Pronunciation scoring", included: false },
    ],
    buttonText: "Get Started Free",
    buttonVariant: "outline",
  },
  {
    id: "support",
    name: "Support",
    price: "29,000",
    period: "One-time payment",
    description: "Support our mission and unlock full content",
    icon: <Zap className="h-6 w-6" />,
    features: [
      { text: "Access to ALL sections", included: true },
      { text: "6 hearts per level", included: true },
      { text: "No advertisements", included: true },
      { text: "Advanced progress analytics", included: true },
      { text: "Text-to-speech for vocabulary", included: true },
      { text: "Daily streak tracking", included: true },
      { text: "Community leaderboard", included: true },
      { text: "Priority customer support", included: true },
      { text: "Unlimited AI tutor access", included: false },
      { text: "Pronunciation scoring", included: false },
    ],
    popular: true,
    buttonText: "Buy Once, Learn Forever",
    buttonVariant: "default",
  },
  {
    id: "premium",
    name: "Premium",
    price: "99,000",
    period: "per month",
    description: "The ultimate English learning experience",
    icon: <Crown className="h-6 w-6" />,
    features: [
      { text: "Access to ALL sections", included: true },
      { text: "Unlimited hearts", included: true },
      { text: "No advertisements", included: true },
      { text: "Advanced progress analytics", included: true },
      { text: "Text-to-speech for vocabulary", included: true },
      { text: "Daily streak tracking", included: true },
      { text: "Community leaderboard", included: true },
      { text: "Priority customer support", included: true },
      { text: "Unlimited AI tutor access", included: true },
      { text: "Pronunciation scoring", included: true },
    ],
    buttonText: "Start Premium Trial",
    buttonVariant: "default",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header Section */}
      <motion.div 
        className="container mx-auto px-4 py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Badge variant="secondary" className="mb-4">
              <Star className="h-4 w-4 mr-2" />
              Choose Your Learning Journey
            </Badge>
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            variants={itemVariants}
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Start learning English for free, or unlock your full potential with our premium plans. 
            No hidden fees, cancel anytime.
          </motion.p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto"
          variants={containerVariants}
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              variants={cardVariants}
              whileHover="hover"
              custom={index}
            >
              <Card 
                className={`relative h-full ${
                  plan.popular 
                    ? "border-2 border-blue-500 shadow-xl" 
                    : "border border-gray-200 shadow-lg"
                }`}
              >
                {plan.popular && (
                  <motion.div 
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </motion.div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <motion.div 
                    className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                      plan.id === "free" ? "bg-gray-100 text-gray-600" :
                      plan.id === "support" ? "bg-blue-100 text-blue-600" :
                      "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
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
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price === "0" ? "Free" : `₫${plan.price}`}
                      </span>
                      {plan.price !== "0" && (
                        <span className="text-gray-600 ml-2">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    {plan.price === "0" && (
                      <p className="text-gray-600 mt-1">{plan.period}</p>
                    )}
                  </motion.div>
                  </CardHeader>

                <CardContent className="px-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex} 
                        className="flex items-start"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: 0.6 + index * 0.1 + featureIndex * 0.05 
                        }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          transition={{ duration: 0.2 }}
                        >
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                          )}
                        </motion.div>
                        <span className={`text-sm ${
                          feature.included ? "text-gray-900" : "text-gray-500"
                        }`}>
                          {feature.text}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="px-6 pb-6">
                  <Link href={plan.id === "free" ? "/register" : "/payment"} className="w-full">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full"
                    >
                      <Button 
                        className="w-full" 
                        variant={plan.buttonVariant}
                        size="lg"
                      >
                        {plan.buttonText}
                      </Button>
                    </motion.div>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="mt-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Everything you need to know about our pricing plans
            </p>
          </motion.div>

          <motion.div 
            className="max-w-3xl mx-auto"
            variants={itemVariants}
          >
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  value: "item-1",
                  question: "What's included in the free plan?",
                  answer: "The free plan gives you access to the first 2 sections of our curriculum, basic progress tracking, and all core learning features with ads."
                },
                {
                  value: "item-2",
                  question: "What's the difference between Support and Premium?",
                  answer: "Support is a one-time payment that unlocks all content without ads. Premium is a monthly subscription that includes everything plus unlimited AI tutor access and pronunciation scoring."
                },
                {
                  value: "item-3",
                  question: "Can I switch plans anytime?",
                  answer: "Yes! You can upgrade from Free to Support or Premium anytime. Premium subscribers can cancel their subscription at any time."
                },
                {
                  value: "item-4",
                  question: "What payment methods do you accept?",
                  answer: "We accept all major payment methods through VNPAY, including credit cards, debit cards, and local Vietnamese payment options."
                },
                {
                  value: "item-5",
                  question: "Is there a money-back guarantee?",
                  answer: "Yes! We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund."
                },
                {
                  value: "item-6",
                  question: "How does the hearts system work?",
                  answer: "Hearts represent your attempts per level. Free users get 5 hearts, Support users get 6, and Premium users have unlimited hearts."
                }
              ].map((faq, index) => (
                <motion.div
                  key={faq.value}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem value={faq.value}>
                    <AccordionTrigger className="text-left hover:text-blue-600 transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="mt-24 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-12 text-white"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Ready to Start Your English Journey?
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Join thousands of learners who are already improving their English with English Quest
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" variant="secondary" className="text-blue-600">
                    Start Learning Free
                  </Button>
                </motion.div>
              </Link>
              <Link href="/payment">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" variant="secondary" className="text-blue-600">
                    View All Plans
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}