import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  
  // Safe auth access with try/catch to handle when AuthProvider is not available
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    // AuthProvider not available, continue with user as null
  }

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
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 rounded-md gradient-bg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">J</span>
                </div>
                <span className="text-xl font-bold text-neutral-800">JagJar</span>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features">
              <div className={`font-medium ${isActive("/features") ? "text-primary-500" : "hover:text-primary-500"} transition-colors cursor-pointer`}>
                Features
              </div>
            </Link>
            <Link href="/pricing">
              <div className={`font-medium ${isActive("/pricing") ? "text-primary-500" : "hover:text-primary-500"} transition-colors cursor-pointer`}>
                Pricing
              </div>
            </Link>
            <Link href="/developers">
              <div className={`font-medium ${isActive("/developers") ? "text-primary-500" : "hover:text-primary-500"} transition-colors cursor-pointer`}>
                Developers
              </div>
            </Link>
            <Link href="/extension">
              <div className={`font-medium ${isActive("/extension") ? "text-primary-500" : "hover:text-primary-500"} transition-colors cursor-pointer`}>
                Extension
              </div>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth">
                  <div className="hidden sm:block font-medium hover:text-primary-500 transition-colors cursor-pointer">
                    Login
                  </div>
                </Link>
                <Link href="/auth">
                  <Button>Sign Up</Button>
                </Link>
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
            <Link href="/features">
              <div 
                className="block px-4 py-2 font-medium hover:bg-primary-50 hover:text-primary-500 cursor-pointer"
                onClick={closeMenu}
              >
                Features
              </div>
            </Link>
            <Link href="/pricing">
              <div 
                className="block px-4 py-2 font-medium hover:bg-primary-50 hover:text-primary-500 cursor-pointer"
                onClick={closeMenu}
              >
                Pricing
              </div>
            </Link>
            <Link href="/developers">
              <div 
                className="block px-4 py-2 font-medium hover:bg-primary-50 hover:text-primary-500 cursor-pointer"
                onClick={closeMenu}
              >
                Developers
              </div>
            </Link>
            <Link href="/extension">
              <div 
                className="block px-4 py-2 font-medium hover:bg-primary-50 hover:text-primary-500 cursor-pointer"
                onClick={closeMenu}
              >
                Extension
              </div>
            </Link>
            {!user && (
              <Link href="/auth">
                <div 
                  className="block px-4 py-2 font-medium hover:bg-primary-50 hover:text-primary-500 cursor-pointer"
                  onClick={closeMenu}
                >
                  Login
                </div>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
