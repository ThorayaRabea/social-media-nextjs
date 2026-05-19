"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";

import Navbar from "./_components/navbar/navbar";
import AuthGuard from "./_components/auth/AuthGuard";

import { Provider } from "react-redux";
import theme from "../theme";
import { store } from "../lib/store";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Provider store={store}>
              <Navbar />
              <Toaster />
              <AuthGuard>{children}</AuthGuard>
            </Provider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
