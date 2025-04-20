
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileMenu } from "./sidebar/MobileMenu";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { NavItems } from "./sidebar/NavItems";
import { LogoutSection } from "./sidebar/LogoutSection";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <MobileMenu 
        isMobileMenuOpen={isMobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu} 
      />

      <div className={`bg-sidebar fixed h-full w-64 hidden lg:block shadow-lg z-20`}>
        <SidebarHeader />
        <nav className="px-3 flex flex-col justify-between h-[calc(100%-5rem)]">
          <NavItems />
          <LogoutSection />
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30">
          <div className="fixed inset-0 z-40">
            <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-sidebar overflow-y-auto p-4">
              <SidebarHeader />
              <nav className="flex flex-col justify-between h-[calc(100%-4rem)]">
                <NavItems isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
                <LogoutSection />
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
