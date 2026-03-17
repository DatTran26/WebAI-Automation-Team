"use client"

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

function CartSuggestion() {
  const itemsCount = useCartStore((state) => state.totalItems());
  const prevCount = useRef(itemsCount);
  const pathname = usePathname();

  useEffect(() => {
    if (itemsCount > prevCount.current && itemsCount > 0 && pathname !== "/cart") {
      // Item was added
      const timer = setTimeout(() => {
        toast.info("Your delicacies are ready.", {
          description: "Would you like to review your inventory?",
          id: "cart-suggestion",
          duration: 5000,
          action: {
            label: "Review",
            onClick: () => {
              const cartBtn = document.getElementById("global-cart-icon");
              cartBtn?.click();
            }
          }
        });
      }, 5000);
      return () => clearTimeout(timer);
    }
    prevCount.current = itemsCount;
  }, [itemsCount, pathname]);

  return null;
}

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = ["/auth/login", "/auth/create-account", "/auth/verify-email", "/auth/forgot-password"].includes(pathname || "");
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <>
      <CartSuggestion />
      {!isAuthPage && !isAdminPage && <Header />}
      {children}
      {!isAuthPage && !isAdminPage && <Footer />}
    </>
  );
}
