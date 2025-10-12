// components/require-role.tsx
'use client'

import { useAuth } from '@/hooks/actions/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'

interface RequireRoleProps {
  role?: 'seller' | 'buyer'
  children: React.ReactNode
}

export function RequireRole({ role, children }: RequireRoleProps) {
  const { user, isSeller, isBuyer } = useAuth({ middleware: 'auth' })
  const router = useRouter()

  useEffect(() => {
    if (!user) return

    // Check role access
    if (role === 'seller' && !isSeller) {
      router.push('/dashboard') // Redirect buyer to their dashboard
    }
    
    if (role === 'buyer' && !isBuyer) {
      router.push('/my-shop') // Redirect seller to their shop
    }
  }, [user, role, isSeller, isBuyer, router])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-hdvh">
        <Loader className="animate-spin size-8" />
      </div>
    )
  }

  // Check if user has correct role
  if (role === 'seller' && !isSeller) return null
  if (role === 'buyer' && !isBuyer) return null

  return <>{children}</>
}