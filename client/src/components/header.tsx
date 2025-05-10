import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => window.location.href = "/"}
            >
              <div className="w-8 h-8 rounded-md gradient-bg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="text-xl font-bold text-neutral-800">JagJar</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <div 
              onClick={() => window.location.href = "/features"}
              className={`font-medium ${isActive("/features") ? "text-primary-500" : "hover:text-primary-500"} transition-colors cursor-pointer`}
            >
              Features
            </div>
            <div 
              onClick={() => window.location.href = "/pricing"}
              className={`font-medium ${isActive("/pricing") ? "text-primary-500" : "hover:text-primary-500"} transition-colors cursor-pointer`}
            >
              Pricing
            </div>
            <div 
              onClick={() => window.location.href = "/developers"}
              className={`font-medium ${isActive("/developers") ? "text-primary-500" : "hover:text-primary-500"} transition-colors cursor-pointer`}
            >
              Developers
            </div>
            <div 
              onClick={() => window.location.href = "/extension"}
              className={`font-medium ${isActive("/extension") ? "text-primary-500" : "hover:text-primary-500"} transition-colors cursor-pointer`}
            >
              Extension
            </div>
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <Button 
                variant="ghost"
                onClick={() => window.location.href = "/dashboard"}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <div 
                  className="hidden sm:block font-medium hover:text-primary-500 transition-colors cursor-pointer"
                  onClick={() => window.location.href = "/auth"}
                >
                  Login
                </div>
                <Button onClick={() => window.location.href = "/auth"}>
                  Sign Up
                </Button>
              </>
            )}
            <button 
              className="md:hidden text-neutral-500 hover:text-neutral-700"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-2 pb-4 space-y-1 border-t border-neutral-200">
            <div 
              className="block px-4 py-2 font-medium hover:bg-primary-50 hover:text-primary-500 cursor-pointer"
              onClick={() => {
                closeMenu();
                window.location.href = "/features";
              }}
            >
              Features
            </div>
            <div 
              className="block px-4 py-2 font-medium hover:bg-primary-50 hover:text-primary-500 cursor-pointer"
              onClick={() => {
                closeMenu();
                window.location.href = "/pricing";
              }}
            >
              Pricing
            </div>
            <div 
              className="block px-4 py-2 font-medium hover:bg-primary-50 hover:text-primary-500 cursor-pointer"
              onClick={() => {
                closeMenu();
                window.location.href = "/developers";
              }}
            >
              Developers
            </div>
            <div 
              className="block px-4 py-2 font-medium hover:bg-primary-50 hover:text-primary-500 cursor-pointer"
              onClick={() => {
                closeMenu();
                window.location.href = "/extension";
              }}
            >
              Extension
            </div>
            {!user && (
              <div 
                className="block px-4 py-2 font-medium hover:bg-primary-50 hover:text-primary-500 cursor-pointer"
                onClick={() => {
                  closeMenu();
                  window.location.href = "/auth";
                }}
              >
                Login
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
