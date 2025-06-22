"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, User, LogOut, Settings, Crown } from "lucide-react";
import { motion } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {apiFetch} from "@/lib/api";
import {API_ENDPOINTS} from "@/lib/configURL";

interface User {
    userName: string;
    email: string;
    plan: string | number; // Allow both string and number
}

// Plan mapping functions
const getPlanName = (plan: string | number): string => {
    const planValue = typeof plan === 'string' ? parseInt(plan) : plan;
    switch (planValue) {
        case 0:
            return "Free";
        case 1:
            return "Support";
        case 2:
            return "Premium";
        default:
            return "Free";
    }
};

const isPlanFree = (plan: string | number): boolean => {
    const planValue = typeof plan === 'string' ? parseInt(plan) : plan;
    return planValue === 0;
};

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = () => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
      
        if (token && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
          } catch (error) {
            console.error("Error parsing user data:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        }
        setIsLoading(false);
      };

      checkAuth();
    }, []);

    const handleLogout = async () => {
        try {
            // Call the logout API
            await apiFetch(API_ENDPOINTS.LOGOUT, {
                method: "POST",
                requiresAuth: true,
            });
        } catch (error) {
            console.error("Logout API error:", error);
            // Continue with local logout even if API fails
        } finally {
            // Always clear local storage and redirect
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            window.location.href = "/";
        }
    };

    const getPlanIcon = (plan: string | number) => {
        const planName = getPlanName(plan).toLowerCase();
        switch (planName) {
            case "premium":
                return <Crown className="h-3 w-3" />;
            case "support":
                return <BookOpen className="h-3 w-3" />;
            default:
                return null;
        }
    };

    const getPlanColor = (plan: string | number) => {
        const planName = getPlanName(plan).toLowerCase();
        switch (planName) {
            case "premium":
                return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
            case "support":
                return "bg-blue-500 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    return (
        <motion.header 
            className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Link href="/" className="flex items-center space-x-2">
                        <motion.div 
                            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring" as const, stiffness: 400, damping: 10 }}
                        >
                            <BookOpen className="h-5 w-5 text-white" />
                        </motion.div>
                        <span className="text-xl font-bold text-gray-900">English Quest</span>
                    </Link>
                </motion.div>
                
                <motion.nav 
                    className="hidden md:flex items-center space-x-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {[
                        { href: "/pricing", label: "Pricing" },
                        { href: "/leaderboard", label: "Leaderboard" },
                    ].map((item, index) => (
                        <motion.div
                            key={item.href}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                        >
                            <Link
                                href={item.href}
                                className="text-gray-600 hover:text-gray-900 transition-colors relative group"
                            >
                                {item.label}
                                <motion.div
                                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 group-hover:w-full transition-all duration-300"
                                    layoutId={`navbar-underline-${item.href}`}
                                />
                            </Link>
                        </motion.div>
                    ))}
                </motion.nav>

                <motion.div 
                    className="flex items-center space-x-4"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
                      />
                    ) : user ? (
                      // Authenticated User Menu
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-sm">
                                  {user.userName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-gray-900">{user.userName}</p>
                                <div className="flex items-center space-x-1">
                                  <Badge 
                                    className={`text-xs px-2 py-0 ${getPlanColor(user.plan)}`}
                                  >
                                      {getPlanIcon(user.plan)}
                                    <span>{getPlanName(user.plan)}</span>
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium">{user.userName}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard" className="flex items-center cursor-pointer">
                              <User className="mr-2 h-4 w-4" />
                              Dashboard
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/settings" className="flex items-center cursor-pointer">
                              <Settings className="mr-2 h-4 w-4" />
                              Settings
                            </Link>
                          </DropdownMenuItem>
                          {/* Fixed condition to check for Free plan (0) */}
                          {isPlanFree(user.plan) && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href="/pricing" className="flex items-center cursor-pointer text-blue-600">
                                  <Crown className="mr-2 h-4 w-4" />
                                  Upgrade Plan
                                </Link>
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={handleLogout}
                            className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      // Non-authenticated User Buttons
                      <>
                        <Link href="/login">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button variant="ghost">Sign In</Button>
                            </motion.div>
                        </Link>
                        <Link href="/register">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button>Get Started</Button>
                            </motion.div>
                        </Link>
                      </>
                    )}
                </motion.div>
            </div>
        </motion.header>
    );
}
