'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image'

export default function ActivateClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const paramToken = searchParams.get('token')
    if (paramToken) setToken(paramToken)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    const res = await fetch('/api/users/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    if (res.ok) {
      const { email } = await res.json()

      const loginRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (loginRes?.ok) {
        toast.success('Account activated successfully!')
        router.push('/dashboard')
      } else {
        toast.error('Activated, but login failed. Try logging in manually.')
      }
    } else {
      const data = await res.json()
      toast.error(data.error || 'Activation failed')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image 
              src="/logo-color.png" 
              alt="NCDA Logo" 
              className="h-24 w-auto"
              width={264}
              height={64}
            />
          </div>
          <CardTitle className="text-2xl">Activate Your Account</CardTitle>
          <CardDescription>
            Create password you wish to use
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">New password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                className="w-full border p-2 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Confirm password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  className="w-full border p-2 rounded"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 w-full"
              disabled={loading}
            >
              {loading ? 'Activating...' : 'Activate'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
