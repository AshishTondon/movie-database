"use client";

import React, { useEffect } from "react";
import ThemeProvider from "@/app/theme/theme-provider";
import "./globals.css";
import { auth } from "@/app/common/firebase-config";
import { redirect } from "next/navigation";
import { usePathname } from "next/navigation";

const loginPath = "/login";
const dashboardPath = "/dashboard";

export default function RootLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (pathName != loginPath && !user) {
        redirect(loginPath);
      } else if (pathName === loginPath && user) {
        redirect(dashboardPath);
      }
    });
  }, [auth]);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
