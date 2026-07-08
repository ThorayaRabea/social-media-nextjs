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
      setAuthState("authenticated");
      if (isPublicRoute) {
        router.replace("/");
      }
    } else {
      setAuthState("unauthenticated");
      if (!isPublicRoute) {
        router.replace("/logout");
      }
    }
  }, [pathname, router]);

  // Show loading spinner while determining auth state
  if (authState === "loading") {
    return <Loading />;
  }

  return <>{children}</>;
}
