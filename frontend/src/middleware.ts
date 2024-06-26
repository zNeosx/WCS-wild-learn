import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Role } from './graphql/generated/schema';
import { APP_ROUTES, MIDDLEWARE_MATCH_ROUTES } from './constants';

const JWT_PRIVATE_KEY = new TextEncoder().encode(
  process.env.JWT_PRIVATE_KEY || ''
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_PRIVATE_KEY);
      if (payload.userId) {
        if (request.nextUrl.pathname.startsWith('/auth')) {
          return NextResponse.redirect(new URL('/', request.url));
        }
        if (request.nextUrl.pathname.startsWith('/enseignant')) {
          if (payload.role === Role.STUDENT) {
            return NextResponse.redirect(new URL('/', request.url));
          }
        }
        if (!request.nextUrl.pathname.includes('/enseignant')) {
          if (payload.role === Role.TEACHER) {
            return NextResponse.redirect(
              new URL('/enseignant/cours', request.url)
            );
          }
        }

        return NextResponse.next();
      }
    } catch (error) {
      console.error('Verification failed', error);
    }
  }

  if (request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/auth/connexion', request.url));
}

export const config = {
  matcher: ['/', '/rechercher', '/enseignant/:path*', '/auth/:path*'],
};
