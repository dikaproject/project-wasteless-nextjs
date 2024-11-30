import { pattern } from 'framer-motion/client';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  {
    prefix: '/admin',
    role: 'admin',
    patterns: [
      '/admin',
      '/admin/products',
      '/admin/products/[0-9]+',
      '/admin/products/[0-9]+/edit',
      '/admin/categories',
      '/admin/categories/[0-9]+',
      '/admin/categories/[0-9]+/edit'
    ]
  },
  {
    prefix: '/seller',
    role: 'seller',
    patterns: [
      '/seller',
      '/seller/products',
      '/seller/products/[0-9]+',
      '/seller/products/[0-9]+/edit',
      '/seller/orders',
      '/seller/orders/[0-9]+',
      '/seller/orders/[0-9]+/edit'
    ]
  }
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;
  const userDataCookie = request.cookies.get('userData')?.value;

  console.log('Current path:', path);
  console.log('Token exists:', !!token);
  console.log('User data exists:', !!userDataCookie);

  const publicPaths = ['/login', '/register', '/access-denied', '/', '/about', '/business', '/contact', '/marketplace'];
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // Check authentication
  if (!token || !userDataCookie) {
    console.log('No auth data found, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const userData = JSON.parse(userDataCookie);
    console.log('User role:', userData.role);

    const protectedRoute = protectedRoutes.find(route => {
      if (!path.startsWith(route.prefix)) return false;

      if (route.role === 'admin' && route.patterns) {
        return route.patterns.some(pattern => {
          const regex = new RegExp(`^${pattern.replace(/\[0-9\]\+/, '\\d+')}$`);
          return regex.test(path);
        });
      }

      return true;
    });
    
    if (protectedRoute) {
      console.log('Protected route found:', protectedRoute.prefix);
      console.log('Required role:', protectedRoute.role);
      
      if (userData.role !== protectedRoute.role) {
        console.log('Role mismatch, redirecting');
        return NextResponse.redirect(new URL('/access-denied', request.url));
      }
    }


    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}