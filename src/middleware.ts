import { NextResponse } from "next/server";

export function middleware() {
  // Server side validation can go here.
  // We can validate token for server side here


  return NextResponse.next();
}