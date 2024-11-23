'use client';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type UserRole = 'admin' | 'seller' | 'user'

export function useAuth(requiredRole: UserRole) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token')
        const user = JSON.parse(localStorage.getItem('user') || '{}')

        if (!token || !user.role) {
          router.push('/login')
          return
        }

        if (!user.has_address && user.role !== 'admin') {
          router.push('/address-completed');
          return;
        }

        if (requiredRole && user.role !== requiredRole) {
          switch (user.role) {
            case 'admin':
              router.push('/admin');
              break;
            case 'seller':
              router.push('/seller');
              break;
            default:
              router.push('/');
          }
          return;
        }
        
        setIsAuthenticated(true)
      } catch (error) {
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [requiredRole, router])

  return { isLoading, isAuthenticated }
}