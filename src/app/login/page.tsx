'use client'

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
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Giả lập đăng nhập - trong ứng dụng thực tế, sẽ gọi API
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
  }

  return (
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
      </div>
    </div>
  )
}
