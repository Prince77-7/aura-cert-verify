import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            {new Date().getFullYear()} Shield of Steel - Training Division. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex items-center space-x-4 text-sm font-medium">
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            {/* Admin Login Link - Hidden in plain sight */}
            <Link to="/login" className="text-muted-foreground/50 hover:text-foreground/80">
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
