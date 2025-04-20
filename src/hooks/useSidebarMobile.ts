
import { useState } from "react";

export function useSidebarMobile() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    toggleMobileMenu
  };
}
