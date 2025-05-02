import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { Button } from "../ui/button";
import { LogOut, Settings } from "lucide-react";

export const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Shield of Steel Logo" className="h-8 w-auto dark:invert-0 invert" />
          <span className="font-medium text-lg">Training Division</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link 
            to="/" 
            className={`transition-colors hover:text-foreground/80 ${
              location.pathname === "/" ? "text-foreground font-medium" : "text-foreground/60"
            }`}
          >
            Home
          </Link>
          <Link 
            to="/verify" 
            className={`transition-colors hover:text-foreground/80 ${
              location.pathname === "/verify" ? "text-foreground font-medium" : "text-foreground/60"
            }`}
          >
            Verify Certificate
          </Link>
          {isAuthenticated && (
            <Link 
              to="/admin" 
              className={`transition-colors hover:text-foreground/80 ${
                location.pathname.startsWith("/admin") ? "text-foreground font-medium" : "text-foreground/60"
              }`}
            >
              Admin Dashboard
            </Link>
          )}
          {isAuthenticated && (
            <Link 
              to="/settings" 
              className={`transition-colors hover:text-foreground/80 ${
                location.pathname === "/settings" ? "text-foreground font-medium" : "text-foreground/60"
              }`}
            >
              Settings
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout} 
              className="gap-1"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden container py-2">
        <div className="flex space-x-4 overflow-x-auto pb-1">
          <Link to="/" className={`px-3 py-1 whitespace-nowrap ${location.pathname === "/" ? "text-foreground font-medium" : "text-foreground/60"}`}>
            Home
          </Link>
          <Link to="/verify" className={`px-3 py-1 whitespace-nowrap ${location.pathname === "/verify" ? "text-foreground font-medium" : "text-foreground/60"}`}>
            Verify Certificate
          </Link>
          {isAuthenticated && (
            <Link to="/admin" className={`px-3 py-1 whitespace-nowrap ${location.pathname.startsWith("/admin") ? "text-foreground font-medium" : "text-foreground/60"}`}>
              Admin
            </Link>
          )}
          {isAuthenticated && (
            <Link to="/settings" className={`px-3 py-1 whitespace-nowrap ${location.pathname === "/settings" ? "text-foreground font-medium" : "text-foreground/60"}`}>
              Settings
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
