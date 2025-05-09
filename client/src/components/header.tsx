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
            <Link href="/">
              <a className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-md gradient-bg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">J</span>
                </div>
                <span className="text-xl font-bold text-neutral-800">JagJar</span>
              </a>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features">
              <a className={`font-medium ${isActive("/features") ? "text-primary-500" : "hover:text-primary-500"} transition-colors`}>
                Features
              </a>
            </Link>
            <Link href="/pricing">
              <a className={`font-medium ${isActive("/pricing") ? "text-primary-500" : "hover:text-primary-500"} transition-colors`}>
                Pricing
              </a>
            </Link>
            <Link href="/developers">
              <a className={`font-medium ${isActive("/developers") ? "text-primary-500" : "hover:text-primary-500"} transition-colors`}>
                Developers
              </a>
            </Link>
            <Link href="/extension">
              <a className={`font-medium ${isActive("/extension") ? "text-primary-500" : "hover:text-primary-500"} transition-colors`}>
                Extension
              </a>
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
                  <a className="hidden sm:block font-medium hover:text-primary-500 transition-colors">
                    Login
                  </a>
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
              <a 
                className="block px-4 py-2 font-medium hover:bg-primary-50 hover:text-primary-500"
                onClick={closeMenu}
              >
                Features
              </a>
            </Link>
            <Link href="/pricing">
              <a 
                className="block px-4 py-2 font-medium hover:bg-primary-50 hover:text-primary-500"
                onClick={closeMenu}
              >
                Pricing
              </a>
            </Link>
            <Link href="/developers">
              <a 
                className="block px-4 py-2 font-medium hover:bg-primary-50 hover:text-primary-500"
                onClick={closeMenu}
              >
                Developers
              </a>
            </Link>
            <Link href="/extension">
              <a 
                className="block px-4 py-2 font-medium hover:bg-primary-50 hover:text-primary-500"
                onClick={closeMenu}
              >
                Extension
              </a>
            </Link>
            {!user && (
              <Link href="/auth">
                <a 
                  className="block px-4 py-2 font-medium hover:bg-primary-50 hover:text-primary-500"
                  onClick={closeMenu}
                >
                  Login
                </a>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
