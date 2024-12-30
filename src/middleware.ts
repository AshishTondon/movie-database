import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware() {
    // We can validate token for server side here

    return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
// export const config = {
//   matcher: ['/dashboard', "/login"],
// }