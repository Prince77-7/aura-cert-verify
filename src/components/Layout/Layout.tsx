import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
// Remove Link import if no longer needed here
// import { Link } from "react-router-dom"; 

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Restore self-closing Header */}
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
