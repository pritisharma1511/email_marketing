import { NextResponse } from 'next/server';
import * as jose from 'jose';

// We map paths that require authentication
const protectedPaths = [
    '/dashboard',
    '/campaigns',
    '/contacts',
    '/settings',
    '/api/campaigns',
    '/api/contacts',
    '/api/segments'
];

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

    if (isProtectedPath) {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            if (pathname.startsWith('/api')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            } else {
                return NextResponse.redirect(new URL('/login', request.url));
            }
        }

        try {
            // In Next.js middleware (Edge runtime), we must use jose instead of jsonwebtoken
            const secret = new TextEncoder().encode(
                process.env.JWT_SECRET || 'fallback_secret_for_development_only'
            );
            await jose.jwtVerify(token, secret);
            return NextResponse.next();
        } catch (error) {
            console.error('JWT Verification failed in middleware:', error.message);
            if (pathname.startsWith('/api')) {
                return NextResponse.json({ error: 'Unauthorized, invalid token' }, { status: 401 });
            } else {
                return NextResponse.redirect(new URL('/login', request.url));
            }
        }
    }

    // Redirect authenticated users away from login/signup
    if (pathname === '/login' || pathname === '/signup') {
        const token = request.cookies.get('token')?.value;
        if (token) {
            try {
                const secret = new TextEncoder().encode(
                    process.env.JWT_SECRET || 'fallback_secret_for_development_only'
                );
                await jose.jwtVerify(token, secret);
                return NextResponse.redirect(new URL('/dashboard', request.url));
            } catch (error) {
                // Token invalid, allow them to view login
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
