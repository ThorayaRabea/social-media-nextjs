"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Loading from "../../../loading";

// Pages that don't require authentication
const PUBLIC_ROUTES = ["/login", "/logout"];

function isValidToken(token: string | null): boolean {
  return !!token && token !== "undefined" && token !== "null" && token.trim() !== "";
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (isValidToken(token)) {
      // User has a valid token
      if (pathname === "/login" || pathname === "/logout") {
        // Logged-in user on login/register page → redirect to home
        router.replace("/");
        return;
      }
      setAuthState("authenticated");
    } else {
      // No valid token
      if (isPublicRoute) {
        // Already on a public page → allow
        setAuthState("unauthenticated");
      } else {
        // Trying to access protected page → redirect to register/logout
        router.replace("/logout");
        return;
      }
    }
  }, [pathname, router]);

  // Show loading spinner while determining auth state
  if (authState === "loading") {
    return <Loading />;
  }

  return <>{children}</>;
}
