'use client';

import { useState } from 'react';
import { Sidebar } from '../ui/sidebar';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import ProductsTable from './ProductsTable';
import OrdersTable from './OrdersTable';
import AdminCategory from './AdminCategory';
import AdminCoupons from './AdminCoupons';
import AdminHomeConfig from './AdminHomeConfig';
import AdminProductListConfig from './AdminProductListConfig';
import AdminFaq from './AdminFaq';
import AnalyticDashboard from './AnalyticDashboard';
import UsersTable from './UsersTable';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytic-dashboard');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const renderContent = () => {
    
    switch (activeTab) {
      case 'analytic-dashboard':
        return <AnalyticDashboard />;
      case 'products':
        return <ProductsTable />;
      case 'users':
        return <UsersTable />;
      case 'orders':
        return <OrdersTable />;
      case 'categories':
        return <AdminCategory />;
      case 'coupons':
        return <AdminCoupons />;
      case 'home-config':
        return <AdminHomeConfig />;
      case 'products-list-config':
        return <AdminProductListConfig />;
      case 'faq':
        return <AdminFaq />;
      default:
        // Default to analytic dashboard instead of products table
        return <AnalyticDashboard />;
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home-config' || tab === 'products-list-config' ||
      tab === 'products' || tab === 'orders' || tab === 'categories' || tab === 'coupons') {
      setIsSheetOpen(false);
    }
  };

  return (
    <div className="grid grid-cols-12 h-screen bg-background">
      <div className="hidden md:block md:col-span-3 lg:col-span-2">
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
        </SheetContent>
      </Sheet>

      <main className="col-span-12 md:col-span-9 lg:col-span-10 mt-12 md:mt-0 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
} 