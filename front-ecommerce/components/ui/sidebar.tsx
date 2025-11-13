import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Package, PackageCheck, Percent, Plus, Settings, SquareMenu, ChevronDown, ChevronRight, HelpCircle, ChartBar, Users } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const router = useRouter();
  const [expandedPages, setExpandedPages] = useState(false);

  // Auto-expand Pages Config if active tab is one of its children
  useEffect(() => {
    if (activeTab === "home-config" || activeTab === "products-list-config" || activeTab === "faq") {
      setExpandedPages(true);
    }
  }, [activeTab]);

  const menuItems = [
    {
      id: "analytic-dashboard",
      label: "Analíticas",
      icon: ChartBar,
    },
    {
      id: "products",
      label: "Productos",
      icon: Package,
    },
    {
      id: "users",
      label: "Usuarios",
      icon: Users,
    },
    {
      id: "categories",
      label: "Categorías",
      icon: SquareMenu,
    },
    {
      id: "orders",
      label: "Pedidos",
      icon: PackageCheck,
    },
    {
      id: "coupons",
      label: "Cupones",
      icon: Percent,
    },
  ];

  const pagesConfigItems = [
    {
      id: "home-config",
      label: "Inicio",
      parentId: "pages-config",
    },
    {
      id: "products-list-config",
      label: "Lista de Productos",
      parentId: "pages-config",
    },
    {
      id: "faq",
      label: "Preguntas Frecuentes",
      icon: HelpCircle,
    },
  ];

  const handlePagesConfigClick = () => {
    setExpandedPages(!expandedPages);
    if (!expandedPages) {
      // When expanding, set the first child item as active
      onTabChange("home-config");
    }
  };

  const handlePageItemClick = (pageId: string) => {
    onTabChange(pageId);
  };

  // Check if any pages config item is active
  const isAnyPagesConfigActive = activeTab === "home-config" || activeTab === "products-list-config" || activeTab === "faq";

  return (
    <div className="flex h-full w-full flex-col bg-background border-r">
      <div className="flex h-16 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4 cursor-pointer" onClick={() => router.push('/')} />
          <h1 className="text-lg font-semibold">Panel de Control</h1>
        </div>
        <ThemeToggle />
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 cursor-pointer",
                activeTab === item.id && "bg-primary text-primary-foreground"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}

        <div className="space-y-1">
          <Button
            variant={isAnyPagesConfigActive ? "default" : "ghost"}
            className={cn(
              "w-full justify-between gap-3 cursor-pointer",
              isAnyPagesConfigActive && "bg-primary text-primary-foreground"
            )}
            onClick={handlePagesConfigClick}
          >
            <div className="flex items-center gap-3">
              <Settings className="h-4 w-4" />
              Configuración de Páginas
            </div>
            {expandedPages ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>

          {expandedPages && (
            <div className="ml-6 space-y-1">
              {pagesConfigItems.map((pageItem) => (
                <Button
                  key={pageItem.id}
                  variant={activeTab === pageItem.id ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start gap-3 cursor-pointer text-sm",
                    activeTab === pageItem.id && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handlePageItemClick(pageItem.id)}
                >
                  <div className="w-2 h-2 rounded-full bg-current" />
                  {pageItem.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
} 