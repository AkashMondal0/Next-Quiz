import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Extract the 'token' cookie from the request
  // const token = req.cookies.get('token');
  // // Check if the token is present
  // if (!token) {
  // // redirect to the login page if the token is not present
  //   return NextResponse.redirect(new URL('/login', req.url))
  // }

  // If the token exists, allow the request to proceed
  return NextResponse.next();
}


export const config = {
  matcher: [
    "/",
  ]
}