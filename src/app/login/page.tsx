'use client'

<<<<<<< HEAD
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
//import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {  Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
=======
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
>>>>>>> login
  const router = useRouter()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
<<<<<<< HEAD
    // Giả lập đăng nhập - trong ứng dụng thực tế, sẽ gọi API
=======
    // Giả lập đăng nhập - thay thế bằng API thực tế trong ứng dụng
    console.log("Login attempted with:", { email: formData.email })
    // Lưu thông tin người dùng vào localStorage (hoặc SessionStorage)
>>>>>>> login
    localStorage.setItem(
      'user',
      JSON.stringify({
<<<<<<< HEAD
        email,
        plan: 'Free',
=======
        email: formData.email,
        plan: "Free",
>>>>>>> login
        hearts: 5,
        streak: { current: 0, lastUpdate: new Date() },
      })
    )
<<<<<<< HEAD
    router.push('/dashboard')
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    // Giả lập đăng ký - trong ứng dụng thực tế, sẽ gọi API
    localStorage.setItem(
      'user',
      JSON.stringify({
        email,
        plan: 'Free',
        hearts: 5,
        streak: { current: 0, lastUpdate: new Date() },
      }),
    )
    router.push('/dashboard')
=======
    // Chuyển hướng đến trang dashboard sau khi đăng nhập thành công
    router.push("/dashboard")
>>>>>>> login
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions")
      return
    }
    // Giả lập đăng ký - thay thế bằng API thực tế trong ứng dụng
    console.log("Registration attempted with:", { userName: formData.userName, email: formData.email })
    // Chuyển sang tab login sau khi đăng ký thành công
    setActiveTab('login')  // Chuyển sang tab login
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Phía trái với hình ảnh và nội dung - luôn hiển thị */}
      <div className="flex w-full md:w-1/2 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 items-center justify-center p-8 md:p-16 relative min-h-[300px] md:min-h-0">
        <div className="text-white max-w-md z-10">
          {activeTab === 'login' ? (
            <>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-6">Smash sets in your sweats.</h1>
              <p className="text-lg">Quizlet helps you learn anything, anywhere.</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-6">The best way to study. Sign up for free.</h1>
              <p className="text-lg">Create flashcards, play games, and track your progress.</p>
            </>
          )}
        </div>
        {/* Ảnh minh họa */}
        <img
          src="/quizlet-books.png"
          alt="Books and headphones"
          className="absolute right-4 bottom-4 w-40 md:w-72 z-0 opacity-90 pointer-events-none select-none"
          style={{ objectFit: 'contain' }}
        />
      </div>
      {/* Phía phải với form - luôn hiển thị */}
      <div className="flex flex-col w-full md:w-1/2 bg-white dark:bg-gray-900 p-6 md:p-10 min-h-[400px] justify-center items-center">
        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="flex space-x-8 mb-8 text-xl font-semibold text-gray-700 dark:text-gray-300 justify-center">
            <button
              className={`pb-2 border-b-4 ${activeTab === 'signup' ? 'border-purple-600 text-purple-600' : 'border-transparent'}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign up
            </button>
            <button
              className={`pb-2 border-b-4 ${activeTab === 'login' ? 'border-purple-600 text-purple-600' : 'border-transparent'}`}
              onClick={() => setActiveTab('login')}
            >
              Log in
            </button>
          </div>

          {/* Form */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                Sign In
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I accept the{' '}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                disabled={!acceptTerms}
              >
                Sign Up
              </Button>
              <p className="text-center text-gray-500 mt-4">
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setActiveTab('login')}
                >
                  Log in
                </button>
              </p>
            </form>
          )}
        </div>
=======
    <div className="min-h-screen flex">
      {/* Left Section - Gradient Background */}
      <div className="w-1/2 bg-gradient-to-br from-blue-500 via-cyan-500 to-green-500 hidden md:flex items-center justify-center relative">
        <div className="w-1/2 bg-gradient-to-r from-blue-500 to-green-500 hidden md:block">
          <img
            src="/path_to_your_image.jpg" // Thay đổi với đường dẫn ảnh của bạn
            alt="Illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right Section - Authentication Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <Card className="w-full max-w-md border-0 shadow-none">
          <CardHeader className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-semibold text-gray-800">Welcome</CardTitle>
            <CardDescription className="text-base text-gray-600">Join millions of learners worldwide</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex space-x-8 mb-4 text-xl font-semibold text-gray-700 justify-center">
              <button
                className={`pb-2 border-b-4 ${activeTab === 'signup' ? 'border-purple-600 text-purple-600' : 'border-transparent'}`}
                onClick={() => setActiveTab('signup')}
              >
                Sign up
              </button>
              <button
                className={`pb-2 border-b-4 ${activeTab === 'login' ? 'border-purple-600 text-purple-600' : 'border-transparent'}`}
                onClick={() => setActiveTab('login')}
              >
                Log in
              </button>
            </div>

            {/* Login Form */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      className="h-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold"
                >
                  Sign In
                </Button>
              </form>
            ) : (
              // Sign Up Form
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="userName">Username</Label>
                  <Input
                    id="userName"
                    type="text"
                    placeholder="Choose a username"
                    value={formData.userName}
                    onChange={(e) => handleInputChange("userName", e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      className="h-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                      className="h-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold"
                  disabled={!formData.agreeToTerms}
                >
                  Create Account
                </Button>
              </form>
            )}
            <div className="mt-6 text-center">
              {activeTab === 'login' ? (
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => setActiveTab('signup')}
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => setActiveTab('login')}
                  >
                    Log in
                  </button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
>>>>>>> login
      </div>
    </div>
  )
}
