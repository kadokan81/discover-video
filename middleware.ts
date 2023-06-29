import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/utils';

// This function can be marked `async` if using `await` inside

export function middleware(request: NextRequest) {
	//check token
	//if token is valid
	//@ts-ignore
	// const token = request.cookies ? request.cookies?.token : null;
	// const userId = verifyToken(token);
	// const { pathname } = request.nextUrl;
	// if ((token && userId) || pathname.includes('/api/login')) {
	// 	return NextResponse.next();
	// }
	// if (!token && pathname !== '/login') {
	// 	return NextResponse.redirect('/login');
	// }
	//else if no token
	//redirect to login page
}

// See "Matching Paths" below to learn more
//
