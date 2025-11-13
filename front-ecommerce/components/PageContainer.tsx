import React from 'react'
import Header from './Header';
import Footer from './Footer';

interface PageContainerProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  isHomePage?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, showHeader = true, showFooter = true, isHomePage = false }) => {
  return (
    <div className="min-h-screen bg-background">
      {showHeader && <Header />}
      <main className={`min-h-screen ${isHomePage ? "px-0 py-0" : "container mx-auto px-4 py-8 lg:px-0"}`}>
        <div className={`flex flex-col gap-8 items-center ${isHomePage ? "w-full" : ""}`}>
          {children}
        </div>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default PageContainer; 